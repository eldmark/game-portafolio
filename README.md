# Interactive Portfolio Room

A full-stack developer portfolio presented as an explorable cozy room. Visitors can move through a stylized 3D space, interact with objects, inspect projects, read technical reasoning, and use a dedicated Recruiter Mode for a faster, traditional flow.

## What this project demonstrates

- Interactive SPA architecture with routed views and modal overlays.
- Backend-driven projects, skills, experiences, analytics, and admin workflows.
- Dockerized frontend, backend, and PostgreSQL stack.
- Nginx-ready production deployment with support for multiple apps on the same server.
- Clear engineering reasoning through project descriptions and dashboard analytics.

## 🚀 Experience Features

- **Explorable 3D Space:** Interactive React Three Fiber room with movement, camera follow, and object prompts.
- **Pixel Art Character:** Sprite-sheet based character animation with direction-based logic.
- **Recruiter Mode:** A high-speed, traditional portfolio view optimized for professional evaluation (About, Proof of Work, Skills, Resume, and Contact).
- **Dynamic Content:** Projects, skills, and experience are loaded from a backend API with a robust frontend fallback system.
- **Interactive Computer:** A functional developer terminal simulation inside the computer overlay.
- **Contact System:** Integrated mailbox with real-time validation and error handling.
- **Mobile Responsive:** Fully optimized for all devices, including mobile-friendly navigation bars and touch controls.
- **Cozy Aesthetics:** Polished UI with Framer Motion animations, Syne typography, and a warm color palette.

## 🛠️ Technical Stack

- **Frontend:** Vite, React, TypeScript, React Three Fiber, Drei, Framer Motion, Zustand.
- **Backend:** Node.js, Express, Prisma ORM, PostgreSQL, Zod validation.
- **DevOps:** Docker, Docker Compose.
- **Shared:** Monorepo architecture with shared TypeScript contracts.

## Why this stack

- **React + Vite:** fast iteration for a UI-heavy portfolio with modular components and smooth client-side routing.
- **React Three Fiber:** lets the room behave like a real interactive scene while staying in the React ecosystem.
- **Express + Prisma + PostgreSQL:** a practical backend stack for CRUD, analytics, and admin flows with a real relational database.
- **Docker:** makes local development and production rollout predictable across machines and servers.
- **Zustand + Framer Motion:** simple client state and lightweight motion without unnecessary framework overhead.

## 🏗️ Architecture

- `apps/frontend`: Vite-powered portfolio and 3D room experience.
- `apps/backend`: REST API, PostgreSQL database management, and email services.
- `packages/shared`: Centralized types and Zod schemas used by both frontend and backend.
- `packages/ui`: Shared UI primitives.
- `docs/`: Comprehensive documentation (Projects, Architecture, Replacements).

## Key Features

- Room-based portfolio exploration with object interactions and dialogue prompts.
- Recruiter Mode for quick access to proof of work, skills, experience, resume, and contact.
- Dynamic projects, experience, skills, and analytics fetched from the backend.
- Admin dashboard for managing projects, skills, experience, and users.
- Contact system with email fallback behavior and clear user feedback.

## 📋 Getting Started

### 1. Prerequisites

- Node.js >= 20.11.0
- Docker & Docker Compose (optional for local development)

### 2. Environment Setup

Copy the example environment files and adjust the values:

```bash
# Root directory
cp .env.example .env

# Backend
cp apps/backend/.env.example apps/backend/.env

# Frontend
cp apps/frontend/.env.example apps/frontend/.env
```

### 3. Installation

```bash
npm install
```

### 4. Database Setup

Ensure you have a PostgreSQL instance running, then:

```bash
npm run db:migrate
npm run db:seed
```

For a fresh database bootstrap, use:

```bash
npm run db:bootstrap
```

### 5. Local Development

```bash
npm run dev
```

## 🐳 Docker Execution

The easiest way to run the full stack (Frontend, Backend, Database) is using Docker:

```bash
npm run docker:up
```

- **Frontend:** `http://localhost:3000`
- **Backend:** `http://localhost:4000`

## 🚀 Production Deployment with Nginx

The full production guide lives in [docs/produciton.md](./docs/produciton.md).

## 🎨 Manual Personalization

This portfolio is designed to be easily customized. Before deploying, follow the guide in:
👉 **[docs/replace.md](./docs/replace.md)**

It covers how to:

- Replace project thumbnails and GIFs.
- Add your own resume PDF.
- Update personal contact links and GitHub repositories.
- Configure email services (Resend).

## ✅ Quality Standards

```bash
npm run typecheck # Verify TypeScript types
npm run lint      # Run ESLint
npm run format    # Apply Prettier formatting
```

## API Documentation

This project exposes a small REST API used by the frontend. All JSON responses follow the envelope shape: `{ "data": ... }` on success, and `{ "error": "message", "details": ... }` on failure.

Base URL (development): `http://localhost:4000`

Authentication: Admin routes require a JWT in the `Authorization: Bearer <token>` header.

Public endpoints

- `GET /projects` — list projects (returns `[{...project}]`)
- `GET /projects/:slug` — get a single project by slug
- `GET /skills` — list skills
- `GET /experiences` — list experiences
- `POST /messages` — submit contact message (body: `{ name, email, message }`)

Usage tracking & analytics

- `POST /visits` — record or upsert a visit (body: `{ sessionId, recruiterMode, device, country }`)
- `PATCH /visits/:sessionId` — update duration and flags (body: `{ duration, recruiterMode }`)
- `POST /dialogue-logs` — record a dialogue interaction (body: `{ sessionId, dialogueKey }`)
- `GET /analytics/summary` — admin-visible analytics summary (total visits, average duration, dialogue counts)

Auth

- `POST /auth/login` — login (body: `{ email, password }`) returns `{ token, user }` on success.

Admin endpoints (require `Authorization` header)

- `GET /admin/users` — list admin users
- `POST /admin/users` — create admin user (body `{ email, password, name? }`)
- `DELETE /admin/users/:id` — delete admin user
- `POST /admin/projects`, `PATCH /admin/projects/:id`, `DELETE /admin/projects/:id` — manage projects
- `POST /admin/skills`, `PATCH /admin/skills/:id`, `DELETE /admin/skills/:id` — manage skills
- `POST /admin/experiences`, `PATCH /admin/experiences/:id`, `DELETE /admin/experiences/:id` — manage experiences

Quick curl examples

Fetch public projects:

```bash
curl -s http://localhost:4000/projects | jq
```

Create an admin user (replace `<TOKEN>` with an admin JWT):

```bash
curl -X POST http://localhost:4000/admin/users \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer <TOKEN>" \
	-d '{"email":"you@example.com","password":"securepass","name":"You"}' | jq
```

Environment variables the server expects (see `apps/backend/.env.example`):

- `DATABASE_URL`, `JWT_SECRET`, `RESEND_API_KEY`, `CONTACT_EMAIL`, `CORS_ORIGIN`, `PORT`

## Screenshots and Media

Add production screenshots or GIFs of:

- The room experience.
- Recruiter Mode.
- Admin dashboard.
- The contact fallback flow.

## Challenges Encountered

- Keeping the 3D room stable while still feeling lightweight.
- Balancing creative visuals with recruiter-friendly navigation.
- Keeping backend data, analytics, and admin flows consistent across frontend and server.
- Making deployment friendly for both local Docker usage and server-based hosting.
