import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { errorHandler, notFound } from './lib/errors.js';
import { prisma } from './lib/prisma.js';
import { portfolioRouter } from './routes/portfolio-routes.js';

const app = express();
const port = Number(process.env.PORT ?? 4000);
const corsOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:3000';

app.use(
  cors({
    origin: corsOrigin,
  }),
);
app.use(express.json({ limit: '1mb' }));

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
