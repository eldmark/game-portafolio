import { Router } from 'express';
import {
  experienceCreateSchema,
  experienceUpdateSchema,
  goalCreateSchema,
  goalUpdateSchema,
  postCreateSchema,
  postUpdateSchema,
  projectCreateSchema,
  projectUpdateSchema,
  skillCreateSchema,
  skillUpdateSchema,
  trophyCreateSchema,
  trophyUpdateSchema,
} from '@portfolio/shared';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { asyncHandler, badRequest, forbidden, notFound } from '../lib/errors.js';
import { prisma } from '../lib/prisma.js';
import type { AuthRequest } from '../middleware/auth-middleware.js';

export const adminRouter = Router();

const createAdminUserSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(12),
  name: z.string().trim().min(1).optional().nullable(),
});

function getAdminUserId(req: unknown) {
  return (req as AuthRequest).user?.userId;
}

adminRouter.get(
  '/users',
  asyncHandler(async (_req, res) => {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({ data: users });
  }),
);

adminRouter.post(
  '/users',
  asyncHandler(async (req, res) => {
    const input = createAdminUserSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email: input.email } });

    if (existing) {
      throw badRequest('A user with that email already exists');
    }

    const password = await bcrypt.hash(input.password, 10);

    const user = await prisma.user.create({
      data: {
        email: input.email,
        password,
        name: input.name?.trim() || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(201).json({ data: user });
  }),
);

adminRouter.delete(
  '/users/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const currentUserId = getAdminUserId(req);

    if (!id) {
      throw notFound('User not found');
    }

    if (currentUserId && currentUserId === id) {
      throw forbidden('You cannot delete the account you are currently using');
    }

    const existing = await prisma.user.findUnique({ where: { id } });

    if (!existing) {
      throw notFound('User not found');
    }

    await prisma.user.delete({ where: { id } });
    res.status(204).end();
  }),
);

/* -------------------------------------------------------------------------- */
/*                                  PROJECTS                                  */
/* -------------------------------------------------------------------------- */

adminRouter.post(
  '/projects',
  asyncHandler(async (req, res) => {
    const input = projectCreateSchema.parse(req.body);
    const { media, ...data } = input;

    const project = await prisma.project.create({
      data: {
        ...data,
        media: {
          create: media?.map((m) => ({
            type: m.type,
            url: m.url,
            alt: m.alt,
            orderIndex: m.orderIndex,
          })),
        },
      },
      include: { media: true },
    });

    res.status(201).json({ data: project });
  }),
);

adminRouter.patch(
  '/projects/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const input = projectUpdateSchema.parse(req.body);
    const { media, ...data } = input;

    // First check if exists
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) throw notFound('Project not found');

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...data,
        media: media
          ? {
              deleteMany: {},
              create: media.map((m) => ({
                type: m.type,
                url: m.url,
                alt: m.alt,
                orderIndex: m.orderIndex,
              })),
            }
          : undefined,
      },
      include: { media: true },
    });

    res.json({ data: project });
  }),
);

adminRouter.delete(
  '/projects/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.project.delete({ where: { id } });
    res.status(204).end();
  }),
);

/* -------------------------------------------------------------------------- */
/*                                   SKILLS                                   */
/* -------------------------------------------------------------------------- */

adminRouter.post(
  '/skills',
  asyncHandler(async (req, res) => {
    const input = skillCreateSchema.parse(req.body);
    const skill = await prisma.skill.create({ data: input });
    res.status(201).json({ data: skill });
  }),
);

adminRouter.patch(
  '/skills/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const input = skillUpdateSchema.parse(req.body);
    const skill = await prisma.skill.update({
      where: { id },
      data: input,
    });
    res.json({ data: skill });
  }),
);

adminRouter.delete(
  '/skills/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.skill.delete({ where: { id } });
    res.status(204).end();
  }),
);

/* -------------------------------------------------------------------------- */
/*                                 EXPERIENCES                                */
/* -------------------------------------------------------------------------- */

adminRouter.post(
  '/experiences',
  asyncHandler(async (req, res) => {
    const input = experienceCreateSchema.parse(req.body);
    const experience = await prisma.experience.create({
      data: {
        ...input,
        startDate: new Date(input.startDate),
        endDate: input.endDate ? new Date(input.endDate) : null,
      },
    });
    res.status(201).json({ data: experience });
  }),
);

adminRouter.patch(
  '/experiences/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const input = experienceUpdateSchema.parse(req.body);
    const experience = await prisma.experience.update({
      where: { id },
      data: {
        ...input,
        startDate: input.startDate ? new Date(input.startDate) : undefined,
        endDate: input.endDate
          ? new Date(input.endDate)
          : input.endDate === null
            ? null
            : undefined,
      },
    });
    res.json({ data: experience });
  }),
);

adminRouter.delete(
  '/experiences/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.experience.delete({ where: { id } });
    res.status(204).end();
  }),
);

/* -------------------------------------------------------------------------- */
/*                                    GOALS                                   */
/* -------------------------------------------------------------------------- */

adminRouter.post(
  '/goals',
  asyncHandler(async (req, res) => {
    const input = goalCreateSchema.parse(req.body);
    const goal = await prisma.goal.create({
      data: {
        ...input,
        targetDate: input.targetDate ? new Date(input.targetDate) : null,
      },
    });
    res.status(201).json({ data: goal });
  }),
);

adminRouter.patch(
  '/goals/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const input = goalUpdateSchema.parse(req.body);
    const goal = await prisma.goal.update({
      where: { id },
      data: {
        ...input,
        targetDate: input.targetDate
          ? new Date(input.targetDate)
          : input.targetDate === null
            ? null
            : undefined,
      },
    });
    res.json({ data: goal });
  }),
);

adminRouter.delete(
  '/goals/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.goal.delete({ where: { id } });
    res.status(204).end();
  }),
);

/* -------------------------------------------------------------------------- */
/*                                  TROPHIES                                  */
/* -------------------------------------------------------------------------- */

adminRouter.post(
  '/trophies',
  asyncHandler(async (req, res) => {
    const input = trophyCreateSchema.parse(req.body);
    const trophy = await prisma.trophy.create({
      data: { ...input, dateEarned: new Date(input.dateEarned) },
    });
    res.status(201).json({ data: trophy });
  }),
);

adminRouter.patch(
  '/trophies/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const input = trophyUpdateSchema.parse(req.body);
    const trophy = await prisma.trophy.update({
      where: { id },
      data: {
        ...input,
        dateEarned: input.dateEarned ? new Date(input.dateEarned) : undefined,
      },
    });
    res.json({ data: trophy });
  }),
);

adminRouter.delete(
  '/trophies/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.trophy.delete({ where: { id } });
    res.status(204).end();
  }),
);

/* -------------------------------------------------------------------------- */
/*                                    POSTS                                   */
/* -------------------------------------------------------------------------- */

adminRouter.post(
  '/posts',
  asyncHandler(async (req, res) => {
    const input = postCreateSchema.parse(req.body);
    const post = await prisma.post.create({
      data: {
        ...input,
        publishedAt: input.publishedAt ? new Date(input.publishedAt) : undefined,
      },
    });
    res.status(201).json({ data: post });
  }),
);

adminRouter.patch(
  '/posts/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const input = postUpdateSchema.parse(req.body);
    const post = await prisma.post.update({
      where: { id },
      data: {
        ...input,
        publishedAt: input.publishedAt ? new Date(input.publishedAt) : undefined,
      },
    });
    res.json({ data: post });
  }),
);

adminRouter.delete(
  '/posts/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.post.delete({ where: { id } });
    res.status(204).end();
  }),
);

/* -------------------------------------------------------------------------- */
/*                                   DEVLOG                                   */
/* -------------------------------------------------------------------------- */

adminRouter.delete(
  '/devlog/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.devlogEntry.delete({ where: { id } });
    res.status(204).end();
  }),
);
