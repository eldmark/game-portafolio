'use client';

import React from 'react';
import type { Move } from '../lib/types';

function typeClass(type: string) {
  return `type-${type.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

export default function MoveGrid({
  moves,
  onUse,
  disabled = false,
}: {
  moves: Move[];
  onUse: (idx: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="move-grid">
      {moves.map((m, i) => (
        <button
          key={m.id}
          className={`move-btn ${typeClass(m.type)}`}
          disabled={disabled || m.pp <= 0}
          onClick={() => onUse(i)}
          type="button"
        >
          <div className="move-btn-top">
            <div className="move-btn-name">{m.name}</div>
            <div className="move-btn-pill">{m.type}</div>
          </div>
          <div className="move-btn-stats">
            <span className="move-btn-pp">
              PP {m.pp}/{m.maxPp}
            </span>
            <span className="move-btn-power">Power {m.power > 0 ? m.power : '—'}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
