import { Router } from 'express';
import {
  experienceCreateSchema,
  experienceUpdateSchema,
  projectCreateSchema,
  projectUpdateSchema,
  skillCreateSchema,
  skillUpdateSchema,
} from '@portfolio/shared';
import { asyncHandler, notFound } from '../lib/errors.js';
import { prisma } from '../lib/prisma.js';

export const adminRouter = Router();

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
        endDate: input.endDate ? new Date(input.endDate) : input.endDate === null ? null : undefined,
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
