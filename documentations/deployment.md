# Deployment

How the project goes from a push on `main` to running containers.

> Public documentation. Host-specific setup for this particular server lives in [`docs/production.md`](../docs/production.md).

---

## 1. The constraint that shapes everything

Production runs on a **1 GB VM**. A Vite build peaks well above that, and a Docker build on the host would exhaust both RAM and disk. So:

**Images are built in CI. The server only pulls and restarts.**

Every other choice here follows from that rule. Do not run `npm run build` or `docker compose build` on the production host.

---

## 2. Pipeline

```text
push to main
  │
  ├─► build-and-push (GitHub Actions, ubuntu-latest)
  │     ├─ build apps/backend/Dockerfile  → ghcr.io/<owner>/portfolio-backend:latest + :<sha>
  │     └─ build apps/frontend/Dockerfile → ghcr.io/<owner>/portfolio-frontend:latest + :<sha>
  │        (VITE_API_URL passed as a build arg)
  │
  └─► deploy (needs build-and-push, only on refs/heads/main)
        ├─ scp docker-compose.prod.yml → ~/srv/portfolio/game-portafolio
        └─ ssh:
             write .env from secrets, chmod 600
             docker login ghcr.io
             docker compose -f docker-compose.prod.yml pull
             docker compose -f docker-compose.prod.yml up -d --remove-orphans
             docker image prune -f
```

Defined in [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml). Every action is pinned to a commit SHA, not a floating tag — a compromised or retagged third-party action would otherwise run with repository credentials.

Both images are tagged `:latest` and `:<commit-sha>`. The SHA tag is what makes a rollback possible (§7).

---

## 3. Images

| Image | Base | Contents |
| --- | --- | --- |
| `portfolio-backend` | `node:20-alpine` | compiled `dist/`, production `node_modules`, Prisma engines |
| `portfolio-frontend` | `nginx` on alpine | static Vite output + [`nginx.conf`](../apps/frontend/nginx.conf) |

Alpine bases keep both the image size and the baseline RSS small enough to fit the memory limits in §5.

### `VITE_API_URL` is compile-time

Vite inlines `import.meta.env` values into the bundle at **build** time. The value is passed as a Docker build arg from the `VITE_API_URL` secret.

Consequences:

- In production it must be exactly `/api`.
- Changing it on the server's `.env` does nothing. You must rebuild the image — a push to `main` does that.

---

## 4. Compose topology

[`docker-compose.prod.yml`](../docker-compose.prod.yml):

| Service | Image | Ports | Memory limit |
| --- | --- | --- | --- |
| `postgres` | `postgres:16-alpine` | `expose: 5432` (not published) | 256 MB |
| `backend` | GHCR backend | `4000:4000` | 384 MB |
| `frontend` | GHCR frontend | `8082:80` | 128 MB |

`postgres` uses `expose`, not `ports`. Docker writes its own iptables rules that bypass most host firewall configurations, so a published `5432` would be reachable from the internet even behind a firewall that looks closed. The backend reaches it over the Compose network; nothing else needs to.

`backend` waits on `postgres`'s `pg_isready` healthcheck (`condition: service_healthy`) rather than mere container start, so Prisma does not fail its first connections during a cold boot.

Data lives in the named volume `postgres-data`. It survives `docker compose down`; it does **not** survive `docker compose down -v`.

---

## 5. Host reverse proxy

Nginx on the host terminates TLS (Let's Encrypt) and routes:

- `/` → `http://127.0.0.1:8082` (frontend container)
- `/api/` → `http://127.0.0.1:4000/` (backend container)

The frontend container's own Nginx *also* handles `/api/`, forwarding to `http://backend:4000` over the Docker network and stripping the prefix. That inner proxy is what makes the same-origin setup work regardless of how the outer proxy is arranged.

The inner config resolves the upstream through a variable plus Docker's internal DNS (`resolver 127.0.0.11`). A static `proxy_pass` to a named container makes Nginx fail config load when the backend is not yet up; the variable form lets the frontend boot and serve static content while the backend is still starting.

---

## 6. Configuration

### GitHub Actions secrets

| Secret | Purpose |
| --- | --- |
| `SERVER_HOST` | Deploy target host |
| `SERVER_USER` | SSH user |
| `SSH_PRIVATE_KEY` | Deploy key |
| `POSTGRES_PASSWORD` | Database password |
| `JWT_SECRET` | HS256 signing key — `openssl rand -hex 32` |
| `CORS_ORIGIN` | Browser origin allowlist |
| `RESEND_API_KEY` | Contact email delivery |
| `CONTACT_EMAIL` | Destination inbox |
| `DEVLOG_WEBHOOK_SECRET` | GitHub webhook HMAC secret — `openssl rand -hex 32` |
| `VITE_API_URL` | Must be `/api` |

`DEVLOG_WEBHOOK_SECRET` is named differently from the env var it feeds (`GITHUB_WEBHOOK_SECRET`) because GitHub reserves the `GITHUB_` prefix for secret names. The deploy step performs the mapping.

### Server `.env`

The deploy step rewrites `~/srv/portfolio/game-portafolio/.env` on every run and `chmod 600`s it — it holds every production secret, so it must not be group- or world-readable. It is generated, never hand-edited: any manual change is overwritten by the next deploy.

`CORS_ORIGIN` must match the browser origin exactly, scheme included, no trailing path.

---

## 7. Rollback

Both images carry a `:<commit-sha>` tag. To go back to a known-good commit, pin the images to that SHA and recreate:

```bash
cd ~/srv/portfolio/game-portafolio
docker compose -f docker-compose.prod.yml pull
# edit the image tags to :<sha>, or run with an override file
docker compose -f docker-compose.prod.yml up -d
```

The faster path for a bad application change is to revert the commit on `main` and let the pipeline redeploy — it is one push and leaves the server's state consistent with the repository.

**Database migrations do not roll back with the image.** If the bad release included a destructive migration, restore from a dump (see [operations.md](operations.md)) before rolling the image back.

---

## 8. Local deployment

```bash
npm run docker:up     # build + run the full stack locally
npm run docker:down
```

Uses [`docker-compose.yml`](../docker-compose.yml), which builds from source. This is the one place local and production diverge on purpose: locally, building is fine.

---

## 9. Deploy checklist

- [ ] `npm test`, `npm run typecheck`, `npm run lint` pass
- [ ] Migrations committed if the schema changed
- [ ] `VITE_API_URL` is `/api`
- [ ] `CORS_ORIGIN` matches the live origin exactly
- [ ] `GET /api/health` returns `{"status":"ok"}` after the deploy
- [ ] Frontend loads and shows live (not fallback) content

---

## 10. See also

- [architecture.md](architecture.md) — why the topology looks like this
- [operations.md](operations.md) — day-two running and troubleshooting
- [security.md](security.md) — secret handling and controls
