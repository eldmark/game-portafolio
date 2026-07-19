import test from 'node:test';
import assert from 'node:assert/strict';
import { mapGoal, mapTrophy } from '../src/services/goals-trophies-service.js';

const baseGoal = {
  id: 'goal-1',
  title: 'Ship the portfolio',
  description: 'Get it live',
  category: 'career',
  status: 'in_progress',
  targetDate: new Date('2026-01-15T00:00:00.000Z'),
  orderIndex: 2,
  trophyId: 'trophy-1',
};

test('mapGoal serializes dates and keeps a known status', () => {
  const goal = mapGoal(baseGoal as never);

  assert.equal(goal.status, 'in_progress');
  assert.equal(goal.targetDate, '2026-01-15T00:00:00.000Z');
  assert.equal(goal.orderIndex, 2);
  assert.equal(goal.trophyId, 'trophy-1');
});

test('mapGoal keeps a null targetDate null', () => {
  const goal = mapGoal({ ...baseGoal, targetDate: null } as never);

  assert.equal(goal.targetDate, null);
});

test('mapGoal falls back to planned for an unknown status', () => {
  assert.equal(mapGoal({ ...baseGoal, status: 'garbage' } as never).status, 'planned');
  assert.equal(mapGoal({ ...baseGoal, status: 'done' } as never).status, 'done');
});

test('mapTrophy serializes dateEarned to an ISO string', () => {
  const trophy = mapTrophy({
    id: 'trophy-1',
    title: 'Deployed to production',
    description: 'It is live',
    icon: 'star',
    category: 'engineering',
    dateEarned: new Date('2026-02-01T10:30:00.000Z'),
    proofUrl: 'https://marcodiaz.me/',
  } as never);

  assert.equal(trophy.dateEarned, '2026-02-01T10:30:00.000Z');
  assert.equal(trophy.proofUrl, 'https://marcodiaz.me/');
});
