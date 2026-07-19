# Operations

Running, observing, and fixing the deployed stack.

---

## 1. Service map

| Service | Container | Port | Memory limit | Restart policy |
| --- | --- | --- | --- | --- |
| Postgres | `portfolio-postgres` | internal only | 256 MB | `unless-stopped` |
| Backend | `portfolio-backend` | `4000` | 384 MB | `unless-stopped` |
| Frontend | `portfolio-frontend` | `8082` | 128 MB | `unless-stopped` |

Deployment directory on the host: `~/srv/portfolio/game-portafolio`. It contains `docker-compose.prod.yml` and the generated `.env`.

---

## 2. Everyday commands

```bash
cd ~/srv/portfolio/game-portafolio

docker compose -f docker-compose.prod.yml ps          # status
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs --tail=200 frontend
docker compose -f docker-compose.prod.yml restart backend
docker stats --no-stream                              # live memory use
```

Pull and recreate after a manual image update:

```bash
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d --remove-orphans
docker image prune -f
```

Never run `docker compose build` on the production host — the 1 GB VM cannot survive it. Builds belong in CI ([deployment.md](deployment.md)).

---

## 3. Health checks

```bash
curl -s https://marcodiaz.me/api/health          # {"status":"ok",...}
curl -s -o /dev/null -w '%{http_code}\n' https://marcodiaz.me/
curl -s https://marcodiaz.me/api/projects | head -c 200
```

A green `/health` means the process is up. It does **not** prove database connectivity — for that, hit a data endpoint like `/api/projects`.

Postgres has a Compose healthcheck (`pg_isready`, every 10 s, 5 retries). The backend will not start until it passes.

---

## 4. Memory — the recurring theme

1 GB total across three containers plus the host's Nginx and OS. Almost every production incident on this host traces back to memory.

- **Swap is mandatory.** 2 GB of swap is what keeps a transient spike from OOM-killing a container.
- **Watch `docker stats`** when something feels slow. The backend brushing 384 MB is the usual first symptom.
- **The 128 MB frontend limit is generous** for serving static files — if it is near the cap, something is wrong, not busy.
- **Never build on the host.** This is the single fastest way to take the site down.

An OOM kill looks like a container that restarted on its own:

```bash
docker inspect portfolio-backend --format '{{.State.OOMKilled}} {{.RestartCount}}'
```

---

## 5. Database operations

### Shell

```bash
docker compose -f docker-compose.prod.yml exec postgres \
  psql -U portfolio -d portfolio
```

### Backup

```bash
docker compose -f docker-compose.prod.yml exec -T postgres \
  pg_dump -U portfolio portfolio > backup-$(date +%F).sql
```

Take one before any migration or rollback. Store it off the host — a backup on the same 1 GB VM is not a backup.

### Restore

```bash
cat backup-2026-07-18.sql | docker compose -f docker-compose.prod.yml exec -T postgres \
  psql -U portfolio -d portfolio
```

### Migrations

Migrations are applied with `prisma migrate deploy` (never `migrate dev`, which can reset the database).

### Never run the seed against production

`npm run db:seed` is **destructive** — it wipes existing records before recreating them. It exists for development databases only.

### Volume safety

Data lives in the `postgres-data` named volume. `docker compose down` preserves it. **`docker compose down -v` destroys it.** Do not use `-v` on the production host.

---

## 6. Troubleshooting

### Site loads but shows stale or generic content

The frontend is serving its bundled fallback data, meaning API calls failed. This is the designed degradation, not a crash.

1. `curl https://marcodiaz.me/api/health`
2. `docker compose logs --tail=100 backend`
3. Check the browser console for the failing request and its status.

### `502 Bad Gateway`

The proxy cannot reach an upstream.

- Backend down or restarting → `docker compose ps`, then logs
- Container OOM-killed → §4
- Host Nginx pointing at the wrong port → `/` should be `127.0.0.1:8082`, `/api/` should be `127.0.0.1:4000/`

### CORS error in the browser console

Almost always `VITE_API_URL` baked to an absolute host instead of `/api`.

Remember it is **compile-time**: changing the server `.env` has no effect. Fix the `VITE_API_URL` secret and push to `main` to rebuild the image. Failing that, confirm `CORS_ORIGIN` matches the browser origin exactly — scheme included, no trailing path.

### `401` on every admin request

- Token expired (1-hour lifetime) → log in again
- `JWT_SECRET` changed on the last deploy → all existing tokens are invalid by design; log in again

### `429 Too many requests`

Rate limiting is working. Login allows 5 failed attempts per IP per 15 minutes; successful logins are not counted. Contact form allows 5 per hour. Wait out the window.

### Devlog not updating after pushes

1. GitHub → repository → Settings → Webhooks → check recent deliveries.
2. A `401` there means the signature failed: `GITHUB_WEBHOOK_SECRET` on the server does not match the secret configured on the webhook.

   Note the naming: the CI secret is `DEVLOG_WEBHOOK_SECRET` (GitHub reserves the `GITHUB_` prefix) and the deploy step maps it to `GITHUB_WEBHOOK_SECRET` in the server `.env`.
3. Pushes to branches other than `main`/`master` are skipped on purpose and return `200` with `{ "skipped": true }`.

### Contact form succeeds but no email arrives

The message row is written before delivery is attempted, so the submission is not lost. Check `RESEND_API_KEY` and `CONTACT_EMAIL`, then read the `emailDelivery` field in the response and the backend logs. Recover the message from the database:

```sql
SELECT name, email, message, created_at FROM "Message" ORDER BY created_at DESC LIMIT 10;
```

### Deploy succeeded but nothing changed

- Frontend change → confirm the image was rebuilt; `VITE_` values only take effect on rebuild
- Browser cache → static assets are served `immutable` for 30 days; hard-reload
- Check that the deploy job actually ran and `docker compose pull` fetched a new digest

---

## 7. Incident response

1. **Assess** — is the site down, degraded (fallback content), or is only the admin affected?
2. **Contain** — for a suspected credential compromise, rotate `JWT_SECRET` and redeploy. That invalidates every outstanding token immediately.
3. **Roll back** — revert the offending commit on `main` and let the pipeline redeploy, or pin images to a known-good `:<sha>` (see [deployment.md](deployment.md)).
4. **Restore data** if a migration caused the damage — restore the dump *before* rolling the image back; migrations do not roll back with the image.
5. **Verify** — `/api/health`, a data endpoint, the frontend, and an admin login.

---

## 8. Routine maintenance

| Task | Cadence |
| --- | --- |
| Database dump stored off-host | Weekly, and before every migration |
| `docker image prune -f` | Runs on each deploy; check disk occasionally |
| TLS certificate renewal | Automatic via Let's Encrypt — verify it is renewing |
| Dependency updates | Monthly, gated by `npm test` + `npm run typecheck` |
| Secret rotation | Annually, or immediately on suspicion |
| Log review | After each deploy |

Disk pressure on a small VM is real: check with `df -h` and `docker system df`.

---

## 9. Local development

```bash
npm install
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
npm run db:bootstrap    # migrate + seed — development databases only
npm run dev
```

Frontend on `http://localhost:3000`, API on `http://localhost:4000`.

Quality gates:

```bash
npm test
npm run typecheck
npm run lint
npm run format
```

---

## 10. See also

- [deployment.md](deployment.md) — pipeline and rollback
- [architecture.md](architecture.md) — how the pieces fit
- [security.md](security.md) — controls and secret handling
- [api.md](api.md) — endpoints for probing a live deployment
