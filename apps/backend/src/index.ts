import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { errorHandler, notFound } from './lib/errors.js';
import { prisma } from './lib/prisma.js';
import { portfolioRouter } from './routes/portfolio-routes.js';
import { authRouter } from './routes/auth-routes.js';
import { adminRouter } from './routes/admin-routes.js';
import { authMiddleware } from './middleware/auth-middleware.js';

const app = express();
const port = Number(process.env.PORT ?? 4000);
function normalizeOrigin(value: string) {
  const trimmed = value.trim();

  try {
    return new URL(trimmed).origin;
  } catch {
    return trimmed.replace(/\/+$/, '');
  }
}

const corsOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:3001,http://localhost:3000')
  .split(',')
  .map(normalizeOrigin)
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || corsOrigins.includes(normalizeOrigin(origin))) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
  }),
);
app.use(express.json({ limit: '1mb' }));

app.use('/auth', authRouter);
app.use('/admin', authMiddleware, adminRouter);

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'interactive-portfolio-api',
  });
});

app.use('/', portfolioRouter);
app.use((_req, _res, next) => {
  next(notFound('Route not found'));
});
app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`Portfolio API listening on port ${port}`);
});

async function shutdown(signal: string) {
  console.log(`${signal} received, closing API`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));
