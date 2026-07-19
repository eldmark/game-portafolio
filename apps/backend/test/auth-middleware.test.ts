import test from 'node:test';
import assert from 'node:assert/strict';

process.env.JWT_SECRET ??= 'test-secret';

const { signToken } = await import('../src/lib/auth.js');
const { authMiddleware } = await import('../src/middleware/auth-middleware.js');

function run(authorization?: string) {
  const req = { headers: authorization ? { authorization } : {} } as never;
  let nextCalled = false;

  authMiddleware(req, {} as never, () => {
    nextCalled = true;
  });

  return { req: req as { user?: { userId: string; email: string } }, nextCalled };
}

test('authMiddleware attaches the payload for a valid bearer token', () => {
  const token = signToken({ userId: 'user-1', email: 'admin@example.com' });
  const { req, nextCalled } = run(`Bearer ${token}`);

  assert.equal(nextCalled, true);
  assert.equal(req.user?.userId, 'user-1');
});

test('authMiddleware rejects a missing header', () => {
  assert.throws(() => run(), /Missing or invalid authorization header/);
});

test('authMiddleware rejects a non-bearer scheme', () => {
  assert.throws(() => run('Basic abc123'), /Missing or invalid authorization header/);
});

test('authMiddleware rejects a bearer header with no token', () => {
  assert.throws(() => run('Bearer '), /Invalid token format/);
});

test('authMiddleware rejects an invalid token', () => {
  assert.throws(() => run('Bearer not-a-jwt'), /Invalid or expired token/);
});
