'use client';

import { useEffect, useState } from 'react';
import type { DevlogEntry, Post } from '@portfolio/shared';
import { getDevlog, getPosts } from './api';
import { fallbackDevlog, fallbackPosts } from './portfolio-fallback';

export type BlogDataState = {
  posts: Post[];
  devlog: DevlogEntry[];
  loading: boolean;
  error: string | null;
  usingFallback: boolean;
};

export function useBlogData(): BlogDataState {
  const [state, setState] = useState<BlogDataState>({
    posts: fallbackPosts,
    devlog: fallbackDevlog,
    loading: true,
    error: null,
    usingFallback: true,
  });

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [posts, devlog] = await Promise.all([getPosts(), getDevlog()]);

        if (!active) return;

        setState({
          posts,
          devlog,
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
