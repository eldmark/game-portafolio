export type MusicTrack = {
  title: string;
  artist: string;
  src: string;
};

export const musicTracks = [
  {
    title: 'Glownes',
    artist: 'Skygaze',
    src: '/assets/audio/glowness-skygaze-main-version.mp3',
  },
  {
    title: 'The Flow',
    artist: 'Night Drift',
    src: '/assets/audio/the-flow-night-drift-main-version-35011-02-00.mp3',
  },
  {
    title: 'The Waves',
    artist: 'otto.mp3',
    src: '/assets/audio/the-waves-otto-mp3-main-version-33266-03-45.mp3',
  },
] as const satisfies readonly [MusicTrack, ...MusicTrack[]];

export function normalizeTrackIndex(trackIndex: number) {
  return ((trackIndex % musicTracks.length) + musicTracks.length) % musicTracks.length;
}

export function getMusicTrack(trackIndex: number): MusicTrack {
  return musicTracks[normalizeTrackIndex(trackIndex)] ?? musicTracks[0];
}
