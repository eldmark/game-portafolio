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

const mainBounds: Collider = {
  minX: -4,
  maxX: 4,
  minZ: -3,
  maxZ: 3.3,
};

export const rooms: Record<RoomId, RoomDefinition> = {
  main: {
    id: 'main',
    name: 'Developer Room',
    spawnPoint: [0, 0.45, 2.85],
    background: '#161b22',
    fog: { color: '#161b22', near: 9, far: 16 },
    floorColor: '#91633f',
    wallColor: '#5d4b3f',
    bounds: mainBounds,
    colliders: [
      { minX: -3.85, maxX: -2.8, minZ: -3.3, maxZ: -2.2 },
      { minX: -4.1, maxX: -2.0, minZ: 1.67, maxZ: 3.23 },
      { minX: 3.17, maxX: 4.1, minZ: 0.28, maxZ: 2.08 },
      { minX: 3.49, maxX: 4.07, minZ: -1.54, maxZ: -0.88 },
    ],
    objects: [
      {
        id: 'computer',
        label: 'Computer',
        hint: 'Open the professional hub',
        overlay: 'computer',
        position: [-3.45, 0.85, -3.05],
        size: [1.5, 1.1, 0.35],
        interactionDistance: 1.6,
        markerPosition: [-3.45, 0.56, -3.1],
      },
      {
        id: 'projects',
        label: 'Project Board',
        hint: 'Inspect project architecture',
        overlay: 'projects',
        position: [0, 1.55, -3.5],
        size: [2.4, 1.4, 0.18],
        interactionDistance: 1.65,
        // button on the floor
        markerPosition: [0, 0.02, -3.1],
      },
      {
        id: 'mailbox',
        label: 'Mailbox',
        hint: 'Send a contact message',
        overlay: 'mailbox',
        // swapped with bookshelf
        position: [3.7, 1.05, 1.2],
        size: [0.66, 0.92, 0.58],
        interactionDistance: 1.25,
        // button on the floor
        markerPosition: [3.47, 0.02, 1.15],
      },
      {
        id: 'about',
        label: 'Portrait',
        hint: 'Read the about section',
        overlay: 'about',
        position: [-3.96, 1.6, 0.42],
        size: [0.18, 1.32, 0.92],
        interactionDistance: 1.25,
        // button on the floor
        markerPosition: [-3.69, 0.02, 0.42],
      },
      {
        id: 'bookshelf',
        label: 'Bookshelf',
        hint: 'Open technology notes',
        overlay: 'bookshelf',
        // swapped with mailbox
        position: [3.77, 0.66, -1.16],
        size: [0.55, 1.9, 1.35],
        interactionDistance: 1.5,
        markerPosition: [3.45, 0.42, -1.14],
      },
      {
        id: 'posters',
        label: 'Posters',
        hint: 'View featured highlights',
        overlay: 'posters',
        position: [1.95, 1.72, -3.51],
        size: [1.22, 1.34, 0.14],
        interactionDistance: 1.35,
        // button on the floor
        markerPosition: [1.96, 0.02, -3.13],
      },
      {
        id: 'future',
        label: 'Bed',
        hint: 'Open future ideas',
        overlay: 'future',
        position: [-2.95, 0.45, 2.45],
        size: [1.8, 0.55, 1.35],
        interactionDistance: 1.5,
        markerPosition: [-2.85, 0.5, 1.6],
      },
      {
        id: 'switch',
        label: 'Nintendo Switch',
        hint: 'Play the Interview Battle',
        overlay: 'switch',
        position: [3.95, 0.58, 2.7],
        size: [0.32, 0.18, 0.06],
        interactionDistance: 1.6,
        markerPosition: [3.95, 0.02, 2.7],
      },
    ],
    doors: [
      {
        id: 'door-to-archive',
        label: 'Archive Room',
        hint: 'Enter the Archive Room',
        kind: 'door',
        position: [-4.35, 0.95, -1.25],
        size: [0.2, 1.8, 0.7],
        targetRoom: 'archive',
        interactionDistance: 1.2,
        markerPosition: [-4.05, 0.02, -1.25],
      },
    ],
  },
  archive: {
    id: 'archive',
    name: 'Archive Room',
    spawnPoint: [-2.9, 0.45, 0.15],
    background: '#1a2233',
    fog: { color: '#1a2233', near: 7.5, far: 13 },
    floorColor: '#4f6079',
    wallColor: '#39465c',
    bounds: defaultBounds,
    colliders: [
      { minX: 2.6, maxX: 3.35, minZ: 0.3, maxZ: 2.1 },
      { minX: 2.5, maxX: 3.35, minZ: -1.6, maxZ: -0.2 },
    ],
    objects: [
      {
        id: 'vision-board',
        label: 'Vision Board',
        hint: 'Review goals and milestones',
        overlay: 'goals',
        // corkboard on the back wall, far from the right-wall door
        position: [-1.5, 1.55, -2.85],
        size: [2.4, 1.5, 0.18],
        interactionDistance: 1.65,
        // button on the floor
        markerPosition: [-1.5, 0.02, -2.45],
      },
      {
        id: 'bulletin-board',
        label: 'Bulletin Board',
        hint: 'Read the blog posts',
        overlay: 'posts',
        // board on the back wall, far from the left-wall door
        position: [1.3, 1.55, -2.85],
        size: [2, 1.35, 0.16],
        interactionDistance: 1.65,
        // button on the floor
        markerPosition: [1.3, 0.02, -2.45],
      },
      {
        id: 'trophy-shelf',
        label: 'Trophy Shelf',
        hint: 'Browse earned trophies',
        overlay: 'trophies',
        // shelf against the right wall, opposite the left-wall door
        position: [3.05, 0.95, 1.2],
        size: [0.6, 1.9, 1.8],
        interactionDistance: 1.7,
        // button on the floor
        markerPosition: [2.5, 0.02, 1.2],
      },
      {
        id: 'dev-terminal',
        label: 'Dev Terminal',
        hint: 'Check the dev activity feed',
        overlay: 'devlog',
        // desk with terminal against the right wall
        position: [2.95, 0.8, -0.9],
        size: [0.85, 1, 1.25],
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
        position: [-3.6, 0.95, 0.15],
        size: [0.2, 1.8, 0.7],
        targetRoom: 'main',
        interactionDistance: 1.4,
        markerPosition: [-3.3, 0.02, 0.15],
      },
    ],
  },
};

export function getRoomSpawnPoint(roomId: RoomId): [number, number, number] {
  return rooms[roomId]?.spawnPoint ?? [0, 0.45, 2.85];
}
