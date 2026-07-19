import test from 'node:test';
import assert from 'node:assert/strict';
import { buildDevlogMessage } from '../src/lib/devlog-phrases.js';

test('buildDevlogMessage uses the repo name without the owner prefix', () => {
  const message = buildDevlogMessage('eldmark/db_barbershop', 1);

  assert.match(message, /db_barbershop/);
  assert.doesNotMatch(message, /eldmark/);
});

test('buildDevlogMessage falls back to the full name when there is no slash', () => {
  assert.match(buildDevlogMessage('standalone', 1), /standalone/);
});

test('buildDevlogMessage mentions the count for multiple commits', () => {
  const message = buildDevlogMessage('eldmark/portfolio', 4);

  assert.match(message, /\b4\b/);
  assert.match(message, /portfolio/);
});

test('buildDevlogMessage leaves no unresolved placeholders', () => {
  for (const count of [1, 2, 10]) {
    for (let i = 0; i < 30; i += 1) {
      const message = buildDevlogMessage('eldmark/portfolio', count);
      assert.doesNotMatch(message, /\{repo\}|\{count\}/, message);
    }
  }
});
