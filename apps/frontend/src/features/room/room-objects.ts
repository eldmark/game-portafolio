import type { OverlayType } from '@/lib/store';

export type RoomObject = {
  id: string;
  label: string;
  hint: string;
  overlay: Exclude<OverlayType, null>;
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  interactionDistance?: number;
  markerPosition?: [number, number, number];
};

export const roomObjects: RoomObject[] = [
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
    markerPosition: [0, 0.46, -2.45],
  },
  {
    id: 'mailbox',
    label: 'Mailbox',
    hint: 'Send a contact message',
    overlay: 'mailbox',
    position: [3.02, 0.66, -1.16],
    size: [0.66, 0.92, 0.58],
    color: '#a04747',
    interactionDistance: 1.25,
    markerPosition: [2.7, 0.42, -1.14],
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
    markerPosition: [-2.94, 0.48, 0.42],
  },
  {
    id: 'bookshelf',
    label: 'Bookshelf',
    hint: 'Open technology notes',
    overlay: 'bookshelf',
    position: [3.1, 1.05, 1.2],
    size: [0.55, 1.9, 1.35],
    color: '#6c584c',
    interactionDistance: 1.5,
    markerPosition: [2.72, 0.48, 1.15],
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
    markerPosition: [1.96, 0.42, -2.48],
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
];

export function getNearestObject(position: [number, number, number], maxDistance = 1.35) {
  let nearest: RoomObject | null = null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const object of roomObjects) {
    const dx = object.position[0] - position[0];
    const dz = object.position[2] - position[2];
    const distance = Math.sqrt(dx * dx + dz * dz);

    const objectDistanceLimit = object.interactionDistance ?? maxDistance;
    if (distance < nearestDistance && distance <= objectDistanceLimit) {
      nearest = object;
      nearestDistance = distance;
    }
  }

  return nearest;
}
