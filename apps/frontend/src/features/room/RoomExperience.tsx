'use client';

import Link from 'next/link';
import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Info, Laptop, Mail, Map, Settings, Volume2, VolumeX } from 'lucide-react';
import { logDialogue, trackVisit, endVisit } from '@/lib/api';
import { usePortfolioData } from '@/lib/usePortfolioData';
import { usePortfolioStore } from '@/lib/store';
import { PortfolioOverlay } from '@/features/overlays/PortfolioOverlay';
import { AudioManager } from './AudioManager';
import { RoomScene } from './RoomScene';
import { getNearestObject } from './room-objects';
import { setVirtualKey } from './Player';

function createSessionId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function EntryScreen() {
  const enterRoom = usePortfolioStore((state) => state.enterRoom);
  const setOverlay = usePortfolioStore((state) => state.setOverlay);

  return (
    <section className="entry-screen" aria-label="Portfolio entry menu">
      <div className="entry-copy">
        <p className="eyebrow">Interactive Full-Stack Portfolio</p>
        <h1>Developer Room</h1>
        <p>
          Walk through a cozy digital workspace where each object reveals technical evidence,
          project architecture, and contact paths.
        </p>
      </div>
      <div className="entry-actions">
        <button className="primary-button" onClick={() => enterRoom(false)} type="button">
          <Map size={18} />
          Enter Room
        </button>
        <button className="secondary-button" onClick={() => enterRoom(true)} type="button">
          <Laptop size={18} />
          Recruiter Mode
        </button>
        <button
          className="secondary-button"
          onClick={() => {
            enterRoom(false);
            setOverlay('about');
          }}
          type="button"
        >
          <Info size={18} />
          About
        </button>
        <button
          className="secondary-button"
          onClick={() => {
            enterRoom(false);
            setOverlay('settings');
          }}
          type="button"
        >
          <Settings size={18} />
          Settings
        </button>
      </div>
    </section>
  );
}

function RecruiterNav() {
  const setOverlay = usePortfolioStore((state) => state.setOverlay);
  const muted = usePortfolioStore((state) => state.muted);
  const setMuted = usePortfolioStore((state) => state.setMuted);

  return (
    <nav className="recruiter-nav" aria-label="Recruiter shortcuts">
      <button onClick={() => setOverlay('about')} type="button">
        About
      </button>
      <button onClick={() => setOverlay('projects')} type="button">
        Projects
      </button>
      <button onClick={() => setOverlay('bookshelf')} type="button">
        Skills
      </button>
      <button onClick={() => setOverlay('computer')} type="button">
        Resume
      </button>
      <button onClick={() => setOverlay('mailbox')} type="button">
        Contact
      </button>
      <Link href="/recruiter">Full recruiter page</Link>
      <button aria-label="Toggle audio" onClick={() => setMuted(!muted)} type="button">
        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
    </nav>
  );
}

function TutorialMascot() {
  const tutorialSeen = usePortfolioStore((state) => state.tutorialSeen);
  const markTutorialSeen = usePortfolioStore((state) => state.markTutorialSeen);

  if (tutorialSeen) return null;

  return (
    <aside className="mascot-dialogue">
      <p className="speaker">Pixel</p>
      <p>Use WASD or arrow keys to move. Stand near an object and press E to interact.</p>
      <div className="dialogue-actions">
        <button onClick={markTutorialSeen} type="button">
          Got it
        </button>
      </div>
    </aside>
  );
}

function MobileControls() {
  const controls = [
    ['w', 'up', '^'],
    ['a', 'left', '<'],
    ['s', 'down', 'v'],
    ['d', 'right', '>'],
  ] as const;

  return (
    <div className="mobile-controls" aria-label="Touch movement controls">
      {controls.map(([key, label, symbol]) => (
        <button
          aria-label={`Move ${label}`}
          key={key}
          onPointerDown={() => setVirtualKey(key, true)}
          onPointerLeave={() => setVirtualKey(key, false)}
          onPointerUp={() => setVirtualKey(key, false)}
          type="button"
        >
          {symbol}
        </button>
      ))}
    </div>
  );
}

export default function RoomExperience() {
  const data = usePortfolioData();
  const enteredRoom = usePortfolioStore((state) => state.enteredRoom);
  const activeOverlay = usePortfolioStore((state) => state.activeOverlay);
  const playerPosition = usePortfolioStore((state) => state.playerPosition);
  const setOverlay = usePortfolioStore((state) => state.setOverlay);
  const recruiterMode = usePortfolioStore((state) => state.recruiterMode);
  const sessionRef = useRef<string | null>(null);
  const startedAtRef = useRef<number>(Date.now());

  const nearestObject = useMemo(() => getNearestObject(playerPosition), [playerPosition]);

  useEffect(() => {
    sessionRef.current = window.localStorage.getItem('portfolio-session-id') ?? createSessionId();
    window.localStorage.setItem('portfolio-session-id', sessionRef.current);
  }, []);

  useEffect(() => {
    if (!enteredRoom || !sessionRef.current) return;

    void trackVisit(sessionRef.current, recruiterMode).catch(() => undefined);
  }, [enteredRoom, recruiterMode]);

  useEffect(() => {
    if (!sessionRef.current || !activeOverlay) return;

    void logDialogue(sessionRef.current, activeOverlay).catch(() => undefined);
  }, [activeOverlay]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOverlay(null);
      }

      if (event.key.toLowerCase() === 'e' && nearestObject && !activeOverlay) {
        setOverlay(nearestObject.overlay);
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeOverlay, nearestObject, setOverlay]);

  useEffect(() => {
    function onUnload() {
      if (!sessionRef.current) return;
      const duration = Math.floor((Date.now() - startedAtRef.current) / 1000);
      void endVisit(sessionRef.current, duration, recruiterMode).catch(() => undefined);
    }

    window.addEventListener('beforeunload', onUnload);
    return () => {
      window.removeEventListener('beforeunload', onUnload);
      onUnload();
    };
  }, [recruiterMode]);

  return (
    <main className="room-app">
      <AudioManager />
      {!enteredRoom ? <EntryScreen /> : null}
      {enteredRoom ? (
        <>
          <RecruiterNav />
          <section className="room-stage" aria-label="Interactive portfolio room">
            <Canvas camera={{ position: [0, 4.2, 6.5], fov: 45 }} shadows>
              <Suspense fallback={null}>
                <RoomScene activeObjectId={nearestObject?.id ?? null} />
              </Suspense>
            </Canvas>
            <div className="hud">
              <p>{nearestObject ? `Press E: ${nearestObject.hint}` : 'Move near an object'}</p>
            </div>
          </section>
          <TutorialMascot />
          <MobileControls />
          <button className="floating-contact" onClick={() => setOverlay('mailbox')} type="button">
            <Mail size={18} />
            Contact
          </button>
        </>
      ) : null}
      <PortfolioOverlay {...data} />
    </main>
  );
}
