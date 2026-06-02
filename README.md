# Interactive Portfolio Room

Interactive portfolio presented as an explorable 3D room with a recruiter-friendly alternate view, admin dashboard, analytics, contact flow, and a small full-stack backend.

This repository is a monorepo with:

- `apps/frontend`: Vite + React portfolio client
- `apps/backend`: Express + Prisma + PostgreSQL API
- `packages/shared`: shared contracts and schemas
- `packages/ui`: shared UI package
- `docs/`: deployment and project documentation

## What This Project Does

The project exposes two primary user experiences:

- A room-based portfolio where visitors move around a scene, interact with objects, and open overlays for projects, skills, contact, and resume content.
- A recruiter page with a faster linear navigation flow for proof-of-work review.

It also includes:

- Admin authentication and dashboard routes
- Contact form delivery with Resend and fallback behavior
- Visit tracking and dialogue analytics
- Dockerized deployment for frontend, backend, and PostgreSQL

## Stack

- Frontend: React, Vite, TypeScript, React Router, React Three Fiber, Drei, Zustand, Framer Motion
- Backend: Node.js, Express, Prisma, PostgreSQL, Zod
- Infrastructure: Docker, Docker Compose, Nginx, GitHub Actions, GHCR

## Repository Layout

```text
.
├── apps
│   ├── backend
│   └── frontend
├── packages
│   ├── shared
│   └── ui
├── docs
├── docker-compose.prod.yml
└── .github/workflows/deploy.yml
```

## Routing Model

The frontend uses `HashRouter`.

That matters for production URLs:

- Public home: `http://<host>/#/`
- Recruiter page: `http://<host>/#/recruiter`
- Recruiter section example: `http://<host>/#/recruiter/projects`
- Admin login: `http://<host>/#/admin/login`
- Admin dashboard: `http://<host>/#/admin/dashboard`

This was chosen because the project may be hosted behind simple static hosting or nested paths where server-side SPA rewrites are not guaranteed.

## API Model

The frontend should call the backend through `/api` in production.

That means:

- Browser -> `http://<host>/api/...`
- Nginx -> proxies `/api` to the backend container

Do not build production frontend images with `VITE_API_URL=<server-ip>:4000`. That bypasses the reverse proxy, creates CORS issues, and breaks browser behavior.

Correct production value:

```env
VITE_API_URL=/api
```

## Local Development

### Prerequisites

- Node.js `>= 20.11.0`
- npm `>= 10.2.0`
- PostgreSQL if running outside Docker

### Environment Files

Create local env files as needed:

```bash
cp .env.example .env
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
```

Important local variables:

- `apps/backend/.env`
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `CORS_ORIGIN`
  - `RESEND_API_KEY`
- `apps/frontend/.env`
  - `VITE_API_URL`

### Install

```bash
npm install
```

### Database

Apply migrations:

```bash
npm run db:migrate
```

Seed data:

```bash
npm run db:seed
```

Bootstrap from scratch:

```bash
npm run db:bootstrap
```

### Run Locally

```bash
npm run dev
```

Expected local URLs:

- Frontend dev server: `http://localhost:3000`
- Backend API: `http://localhost:4000`

## Docker

For local full-stack execution:

```bash
npm run docker:up
```

Stop containers:

```bash
npm run docker:down
```

## Production Deployment

The production stack is designed for low-memory servers and expects images to be built in GitHub Actions, not on the server.

Primary reference:

- [docs/production.md](/home/dmark123/Desktop/homework/web/game-portafolio/docs/production.md)

### Production Flow

1. Push to `main`
2. GitHub Actions builds frontend and backend images
3. Images are pushed to GHCR
4. The server pulls the images and recreates containers
5. Nginx serves the frontend and proxies `/api` to the backend

### Production Compose File

- [docker-compose.prod.yml](/home/dmark123/Desktop/homework/web/game-portafolio/docker-compose.prod.yml)

Current production port mapping in that file:

- Frontend container -> host `8082`
- Backend container -> host `4000`
- Postgres container -> host `5432`

Nginx should proxy:

- `/` -> `http://127.0.0.1:8082`
- `/api/` -> `http://127.0.0.1:4000/`

### GitHub Actions Secrets

Required secrets for the current deploy flow:

- `SERVER_HOST`
- `SERVER_USER`
- `SSH_PRIVATE_KEY`
- `POSTGRES_PASSWORD`
- `JWT_SECRET`
- `CORS_ORIGIN`
- `RESEND_API_KEY`
- `VITE_API_URL`

Recommended values in the current `sslip.io` single-host setup:

```env
CORS_ORIGIN=http://34.71.234.176.sslip.io,http://portfolio.34.71.234.176.sslip.io
VITE_API_URL=/api
```

### Current `sslip.io` Pattern

Current public hostname shape:

```text
http://34.71.234.176.sslip.io
```

The portfolio has also been configured to answer:

```text
http://portfolio.34.71.234.176.sslip.io
```

For practical consistency, prefer one public hostname and use that same hostname in `CORS_ORIGIN`.

## API Reference

All successful responses use:

```json
{ "data": ... }
```

Errors use:

```json
{ "error": "message" }
```

### Public Endpoints

- `GET /projects`
- `GET /projects/:slug`
- `GET /skills`
- `GET /experiences`
- `POST /messages`
- `POST /visits`
- `PATCH /visits/:sessionId`
- `POST /dialogue-logs`
- `GET /analytics/summary`

### Auth

- `POST /auth/login`

### Admin

Requires `Authorization: Bearer <token>`.

- `GET /admin/users`
- `POST /admin/users`
- `DELETE /admin/users/:id`
- `POST /admin/projects`
- `PATCH /admin/projects/:id`
- `DELETE /admin/projects/:id`
- `POST /admin/skills`
- `PATCH /admin/skills/:id`
- `DELETE /admin/skills/:id`
- `POST /admin/experiences`
- `PATCH /admin/experiences/:id`
- `DELETE /admin/experiences/:id`

## Admin Access

Production admin URLs:

- Login: `http://<host>/#/admin/login`
- Dashboard: `http://<host>/#/admin/dashboard`

Do not use `/admin/login` without `#/` unless the router strategy changes.

## Seeding Notes

The backend seed command is currently:

```bash
npm run db:seed --workspace @portfolio/backend
```

In development this works because `tsx` is available.

In the current production container, dev dependencies are pruned, so `tsx` is not available by default. If you need to seed the running production container immediately, the temporary workaround is:

```bash
docker exec -it portfolio-backend sh -lc "npm install --no-save tsx && npm run db:seed --workspace @portfolio/backend"
```

Important caveat:

- The seed script is destructive. It deletes existing users, projects, skills, experiences, messages, visits, and dialogue logs before recreating the seeded records.

This is a temporary operational workaround, not the ideal long-term production seeding strategy.

## Operational Checks

Useful server-side checks:

```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f
docker stats
free -h
df -h
```

Useful API checks:

```bash
curl http://127.0.0.1:4000/projects
curl http://127.0.0.1:4000/messages -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"test","email":"test@example.com","message":"hello from server"}'
curl http://34.71.234.176.sslip.io/api/projects
```

Useful frontend verification:

- Confirm the deployed frontend bundle does not contain `34.71.234.176:4000`
- Confirm it uses `/api`
- Confirm recruiter routes are under `/#/recruiter/...`

## Known Production Lessons

These issues already occurred during deployment and are worth documenting explicitly:

- If Nginx points to the wrong frontend port, the public site may return `502 Bad Gateway`.
- If `VITE_API_URL` is built as `34.71.234.176:4000`, the browser may bypass the proxy and create CORS and timeout issues.
- If `CORS_ORIGIN` changes in `.env`, the backend container must be recreated to pick up the new value.
- If the browser still behaves like an old version after deploy, force a hard refresh or test in a private window because stale JS assets can hide server-side fixes.
- The server currently has low disk headroom. Monitor `df -h` before large image pulls or repeated redeploys.

## Quality Commands

```bash
npm run typecheck
npm run lint
npm run format
```

If local `node` tooling is unavailable in the shell you are using, `bunx tsc` can still be used for direct TypeScript verification.

## Related Docs

- [docs/production.md](/home/dmark123/Desktop/homework/web/game-portafolio/docs/production.md)
- [docs/replace.md](/home/dmark123/Desktop/homework/web/game-portafolio/docs/replace.md)
- [docs/architecture.md](/home/dmark123/Desktop/homework/web/game-portafolio/docs/architecture.md)

## Current Status Summary

At the time of this README update, the project has been adapted to:

- serve the frontend through `HashRouter`
- work behind a reverse-proxied `/api` path
- support `sslip.io`-based server access
- expose admin routes through hash-based URLs
- tolerate browsers where `crypto.randomUUID()` is unavailable
- avoid room keyboard crashes while typing inside the mailbox form

The remaining long-term operational improvements are:

- make production seeding work without installing `tsx` manually
- reduce disk pressure on the server
- add timeout handling around Resend requests in the backend
