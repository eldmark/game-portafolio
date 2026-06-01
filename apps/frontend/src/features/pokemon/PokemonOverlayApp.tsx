'use client';

import React from 'react';
import OpponentSelect from './OpponentSelect';
import LoadoutScreen from './LoadoutScreen';
import InterviewGuideScreen from './InterviewGuideScreen';
import BattleScreen from './BattleScreen';
import { useBattleStore } from './useBattleStore';

export default function PokemonOverlayApp() {
  const phase = useBattleStore((s) => s.phase);

  return (
    <div className="pokemon-overlay-app">
      {phase === 'opponent_select' && <OpponentSelect />}
      {phase === 'loadout' && <LoadoutScreen />}
      {phase === 'guide' && <InterviewGuideScreen />}
      {(phase === 'battle_intro' || phase === 'player_turn' || phase === 'result') && (
        <BattleScreen />
      )}
    </div>
  );
}
