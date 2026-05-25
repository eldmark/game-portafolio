import type { OverlayType } from '@/lib/store';

export type RoomObject = {
  id: string;
  label: string;
  hint: string;
  overlay: Exclude<OverlayType, null>;
  position: [number, number, number];
  size: [number, number, number];
  color: string;
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
  },
  {
    id: 'projects',
    label: 'Project Board',
    hint: 'Inspect project architecture',
    overlay: 'projects',
    position: [0, 1.55, -2.85],
    size: [2.4, 1.4, 0.18],
    color: '#4f6f52',
  },
  {
    id: 'mailbox',
    label: 'Mailbox',
    hint: 'Send a contact message',
    overlay: 'mailbox',
    position: [3, 0.6, -1.2],
    size: [0.8, 0.75, 0.75],
    color: '#a04747',
  },
  {
    id: 'about',
    label: 'Portrait',
    hint: 'Read the about section',
    overlay: 'about',
    position: [-3.15, 1.6, 0.4],
    size: [0.15, 1.25, 1],
    color: '#7f5539',
  },
  {
    id: 'bookshelf',
    label: 'Bookshelf',
    hint: 'Open technology notes',
    overlay: 'bookshelf',
    position: [3.1, 1.05, 1.2],
    size: [0.55, 1.9, 1.35],
    color: '#6c584c',
  },
  {
    id: 'posters',
    label: 'Posters',
    hint: 'View featured highlights',
    overlay: 'posters',
    position: [1.8, 1.65, -2.85],
    size: [0.9, 1.1, 0.14],
    color: '#2f5f98',
  },
  {
    id: 'future',
    label: 'Bed',
    hint: 'Open future ideas',
    overlay: 'future',
    position: [-2.2, 0.45, 1.8],
    size: [1.8, 0.55, 1.35],
    color: '#8e5572',
  },
];

export function getNearestObject(position: [number, number, number], maxDistance = 1.35) {
  let nearest: RoomObject | null = null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const object of roomObjects) {
    const dx = object.position[0] - position[0];
    const dz = object.position[2] - position[2];
    const distance = Math.sqrt(dx * dx + dz * dz);

    if (distance < nearestDistance && distance <= maxDistance) {
      nearest = object;
      nearestDistance = distance;
    }
  }

  return nearest;
}
