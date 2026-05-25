'use client';

import { useEffect, useState } from 'react';
import type { Experience, Project, Skill } from '@portfolio/shared';
import { getExperiences, getProjects, getSkills } from './api';
import { fallbackExperiences, fallbackProjects, fallbackSkills } from './portfolio-fallback';

export type PortfolioDataState = {
  projects: Project[];
  skills: Skill[];
  experiences: Experience[];
  loading: boolean;
  error: string | null;
  usingFallback: boolean;
};

export function usePortfolioData(): PortfolioDataState {
  const [state, setState] = useState<PortfolioDataState>({
    projects: fallbackProjects,
    skills: fallbackSkills,
    experiences: fallbackExperiences,
    loading: true,
    error: null,
    usingFallback: true,
  });

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [projects, skills, experiences] = await Promise.all([
          getProjects(),
          getSkills(),
          getExperiences(),
        ]);

        if (!active) return;

        setState({
          projects,
          skills,
          experiences,
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
