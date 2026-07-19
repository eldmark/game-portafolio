import test from 'node:test';
import assert from 'node:assert/strict';

process.env.JWT_SECRET ??= 'test-secret';

const { signToken, verifyToken } = await import('../src/lib/auth.js');

test('signToken and verifyToken round-trip the payload', () => {
  const token = signToken({ userId: 'user-1', email: 'admin@example.com' });
  const payload = verifyToken(token);

  assert.equal(payload.userId, 'user-1');
  assert.equal(payload.email, 'admin@example.com');
});

test('verifyToken rejects a tampered token', () => {
  const token = signToken({ userId: 'user-1', email: 'admin@example.com' });

  assert.throws(() => verifyToken(`${token}tampered`));
});

test('verifyToken rejects a token signed with another secret', async () => {
  const jwt = (await import('jsonwebtoken')).default;
  const foreign = jwt.sign({ userId: 'x', email: 'x@example.com' }, 'other-secret');

  assert.throws(() => verifyToken(foreign));
});
