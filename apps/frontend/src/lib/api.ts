import type {
  ApiItemResponse,
  ApiListResponse,
  AnalyticsSummary,
  AnalyticsTimeseries,
  ContactMessageInput,
  DevlogEntry,
  Experience,
  Goal,
  GoalCreate,
  GoalUpdate,
  Post,
  PostCreate,
  PostUpdate,
  Project,
  Skill,
  Trophy,
  TrophyCreate,
  TrophyUpdate,
  LoginInput,
  ProjectCreate,
  ProjectUpdate,
  SkillCreate,
  SkillUpdate,
  ExperienceCreate,
  ExperienceUpdate,
} from '@portfolio/shared';
import { useAuthStore, type AuthUser } from './auth-store';

function normalizeApiUrl(rawValue?: string) {
  const raw = rawValue?.trim();

  if (!raw) {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/api`;
    }

    return 'http://localhost:4000';
  }

  if (/^https?:\/\//i.test(raw)) {
    return raw.replace(/\/+$/, '');
  }

  if (raw.startsWith('/')) {
    return raw.replace(/\/+$/, '');
  }

  const protocol = typeof window !== 'undefined' ? window.location.protocol : 'http:';
  return `${protocol}//${raw}`.replace(/\/+$/, '');
}

function buildApiUrl(baseUrl: string, path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (/^https?:\/\//i.test(baseUrl)) {
    return new URL(normalizedPath, `${baseUrl}/`).toString();
  }

  return `${baseUrl}${normalizedPath}`;
}

const API_URL = normalizeApiUrl(import.meta.env.VITE_API_URL);

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const { token } = useAuthStore.getState();

  const response = await fetch(buildApiUrl(API_URL, path), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

export async function getAnalyticsTimeseries(days = 30) {
  return request<ApiItemResponse<AnalyticsTimeseries>>(`/analytics/timeseries?days=${days}`).then(
    (response) => response.data,
  );
}

export async function getGoals() {
  return request<ApiListResponse<Goal>>('/goals').then((response) => response.data);
}

export async function getTrophies() {
  return request<ApiListResponse<Trophy>>('/trophies').then((response) => response.data);
}

export async function getPosts() {
  return request<ApiListResponse<Post>>('/posts').then((response) => response.data);
}

export async function getDevlog(limit = 20) {
  return request<ApiListResponse<DevlogEntry>>(`/devlog?limit=${limit}`).then(
    (response) => response.data,
  );
}

export type AdminUser = {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminUserCreate = {
  email: string;
  password: string;
  name?: string | null;
};

export async function sendMessage(input: ContactMessageInput) {
  return request<
    ApiItemResponse<{
      id: string;
      createdAt: string;
      emailDelivery: 'sent' | 'fallback';
      contactEmail: string;
    }>
  >('/messages', {
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

/* -------------------------------------------------------------------------- */
/*                                    AUTH                                    */
/* -------------------------------------------------------------------------- */

export async function login(input: LoginInput) {
  return request<ApiItemResponse<{ token: string; user: AuthUser }>>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  }).then((response) => response.data);
}

/* -------------------------------------------------------------------------- */
/*                                    ADMIN                                   */
/* -------------------------------------------------------------------------- */

export async function createProject(data: ProjectCreate) {
  return request<ApiItemResponse<Project>>('/admin/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  }).then((res) => res.data);
}

export async function updateProject(id: string, data: ProjectUpdate) {
  return request<ApiItemResponse<Project>>(`/admin/projects/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }).then((res) => res.data);
}

export async function deleteProject(id: string) {
  return request<void>(`/admin/projects/${id}`, { method: 'DELETE' });
}

export async function createSkill(data: SkillCreate) {
  return request<ApiItemResponse<Skill>>('/admin/skills', {
    method: 'POST',
    body: JSON.stringify(data),
  }).then((res) => res.data);
}

export async function updateSkill(id: string, data: SkillUpdate) {
  return request<ApiItemResponse<Skill>>(`/admin/skills/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }).then((res) => res.data);
}

export async function deleteSkill(id: string) {
  return request<void>(`/admin/skills/${id}`, { method: 'DELETE' });
}

export async function createExperience(data: ExperienceCreate) {
  return request<ApiItemResponse<Experience>>('/admin/experiences', {
    method: 'POST',
    body: JSON.stringify(data),
  }).then((res) => res.data);
}

export async function updateExperience(id: string, data: ExperienceUpdate) {
  return request<ApiItemResponse<Experience>>(`/admin/experiences/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }).then((res) => res.data);
}

export async function deleteExperience(id: string) {
  return request<void>(`/admin/experiences/${id}`, { method: 'DELETE' });
}

export async function createGoal(data: GoalCreate) {
  return request<ApiItemResponse<Goal>>('/admin/goals', {
    method: 'POST',
    body: JSON.stringify(data),
  }).then((res) => res.data);
}

export async function updateGoal(id: string, data: GoalUpdate) {
  return request<ApiItemResponse<Goal>>(`/admin/goals/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }).then((res) => res.data);
}

export async function deleteGoal(id: string) {
  return request<void>(`/admin/goals/${id}`, { method: 'DELETE' });
}

export async function createTrophy(data: TrophyCreate) {
  return request<ApiItemResponse<Trophy>>('/admin/trophies', {
    method: 'POST',
    body: JSON.stringify(data),
  }).then((res) => res.data);
}

export async function updateTrophy(id: string, data: TrophyUpdate) {
  return request<ApiItemResponse<Trophy>>(`/admin/trophies/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }).then((res) => res.data);
}

export async function deleteTrophy(id: string) {
  return request<void>(`/admin/trophies/${id}`, { method: 'DELETE' });
}

export async function createPost(data: PostCreate) {
  return request<ApiItemResponse<Post>>('/admin/posts', {
    method: 'POST',
    body: JSON.stringify(data),
  }).then((res) => res.data);
}

export async function updatePost(id: string, data: PostUpdate) {
  return request<ApiItemResponse<Post>>(`/admin/posts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }).then((res) => res.data);
}

export async function deletePost(id: string) {
  return request<void>(`/admin/posts/${id}`, { method: 'DELETE' });
}

export async function getUsers() {
  return request<ApiListResponse<AdminUser>>('/admin/users').then((response) => response.data);
}

export async function deleteUser(id: string) {
  return request<void>(`/admin/users/${id}`, { method: 'DELETE' });
}

export async function createUser(data: AdminUserCreate) {
  return request<ApiItemResponse<AdminUser>>('/admin/users', {
    method: 'POST',
    body: JSON.stringify(data),
  }).then((response) => response.data);
}
