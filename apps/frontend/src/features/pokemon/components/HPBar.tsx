'use client';

import { motion } from 'framer-motion';
import React from 'react';

export default function HPBar({ value, max }: { value: number; max: number }) {
  const pct = Math.round((value / max) * 100);
  const color = pct > 50 ? '#4caf50' : pct > 20 ? '#ff9800' : '#f44336';

  return (
    <div
      className="hp-bar"
      style={{ background: 'rgba(255,255,255,0.04)', height: 14, borderRadius: 8 }}
    >
      <motion.div
        className="hp-fill"
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.5 }}
        style={{ height: '100%', background: color }}
      />
    </div>
  );
}
