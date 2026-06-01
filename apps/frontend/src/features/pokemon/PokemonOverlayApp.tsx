'use client';

import React from 'react';
import OpponentSelect from './OpponentSelect';
import LoadoutScreen from './LoadoutScreen';
import BattleScreen from './BattleScreen';
import { useBattleStore } from './useBattleStore';

export default function PokemonOverlayApp() {
  const phase = useBattleStore((s) => s.phase);

  return (
    <div style={{ padding: 12, height: '72vh', display: 'flex', flexDirection: 'column' }}>
      {phase === 'opponent_select' && <OpponentSelect />}
      {phase === 'loadout' && <LoadoutScreen />}
      {(phase === 'battle_intro' || phase === 'player_turn') && <BattleScreen />}
    </div>
  );
}
