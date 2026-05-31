# Interactive Portfolio Room

A full-stack developer portfolio presented as an explorable cozy room. Visitors can move through a stylized 3D space, interact with objects, inspect projects, read technical reasoning, and use a dedicated Recruiter Mode for a faster, traditional flow.

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

## 🏗️ Architecture

- `apps/frontend`: Vite-powered portfolio and 3D room experience.
- `apps/backend`: REST API, PostgreSQL database management, and email services.
- `packages/shared`: Centralized types and Zod schemas used by both frontend and backend.
- `packages/ui`: Shared UI primitives.
- `docs/`: Comprehensive documentation (Projects, Architecture, Replacements).

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

## 📜 Future Roadmap

- [ ] Recruiter "Interview Battle" minigame.
- [ ] Admin dashboard for real-time project management.
- [ ] Advanced WebGL shaders for the 3D room.
- [ ] Automated CI/CD pipelines.
