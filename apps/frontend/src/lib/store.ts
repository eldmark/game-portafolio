import { create } from 'zustand';
import { getRoomSpawnPoint } from '@/features/room/rooms';

export type RoomId = 'main' | 'archive';

export type OverlayType =
  | 'computer'
  | 'projects'
  | 'mailbox'
  | 'about'
  | 'bookshelf'
  | 'posters'
  | 'future'
  | 'settings'
  | 'recruiter'
  | 'switch'
  | 'goals'
  | 'trophies'
  | 'posts'
  | 'devlog'
  | null;

type Vec3Tuple = [number, number, number];

type PortfolioState = {
  activeOverlay: OverlayType;
  currentRoomId: RoomId;
  playerPosition: Vec3Tuple;
  enteredRoom: boolean;
  recruiterMode: boolean;
  muted: boolean;
  audioStarted: boolean;
  currentTrackIndex: number;
  tutorialSeen: boolean;
  setOverlay: (overlay: OverlayType) => void;
  setRoom: (roomId: RoomId) => void;
  setPlayerPosition: (position: Vec3Tuple) => void;
  enterRoom: (recruiterMode?: boolean) => void;
  closeOverlay: () => void;
  setMuted: (muted: boolean) => void;
  startAudio: () => void;
  setCurrentTrackIndex: (trackIndex: number) => void;
  markTutorialSeen: () => void;
};

export const usePortfolioStore = create<PortfolioState>((set) => ({
  activeOverlay: null,
  currentRoomId: 'main',
  playerPosition: [0, 0.45, 2.2],
  enteredRoom: false,
  recruiterMode: false,
  muted: true,
  audioStarted: false,
  currentTrackIndex: 0,
  tutorialSeen: false,
  setOverlay: (overlay) => set({ activeOverlay: overlay }),
  setRoom: (roomId) =>
    set({
      currentRoomId: roomId,
      playerPosition: getRoomSpawnPoint(roomId),
    }),
  setPlayerPosition: (playerPosition) => set({ playerPosition }),
  enterRoom: (recruiterMode = false) =>
    set({
      enteredRoom: true,
      recruiterMode,
      activeOverlay: recruiterMode ? 'recruiter' : null,
    }),
  closeOverlay: () => set({ activeOverlay: null }),
  setMuted: (muted) => set({ muted, audioStarted: true }),
  startAudio: () => set({ muted: false, audioStarted: true }),
  setCurrentTrackIndex: (currentTrackIndex) => set({ currentTrackIndex }),
  markTutorialSeen: () => set({ tutorialSeen: true }),
}));
