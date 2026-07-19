# API Reference

Express + Prisma REST API backing the portfolio.

- **Production base URL:** `https://marcodiaz.me/api`
- **Local base URL:** `http://localhost:4000`

---

## 1. Conventions

### Response envelope

Success:

```json
{ "data": ... }
```

Errors:

```json
{ "error": "message", "details": ... }
```

`details` is present only for validation failures and errors that carry structured context.

### Status codes

| Code | Meaning |
| --- | --- |
| `200` | OK |
| `201` | Created |
| `400` | Malformed request |
| `401` | Missing, invalid, or expired credentials |
| `404` | Resource or route not found |
| `422` | Zod validation failed — `details` holds `error.flatten()` |
| `429` | Rate limit exceeded |
| `500` | Unexpected server error (details are logged, never returned) |

### Content type

`application/json`. Request bodies are capped at **1 MB**.

### Validation

Every request body is parsed with a Zod schema from `@portfolio/shared`. A 422 body looks like:

```json
{
  "error": "Validation failed",
  "details": {
    "formErrors": [],
    "fieldErrors": { "email": ["Invalid email"] }
  }
}
```

### Rate limits

Buckets are per IP, with `RateLimit` headers (draft-7 standard):

| Scope | Window | Limit |
| --- | --- | --- |
| Global | 15 min | 300 |
| `POST /auth/login` | 15 min | 5 (successful logins are not counted) |
| `POST /messages` | 60 min | 5 |
| `/visits`, `/dialogue-logs` | 15 min | 120 |

---

## 2. Health

### `GET /health`

```json
{ "status": "ok", "service": "interactive-portfolio-api" }
```

---

## 3. Public content

All read-only, unauthenticated.

| Method | Endpoint | Returns |
| --- | --- | --- |
| `GET` | `/projects` | All projects with media |
| `GET` | `/projects/:slug` | One project — `404` if unknown |
| `GET` | `/skills` | All skills |
| `GET` | `/experiences` | Work history |
| `GET` | `/goals` | Goal room entries |
| `GET` | `/trophies` | Achievement room entries |
| `GET` | `/posts` | Blog posts, newest first |
| `GET` | `/posts/:slug` | One post — `404` if unknown |

### `GET /devlog`

Generated activity feed.

| Query | Default | Range |
| --- | --- | --- |
| `limit` | 20 | 1–50, clamped |

```json
{
  "data": [
    {
      "id": "clx...",
      "repo": "eldmark/game-portafolio",
      "branch": "main",
      "commitSha": "90204f7...",
      "commitUrl": "https://github.com/...",
      "message": "Pushed 3 commits to game-portafolio",
      "commitCount": 3,
      "createdAt": "2026-07-18T10:00:00.000Z"
    }
  ]
}
```

### Example

```bash
curl https://marcodiaz.me/api/projects
curl https://marcodiaz.me/api/projects/interactive-portfolio-room
curl "https://marcodiaz.me/api/devlog?limit=5"
```

---

## 4. Analytics (read)

### `GET /analytics/summary`

Aggregate visit statistics.

### `GET /analytics/timeseries`

| Query | Default | Range |
| --- | --- | --- |
| `days` | 30 | 1–90, clamped |

```json
{
  "data": {
    "visitsOverTime": [{ "date": "2026-07-01", "count": 12 }],
    "deviceBreakdown": [{ "device": "desktop", "count": 80 }],
    "countryBreakdown": [{ "country": "GT", "count": 40 }]
  }
}
```

Both endpoints return aggregates only — no per-visitor rows are exposed.

---

## 5. Public writes

### `POST /messages`

Contact form. Persists the message and delivers it through Resend.

```json
{ "name": "Jane Doe", "email": "jane@example.com", "message": "Hello" }
```

`201`:

```json
{
  "data": {
    "id": "clx...",
    "createdAt": "2026-07-18T10:00:00.000Z",
    "emailDelivery": { "...": "provider result" },
    "contactEmail": "hello@example.com"
  }
}
```

The message row is written before delivery is attempted, so a Resend outage loses the email but never the message.

Rate limit: 5 per hour per IP.

---

### `POST /visits`

Session tracking. **Upserts** on `sessionId` — safe to retry.

```json
{
  "sessionId": "a-session-id-min-8-chars",
  "recruiterMode": false,
  "device": "desktop",
  "country": "GT"
}
```

`201` → `{ "data": { "id": "...", "sessionId": "..." } }`

### `PATCH /visits/:sessionId`

Updates session duration and mode. Also upserts, so it works even if the initial `POST` was lost.

```json
{ "duration": 145, "recruiterMode": true }
```

`200` → `{ "data": { "id": "...", "sessionId": "...", "duration": 145 } }`

`sessionId` must be 8–120 characters.

### `POST /dialogue-logs`

Records an in-room interaction. Ensures the parent visit exists first, so a log never orphans.

```json
{ "sessionId": "a-session-id-min-8-chars", "dialogueKey": "desk.projects" }
```

`201` → `{ "data": { "id": "...", "createdAt": "..." } }`

---

## 6. Authentication

### `POST /auth/login`

```json
{ "email": "admin@example.com", "password": "your-password" }
```

`200`:

```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": { "id": "clx...", "email": "admin@example.com", "name": "Marco" }
  }
}
```

- Unknown email and wrong password both return `401 Invalid credentials`. Identical responses prevent account enumeration.
- Tokens are HS256, valid for **1 hour**.
- Rate limit: 5 failed attempts per IP per 15 minutes.

Use the token on every admin request:

```
Authorization: Bearer <token>
```

Missing header, malformed header, expired token, or bad signature all yield `401`.

---

## 7. Admin

All routes below require a valid bearer token. There is exactly one privilege level (see [security.md](security.md)).

### Content CRUD

```
POST   /admin/{projects|skills|experiences|goals|trophies|posts}
PATCH  /admin/{projects|skills|experiences|goals|trophies|posts}/:id
DELETE /admin/{projects|skills|experiences|goals|trophies|posts}/:id
```

- `POST` bodies are validated against `<entity>CreateSchema` — the full entity minus `id`.
- `PATCH` bodies use `<entity>UpdateSchema` — every field optional. Omitted fields are left untouched.
- `DELETE` returns `404` for an unknown id.

Cascade behavior: deleting a project removes its media; deleting a trophy or project leaves related goals and posts in place with the reference nulled.

### Users

```
GET    /admin/users
POST   /admin/users
DELETE /admin/users/:id
```

Passwords require a minimum of 12 characters and are hashed with bcrypt (cost 10). Password hashes are never returned.

### Devlog

```
DELETE /admin/devlog/:id
```

---

## 8. Webhooks

### `POST /webhooks/github`

Turns pushes into devlog entries.

**Required headers**

| Header | Value |
| --- | --- |
| `X-GitHub-Event` | `push` |
| `X-Hub-Signature-256` | `sha256=<hmac>` over the raw body, keyed with `GITHUB_WEBHOOK_SECRET` |

Signature comparison is constant-time. An invalid or missing signature returns `401`.

The request is accepted but skipped, with a reason, when it is not a push, carries no commits, or targets a branch other than `main`/`master`:

```json
{ "data": { "skipped": true, "reason": "branch not tracked" } }
```

On success, `201`:

```json
{ "data": { "id": "clx..." } }
```

---

## 9. CORS

Allowed origins come from the comma-separated `CORS_ORIGIN` env var and are normalized to their origin form, so a trailing slash in configuration does not break the allowlist. Requests with no `Origin` header (server-to-server, curl) are permitted; a disallowed browser origin is rejected.

In production this rarely engages: the frontend calls `/api` on its own origin, so requests are same-origin by construction.

---

## 10. See also

- [architecture.md](architecture.md) — request pipeline and data model
- [security.md](security.md) — auth model and limitations
- [operations.md](operations.md) — probing a live deployment
