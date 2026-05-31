import test from 'node:test';
import assert from 'node:assert/strict';
import { z } from 'zod';
import { asyncHandler, errorHandler, forbidden } from '../src/lib/errors.js';

function createResponse() {
  const state: { statusCode?: number; payload?: unknown } = {};

  const res = {
    status(code: number) {
      state.statusCode = code;
      return res;
    },
    json(payload: unknown) {
      state.payload = payload;
      return res;
    },
  };

  return { state, res };
}

test('errorHandler maps HttpError to a JSON response', () => {
  const { res, state } = createResponse();

  errorHandler(forbidden('Nope'), {} as never, res as never, {} as never);

  assert.equal(state.statusCode, 403);
  assert.deepEqual(state.payload, { error: 'Nope', details: undefined });
});

test('errorHandler maps zod validation errors', () => {
  const { res, state } = createResponse();

  const schema = z.object({ email: z.string().email() });

  try {
    schema.parse({ email: 'invalid' });
  } catch (error) {
    errorHandler(error, {} as never, res as never, {} as never);
  }

  assert.equal(state.statusCode, 422);
  assert.equal((state.payload as { error: string }).error, 'Validation failed');
});

test('asyncHandler forwards rejected promises', async () => {
  const nextErrors: unknown[] = [];

  const handler = asyncHandler(async () => {
    throw new Error('boom');
  });

  handler({} as never, {} as never, (error) => nextErrors.push(error));
  await new Promise((resolve) => setImmediate(resolve));

  assert.equal(nextErrors.length, 1);
  assert.equal((nextErrors[0] as Error).message, 'boom');
});
