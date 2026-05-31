'use client';

import { useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { usePortfolioStore } from '@/lib/store';
import { getMusicTrack, musicTracks, normalizeTrackIndex } from './music-tracks';

export function AudioManager() {
  const muted = usePortfolioStore((state) => state.muted);
  const currentTrackIndex = usePortfolioStore((state) => state.currentTrackIndex);
  const setCurrentTrackIndex = usePortfolioStore((state) => state.setCurrentTrackIndex);
  const soundRef = useRef<Howl | null>(null);
  const mutedRef = useRef(muted);
  const trackIndex = normalizeTrackIndex(currentTrackIndex);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  useEffect(() => {
    const sound = new Howl({
      src: [getMusicTrack(trackIndex).src],
      volume: 0.24,
      html5: true,
      preload: true,
      onend: () => setCurrentTrackIndex((trackIndex + 1) % musicTracks.length),
    });

    soundRef.current = sound;

    if (!mutedRef.current) {
      sound.play();
    }

    return () => {
      sound.stop();
      sound.unload();
      if (soundRef.current === sound) {
        soundRef.current = null;
      }
    };
  }, [setCurrentTrackIndex, trackIndex]);

  useEffect(() => {
    const sound = soundRef.current;

    if (!sound) return;

    if (muted) {
      sound.pause();
      return;
    }

    if (!sound.playing()) {
      sound.play();
    }
  }, [muted]);

  return null;
}
