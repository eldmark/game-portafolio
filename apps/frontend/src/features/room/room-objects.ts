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

type NearbyInteractable = {
  position: [number, number, number];
  interactionDistance?: number;
};

export function getNearestObject<T extends NearbyInteractable>(
  objects: readonly T[],
  position: [number, number, number],
  maxDistance = 1.35,
) {
  let nearest: T | null = null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const object of objects) {
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
