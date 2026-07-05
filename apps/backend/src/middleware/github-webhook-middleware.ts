import type { NextFunction, Request, Response } from 'express';
import crypto from 'node:crypto';
import { unauthorized } from '../lib/errors.js';

export function verifyGithubSignature(req: Request, _res: Response, next: NextFunction) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;

  if (!secret) {
    throw unauthorized('Webhook not configured');
  }

  const signature = req.headers['x-hub-signature-256'];

  if (typeof signature !== 'string') {
    throw unauthorized('Missing signature');
  }

  const expected =
    'sha256=' + crypto.createHmac('sha256', secret).update(req.rawBody ?? '').digest('hex');

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (
    sigBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(sigBuffer, expectedBuffer)
  ) {
    throw unauthorized('Invalid signature');
  }

  next();
}
