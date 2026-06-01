import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { loginInputSchema } from '@portfolio/shared';
import { asyncHandler, unauthorized } from '../lib/errors.js';
import { prisma } from '../lib/prisma.js';
import { signToken } from '../lib/auth.js';

export const authRouter = Router();

authRouter.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = loginInputSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw unauthorized('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw unauthorized('Invalid credentials');
    }

    const token = signToken({ userId: user.id, email: user.email });

    res.json({
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
    });
  }),
);
