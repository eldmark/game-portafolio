import type { PresenceEntry } from '@portfolio/shared';

const STALE_MS = 15_000; // consider offline after 15s without a ping
const MAX_ENTRIES = 500; // defensive cap against session-id spam

const presenceMap = new Map<string, PresenceEntry>();

function evictOldest() {
  let oldestSessionId: string | null = null;
  let oldestLastSeen = Number.POSITIVE_INFINITY;

  for (const [sessionId, entry] of presenceMap.entries()) {
    if (entry.lastSeen < oldestLastSeen) {
      oldestLastSeen = entry.lastSeen;
      oldestSessionId = sessionId;
    }
  }

  if (oldestSessionId !== null) {
    presenceMap.delete(oldestSessionId);
  }
}

export function upsertPresence(entry: PresenceEntry) {
  if (!presenceMap.has(entry.sessionId) && presenceMap.size >= MAX_ENTRIES) {
    evictOldest();
  }

  presenceMap.set(entry.sessionId, entry);
}

export function removePresence(sessionId: string) {
  presenceMap.delete(sessionId);
}

export function getPresenceInRoom(roomId: string, excludeSessionId?: string) {
  const now = Date.now();
  const result: PresenceEntry[] = [];

  for (const entry of presenceMap.values()) {
    if (entry.sessionId === excludeSessionId) continue;
    if (now - entry.lastSeen > STALE_MS) continue;
    if (entry.roomId !== roomId) continue;
    result.push(entry);
  }

  return result;
}

// Periodic cleanup to prevent unbounded growth
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [sessionId, entry] of presenceMap.entries()) {
    if (now - entry.lastSeen > STALE_MS * 2) {
      presenceMap.delete(sessionId);
    }
  }
}, 30_000);

// Don't keep the process alive just for presence cleanup (tests, scripts)
cleanupInterval.unref?.();
