# Architecture

How the Interactive Portfolio Room is put together, and why.

> Public documentation. Server-specific runbooks and internal phase notes live in [`docs/`](../docs/).

---

## 1. System overview

```text
                    ┌─────────────────────────────┐
  Browser  ──HTTPS──►  Nginx (host, Let's Encrypt) │
                    └──────┬───────────────┬───────┘
                       /   │               │  /api/
                           ▼               ▼
                  ┌────────────────┐  ┌───────────────┐
                  │ frontend :8082 │  │ backend :4000 │
                  │ nginx + static │  │ Express+Prisma│
                  └────────────────┘  └──────┬────────┘
                                             ▼
                                     ┌────────────────┐
                                     │ postgres :5432 │
                                     │ (internal only)│
                                     └────────────────┘
```

Three containers, one host reverse proxy.

- **frontend** — Nginx serving the built Vite bundle. It also owns the `/api/` location and proxies to the backend over the Docker network, so the browser only ever talks to one origin.
- **backend** — Express API, Prisma client, Zod validation. Stateless: no sessions, no local files.
- **postgres** — not published to the host. Only reachable over the Compose network.

Single-origin traffic is the load-bearing decision. Because the page and the API share a host, there is no CORS preflight, no mixed-content risk, and one TLS certificate covers everything. `VITE_API_URL` must be `/api` in production for this to hold — a baked-in absolute host bypasses the proxy and reintroduces cross-origin problems.

---

## 2. Repository layout

```text
.
├── apps
│   ├── backend            # Express + Prisma API
│   │   ├── prisma         # schema, migrations, seed
│   │   ├── src
│   │   │   ├── lib        # auth, errors, prisma client, devlog phrases
│   │   │   ├── middleware # bearer auth, GitHub HMAC verification
│   │   │   ├── routes     # portfolio, admin, auth, webhooks
│   │   │   └── services   # data access + DTO mapping
│   │   └── test
│   └── frontend           # Vite + React client
│       ├── src
│       │   ├── components # ErrorBoundary, ProtectedRoute
│       │   ├── features   # room, recruiter, admin, overlays, pokemon
│       │   └── lib        # api client, stores, data hooks, fallback data
│       └── test
├── packages
│   └── shared             # Zod contracts shared by both apps
├── documentations         # this public documentation set
├── docs                   # internal notes and runbooks
└── .github/workflows      # CI/CD
```

npm workspaces. `@portfolio/shared` is built before either app, because both import its compiled types.

---

## 3. The shared contract package

`packages/shared` exports Zod schemas — `projectSchema`, `skillSchema`, `experienceSchema`, `goalSchema`, `trophySchema`, `postSchema`, `devlogEntrySchema`, `loginInputSchema`, `contactMessageInputSchema`, `visitInputSchema`, `dialogueLogInputSchema`, `analyticsSummarySchema`, `githubPushWebhookSchema`, and the derived `*CreateSchema` / `*UpdateSchema` pairs.

One definition serves three jobs:

1. The backend parses request bodies with it (`schema.parse(req.body)`), so invalid input never reaches Prisma.
2. The frontend imports the inferred TypeScript types, so a field rename breaks the build on both sides at once instead of at runtime in production.
3. Contract tests assert the schemas themselves.

Create/update variants are derived, not hand-written: `projectCreateSchema = projectSchema.omit({ id: true })` and `projectUpdateSchema = projectCreateSchema.partial()`. Adding a field to the entity propagates everywhere for free.

---

## 4. Backend

### Request pipeline

```text
request
  → trust proxy (X-Forwarded-For → req.ip)
  → helmet security headers
  → CORS allowlist
  → express.json (1 MB limit, raw body captured for HMAC)
  → global rate limiter
  → route-specific limiter (login / contact / telemetry)
  → router
  → asyncHandler → Zod parse → service → Prisma
  → errorHandler
```

Notable details in [`apps/backend/src/index.ts`](../apps/backend/src/index.ts):

- `app.set('trust proxy', 1)` — behind the reverse proxy, every request would otherwise appear to come from the proxy's IP and all clients would share one rate-limit bucket.
- `express.json`'s `verify` hook stores the raw request bytes on `req.rawBody`. HMAC signatures must be computed over the exact bytes GitHub sent; re-serializing the parsed JSON would produce a different digest.
- CORS origins are normalized through `new URL(value).origin`, so a trailing slash or path in the env var does not silently break the allowlist.
- `x-powered-by` disabled.

### Layers

- **Routes** parse input and shape responses. No business logic.
- **Services** (`portfolio-service`, `goals-trophies-service`, `email-service`) own Prisma queries, aggregation, and record→DTO mapping. Mapping lives here so JSON columns and `Date` objects are normalized in exactly one place.
- **Lib** holds cross-cutting pieces: JWT sign/verify, the `HttpError` hierarchy, the Prisma singleton, devlog phrase generation.

### Error handling

Every async route is wrapped in `asyncHandler`, which forwards rejections to Express's error handler rather than leaving an unhandled promise. `errorHandler` maps:

| Thrown | Status | Body |
| --- | --- | --- |
| `ZodError` | 422 | `{ error: "Validation failed", details }` |
| `HttpError` | its own status | `{ error, details }` |
| anything else | 500 | `{ error: "Unexpected server error" }` |

Unknown errors are logged server-side and never echoed to the client — internal messages leak stack shape and query structure.

### Graceful shutdown

`SIGTERM`/`SIGINT` close the HTTP server, then `prisma.$disconnect()`. Without this, `docker compose up -d` recreation can drop in-flight requests and leak Postgres connections on a 256 MB database container.

---

## 5. Data model

Postgres via Prisma. Entities and their relations:

| Model | Purpose | Notable relations |
| --- | --- | --- |
| `Project` | Portfolio projects | `ProjectMedia[]`, `Post[]` |
| `ProjectMedia` | Ordered images/GIFs | → `Project`, cascade delete |
| `Skill` | Skill with level, reasoning, `appliedIn` | — |
| `Experience` | Work history | — |
| `Post` | Markdown blog entries | → `Project?`, `SetNull` |
| `Goal` | Goal room entries | → `Trophy?`, `SetNull` |
| `Trophy` | Achievement room entries | `Goal[]` |
| `Message` | Contact form submissions | — |
| `UserVisit` | One row per session id | `DialogueLog[]` |
| `DialogueLog` | In-room interaction events | → `UserVisit` by `sessionId`, cascade |
| `DevlogEntry` | Generated from GitHub pushes | — |
| `User` | Admin accounts | — |

Delete behavior is deliberate: media dies with its project and dialogue logs die with their visit (they are meaningless alone), but a post or goal survives losing its project or trophy — the content still stands on its own.

`UserVisit.sessionId` is unique, and both `POST /visits` and `PATCH /visits/:sessionId` upsert on it. Visit tracking fires from a browser that may retry, reload, or race itself; an upsert makes those requests idempotent instead of producing duplicate rows.

---

## 6. Frontend

### Routing

`HashRouter`, so URLs are hash-based (`/#/recruiter`). Chosen for portability: the app works on any static host, including ones without SPA rewrite rules.

| Route | Purpose |
| --- | --- |
| `/#/` | 3D room experience |
| `/#/recruiter` | Linear, scannable view |
| `/#/recruiter/:section` | Deep link into a section |
| `/#/admin/login` | Admin login |
| `/#/admin` | Dashboard (guarded by `ProtectedRoute`) |

### Feature modules

- **room** — React Three Fiber scene: `RoomScene`, `RoomStage`, `Player`, `AudioManager`, plus declarative `room-objects.ts` / `rooms.ts` definitions. Interactable objects are data, not components, so adding one is a config edit.
- **recruiter** — the same portfolio content as a fast linear page.
- **overlays** — panels the room opens over the 3D canvas.
- **admin** — login, dashboard CRUD, analytics charts.
- **pokemon** — a self-contained battle mini-game with its own store.

### Code splitting

The heavy routes are mounted with `React.lazy` + `Suspense` in [`App.tsx`](../apps/frontend/src/App.tsx). A visitor who lands on recruiter mode never downloads the 3D scene, the audio manager, or the mini-game.

### State

Zustand, one store per concern — global UI (`store.ts`), auth (`auth-store.ts`), character (`character-store.ts`), battle (`useBattleStore.ts`). The app's global state is genuinely small: overlay visibility, audio, tutorial flags, token. A heavier state library would add ceremony without improving anything.

### Fallback-first data loading

`usePortfolioData` (and its siblings `useBlogData`, `useGoalsAndTrophies`) render bundled fallback content **immediately**, then hydrate from the API when it responds. A cold, slow, or down backend produces a slightly stale page instead of an empty one — which matters most for the exact visitor this site is built for, someone evaluating it for the first time with no patience for a spinner.

---

## 7. Key decisions

| Decision | Rationale |
| --- | --- |
| Same-origin `/api` proxy | Kills CORS and mixed-content classes of bug outright; one certificate, one DNS record |
| Build images in CI, never on the server | The 1 GB production VM cannot survive a Vite/Docker build |
| Zod contracts in a shared package | Validation and types stay in sync by construction |
| Fallback content bundled in the client | The site stays useful when the API is not |
| Hash routing | Portable across hosts without rewrite rules |
| Upsert-based visit tracking | Browser-originated writes are unreliable and repeatable |
| `node:test` instead of a test framework | Zero extra dependencies for the logic that actually needs covering |

---

## 8. See also

- [deployment.md](deployment.md) — build and release pipeline
- [api.md](api.md) — endpoint reference
- [security.md](security.md) — controls and known limitations
- [operations.md](operations.md) — running and troubleshooting
