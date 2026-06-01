'use client';

import { useEffect } from 'react';
import { usePortfolioStore } from '@/lib/store';
import PokemonOverlayApp from './PokemonOverlayApp';

export default function PokemonOverlay() {
  const closeOverlay = usePortfolioStore((s) => s.closeOverlay);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="overlay-panel overlay-panel-wide pokemon-overlay-panel">
      <header className="overlay-header">
        <div>
          <p className="eyebrow">Interview Battle</p>
          <h2>Interview Battle</h2>
        </div>
        <button
          aria-label="Close overlay"
          className="icon-button"
          onClick={closeOverlay}
          type="button"
        >
          ✕
        </button>
      </header>

      <PokemonOverlayApp />
    </div>
  );
}
