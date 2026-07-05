import { z } from 'zod';

export const projectMediaSchema = z.object({
  id: z.string().optional(),
  type: z.enum(['image', 'gif', 'video']),
  url: z.string().url(),
  alt: z.string(),
  orderIndex: z.number().int().default(0),
});

export const projectSchema = z.object({
  id: z.string(),
  title: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  architecture: z.string(),
  challenges: z.array(z.string()),
  stack: z.array(z.string()),
  stackReasoning: z.string(),
  githubUrl: z.string().url().nullable().optional(),
  liveUrl: z.string().url().nullable().optional(),
  thumbnail: z.string().nullable().optional(),
  gifDemo: z.string().nullable().optional(),
  featured: z.boolean().default(false),
  media: z.array(projectMediaSchema).default([]),
});

export const projectCreateSchema = projectSchema.omit({ id: true });
export const projectUpdateSchema = projectCreateSchema.partial();

export const skillSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  category: z.string(),
  icon: z.string().nullable().optional(),
  level: z.number().min(1).max(5),
  reasoning: z.string(),
  appliedIn: z.array(z.string()),
});

export const skillCreateSchema = skillSchema.omit({ id: true });
export const skillUpdateSchema = skillCreateSchema.partial();

export const experienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1),
  role: z.string().min(1),
  description: z.string().min(10),
  startDate: z.string().refine((v) => !isNaN(Date.parse(v)), { message: 'Invalid date format' }),
  endDate: z.string().nullable().refine((v) => !v || !isNaN(Date.parse(v)), { message: 'Invalid date format' }),
  technologies: z.array(z.string()),
});

export const experienceCreateSchema = experienceSchema.omit({ id: true });
export const experienceUpdateSchema = experienceCreateSchema.partial();

export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
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

export const goalSchema = z.object({
  id: z.string(),
  title: z.string().min(2),
  description: z.string().min(5),
  category: z.string(),
  status: z.enum(['planned', 'in_progress', 'done']).default('planned'),
  targetDate: z.string().nullable().optional(),
  orderIndex: z.number().int().default(0),
  trophyId: z.string().nullable().optional(),
});

export const goalCreateSchema = goalSchema.omit({ id: true });
export const goalUpdateSchema = goalCreateSchema.partial();

export const trophySchema = z.object({
  id: z.string(),
  title: z.string().min(2),
  description: z.string().min(5),
  icon: z.string().nullable().optional(),
  category: z.string(),
  dateEarned: z.string(),
  proofUrl: z.string().url().nullable().optional(),
});

export const trophyCreateSchema = trophySchema.omit({ id: true });
export const trophyUpdateSchema = trophyCreateSchema.partial();

export const postSchema = z.object({
  id: z.string(),
  title: z.string().min(2),
  slug: z.string().min(2),
  body: z.string().min(10),
  projectId: z.string().nullable().optional(),
  publishedAt: z.string(),
});

export const postCreateSchema = postSchema.omit({ id: true, publishedAt: true }).extend({
  publishedAt: z.string().optional(),
});
export const postUpdateSchema = postCreateSchema.partial();

export const devlogEntrySchema = z.object({
  id: z.string(),
  repo: z.string(),
  branch: z.string(),
  commitSha: z.string(),
  commitUrl: z.string().url(),
  message: z.string(),
  commitCount: z.number().int().min(1),
  createdAt: z.string(),
});

// GitHub webhook payload (minimal subset we care about)
export const githubPushWebhookSchema = z.object({
  ref: z.string(), // "refs/heads/main"
  repository: z.object({
    full_name: z.string(), // "eldmark/db_barbershop"
  }),
  commits: z.array(
    z.object({
      id: z.string(),
      message: z.string(),
      url: z.string().url(),
    }),
  ),
});

export const analyticsTimeseriesSchema = z.object({
  visitsOverTime: z.array(
    z.object({ date: z.string(), total: z.number(), recruiter: z.number() }),
  ),
  deviceBreakdown: z.array(z.object({ device: z.string(), count: z.number() })),
  countryBreakdown: z.array(z.object({ country: z.string(), count: z.number() })),
});

export type ProjectMedia = z.infer<typeof projectMediaSchema>;
export type Project = z.infer<typeof projectSchema>;
export type ProjectCreate = z.infer<typeof projectCreateSchema>;
export type ProjectUpdate = z.infer<typeof projectUpdateSchema>;

export const presencePingSchema = z.object({
  sessionId: sessionIdSchema,
  name: z.string().trim().max(20),
  roomId: z.string(),
  position: z.tuple([z.number(), z.number(), z.number()]),
  hat: z.string(),
  shirtColor: z.string(),
  pantsColor: z.string(),
});

export const presenceEntrySchema = presencePingSchema.extend({
  lastSeen: z.number(),
});

export type Skill = z.infer<typeof skillSchema>;
export type SkillCreate = z.infer<typeof skillCreateSchema>;
export type SkillUpdate = z.infer<typeof skillUpdateSchema>;

export type Experience = z.infer<typeof experienceSchema>;
export type ExperienceCreate = z.infer<typeof experienceCreateSchema>;
export type ExperienceUpdate = z.infer<typeof experienceUpdateSchema>;

export type LoginInput = z.infer<typeof loginInputSchema>;

export type ContactMessageInput = z.infer<typeof contactMessageInputSchema>;
export type VisitInput = z.infer<typeof visitInputSchema>;
export type VisitPatch = z.infer<typeof visitPatchSchema>;
export type DialogueLogInput = z.infer<typeof dialogueLogInputSchema>;
export type AnalyticsSummary = z.infer<typeof analyticsSummarySchema>;
export type AnalyticsTimeseries = z.infer<typeof analyticsTimeseriesSchema>;

export type Goal = z.infer<typeof goalSchema>;
export type GoalCreate = z.infer<typeof goalCreateSchema>;
export type GoalUpdate = z.infer<typeof goalUpdateSchema>;

export type Trophy = z.infer<typeof trophySchema>;
export type TrophyCreate = z.infer<typeof trophyCreateSchema>;
export type TrophyUpdate = z.infer<typeof trophyUpdateSchema>;

export type Post = z.infer<typeof postSchema>;
export type PostCreate = z.infer<typeof postCreateSchema>;
export type PostUpdate = z.infer<typeof postUpdateSchema>;
export type DevlogEntry = z.infer<typeof devlogEntrySchema>;
export type GithubPushWebhook = z.infer<typeof githubPushWebhookSchema>;

export type PresencePing = z.infer<typeof presencePingSchema>;
export type PresenceEntry = z.infer<typeof presenceEntrySchema>;

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
