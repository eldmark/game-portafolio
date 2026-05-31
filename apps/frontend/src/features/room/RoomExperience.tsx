'use client';

import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  Briefcase,
  FileText,
  FolderKanban,
  Info,
  Laptop,
  Mail,
  Map,
  Settings,
  SkipBack,
  SkipForward,
  UserRound,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { logDialogue, trackVisit, endVisit } from '@/lib/api';
import { aboutProfile } from '@/lib/portfolio-fallback';
import { usePortfolioData } from '@/lib/usePortfolioData';
import { usePortfolioStore } from '@/lib/store';
import { PortfolioOverlay } from '@/features/overlays/PortfolioOverlay';
import ErrorBoundary from '@/components/ErrorBoundary';
import { AudioManager } from './AudioManager';
import { RoomScene } from './RoomScene';
import { getNearestObject } from './room-objects';
import { setVirtualKey } from './Player';
import { getMusicTrack, musicTracks, normalizeTrackIndex } from './music-tracks';

function createSessionId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function VinylMusicPlayer({ variant = 'floating' }: { variant?: 'entry' | 'floating' }) {
  const muted = usePortfolioStore((state) => state.muted);
  const setMuted = usePortfolioStore((state) => state.setMuted);
  const currentTrackIndex = usePortfolioStore((state) => state.currentTrackIndex);
  const setCurrentTrackIndex = usePortfolioStore((state) => state.setCurrentTrackIndex);
  const trackIndex = normalizeTrackIndex(currentTrackIndex);
  const track = getMusicTrack(trackIndex);

  function changeTrack(direction: 1 | -1) {
    setCurrentTrackIndex((trackIndex + direction + musicTracks.length) % musicTracks.length);
    if (muted) {
      setMuted(false);
    }
  }

  return (
    <aside className={`vinyl-player vinyl-player-${variant}`} aria-label="Music player">
      <button
        aria-label={muted ? 'Play music' : 'Mute music'}
        className="vinyl-record"
        onClick={() => setMuted(!muted)}
        type="button"
      >
        <span />
      </button>
      <div className="vinyl-track">
        <p className="eyebrow">Now Playing</p>
        <h2>{track.title}</h2>
        <p>{track.artist}</p>
      </div>
      <div className="vinyl-controls" aria-label="Music controls">
        <button aria-label="Previous song" onClick={() => changeTrack(-1)} type="button">
          <SkipBack size={17} />
        </button>
        <button aria-label={muted ? 'Play music' : 'Mute music'} onClick={() => setMuted(!muted)} type="button">
          {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
        </button>
        <button aria-label="Next song" onClick={() => changeTrack(1)} type="button">
          <SkipForward size={17} />
        </button>
      </div>
    </aside>
  );
}

function EntryScreen() {
  const enterRoom = usePortfolioStore((state) => state.enterRoom);
  const setOverlay = usePortfolioStore((state) => state.setOverlay);
  const audioStarted = usePortfolioStore((state) => state.audioStarted);
  const startAudio = usePortfolioStore((state) => state.startAudio);

  function enterPortfolio(recruiterMode = false) {
    if (!audioStarted) {
      startAudio();
    }

    enterRoom(recruiterMode);
  }

  return (
    <section className="entry-screen" aria-label="Portfolio entry menu">
      <div className="entry-hero">
        <div className="entry-copy">
          <p className="eyebrow">Interactive Full-Stack Portfolio</p>
          <h1>{aboutProfile.name}&apos;s Developer Room</h1>
          <p>
            Explore a cozy digital workspace where each object reveals project architecture, backend
            reasoning, frontend craft, and contact paths.
          </p>
          <div className="entry-actions">
            <button className="primary-button" onClick={() => enterPortfolio(false)} type="button">
              <Map size={18} />
              Enter Room
            </button>
            <button className="secondary-button" onClick={() => enterPortfolio(true)} type="button">
              <Laptop size={18} />
              Recruiter Mode
            </button>
            <button
              className="secondary-button"
              onClick={() => {
                enterPortfolio(false);
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
                enterPortfolio(false);
                setOverlay('settings');
              }}
              type="button"
            >
              <Settings size={18} />
              Settings
            </button>
          </div>
          <VinylMusicPlayer variant="entry" />
        </div>
        <figure className="entry-portrait" aria-label={`${aboutProfile.name} portrait`}>
          <img alt={`${aboutProfile.name} portrait`} src="/assets/Me/yo.jpg" />
        </figure>
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
      <span className="recruiter-nav-brand">Recruiter Mode</span>
      <button onClick={() => setOverlay('about')} type="button">
        <UserRound size={15} /> About
      </button>
      <button onClick={() => setOverlay('projects')} type="button">
        <FolderKanban size={15} /> Projects
      </button>
      <button onClick={() => setOverlay('bookshelf')} type="button">
        <BookOpen size={15} /> Skills
      </button>
      <button onClick={() => setOverlay('computer')} type="button">
        <FileText size={15} /> Resume
      </button>
      <button onClick={() => setOverlay('mailbox')} type="button">
        <Mail size={15} /> Contact
      </button>
      <Link to="/recruiter">
        <Briefcase size={15} /> Full page
      </Link>
      <button aria-label="Toggle audio" onClick={() => setMuted(!muted)} type="button">
        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
    </nav>
  );
}

function TutorialMascot({
  nearestHint,
  hasMoved,
  hasInteracted,
}: {
  nearestHint: string | null;
  hasMoved: boolean;
  hasInteracted: boolean;
}) {
  const tutorialSeen = usePortfolioStore((state) => state.tutorialSeen);
  const markTutorialSeen = usePortfolioStore((state) => state.markTutorialSeen);

  if (tutorialSeen) return null;

  const tutorialText = !hasMoved
    ? 'Use WASD or arrow keys to move around the room.'
    : !hasInteracted
      ? nearestHint
        ? `Good. Now press E near an object: ${nearestHint}.`
        : 'Good. Walk near a glowing marker, then press E to interact.'
      : 'Great. You can keep exploring or use Recruiter shortcuts at the top.';

  return (
    <aside className="mascot-dialogue">
      <p className="speaker">Pixel</p>
      <p>{tutorialText}</p>
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
  const [hasMoved, setHasMoved] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

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
    setHasInteracted(true);
  }, [activeOverlay]);

  useEffect(() => {
    const dx = Math.abs(playerPosition[0]);
    const dz = Math.abs(playerPosition[2] - 2.2);
    if (dx > 0.2 || dz > 0.2) {
      setHasMoved(true);
    }
  }, [playerPosition]);

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
          <VinylMusicPlayer />
          <section className="room-stage" aria-label="Interactive portfolio room">
            <ErrorBoundary>
              <Canvas 
                camera={{ position: [0, 4.2, 6.5], fov: 45 }} 
                shadows 
                gl={{ 
                  antialias: true,
                  powerPreference: "high-performance",
                  preserveDrawingBuffer: true,
                  failIfMajorPerformanceCaveat: false
                }}
              >
                <Suspense fallback={null}>
                  <RoomScene activeObjectId={nearestObject?.id ?? null} />
                </Suspense>
              </Canvas>
            </ErrorBoundary>
            <div className="hud">
              <p>{nearestObject ? `Press E: ${nearestObject.hint}` : 'Move near an object'}</p>
            </div>
          </section>
          <TutorialMascot
            hasInteracted={hasInteracted}
            hasMoved={hasMoved}
            nearestHint={nearestObject?.hint ?? null}
          />
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
