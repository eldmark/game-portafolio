'use client';

import React from 'react';
import { useBattleStore } from './useBattleStore';
import HPBar from './components/HPBar';
import MoveGrid from './components/MoveGrid';
import BattleLog from './components/BattleLog';
import PokemonSprite from './components/PokemonSprite';
import { EFFECTIVENESS } from './lib/data';

export default function BattleScreen() {
  const opponent = useBattleStore((s) => s.opponent);
  const opponentHp = useBattleStore((s) => s.opponentHp);
  const opponentMax = useBattleStore((s) => s.opponentMaxHp);
  const marcoHp = useBattleStore((s) => s.marcoHp);
  const marcoMax = useBattleStore((s) => s.marcoMaxHp);
  const moves = useBattleStore((s) => s.equippedMoves);
  const log = useBattleStore((s) => s.log);
  const appendLog = useBattleStore((s) => s.appendLog);
  const applyDamageToOpponent = useBattleStore((s) => s.applyDamageToOpponent);
  const applyDamageToMarco = useBattleStore((s) => s.applyDamageToMarco);

  function onUse(idx: number) {
    const move = moves[idx];
    if (!move) return;
    // consume PP locally
    move.pp = Math.max(0, move.pp - 1);
    const eff = (EFFECTIVENESS[opponent?.typeTag ?? 'JUNIOR'] || {})[move.type] ?? 1;
    const damage = Math.max(1, Math.round((move.power * eff) / 12));
    appendLog(`Marco used ${move.name} — ${damage} dmg (x${eff})`);
    applyDamageToOpponent(damage);

    // simple opponent counter-attack (placeholder)
    setTimeout(() => {
      if (!opponent) return;
      const oppDamage = Math.max(1, Math.round(Math.random() * 6 + 1));
      appendLog(`${opponent.name} hits Marco for ${oppDamage} dmg`);
      applyDamageToMarco(oppDamage);
    }, 600);
  }

  return (
    <div
      className="battle-overlay"
      style={{ display: 'grid', gridTemplateRows: 'auto auto 1fr auto', height: '100%' }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <PokemonSprite opponentId={opponent?.id ?? 'alex'} alt={opponent?.name} />
            <div>
              <strong>{opponent?.name ?? 'Opponent'}</strong>
              <div style={{ fontSize: 12 }}>{opponent?.level ?? ''}</div>
            </div>
          </div>

          <div style={{ width: 240 }}>
            <HPBar value={opponentHp} max={opponentMax} />
            <div style={{ fontSize: 12, color: '#9fb0c9' }}>
              {opponentHp}/{opponentMax}
            </div>
          </div>
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div>
              <strong>MARCO</strong>
              <div style={{ fontSize: 12 }}>{marcoHp}</div>
            </div>
          </div>
          <div style={{ width: 240 }}>
            <HPBar value={marcoHp} max={marcoMax} />
            <div style={{ fontSize: 12, color: '#9fb0c9' }}>
              {marcoHp}/{marcoMax}
            </div>
          </div>
        </div>
      </div>

      <div className="equipped-strip">
        <div className="equipped-strip-header">
          <span className="eyebrow">Selected moveset</span>
          <span className="equipped-strip-count">{moves.length}/4 ready</span>
        </div>
        <div className="equipped-chips">
          {moves.map((move, index) => (
            <div key={move.id} className="equipped-chip">
              <span className="equipped-chip-index">{index + 1}</span>
              <span className="equipped-chip-name">{move.name}</span>
              <span className="equipped-chip-meta">{move.type}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 12 }}>
        <div>
          <MoveGrid moves={moves} onUse={onUse} />
        </div>
        <div>
          <BattleLog entries={log} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button onClick={() => window.location.reload()}>Quit</button>
      </div>
    </div>
  );
}
