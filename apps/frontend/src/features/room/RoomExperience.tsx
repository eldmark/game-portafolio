'use client';

import { Link } from 'react-router-dom';
import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { getNearestObject, type RoomObject } from './room-objects';
import { setVirtualKey } from './Player';
import { getMusicTrack, musicTracks, normalizeTrackIndex } from './music-tracks';

const RoomStage = lazy(() => import('./RoomStage'));
const PortfolioOverlay = lazy(() =>
  import('@/features/overlays/PortfolioOverlay').then((module) => ({
    default: module.PortfolioOverlay,
  })),
);

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
  const [termsAccepted, setTermsAccepted] = useState(() => {
    return typeof window !== 'undefined' &&
      window.localStorage.getItem('portfolio-terms-accepted') === 'true';
  });

  function enterPortfolio(recruiterMode = false) {
    if (!audioStarted) {
      startAudio();
    }

    enterRoom(recruiterMode);
  }

  function acceptTerms() {
    window.localStorage.setItem('portfolio-terms-accepted', 'true');
    setTermsAccepted(true);
  }

  function declineTerms() {
    window.localStorage.removeItem('portfolio-terms-accepted');
    window.close();
    window.location.replace('about:blank');
  }

  return (
    <>
      <section className={`entry-screen ${termsAccepted ? '' : 'is-locked'}`} aria-label="Portfolio entry menu">
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

      {!termsAccepted ? (
        <div className="terms-modal-backdrop" role="presentation">
          <section
            aria-describedby="terms-modal-copy"
            aria-labelledby="terms-modal-title"
            aria-modal="true"
            className="terms-modal"
            role="dialog"
          >
            <p className="eyebrow">Terms &amp; Conditions</p>
            <h2 id="terms-modal-title">Consent required</h2>
            <p id="terms-modal-copy">
              By using this portfolio, I may collect usage data such as visits, recruiter-mode
              usage, dialogue interactions, and session duration for statistics and portfolio
              improvements.
            </p>
            <div className="terms-modal-actions">
              <button className="primary-button" onClick={acceptTerms} type="button">
                Accept and continue
              </button>
              <button className="secondary-button" onClick={declineTerms} type="button">
                Decline and exit
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
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

function RoomStateBridge({
  onMove,
  onNearestObjectChange,
}: {
  onMove: () => void;
  onNearestObjectChange: (nextNearestObject: RoomObject | null) => void;
}) {
  const playerPosition = usePortfolioStore((state) => state.playerPosition);
  const nearestObject = useMemo(() => getNearestObject(playerPosition), [playerPosition]);

  useEffect(() => {
    onNearestObjectChange(nearestObject);
  }, [nearestObject, onNearestObjectChange]);

  useEffect(() => {
    const dx = Math.abs(playerPosition[0]);
    const dz = Math.abs(playerPosition[2] - 2.2);
    if (dx > 0.2 || dz > 0.2) {
      onMove();
    }
  }, [onMove, playerPosition]);

  return null;
}

export default function RoomExperience() {
  const data = usePortfolioData();
  const enteredRoom = usePortfolioStore((state) => state.enteredRoom);
  const activeOverlay = usePortfolioStore((state) => state.activeOverlay);
  const setOverlay = usePortfolioStore((state) => state.setOverlay);
  const recruiterMode = usePortfolioStore((state) => state.recruiterMode);
  const sessionRef = useRef<string | null>(null);
  const startedAtRef = useRef<number>(Date.now());
  const [hasMoved, setHasMoved] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [nearestObject, setNearestObject] = useState<RoomObject | null>(null);
  const [overlayLoaded, setOverlayLoaded] = useState(false);

  const handleNearestObjectChange = useCallback((nextNearestObject: RoomObject | null) => {
    setNearestObject((currentNearestObject) =>
      currentNearestObject?.id === nextNearestObject?.id ? currentNearestObject : nextNearestObject,
    );
  }, []);

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
    if (activeOverlay) {
      setOverlayLoaded(true);
    }
  }, [activeOverlay]);

  useEffect(() => {
    const isTypingTarget = (target: EventTarget | null) =>
      target instanceof HTMLElement &&
      (target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable);

    function onKeyDown(event: KeyboardEvent) {
      if (isTypingTarget(event.target)) return;

      if (event.key === 'Escape') {
        setOverlay(null);
      }

      const normalizedKey = event.key?.toLowerCase?.();
      if (normalizedKey === 'e' && nearestObject && !activeOverlay) {
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
      {!enteredRoom ? <EntryScreen /> : null}
      {enteredRoom ? (
        <>
          <RoomStateBridge
            onMove={() => setHasMoved(true)}
            onNearestObjectChange={handleNearestObjectChange}
          />
          <RecruiterNav />
          <VinylMusicPlayer />
          <Suspense
            fallback={
              <section className="loading-screen" aria-label="Preparing the room">
                Preparing the room…
              </section>
            }
          >
            <RoomStage
              activeObjectId={nearestObject?.id ?? null}
              nearestHint={nearestObject?.hint ?? null}
            />
          </Suspense>
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
      {overlayLoaded ? (
        <Suspense fallback={activeOverlay ? <div className="overlay-backdrop" /> : null}>
          <PortfolioOverlay {...data} />
        </Suspense>
      ) : null}
    </main>
  );
}
