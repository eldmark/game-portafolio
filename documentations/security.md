# Security

What this project defends against, how, and — importantly — what it does not.

---

## 1. Threat model

This is a **personal portfolio with a single administrator**. That framing determines what is worth building.

**In scope**

- Unauthorized modification of portfolio content
- Credential brute-forcing against the admin login
- Forged devlog entries via the public webhook
- Injection through any user-supplied input
- Abuse of the unauthenticated write endpoints (contact form, telemetry)
- Direct exposure of the database to the internet
- Secret leakage through the repository, images, or CI logs

**Explicitly out of scope**

- Multi-tenant isolation — there is one tenant
- Role separation — see §3
- Sophisticated targeted attacks against the host itself

> **Do not lift this auth layer into a multi-user or multi-role application.** It is correct for one operator and wrong for anything else.

---

## 2. Authentication

- Passwords hashed with **bcrypt**, cost 10, minimum 12 characters.
- Login returns a **JWT**, HS256, expiring in **1 hour**.
- The signing algorithm is pinned on both sign and verify:

  ```ts
  jwt.verify(token, JWT_SECRET, { algorithms: [JWT_ALGORITHM] });
  ```

  Pinning is not cosmetic. Verification that accepts whatever the token's own header claims is the classic `alg: none` / RS256→HS256 confusion attack. The allowlist makes the token unable to choose how it is checked.

- `JWT_SECRET` is required at startup. The process refuses to boot without it rather than falling back to a default — a development default that reaches production is a signing key an attacker already knows.
- Login failures are indistinguishable: unknown email and wrong password both return `401 Invalid credentials`, so the endpoint cannot be used to enumerate accounts.

### Token transport — known limitation

The token is stored in `localStorage`, not an `HttpOnly` cookie. It is therefore readable by any JavaScript running on the origin, which means a successful XSS gets the admin token.

Accepted because: the admin surface is a single operator, the app renders no user-generated HTML, and the 1-hour expiry bounds the window. A cookie-based session would close this fully, at the cost of adding CSRF protection to every mutating route. That trade is worth revisiting if the app ever renders third-party content.

---

## 3. Authorization — by design, flat

Every authenticated account has **identical privileges**. There are no roles and no permission tiers. Any account that can log in can also create and delete accounts, including the one it is using.

This is intentional for a single-operator site: a role system with one role is ceremony that provides no protection. It is also the single largest reason this auth layer must not be reused elsewhere.

`authMiddleware` guards the entire `/admin` router, mounted before the router itself, so a new admin route cannot be added unprotected by accident.

---

## 4. Input validation

Every request body is parsed with a Zod schema from `@portfolio/shared` before it reaches any service or Prisma call. Unparsed input never touches the database.

Because the schemas are shared with the frontend, client and server agree on shape by construction rather than by convention.

Additional bounds:

- JSON bodies capped at 1 MB
- `sessionId` constrained to 8–120 characters
- `devlog?limit` clamped to 1–50, `analytics?days` clamped to 1–90 — unbounded query params are a cheap denial-of-service vector against a 384 MB container

**SQL injection** is structurally prevented: all database access goes through Prisma's parameterized query builder. There is no raw SQL string interpolation anywhere in the codebase.

---

## 5. Rate limiting

| Scope | Window | Limit | Why |
| --- | --- | --- | --- |
| Global | 15 min | 300 | Blanket abuse ceiling |
| `POST /auth/login` | 15 min | 5 | Brute force. bcrypt slows an attacker but does not stop one, and each attempt burns real CPU on a small container. Successful logins are not counted, so a working admin is never locked out. |
| `POST /messages` | 60 min | 5 | Each request writes a row and calls a paid email API |
| `/visits`, `/dialogue-logs` | 15 min | 120 | Unauthenticated writes from real visitors; caps automated flooding without breaking normal use |

`app.set('trust proxy', 1)` makes `req.ip` read from `X-Forwarded-For`. Without it, every request behind the reverse proxy would appear to come from the proxy and all clients would share one bucket — which would make login rate limiting simultaneously useless against an attacker and a self-inflicted outage for everyone else.

---

## 6. Webhook verification

`POST /webhooks/github` is publicly reachable and writes to the database, so it is verified as if hostile:

1. `GITHUB_WEBHOOK_SECRET` must be configured, else `401`.
2. `X-Hub-Signature-256` must be present.
3. `sha256=HMAC-SHA256(rawBody, secret)` is compared with `crypto.timingSafeEqual`, with a length check first (`timingSafeEqual` throws on mismatched lengths).

Two details matter:

- **Constant-time comparison.** `===` on a signature leaks, byte by byte, how much of a guess was correct, which is enough to forge one.
- **Raw bytes.** The HMAC is computed over the exact body received, captured by `express.json`'s `verify` hook into `req.rawBody`. Re-serializing parsed JSON would reorder keys or change whitespace and never match.

Payloads are then Zod-validated, and only `main`/`master` pushes produce entries.

---

## 7. Transport and headers

- **TLS** terminated by host Nginx with Let's Encrypt.
- **helmet** sets the standard security headers; `x-powered-by` is disabled so the server does not advertise its stack.
- `crossOriginResourcePolicy` is set to `cross-origin` because the API can be served from a different origin than the frontend. CORS, not CORP, is what actually restricts callers here.
- **CORS** uses an explicit allowlist from `CORS_ORIGIN`, normalized via `new URL(v).origin` so a stray trailing slash cannot silently widen or break it. There is no wildcard origin.

In the production layout the frontend calls `/api` on its own origin, so cross-origin requests do not arise in normal operation.

---

## 8. Network exposure

Postgres is declared with `expose`, never `ports`. It is reachable only from the backend over the Compose network.

This is not a stylistic preference. Docker manages its own iptables rules that bypass most host-level firewall configurations, so publishing `5432` would expose the database to the internet even on a host whose firewall appears to deny it.

Only `22`, `80`, and `443` need to be open on the host.

---

## 9. Secrets

- No secrets in the repository. `.env` files are gitignored; `.env.example` files carry names and comments only.
- CI holds secrets in GitHub Actions secrets and injects them at deploy time.
- The generated server `.env` is `chmod 600` — owner-readable only.
- `VITE_API_URL` is compiled into the frontend bundle, so **it must never hold anything secret**. It holds a path (`/api`). No API key or backend credential may be added to any `VITE_`-prefixed variable — the entire bundle is public.
- Every GitHub Action is pinned to a commit SHA rather than a moving tag, so a retagged or compromised upstream action cannot silently gain access to deploy credentials.

Rotating a secret: change it in GitHub Actions secrets and redeploy. The deploy step rewrites the server `.env` on every run. Rotating `JWT_SECRET` invalidates all outstanding tokens, which is the intended behavior after a suspected compromise.

---

## 10. Error handling

Unknown errors are logged server-side and returned as a flat `500 Unexpected server error`. Internal messages are never echoed to clients — driver errors and stack traces disclose schema shape, file paths, and library versions.

Zod errors *are* returned (422) because they describe the caller's own input and reveal nothing about internals.

---

## 11. Known limitations

| Limitation | Impact | Mitigation in place |
| --- | --- | --- |
| Token in `localStorage` | XSS on the origin can steal the admin token | 1-hour expiry; no user-generated HTML rendered |
| No role separation | Any account can delete any account | Single-operator design; documented |
| No token revocation list | A stolen token is valid until it expires | Short expiry; rotating `JWT_SECRET` invalidates all tokens |
| No refresh tokens | Admin re-authenticates hourly | Acceptable for occasional admin use |
| No outbound timeout on Resend | A hung provider request can occupy a handler | Contact endpoint is rate limited to 5/hour; on the roadmap |
| Unauthenticated telemetry writes | Visit and dialogue rows can be fabricated | Rate limited; analytics are non-critical, aggregate-only |

---

## 12. Reporting a vulnerability

Found something? Please report it privately rather than opening a public issue — use the contact form at [marcodiaz.me](https://marcodiaz.me) or open a GitHub security advisory on the repository.

---

## 13. See also

- [api.md](api.md) — auth flow and endpoint-level requirements
- [deployment.md](deployment.md) — secret injection and pinning
- [operations.md](operations.md) — incident response
