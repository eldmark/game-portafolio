import { Router } from 'express';
import { githubPushWebhookSchema } from '@portfolio/shared';
import { asyncHandler } from '../lib/errors.js';
import { prisma } from '../lib/prisma.js';
import { verifyGithubSignature } from '../middleware/github-webhook-middleware.js';
import { buildDevlogMessage } from '../lib/devlog-phrases.js';

export const webhookRouter = Router();

const ALLOWED_BRANCHES = new Set(['main', 'master']);

webhookRouter.post(
  '/github',
  verifyGithubSignature,
  asyncHandler(async (req, res) => {
    const event = req.headers['x-github-event'];

    if (event !== 'push') {
      return res.json({ data: { skipped: true, reason: 'not a push event' } });
    }

    const payload = githubPushWebhookSchema.parse(req.body);

    if (payload.commits.length === 0) {
      return res.json({ data: { skipped: true, reason: 'no commits' } });
    }

    const branch = payload.ref.replace('refs/heads/', '');

    if (!ALLOWED_BRANCHES.has(branch)) {
      return res.json({ data: { skipped: true, reason: 'branch not tracked' } });
    }

    const lastCommit = payload.commits[payload.commits.length - 1]!;
    const message = buildDevlogMessage(payload.repository.full_name, payload.commits.length);

    const entry = await prisma.devlogEntry.create({
      data: {
        repo: payload.repository.full_name,
        branch,
        commitSha: lastCommit.id,
        commitUrl: lastCommit.url,
        message,
        commitCount: payload.commits.length,
      },
    });

    res.status(201).json({ data: { id: entry.id } });
  }),
);
