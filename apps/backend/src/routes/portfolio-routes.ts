import { Router } from 'express';
import { z } from 'zod';
import {
  contactMessageInputSchema,
  dialogueLogInputSchema,
  sessionIdSchema,
  visitInputSchema,
  visitPatchSchema,
} from '@portfolio/shared';
import { asyncHandler, notFound } from '../lib/errors.js';
import { prisma } from '../lib/prisma.js';
import { sendContactEmail } from '../services/email-service.js';
import { getGoals, getTrophies } from '../services/goals-trophies-service.js';
import {
  ensureVisit,
  getAnalyticsSummary,
  getCountryBreakdown,
  getDeviceBreakdown,
  getExperiences,
  getProjectBySlug,
  getProjects,
  getSkills,
  getVisitsTimeseries,
  mapDevlogEntry,
  mapPost,
} from '../services/portfolio-service.js';

export const portfolioRouter = Router();

portfolioRouter.get(
  '/projects',
  asyncHandler(async (_req, res) => {
    res.json({ data: await getProjects() });
  }),
);

portfolioRouter.get(
  '/projects/:slug',
  asyncHandler(async (req, res) => {
    const { slug } = req.params;

    if (!slug) {
      throw notFound('Project not found');
    }

    const project = await getProjectBySlug(slug);

    if (!project) {
      throw notFound('Project not found');
    }

    res.json({ data: project });
  }),
);

portfolioRouter.get(
  '/skills',
  asyncHandler(async (_req, res) => {
    res.json({ data: await getSkills() });
  }),
);

portfolioRouter.get(
  '/experiences',
  asyncHandler(async (_req, res) => {
    res.json({ data: await getExperiences() });
  }),
);

portfolioRouter.get(
  '/goals',
  asyncHandler(async (_req, res) => {
    res.json({ data: await getGoals() });
  }),
);

portfolioRouter.get(
  '/trophies',
  asyncHandler(async (_req, res) => {
    res.json({ data: await getTrophies() });
  }),
);

portfolioRouter.get(
  '/posts',
  asyncHandler(async (_req, res) => {
    const posts = await prisma.post.findMany({ orderBy: { publishedAt: 'desc' } });
    res.json({ data: posts.map(mapPost) });
  }),
);

portfolioRouter.get(
  '/posts/:slug',
  asyncHandler(async (req, res) => {
    const { slug } = req.params;

    if (!slug) {
      throw notFound('Post not found');
    }

    const post = await prisma.post.findUnique({ where: { slug } });

    if (!post) {
      throw notFound('Post not found');
    }

    res.json({ data: mapPost(post) });
  }),
);

portfolioRouter.get(
  '/devlog',
  asyncHandler(async (req, res) => {
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
    const entries = await prisma.devlogEntry.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    res.json({ data: entries.map(mapDevlogEntry) });
  }),
);

portfolioRouter.get(
  '/analytics/summary',
  asyncHandler(async (_req, res) => {
    res.json({ data: await getAnalyticsSummary() });
  }),
);

portfolioRouter.get(
  '/analytics/timeseries',
  asyncHandler(async (req, res) => {
    const days = Math.min(90, Math.max(1, Number(req.query.days) || 30));
    const [visitsOverTime, deviceBreakdown, countryBreakdown] = await Promise.all([
      getVisitsTimeseries(days),
      getDeviceBreakdown(),
      getCountryBreakdown(),
    ]);
    res.json({ data: { visitsOverTime, deviceBreakdown, countryBreakdown } });
  }),
);

portfolioRouter.post(
  '/messages',
  asyncHandler(async (req, res) => {
    const input = contactMessageInputSchema.parse(req.body);
    const message = await prisma.message.create({ data: input });

    const emailDelivery = await sendContactEmail({
      name: input.name,
      email: input.email,
      message: input.message,
    });

    res.status(201).json({
      data: {
        id: message.id,
        createdAt: message.createdAt.toISOString(),
        emailDelivery,
        contactEmail: process.env.CONTACT_EMAIL ?? 'delivered@resend.dev',
      },
    });
  }),
);

portfolioRouter.post(
  '/visits',
  asyncHandler(async (req, res) => {
    const input = visitInputSchema.parse(req.body);
    const visit = await prisma.userVisit.upsert({
      where: { sessionId: input.sessionId },
      update: {
        recruiterMode: input.recruiterMode,
        device: input.device,
        country: input.country,
      },
      create: input,
    });

    res.status(201).json({
      data: {
        id: visit.id,
        sessionId: visit.sessionId,
      },
    });
  }),
);

portfolioRouter.patch(
  '/visits/:sessionId',
  asyncHandler(async (req, res) => {
    const sessionId = sessionIdSchema.parse(req.params.sessionId);
    const input = visitPatchSchema.parse(req.body);
    const visit = await prisma.userVisit.upsert({
      where: { sessionId },
      update: input,
      create: {
        sessionId,
        recruiterMode: input.recruiterMode ?? false,
        duration: input.duration,
      },
    });

    res.json({
      data: {
        id: visit.id,
        sessionId: visit.sessionId,
        duration: visit.duration,
      },
    });
  }),
);

portfolioRouter.post(
  '/dialogue-logs',
  asyncHandler(async (req, res) => {
    const input = dialogueLogInputSchema.parse(req.body);
    await ensureVisit(input.sessionId);

    const log = await prisma.dialogueLog.create({ data: input });

    res.status(201).json({
      data: {
        id: log.id,
        createdAt: log.createdAt.toISOString(),
      },
    });
  }),
);
