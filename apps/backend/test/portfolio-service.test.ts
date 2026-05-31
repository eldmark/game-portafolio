import test from 'node:test';
import assert from 'node:assert/strict';
import { getAnalyticsSummary } from '../src/services/portfolio-service.js';
import { prisma } from '../src/lib/prisma.js';

test('getAnalyticsSummary maps analytics data from prisma', async (t) => {
  const originalTransaction = prisma.$transaction;

  (
    prisma as typeof prisma & {
      $transaction: typeof prisma.$transaction;
    }
  ).$transaction = (async () => [
    12,
    5,
    { _avg: { duration: 145.6 } },
    31,
    [
      { dialogueKey: 'about', _count: { dialogueKey: 7 } },
      { dialogueKey: 'projects', _count: { dialogueKey: 4 } },
    ],
  ]) as typeof prisma.$transaction;

  t.after(() => {
    (
      prisma as typeof prisma & {
        $transaction: typeof prisma.$transaction;
      }
    ).$transaction = originalTransaction;
  });

  const summary = await getAnalyticsSummary();

  assert.deepEqual(summary, {
    totalVisits: 12,
    recruiterVisits: 5,
    averageDuration: 146,
    totalDialogueLogs: 31,
    popularDialogues: [
      { dialogueKey: 'about', count: 7 },
      { dialogueKey: 'projects', count: 4 },
    ],
  });
});
