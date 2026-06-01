import create from 'zustand';
import type { Move, Opponent } from './lib/types';

type MarcoStatus = 'confident' | 'stalling' | 'rattled' | null;

type BattlePhase =
  | 'opponent_select'
  | 'loadout'
  | 'guide'
  | 'battle_intro'
  | 'player_turn'
  | 'animating'
  | 'opponent_turn'
  | 'status_tick'
  | 'battle_over'
  | 'result';

type BattleState = {
  phase: BattlePhase;
  opponent: Opponent | null;
  marcoHp: number;
  marcoMaxHp: number;
  opponentHp: number;
  opponentMaxHp: number;
  marcoStatus: MarcoStatus;
  equippedMoves: Move[];
  log: string[];
  followUpPending: boolean;
  socraticCounter: number;
  teachingBadgeUnlocked: boolean;
  result: 'win' | 'loss' | null;
  setOpponent: (op: Opponent) => void;
  setEquipped: (moves: Move[]) => void;
  startBattle: () => void;
  consumeMovePp: (moveId: string) => void;
  appendLog: (entry: string) => void;
  applyDamageToOpponent: (d: number) => void;
  applyDamageToMarco: (d: number) => void;
  resetBattle: () => void;
};

export const useBattleStore = create<BattleState>((set, get) => ({
  phase: 'opponent_select',
  opponent: null,
  marcoHp: 100,
  marcoMaxHp: 100,
  opponentHp: 0,
  opponentMaxHp: 0,
  marcoStatus: null,
  equippedMoves: [],
  log: [],
  followUpPending: false,
  socraticCounter: 0,
  teachingBadgeUnlocked: false,
  result: null,
  setOpponent(op) {
    set({
      opponent: op,
      opponentHp: op.hp,
      opponentMaxHp: op.hp,
      marcoHp: 100,
      marcoMaxHp: 100,
      marcoStatus: null,
      equippedMoves: [],
      log: [],
      followUpPending: false,
      socraticCounter: 0,
      teachingBadgeUnlocked: false,
      result: null,
      phase: 'loadout',
    });
  },
  setEquipped(moves) {
    set({ equippedMoves: moves, phase: 'guide' });
  },
  startBattle() {
    set({ phase: 'player_turn' });
  },
  consumeMovePp(moveId) {
    set((s) => ({
      equippedMoves: s.equippedMoves.map((move) =>
        move.id === moveId ? { ...move, pp: Math.max(0, move.pp - 1) } : move,
      ),
    }));
  },
  appendLog(entry) {
    set((s) => ({ log: [entry, ...s.log] }));
  },
  applyDamageToOpponent(d) {
    set((s) => {
      const next = Math.max(0, s.opponentHp - d);
      return {
        opponentHp: next,
        phase: next === 0 ? 'result' : s.phase,
        result: next === 0 ? 'win' : s.result,
      };
    });
  },
  applyDamageToMarco(d) {
    set((s) => {
      const next = Math.max(0, s.marcoHp - d);
      return {
        marcoHp: next,
        phase: next === 0 ? 'result' : s.phase,
        result: next === 0 ? 'loss' : s.result,
      };
    });
  },
  resetBattle() {
    set({
      phase: 'opponent_select',
      opponent: null,
      marcoHp: 100,
      marcoMaxHp: 100,
      opponentHp: 0,
      opponentMaxHp: 0,
      marcoStatus: null,
      equippedMoves: [],
      log: [],
      followUpPending: false,
      socraticCounter: 0,
      teachingBadgeUnlocked: false,
      result: null,
    });
  },
}));
