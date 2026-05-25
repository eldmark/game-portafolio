import type {
  ApiItemResponse,
  ApiListResponse,
  AnalyticsSummary,
  ContactMessageInput,
  Experience,
  Project,
  Skill,
} from '@portfolio/shared';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  const payload = (await response.json().catch(() => null)) as T | { error?: string } | null;

  if (!response.ok) {
    const message =
      payload && typeof payload === 'object' && 'error' in payload && payload.error
        ? payload.error
        : 'Request failed';
    throw new Error(message);
  }

  return payload as T;
}

export async function getProjects() {
  return request<ApiListResponse<Project>>('/projects').then((response) => response.data);
}

export async function getSkills() {
  return request<ApiListResponse<Skill>>('/skills').then((response) => response.data);
}

export async function getExperiences() {
  return request<ApiListResponse<Experience>>('/experiences').then((response) => response.data);
}

export async function getAnalyticsSummary() {
  return request<ApiItemResponse<AnalyticsSummary>>('/analytics/summary').then(
    (response) => response.data,
  );
}

export async function sendMessage(input: ContactMessageInput) {
  return request<ApiItemResponse<{ id: string; createdAt: string }>>('/messages', {
    method: 'POST',
    body: JSON.stringify(input),
  }).then((response) => response.data);
}

export async function trackVisit(sessionId: string, recruiterMode: boolean) {
  return request<ApiItemResponse<{ id: string; sessionId: string }>>('/visits', {
    method: 'POST',
    body: JSON.stringify({
      sessionId,
      recruiterMode,
      device: typeof navigator === 'undefined' ? 'server' : navigator.userAgent.slice(0, 80),
    }),
  });
}

export async function logDialogue(sessionId: string, dialogueKey: string) {
  return request<ApiItemResponse<{ id: string; createdAt: string }>>('/dialogue-logs', {
    method: 'POST',
    body: JSON.stringify({ sessionId, dialogueKey }),
  });
}

export async function endVisit(sessionId: string, duration: number, recruiterMode?: boolean) {
  return request<ApiItemResponse<{ id: string; sessionId: string; duration: number | null }>>(
    `/visits/${sessionId}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ duration, recruiterMode }),
    },
  );
}
