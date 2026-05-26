import type { AnalyticsSummary, Experience, Project, ProjectMedia, Skill } from '@portfolio/shared';
import { prisma } from '../lib/prisma.js';

type ProjectRecord = Awaited<ReturnType<typeof prisma.project.findMany>>[number] & {
  media?: Array<{
    id: string;
    type: string;
    url: string;
    alt: string;
    orderIndex: number;
  }>;
};

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
}

function normalizeSkillLevel(level: number) {
  const fivePointLevel = level > 5 ? Math.round(level / 20) : level;

  return Math.min(5, Math.max(1, fivePointLevel));
}

function mapProjectMedia(media: ProjectRecord['media'] = []): ProjectMedia[] {
  return media.map((item) => ({
    id: item.id,
    type: item.type === 'gif' || item.type === 'video' ? item.type : 'image',
    url: item.url,
    alt: item.alt,
    orderIndex: item.orderIndex,
  }));
}

export function mapProject(project: ProjectRecord): Project {
  return {
    id: project.id,
    title: project.title,
    slug: project.slug,
    description: project.description,
    architecture: project.architecture,
    challenges: asStringArray(project.challenges),
    stack: asStringArray(project.stack),
    stackReasoning: project.stackReasoning,
    githubUrl: project.githubUrl,
    liveUrl: project.liveUrl,
    thumbnail: project.thumbnail,
    gifDemo: project.gifDemo,
    featured: project.featured,
    media: mapProjectMedia(project.media),
  };
}

export async function getProjects() {
  const projects = await prisma.project.findMany({
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    include: { media: { orderBy: { orderIndex: 'asc' } } },
  });

  return projects.map(mapProject);
}

export async function getProjectBySlug(slug: string) {
  const project = await prisma.project.findUnique({
    where: { slug },
    include: { media: { orderBy: { orderIndex: 'asc' } } },
  });

  return project ? mapProject(project) : null;
}

export async function getSkills(): Promise<Skill[]> {
  const skills = await prisma.skill.findMany({
    orderBy: [{ category: 'asc' }, { level: 'desc' }, { name: 'asc' }],
  });

  return skills.map((skill) => ({
    id: skill.id,
    name: skill.name,
    category: skill.category,
    icon: skill.icon,
    level: normalizeSkillLevel(skill.level),
    reasoning: skill.reasoning,
    appliedIn: asStringArray(skill.appliedIn),
  }));
}

export async function getExperiences(): Promise<Experience[]> {
  const experiences = await prisma.experience.findMany({
    orderBy: { startDate: 'desc' },
  });

  return experiences.map((experience) => ({
    id: experience.id,
    company: experience.company,
    role: experience.role,
    description: experience.description,
    startDate: experience.startDate.toISOString(),
    endDate: experience.endDate?.toISOString() ?? null,
    technologies: asStringArray(experience.technologies),
  }));
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const [totalVisits, recruiterVisits, durationStats, totalDialogueLogs, popularDialogues] =
    await prisma.$transaction([
      prisma.userVisit.count(),
      prisma.userVisit.count({ where: { recruiterMode: true } }),
      prisma.userVisit.aggregate({
        _avg: { duration: true },
        where: { duration: { not: null } },
      }),
      prisma.dialogueLog.count(),
      prisma.dialogueLog.groupBy({
        by: ['dialogueKey'],
        _count: { dialogueKey: true },
        orderBy: { _count: { dialogueKey: 'desc' } },
        take: 5,
      }),
    ]);

  return {
    totalVisits,
    recruiterVisits,
    averageDuration:
      durationStats._avg.duration === null ? null : Math.round(durationStats._avg.duration),
    totalDialogueLogs,
    popularDialogues: popularDialogues.map((dialogue) => ({
      dialogueKey: dialogue.dialogueKey,
      count:
        typeof dialogue._count === 'object' && dialogue._count !== null
          ? (dialogue._count.dialogueKey ?? 0)
          : 0,
    })),
  };
}

export async function ensureVisit(sessionId: string) {
  return prisma.userVisit.upsert({
    where: { sessionId },
    update: {},
    create: { sessionId },
  });
}
