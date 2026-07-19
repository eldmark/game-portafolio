import test from 'node:test';
import assert from 'node:assert/strict';
import { useBattleStore } from '../src/features/pokemon/useBattleStore';
import type { Move, Opponent } from '../src/features/pokemon/lib/types';

const opponent: Opponent = {
  id: 'recruiter',
  name: 'Recruiter',
  level: 5,
  hp: 60,
  moves: [{ id: 'why-you', type: 'behavioural', power: 10 }],
};

const move: Move = { id: 'star-method', name: 'STAR Method', type: 'behavioural', power: 20, pp: 3, maxPp: 3 };

function reset() {
  useBattleStore.getState().resetBattle();
}

test('setOpponent seeds hp and moves to the loadout phase', () => {
  reset();
  useBattleStore.getState().setOpponent(opponent);

  const state = useBattleStore.getState();
  assert.equal(state.phase, 'loadout');
  assert.equal(state.opponentHp, 60);
  assert.equal(state.opponentMaxHp, 60);
  assert.equal(state.marcoHp, 100);
});

test('setEquipped then startBattle walks guide -> player_turn', () => {
  reset();
  useBattleStore.getState().setOpponent(opponent);
  useBattleStore.getState().setEquipped([move]);
  assert.equal(useBattleStore.getState().phase, 'guide');

  useBattleStore.getState().startBattle();
  assert.equal(useBattleStore.getState().phase, 'player_turn');
});

test('consumeMovePp decrements only the used move and floors at zero', () => {
  reset();
  useBattleStore.getState().setOpponent(opponent);
  useBattleStore.getState().setEquipped([move, { ...move, id: 'other' }]);

  for (let i = 0; i < 5; i += 1) {
    useBattleStore.getState().consumeMovePp('star-method');
  }

  const moves = useBattleStore.getState().equippedMoves;
  assert.equal(moves.find((m) => m.id === 'star-method')?.pp, 0);
  assert.equal(moves.find((m) => m.id === 'other')?.pp, 3);
});

test('appendLog prepends newest entries', () => {
  reset();
  useBattleStore.getState().appendLog('first');
  useBattleStore.getState().appendLog('second');

  assert.deepEqual(useBattleStore.getState().log, ['second', 'first']);
});

test('draining opponent hp ends the battle as a win', () => {
  reset();
  useBattleStore.getState().setOpponent(opponent);
  useBattleStore.getState().startBattle();
  useBattleStore.getState().applyDamageToOpponent(999);

  const state = useBattleStore.getState();
  assert.equal(state.opponentHp, 0);
  assert.equal(state.result, 'win');
  assert.equal(state.phase, 'result');
});

test('draining marco hp ends the battle as a loss', () => {
  reset();
  useBattleStore.getState().setOpponent(opponent);
  useBattleStore.getState().startBattle();
  useBattleStore.getState().applyDamageToMarco(100);

  const state = useBattleStore.getState();
  assert.equal(state.marcoHp, 0);
  assert.equal(state.result, 'loss');
  assert.equal(state.phase, 'result');
});

test('partial damage keeps the current phase and result', () => {
  reset();
  useBattleStore.getState().setOpponent(opponent);
  useBattleStore.getState().startBattle();
  useBattleStore.getState().applyDamageToOpponent(20);

  const state = useBattleStore.getState();
  assert.equal(state.opponentHp, 40);
  assert.equal(state.result, null);
  assert.equal(state.phase, 'player_turn');
});

test('resetBattle returns to opponent_select and clears state', () => {
  useBattleStore.getState().setOpponent(opponent);
  useBattleStore.getState().appendLog('something happened');
  useBattleStore.getState().resetBattle();

  const state = useBattleStore.getState();
  assert.equal(state.phase, 'opponent_select');
  assert.equal(state.opponent, null);
  assert.deepEqual(state.log, []);
  assert.equal(state.result, null);
});
