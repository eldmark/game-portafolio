# Interactive Portfolio Room

A full-stack developer portfolio presented as an explorable cozy room. Visitors can move through a stylized 3D space, interact with objects, inspect projects, read technical reasoning, and use a recruiter mode when they need a faster traditional portfolio flow.

## Features
- Interactive React Three Fiber room with movement, camera, and object prompts.
- Recruiter mode with direct access to About, Projects, Skills, Resume, and Contact.
- Dynamic projects, skills, and experience loaded from a backend API.
- Contact mailbox that posts messages to the API.
- Fake developer terminal inside the computer overlay.
- Mascot tutorial, accessible modal overlays, loading states, and error states.
- Dockerized frontend, backend, and PostgreSQL database.

## Stack
- **Frontend:** Next.js, React, TypeScript, React Three Fiber, Drei, Framer Motion, Zustand, Howler.js.
- **Backend:** Node.js, Express, Prisma, PostgreSQL, Zod.
- **DevOps:** Docker, Docker Compose.

## Why This Stack
Next.js provides routing, production builds, and a mature React foundation. React Three Fiber makes the 3D room fit naturally into the React component model. Zustand keeps interaction state small and explicit without boilerplate. Express keeps the API readable for a junior full-stack portfolio while still supporting production-style middleware, validation, and service boundaries. Prisma and PostgreSQL demonstrate relational modeling, migrations, and intentional data access. Docker Compose proves the app can run as a real multi-service system.

## Architecture
- `apps/frontend`: user-facing Next.js portfolio and room game.
- `apps/backend`: REST API, validation, Prisma access, and seed data.
- `packages/shared`: shared TypeScript contracts and Zod schemas.
- `packages/ui`: small reusable UI primitives.
- `assets`: future models, textures, audio, screenshots, and GIFs.

The room acts as the navigation layer. Each interactable object opens an overlay backed by typed content or API data. Recruiter mode reuses the same data but presents it in a fast, traditional layout.

## Environment Variables
Copy `.env.example` and adjust values as needed.

```bash
cp .env.example .env
```

Backend:
- `DATABASE_URL`
- `PORT`
- `CORS_ORIGIN`

Frontend:
- `NEXT_PUBLIC_API_URL`

## Local Development
Install dependencies:

```bash
npm install
```

Run the full app:

```bash
npm run dev
```

Run database migration and seed:

```bash
npm run db:migrate
npm run db:seed
```

## Docker
Start the full stack:

```bash
docker compose up --build
```

Frontend: `http://localhost:3001`

Backend health check: `http://localhost:4000/health`

## Backend API
- `GET /projects`, `GET /projects/:slug`
- `GET /skills`
- `GET /experiences`
- `GET /analytics/summary`
- `POST /messages`
- `POST /visits`, `PATCH /visits/:sessionId`
- `POST /dialogue-logs`

## Quality Checks
```bash
npm run typecheck
npm run lint
npm run build
```

## Screenshots And GIFs
Add final gameplay screenshots, project GIFs, and architecture diagrams before publishing.

## Current Limitations
- Portfolio data is seeded with placeholders.
- The recruiter battle minigame is planned as a post-MVP feature.
- Admin/CMS and analytics dashboard are deferred until the core full-stack experience is stable.

## Future Improvements
- Pokemon-style recruiter interview battle.
- Admin dashboard for editing project content.
- Analytics dashboard for recruiter behavior.
- Better authored 3D assets, compressed textures, and production audio.
- CI pipeline and deployment automation.
