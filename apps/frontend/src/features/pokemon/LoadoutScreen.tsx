'use client';

import React from 'react';
import { ALL_MOVES } from './lib/data';
import { useBattleStore } from './useBattleStore';
import type { Move } from './lib/types';

export default function LoadoutScreen() {
  const setEquipped = useBattleStore((s) => s.setEquipped);
  const appendLog = useBattleStore((s) => s.appendLog);

  const [selected, setSelected] = React.useState<Move[]>([]);

  function toggle(m: Move) {
    setSelected((curr) => {
      if (curr.find((c) => c.id === m.id)) return curr.filter((c) => c.id !== m.id);
      if (curr.length >= 4) return curr;
      return [...curr, { ...m }];
    });
  }

  function start() {
    setEquipped(selected);
    appendLog('Loadout selected. Battle starting...');
  }

  return (
    <div className="loadout-layout">
      <div className="loadout-main">
        <div className="loadout-header">
          <div>
            <p className="eyebrow">Interview Battle</p>
            <h3>Select 4 moves</h3>
          </div>
          <div className="loadout-count">
            <span>{selected.length}</span>/4 selected
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))',
            gap: 10,
          }}
        >
          {ALL_MOVES.map((m) => {
            const isSelected = selected.some((s) => s.id === m.id);
            return (
              <button
                key={m.id}
                type="button"
                className={`move-card ${isSelected ? 'selected' : ''}`}
                onClick={() => toggle(m)}
              >
                <div className="move-card-top">
                  <div className="move-card-name">{m.name}</div>
                  <div className="move-card-pill">{m.type}</div>
                </div>
                <div className="move-card-meta">PP {m.pp}</div>
                <div className="move-card-power">Power {m.power}</div>
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={start} disabled={selected.length !== 4}>
            Start Battle
          </button>
          <span className="loadout-hint">
            Pick exactly four moves. Click a selected move again to remove it.
          </span>
        </div>
      </div>

      <aside className="loadout-sidebar">
        <div className="sidebar-card">
          <p className="eyebrow">Selected moveset</p>
          <h4>Ready for battle</h4>
          {selected.length === 0 ? (
            <p className="sidebar-empty">No moves selected yet.</p>
          ) : (
            <div className="selected-list">
              {selected.map((move, index) => (
                <button
                  type="button"
                  key={move.id}
                  className="selected-move"
                  onClick={() => toggle(move)}
                >
                  <span className="selected-index">{index + 1}</span>
                  <span className="selected-name">{move.name}</span>
                  <span className="selected-meta">{move.type}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="sidebar-card sidebar-card-soft">
          <p className="eyebrow">Selection tip</p>
          <p className="sidebar-tip">
            Mix one strong damage move, one type advantage move, and a safer backup for longer
            fights.
          </p>
        </div>
      </aside>
    </div>
  );
}
