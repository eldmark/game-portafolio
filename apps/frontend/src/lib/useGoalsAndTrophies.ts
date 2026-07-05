'use client';

import { useEffect, useState } from 'react';
import type { Goal, Trophy } from '@portfolio/shared';
import { getGoals, getTrophies } from './api';
import { fallbackGoals, fallbackTrophies } from './portfolio-fallback';

export type GoalsAndTrophiesState = {
  goals: Goal[];
  trophies: Trophy[];
  loading: boolean;
  error: string | null;
  usingFallback: boolean;
};

export function useGoalsAndTrophies(): GoalsAndTrophiesState {
  const [state, setState] = useState<GoalsAndTrophiesState>({
    goals: fallbackGoals,
    trophies: fallbackTrophies,
    loading: true,
    error: null,
    usingFallback: true,
  });

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [goals, trophies] = await Promise.all([getGoals(), getTrophies()]);

        if (!active) return;

        setState({
          goals,
          trophies,
          loading: false,
          error: null,
          usingFallback: false,
        });
      } catch (error) {
        if (!active) return;

        setState((current) => ({
          ...current,
          loading: false,
          error: error instanceof Error ? error.message : 'Could not load API data',
          usingFallback: true,
        }));
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, []);

  return state;
}
