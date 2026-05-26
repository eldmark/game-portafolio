import { Router } from 'express';
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
import {
  ensureVisit,
  getAnalyticsSummary,
  getExperiences,
  getProjectBySlug,
  getProjects,
  getSkills,
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
  '/analytics/summary',
  asyncHandler(async (_req, res) => {
    res.json({ data: await getAnalyticsSummary() });
  }),
);

portfolioRouter.post(
  '/messages',
  asyncHandler(async (req, res) => {
    const input = contactMessageInputSchema.parse(req.body);
    const message = await prisma.message.create({ data: input });

    // Send email asynchronously
    void sendContactEmail({
      name: input.name,
      email: input.email,
      message: input.message,
    });

    res.status(201).json({
      data: {
        id: message.id,
        createdAt: message.createdAt.toISOString(),
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
