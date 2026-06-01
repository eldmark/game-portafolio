'use client';

import { motion } from 'framer-motion';
import React from 'react';

export default function HPBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.max(0, Math.min(100, Math.round((value / max) * 100))) : 0;
  const color = pct > 50 ? '#4caf50' : pct > 20 ? '#ff9800' : '#f44336';

  return (
    <div
      className="hp-bar"
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{ '--hp-color': color } as React.CSSProperties}
    >
      <motion.div
        className="hp-fill"
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
}
