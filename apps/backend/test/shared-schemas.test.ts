import test from 'node:test';
import assert from 'node:assert/strict';
import {
  contactMessageInputSchema,
  githubPushWebhookSchema,
  loginInputSchema,
  postCreateSchema,
  projectCreateSchema,
  skillSchema,
  visitInputSchema,
  visitPatchSchema,
} from '@portfolio/shared';

test('contactMessageInputSchema trims input and enforces bounds', () => {
  const parsed = contactMessageInputSchema.parse({
    name: '  Marco  ',
    email: '  marco@example.com ',
    message: '  hello from the contact form  ',
  });

  assert.equal(parsed.name, 'Marco');
  assert.equal(parsed.email, 'marco@example.com');

  assert.equal(contactMessageInputSchema.safeParse({ name: 'M', email: 'a@b.co', message: 'x'.repeat(10) }).success, false);
  assert.equal(contactMessageInputSchema.safeParse({ name: 'Marco', email: 'nope', message: 'x'.repeat(10) }).success, false);
  assert.equal(contactMessageInputSchema.safeParse({ name: 'Marco', email: 'a@b.co', message: 'short' }).success, false);
  assert.equal(contactMessageInputSchema.safeParse({ name: 'Marco', email: 'a@b.co', message: 'x'.repeat(2001) }).success, false);
});

test('loginInputSchema requires an email and a 6+ character password', () => {
  assert.equal(loginInputSchema.safeParse({ email: 'a@b.co', password: 'secret' }).success, true);
  assert.equal(loginInputSchema.safeParse({ email: 'a@b.co', password: 'short' }).success, false);
  assert.equal(loginInputSchema.safeParse({ email: 'nope', password: 'secret' }).success, false);
});

test('visitInputSchema defaults recruiterMode and bounds the session id', () => {
  const parsed = visitInputSchema.parse({ sessionId: 'session-1234' });

  assert.equal(parsed.recruiterMode, false);
  assert.equal(visitInputSchema.safeParse({ sessionId: 'short' }).success, false);
});

test('visitPatchSchema rejects negative and out-of-range durations', () => {
  assert.equal(visitPatchSchema.safeParse({ duration: 120 }).success, true);
  assert.equal(visitPatchSchema.safeParse({ duration: -1 }).success, false);
  assert.equal(visitPatchSchema.safeParse({ duration: 1.5 }).success, false);
  assert.equal(visitPatchSchema.safeParse({ duration: 60 * 60 * 24 + 1 }).success, false);
});

test('projectCreateSchema drops the id and defaults featured and media', () => {
  const parsed = projectCreateSchema.parse({
    title: 'Portfolio',
    slug: 'portfolio',
    description: 'An interactive portfolio room.',
    architecture: 'monorepo',
    challenges: ['deployment'],
    stack: ['react'],
    stackReasoning: 'fast iteration',
  });

  assert.equal(parsed.featured, false);
  assert.deepEqual(parsed.media, []);
  assert.equal('id' in parsed, false);
});

test('projectCreateSchema rejects a non-url githubUrl', () => {
  const base = {
    title: 'Portfolio',
    slug: 'portfolio',
    description: 'An interactive portfolio room.',
    architecture: 'monorepo',
    challenges: [],
    stack: [],
    stackReasoning: 'fast iteration',
  };

  assert.equal(projectCreateSchema.safeParse({ ...base, githubUrl: 'not-a-url' }).success, false);
  assert.equal(projectCreateSchema.safeParse({ ...base, githubUrl: null }).success, true);
});

test('skillSchema constrains level to 1-5', () => {
  const base = { id: 's1', name: 'React', category: 'frontend', reasoning: 'used daily', appliedIn: [] };

  assert.equal(skillSchema.safeParse({ ...base, level: 5 }).success, true);
  assert.equal(skillSchema.safeParse({ ...base, level: 0 }).success, false);
  assert.equal(skillSchema.safeParse({ ...base, level: 6 }).success, false);
});

test('postCreateSchema makes publishedAt optional', () => {
  const parsed = postCreateSchema.parse({
    title: 'First post',
    slug: 'first-post',
    body: 'Something worth reading.',
  });

  assert.equal(parsed.publishedAt, undefined);
});

test('githubPushWebhookSchema parses a minimal push payload', () => {
  const parsed = githubPushWebhookSchema.parse({
    ref: 'refs/heads/main',
    repository: { full_name: 'eldmark/game-portafolio' },
    commits: [
      { id: 'abc123', message: 'fix: thing', url: 'https://github.com/eldmark/game-portafolio/commit/abc123' },
      { extra: 'ignored', id: 'def456', message: 'chore: thing', url: 'https://github.com/eldmark/game-portafolio/commit/def456' },
    ],
  });

  assert.equal(parsed.commits.length, 2);
  assert.equal(parsed.repository.full_name, 'eldmark/game-portafolio');
});

test('githubPushWebhookSchema rejects a payload with a missing repository', () => {
  assert.equal(
    githubPushWebhookSchema.safeParse({ ref: 'refs/heads/main', commits: [] }).success,
    false,
  );
});
