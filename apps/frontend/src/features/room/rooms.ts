import type { RoomId } from '@/lib/store';
import type { RoomObject } from './room-objects';

export type Collider = {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
};

export type DoorObject = {
  id: string;
  label: string;
  hint: string;
  kind: 'door';
  position: [number, number, number];
  size: [number, number, number];
  targetRoom: RoomId;
  interactionDistance?: number;
  markerPosition?: [number, number, number];
};

export type RoomDefinition = {
  id: RoomId;
  name: string;
  spawnPoint: [number, number, number];
  background: string;
  fog: { color: string; near: number; far: number };
  floorColor: string;
  wallColor: string;
  bounds: Collider;
  colliders: Collider[];
  objects: RoomObject[];
  doors: DoorObject[];
};

const defaultBounds: Collider = {
  minX: -3.25,
  maxX: 3.25,
  minZ: -2.35,
  maxZ: 2.65,
};

export const rooms: Record<RoomId, RoomDefinition> = {
  main: {
    id: 'main',
    name: 'Developer Room',
    spawnPoint: [0, 0.45, 2.2],
    background: '#161b22',
    fog: { color: '#161b22', near: 7.5, far: 13 },
    floorColor: '#91633f',
    wallColor: '#5d4b3f',
    bounds: defaultBounds,
    colliders: [
      { minX: -3.1, maxX: -2.05, minZ: -2.65, maxZ: -1.55 },
      { minX: -3.35, maxX: -1.25, minZ: 1.02, maxZ: 2.58 },
      { minX: 2.42, maxX: 3.35, minZ: 0.28, maxZ: 2.08 },
      { minX: 2.74, maxX: 3.32, minZ: -1.54, maxZ: -0.88 },
    ],
    objects: [
      {
        id: 'computer',
        label: 'Computer',
        hint: 'Open the professional hub',
        overlay: 'computer',
        position: [-2.7, 0.85, -2.4],
        size: [1.5, 1.1, 0.35],
        color: '#263238',
        interactionDistance: 1.6,
        markerPosition: [-2.7, 0.56, -2.45],
      },
      {
        id: 'projects',
        label: 'Project Board',
        hint: 'Inspect project architecture',
        overlay: 'projects',
        position: [0, 1.55, -2.85],
        size: [2.4, 1.4, 0.18],
        color: '#4f6f52',
        interactionDistance: 1.65,
        // button on the floor
        markerPosition: [0, 0.02, -2.45],
      },
      {
        id: 'mailbox',
        label: 'Mailbox',
        hint: 'Send a contact message',
        overlay: 'mailbox',
        // swapped with bookshelf
        position: [2.95, 1.05, 1.2],
        size: [0.66, 0.92, 0.58],
        color: '#a04747',
        interactionDistance: 1.25,
        // button on the floor
        markerPosition: [2.72, 0.02, 1.15],
      },
      {
        id: 'about',
        label: 'Portrait',
        hint: 'Read the about section',
        overlay: 'about',
        position: [-3.21, 1.6, 0.42],
        size: [0.18, 1.32, 0.92],
        color: '#7f5539',
        interactionDistance: 1.25,
        // button on the floor
        markerPosition: [-2.94, 0.02, 0.42],
      },
      {
        id: 'bookshelf',
        label: 'Bookshelf',
        hint: 'Open technology notes',
        overlay: 'bookshelf',
        // swapped with mailbox
        position: [3.02, 0.66, -1.16],
        size: [0.55, 1.9, 1.35],
        color: '#6c584c',
        interactionDistance: 1.5,
        markerPosition: [2.7, 0.42, -1.14],
      },
      {
        id: 'posters',
        label: 'Posters',
        hint: 'View featured highlights',
        overlay: 'posters',
        position: [1.95, 1.72, -2.86],
        size: [1.22, 1.34, 0.14],
        color: '#2f5f98',
        interactionDistance: 1.35,
        // button on the floor
        markerPosition: [1.96, 0.02, -2.48],
      },
      {
        id: 'future',
        label: 'Bed',
        hint: 'Open future ideas',
        overlay: 'future',
        position: [-2.2, 0.45, 1.8],
        size: [1.8, 0.55, 1.35],
        color: '#8e5572',
        interactionDistance: 1.5,
        markerPosition: [-2.1, 0.5, 0.95],
      },
      {
        id: 'switch',
        label: 'Nintendo Switch',
        hint: 'Play the Interview Battle',
        overlay: 'switch',
        position: [3.2, 0.58, 2.05],
        size: [0.32, 0.18, 0.06],
        color: '#1a1a1a',
        interactionDistance: 1.6,
        markerPosition: [3.2, 0.02, 2.05],
      },
    ],
    doors: [
      {
        id: 'door-to-goals',
        label: 'Goals Room',
        hint: 'Enter the Goals Room',
        kind: 'door',
        // left wall, between the desk and the portrait
        position: [-3.6, 0.95, -1.25],
        size: [0.2, 1.8, 0.7],
        targetRoom: 'goals',
        interactionDistance: 1.2,
        markerPosition: [-3.3, 0.02, -1.25],
      },
      {
        id: 'door-to-dressing',
        label: 'Dressing Room',
        hint: 'Enter the Dressing Room',
        kind: 'door',
        // left wall, next to the goals door, before the portrait
        position: [-3.6, 0.95, -0.45],
        size: [0.2, 1.8, 0.7],
        targetRoom: 'dressing',
        interactionDistance: 1.2,
        markerPosition: [-3.3, 0.02, -0.45],
      },
      {
        id: 'door-to-trophy',
        label: 'Trophy Room',
        hint: 'Enter the Trophy Room',
        kind: 'door',
        // right wall, between the bookshelf and the mailbox
        position: [3.6, 0.95, 0.05],
        size: [0.2, 1.8, 0.7],
        targetRoom: 'trophy',
        interactionDistance: 1.2,
        markerPosition: [3.3, 0.02, 0.05],
      },
      {
        id: 'door-to-blog',
        label: 'Blog Room',
        hint: 'Enter the Blog Room',
        kind: 'door',
        // right wall, front corner past the Nintendo Switch table
        position: [3.6, 0.95, 2.5],
        size: [0.2, 1.8, 0.7],
        targetRoom: 'blog',
        interactionDistance: 1.2,
        markerPosition: [3.3, 0.02, 2.5],
      },
    ],
  },
  goals: {
    id: 'goals',
    name: 'Goals Room',
    spawnPoint: [2.9, 0.45, -1.25],
    background: '#1a2233',
    fog: { color: '#1a2233', near: 7.5, far: 13 },
    floorColor: '#4f6079',
    wallColor: '#39465c',
    bounds: defaultBounds,
    colliders: [],
    objects: [
      {
        id: 'vision-board',
        label: 'Vision Board',
        hint: 'Review goals and milestones',
        overlay: 'goals',
        // corkboard on the back wall, far from the right-wall door
        position: [-0.4, 1.55, -2.85],
        size: [2.4, 1.5, 0.18],
        color: '#b08968',
        interactionDistance: 1.65,
        // button on the floor
        markerPosition: [-0.4, 0.02, -2.45],
      },
    ],
    doors: [
      {
        id: 'door-to-main',
        label: 'Developer Room',
        hint: 'Back to the Developer Room',
        kind: 'door',
        // right wall, mirroring the main room's left-wall door
        position: [3.6, 0.95, -1.25],
        size: [0.2, 1.8, 0.7],
        targetRoom: 'main',
        interactionDistance: 1.4,
        markerPosition: [3.3, 0.02, -1.25],
      },
    ],
  },
  trophy: {
    id: 'trophy',
    name: 'Trophy Room',
    spawnPoint: [-2.9, 0.45, 0.05],
    background: '#241a2e',
    fog: { color: '#241a2e', near: 7.5, far: 13 },
    floorColor: '#6a5478',
    wallColor: '#4a3a59',
    bounds: defaultBounds,
    colliders: [
      // trophy shelf against the right wall
      { minX: 2.6, maxX: 3.35, minZ: -1.05, maxZ: 1.05 },
    ],
    objects: [
      {
        id: 'trophy-shelf',
        label: 'Trophy Shelf',
        hint: 'Browse earned trophies',
        overlay: 'trophies',
        // shelf against the right wall, opposite the left-wall door
        position: [3.05, 0.95, 0],
        size: [0.6, 1.9, 1.8],
        color: '#caa64b',
        interactionDistance: 1.7,
        // button on the floor
        markerPosition: [2.5, 0.02, 0],
      },
    ],
    doors: [
      {
        id: 'door-to-main',
        label: 'Developer Room',
        hint: 'Back to the Developer Room',
        kind: 'door',
        // left wall, mirroring the main room's right-wall door
        position: [-3.6, 0.95, 0.05],
        size: [0.2, 1.8, 0.7],
        targetRoom: 'main',
        interactionDistance: 1.4,
        markerPosition: [-3.3, 0.02, 0.05],
      },
    ],
  },
  blog: {
    id: 'blog',
    name: 'Blog Room',
    spawnPoint: [-2.9, 0.45, 2.4],
    background: '#16241e',
    fog: { color: '#16241e', near: 7.5, far: 13 },
    floorColor: '#4f7059',
    wallColor: '#3a5244',
    bounds: defaultBounds,
    colliders: [
      // dev terminal desk against the right wall
      { minX: 2.5, maxX: 3.35, minZ: -1.6, maxZ: -0.2 },
    ],
    objects: [
      {
        id: 'bulletin-board',
        label: 'Bulletin Board',
        hint: 'Read the blog posts',
        overlay: 'posts',
        // board on the back wall, far from the left-wall door
        position: [-1, 1.55, -2.85],
        size: [2, 1.35, 0.16],
        color: '#9c6644',
        interactionDistance: 1.65,
        // button on the floor
        markerPosition: [-1, 0.02, -2.45],
      },
      {
        id: 'dev-terminal',
        label: 'Dev Terminal',
        hint: 'Check the dev activity feed',
        overlay: 'devlog',
        // desk with terminal against the right wall
        position: [2.95, 0.8, -0.9],
        size: [0.85, 1, 1.25],
        color: '#1c2a22',
        interactionDistance: 1.7,
        // button on the floor
        markerPosition: [2.45, 0.02, -0.9],
      },
    ],
    doors: [
      {
        id: 'door-to-main',
        label: 'Developer Room',
        hint: 'Back to the Developer Room',
        kind: 'door',
        // left wall, mirroring the main room's right-wall door
        position: [-3.6, 0.95, 2.4],
        size: [0.2, 1.8, 0.7],
        targetRoom: 'main',
        interactionDistance: 1.4,
        markerPosition: [-3.3, 0.02, 2.4],
      },
    ],
  },
  dressing: {
    id: 'dressing',
    name: 'Dressing Room',
    spawnPoint: [2.9, 0.45, -0.45],
    background: '#2e1a22',
    fog: { color: '#2e1a22', near: 7.5, far: 13 },
    floorColor: '#7a4f5c',
    wallColor: '#593a44',
    bounds: defaultBounds,
    colliders: [],
    objects: [
      {
        id: 'hat-rack',
        label: 'Hat Rack',
        hint: 'Try on a hat',
        overlay: 'dressing',
        position: [-2.4, 0.6, -2.4],
        size: [0.6, 1.2, 0.6],
        color: '#8a5a68',
        interactionDistance: 1.4,
        markerPosition: [-2.4, 0.02, -1.9],
      },
      {
        id: 'shirt-rack',
        label: 'Shirt Rack',
        hint: 'Pick a shirt color',
        overlay: 'dressing',
        position: [0, 0.6, -2.6],
        size: [1.2, 1.2, 0.5],
        color: '#9c6b78',
        interactionDistance: 1.4,
        markerPosition: [0, 0.02, -2.1],
      },
      {
        id: 'pants-rack',
        label: 'Pants Rack',
        hint: 'Pick pants',
        overlay: 'dressing',
        position: [2.2, 0.6, -2.4],
        size: [0.9, 1.2, 0.5],
        color: '#6f4a55',
        interactionDistance: 1.4,
        markerPosition: [2.2, 0.02, -1.9],
      },
    ],
    doors: [
      {
        id: 'door-to-main',
        label: 'Developer Room',
        hint: 'Back to the Developer Room',
        kind: 'door',
        // right wall, mirroring the main room's left-wall door
        position: [3.6, 0.95, -0.45],
        size: [0.2, 1.8, 0.7],
        targetRoom: 'main',
        interactionDistance: 1.4,
        markerPosition: [3.3, 0.02, -0.45],
      },
    ],
  },
};

export function getRoomSpawnPoint(roomId: RoomId): [number, number, number] {
  return rooms[roomId]?.spawnPoint ?? [0, 0.45, 2.2];
}
