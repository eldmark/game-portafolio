'use client';

import { useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { usePortfolioStore } from '@/lib/store';

export function AudioManager() {
  const muted = usePortfolioStore((state) => state.muted);
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    if (!soundRef.current) {
      soundRef.current = new Howl({
        src: ['/assets/audio/cozy-loop-placeholder.mp3'],
        loop: true,
        volume: 0.22,
        html5: true,
        preload: false,
      });
    }

    const sound = soundRef.current;

    if (muted) {
      sound.pause();
      return;
    }

    if (!sound.playing()) {
      sound.play();
    }

    return () => {
      sound.pause();
    };
  }, [muted]);

  return null;
}
