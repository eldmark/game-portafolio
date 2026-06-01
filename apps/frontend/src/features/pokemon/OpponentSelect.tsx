'use client';

import React from 'react';
import { OPPONENTS } from './lib/data';
import { useBattleStore } from './useBattleStore';
import PokemonSprite from './components/PokemonSprite';

export default function OpponentSelect() {
  const setOpponent = useBattleStore((s) => s.setOpponent);

  return (
    <div>
      <h3>Choose an interviewer</h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))',
          gap: 8,
        }}
      >
        {OPPONENTS.map((op) => (
          <div key={op.id} className="card" onClick={() => setOpponent(op)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <PokemonSprite opponentId={op.id} alt={op.name} />
              <div>
                <div style={{ fontWeight: 700 }}>{op.name}</div>
                <div style={{ fontSize: 12, color: '#9fb0c9' }}>Lv. {op.level}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
