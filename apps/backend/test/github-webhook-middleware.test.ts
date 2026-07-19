import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { verifyGithubSignature } from '../src/middleware/github-webhook-middleware.js';

const SECRET = 'webhook-secret';

function sign(body: string, secret = SECRET) {
  return 'sha256=' + crypto.createHmac('sha256', secret).update(body).digest('hex');
}

function run(req: { headers: Record<string, unknown>; rawBody?: string }) {
  let nextCalled = false;
  verifyGithubSignature(req as never, {} as never, () => {
    nextCalled = true;
  });
  return nextCalled;
}

test('verifyGithubSignature accepts a correctly signed payload', (t) => {
  process.env.GITHUB_WEBHOOK_SECRET = SECRET;
  t.after(() => delete process.env.GITHUB_WEBHOOK_SECRET);

  const rawBody = '{"ref":"refs/heads/main"}';
  const nextCalled = run({
    headers: { 'x-hub-signature-256': sign(rawBody) },
    rawBody,
  });

  assert.equal(nextCalled, true);
});

test('verifyGithubSignature rejects a payload signed with the wrong secret', (t) => {
  process.env.GITHUB_WEBHOOK_SECRET = SECRET;
  t.after(() => delete process.env.GITHUB_WEBHOOK_SECRET);

  const rawBody = '{"ref":"refs/heads/main"}';

  assert.throws(
    () =>
      run({
        headers: { 'x-hub-signature-256': sign(rawBody, 'attacker-secret') },
        rawBody,
      }),
    /Invalid signature/,
  );
});

test('verifyGithubSignature rejects a tampered body', (t) => {
  process.env.GITHUB_WEBHOOK_SECRET = SECRET;
  t.after(() => delete process.env.GITHUB_WEBHOOK_SECRET);

  const signature = sign('{"ref":"refs/heads/main"}');

  assert.throws(
    () =>
      run({
        headers: { 'x-hub-signature-256': signature },
        rawBody: '{"ref":"refs/heads/evil"}',
      }),
    /Invalid signature/,
  );
});

test('verifyGithubSignature rejects a signature of a different length', (t) => {
  process.env.GITHUB_WEBHOOK_SECRET = SECRET;
  t.after(() => delete process.env.GITHUB_WEBHOOK_SECRET);

  assert.throws(
    () => run({ headers: { 'x-hub-signature-256': 'sha256=short' }, rawBody: '{}' }),
    /Invalid signature/,
  );
});

test('verifyGithubSignature rejects a missing signature header', (t) => {
  process.env.GITHUB_WEBHOOK_SECRET = SECRET;
  t.after(() => delete process.env.GITHUB_WEBHOOK_SECRET);

  assert.throws(() => run({ headers: {}, rawBody: '{}' }), /Missing signature/);
});

test('verifyGithubSignature refuses to run when the secret is not configured', () => {
  delete process.env.GITHUB_WEBHOOK_SECRET;

  assert.throws(
    () => run({ headers: { 'x-hub-signature-256': 'sha256=whatever' }, rawBody: '{}' }),
    /Webhook not configured/,
  );
});
