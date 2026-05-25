import { z } from 'zod';

export const projectMediaSchema = z.object({
  id: z.string(),
  type: z.enum(['image', 'gif', 'video']),
  url: z.string(),
  alt: z.string(),
  orderIndex: z.number(),
});

export const projectSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  architecture: z.string(),
  challenges: z.array(z.string()),
  stack: z.array(z.string()),
  stackReasoning: z.string(),
  githubUrl: z.string().nullable(),
  liveUrl: z.string().nullable(),
  thumbnail: z.string().nullable(),
  gifDemo: z.string().nullable(),
  featured: z.boolean(),
  media: z.array(projectMediaSchema).default([]),
});

export const skillSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  icon: z.string().nullable(),
  level: z.number().min(1).max(5),
  reasoning: z.string(),
  appliedIn: z.array(z.string()),
});

export const experienceSchema = z.object({
  id: z.string(),
  company: z.string(),
  role: z.string(),
  description: z.string(),
  startDate: z.string(),
  endDate: z.string().nullable(),
  technologies: z.array(z.string()),
});

export const contactMessageInputSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  message: z.string().trim().min(10).max(2000),
});

export const sessionIdSchema = z.string().trim().min(8).max(120);

export const visitInputSchema = z.object({
  sessionId: sessionIdSchema,
  recruiterMode: z.boolean().default(false),
  device: z.string().trim().max(80).optional(),
  country: z.string().trim().max(80).optional(),
});

export const visitPatchSchema = z.object({
  duration: z.number().int().min(0).max(60 * 60 * 24),
  recruiterMode: z.boolean().optional(),
});

export const dialogueLogInputSchema = z.object({
  sessionId: sessionIdSchema,
  dialogueKey: z.string().trim().min(2).max(120),
});

export const analyticsSummarySchema = z.object({
  totalVisits: z.number().int().min(0),
  recruiterVisits: z.number().int().min(0),
  averageDuration: z.number().nullable(),
  totalDialogueLogs: z.number().int().min(0),
  popularDialogues: z.array(
    z.object({
      dialogueKey: z.string(),
      count: z.number().int().min(0),
    }),
  ),
});

export type ProjectMedia = z.infer<typeof projectMediaSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type ContactMessageInput = z.infer<typeof contactMessageInputSchema>;
export type VisitInput = z.infer<typeof visitInputSchema>;
export type VisitPatch = z.infer<typeof visitPatchSchema>;
export type DialogueLogInput = z.infer<typeof dialogueLogInputSchema>;
export type AnalyticsSummary = z.infer<typeof analyticsSummarySchema>;

export type ApiError = {
  error: string;
  details?: unknown;
};

export type ApiListResponse<T> = {
  data: T[];
};

export type ApiItemResponse<T> = {
  data: T;
};
