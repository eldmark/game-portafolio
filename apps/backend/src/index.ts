import cors from 'cors';
import 'dotenv/config';
import express, { type Request } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errorHandler, notFound } from './lib/errors.js';
import { prisma } from './lib/prisma.js';
import { portfolioRouter } from './routes/portfolio-routes.js';
import { authRouter } from './routes/auth-routes.js';
import { adminRouter } from './routes/admin-routes.js';
import { webhookRouter } from './routes/webhook-routes.js';
import { authMiddleware } from './middleware/auth-middleware.js';

const app = express();
const port = Number(process.env.PORT ?? 4000);

// The API runs behind a reverse proxy, so req.ip must come from X-Forwarded-For
// or every request would look like it originated at the proxy and rate limiting
// would apply to all clients as a single bucket.
app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(
  helmet({
    // The frontend is served from a different origin than the API, so the default
    // same-origin resource policy would be wrong here. CORS above is what actually
    // restricts callers.
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);

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
app.use(
  express.json({
    limit: '1mb',
    verify: (req, _res, buf) => {
      // Keep the raw body bytes for webhook HMAC signature verification
      (req as Request).rawBody = buf;
    },
  }),
);

const limiterDefaults = {
  standardHeaders: 'draft-7',
  legacyHeaders: false,
} as const;

// Brute-force protection: bcrypt slows an attacker down but does not stop them,
// and each attempt costs real CPU on a small container.
const loginLimiter = rateLimit({
  ...limiterDefaults,
  windowMs: 15 * 60 * 1000,
  limit: 5,
  skipSuccessfulRequests: true,
  message: { error: 'Too many login attempts, try again later' },
});

// Contact form writes a row and sends an email through Resend on every request.
const contactLimiter = rateLimit({
  ...limiterDefaults,
  windowMs: 60 * 60 * 1000,
  limit: 5,
  message: { error: 'Too many messages sent, try again later' },
});

// Analytics endpoints are unauthenticated writes called repeatedly by legitimate
// visitors, so this bucket only exists to cap automated flooding.
const telemetryLimiter = rateLimit({ ...limiterDefaults, windowMs: 15 * 60 * 1000, limit: 120 });

const globalLimiter = rateLimit({ ...limiterDefaults, windowMs: 15 * 60 * 1000, limit: 300 });

app.use(globalLimiter);
app.use('/auth/login', loginLimiter);
app.use('/messages', contactLimiter);
app.use(['/visits', '/dialogue-logs'], telemetryLimiter);

app.use('/auth', authRouter);
app.use('/webhooks', webhookRouter);
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
