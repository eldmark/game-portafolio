'use client';

import React from 'react';
import type { Move } from '../lib/types';

export default function MoveGrid({
  moves,
  onUse,
}: {
  moves: Move[];
  onUse: (idx: number) => void;
}) {
  return (
    <div className="move-grid">
      {moves.map((m, i) => (
        <button key={m.id} className="move-btn" disabled={m.pp <= 0} onClick={() => onUse(i)}>
          <div className="move-btn-top">
            <div className="move-btn-name">{m.name}</div>
            <div className="move-btn-pill">{m.type}</div>
          </div>
          <div className="move-btn-stats">
            <span className="move-btn-pp">
              PP {m.pp}/{m.maxPp}
            </span>
            <span className="move-btn-power">Power {m.power}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
