import type { NextFunction, Request, Response } from 'express';
import { unauthorized } from '../lib/errors.js';
import { verifyToken } from '../lib/auth.js';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export const authMiddleware = (req: AuthRequest, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw unauthorized('Missing or invalid authorization header');
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    throw unauthorized('Invalid token format');
  }

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    throw unauthorized('Invalid or expired token');
  }
};
