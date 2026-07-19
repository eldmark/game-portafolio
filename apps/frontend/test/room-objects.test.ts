import test from 'node:test';
import assert from 'node:assert/strict';
import { getNearestObject } from '../src/features/room/room-objects';

const desk = { id: 'desk', position: [0, 0, 0] as [number, number, number] };
const shelf = { id: 'shelf', position: [3, 0, 0] as [number, number, number] };

test('getNearestObject returns null when nothing is in range', () => {
  assert.equal(getNearestObject([desk, shelf], [10, 0, 10]), null);
});

test('getNearestObject picks the closest object in range', () => {
  const nearest = getNearestObject([desk, shelf], [0.5, 0, 0.5]);

  assert.equal(nearest?.id, 'desk');
});

test('getNearestObject ignores the y axis', () => {
  assert.equal(getNearestObject([desk], [0, 99, 0])?.id, 'desk');
});

test('getNearestObject honours a per-object interactionDistance', () => {
  const far = { id: 'poster', position: [3, 0, 0] as [number, number, number], interactionDistance: 4 };

  assert.equal(getNearestObject([far], [3, 0, 3])?.id, 'poster');
  assert.equal(getNearestObject([{ ...far, interactionDistance: 1 }], [3, 0, 3]), null);
});

test('getNearestObject respects the maxDistance boundary inclusively', () => {
  const target = { id: 'lamp', position: [1, 0, 0] as [number, number, number] };

  assert.equal(getNearestObject([target], [0, 0, 0], 1)?.id, 'lamp');
  assert.equal(getNearestObject([target], [0, 0, 0], 0.99), null);
});
