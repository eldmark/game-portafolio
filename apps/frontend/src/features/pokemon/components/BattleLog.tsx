'use client';

import React from 'react';

export default function BattleLog({ entries }: { entries: string[] }) {
  return (
    <div className="battle-log">
      <h3>Battle Log</h3>
      <div className="log" style={{ maxHeight: 200, overflow: 'auto' }}>
        {entries.map((e, i) => (
          <div className="log-entry" key={i}>
            {e}
          </div>
        ))}
      </div>
    </div>
  );
}
