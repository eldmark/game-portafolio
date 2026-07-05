'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';
import { usePortfolioStore } from '@/lib/store';
import { useCharacterStore, type HatId } from '@/lib/character-store';
import { rooms, type Collider } from './rooms';

const pressedKeys = new Set<string>();

/* -------------------------------------------------------------------------- */
/*                               SPRITE CONFIG                                */
/* -------------------------------------------------------------------------- */

const SPRITE_SHEET_URL = '/assets/models/man-character-spritesheet.png';

/*
  NEW SPRITESHEET

  Image size:
  200 x 250

  Grid:
  4 columns
  5 rows

  Frame size:
  50 x 50
*/

const COLUMNS = 4;
const ROWS = 5;

const WALK_FPS = 8;

/* -------------------------------------------------------------------------- */
/*                             ANIMATION MAPPING                              */
/* -------------------------------------------------------------------------- */

/*
  ROWS

  0 = idle down
  1 = walk right
  2 = walk left
  3 = idle front alt
  4 = back / up
*/

const ANIMATIONS = {
  idleDown: {
    row: 0,
    frames: [0, 1],
  },

  walkRight: {
    row: 1,
    frames: [0, 1, 2, 3],
  },

  walkLeft: {
    row: 2,
    frames: [0, 1, 2, 3],
  },

  idleAlt: {
    row: 3,
    frames: [0, 1],
  },
  walkDown: {
    row: 3,
    frames: [0, 1],
  },
  walkUp: {
    row: 4,
    frames: [0, 1, 2, 3],
  },
} as const;

type FacingDirection = 'down' | 'left' | 'right' | 'up';

type AnimationKey = keyof typeof ANIMATIONS;

/* -------------------------------------------------------------------------- */
/*                             PLAYER COLLISIONS                              */
/* -------------------------------------------------------------------------- */

const PLAYER_RADIUS = 0.22;

function collidesAt(colliders: Collider[], x: number, z: number) {
  for (const collider of colliders) {
    const overlapsX = x + PLAYER_RADIUS > collider.minX && x - PLAYER_RADIUS < collider.maxX;

    const overlapsZ = z + PLAYER_RADIUS > collider.minZ && z - PLAYER_RADIUS < collider.maxZ;

    if (overlapsX && overlapsZ) return true;
  }

  return false;
}

/* -------------------------------------------------------------------------- */
/*                             COSMETIC RECOLOR                               */
/* -------------------------------------------------------------------------- */

// Base sprite palette regions sampled from the spritesheet:
const SHIRT_BASE: [number, number, number] = [119, 74, 44];
const SHIRT_SHADE: [number, number, number] = [128, 86, 57];
const PANTS_BASE: [number, number, number] = [51, 49, 49];
const PANTS_SHADE: [number, number, number] = [31, 31, 31];

const SHIRT_COLORS: Record<string, [number, number, number] | null> = {
  default: null,
  red: [196, 64, 64],
  blue: [64, 110, 196],
  green: [76, 158, 92],
  purple: [140, 90, 196],
};

const PANTS_COLORS: Record<string, [number, number, number] | null> = {
  default: null,
  black: [38, 38, 42],
  tan: [168, 140, 96],
  navy: [44, 58, 104],
};

type ColorSwap = { from: [number, number, number]; to: [number, number, number]; tolerance: number };

function darken(c: [number, number, number], f: number): [number, number, number] {
  return [Math.round(c[0] * f), Math.round(c[1] * f), Math.round(c[2] * f)];
}

function buildSwaps(shirt: string, pants: string): ColorSwap[] {
  const swaps: ColorSwap[] = [];
  const shirtTarget = SHIRT_COLORS[shirt] ?? null;
  if (shirtTarget) {
    swaps.push({ from: SHIRT_BASE, to: shirtTarget, tolerance: 14 });
    swaps.push({ from: SHIRT_SHADE, to: darken(shirtTarget, 0.8), tolerance: 10 });
  }
  const pantsTarget = PANTS_COLORS[pants] ?? null;
  if (pantsTarget) {
    swaps.push({ from: PANTS_BASE, to: pantsTarget, tolerance: 10 });
    swaps.push({ from: PANTS_SHADE, to: darken(pantsTarget, 0.7), tolerance: 10 });
  }
  return swaps;
}

function recolorCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  swaps: ColorSwap[],
) {
  if (swaps.length === 0) return;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3] ?? 0;
    if (a === 0) continue;
    const r = data[i] ?? 0;
    const g = data[i + 1] ?? 0;
    const b = data[i + 2] ?? 0;
    for (const swap of swaps) {
      const tol = swap.tolerance;
      if (
        Math.abs(r - swap.from[0]) <= tol &&
        Math.abs(g - swap.from[1]) <= tol &&
        Math.abs(b - swap.from[2]) <= tol
      ) {
        data[i] = swap.to[0];
        data[i + 1] = swap.to[1];
        data[i + 2] = swap.to[2];
        break;
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

function HatMesh({ hat }: { hat: HatId }) {
  if (hat === 'cap') {
    return (
      <mesh position={[0, 0.92, 0.05]}>
        <boxGeometry args={[0.28, 0.12, 0.28]} />
        <meshStandardMaterial color="#3a6ea5" />
      </mesh>
    );
  }
  if (hat === 'party') {
    return (
      <mesh position={[0, 1.0, 0]}>
        <coneGeometry args={[0.16, 0.32, 16]} />
        <meshStandardMaterial color="#e07a5f" />
      </mesh>
    );
  }
  if (hat === 'beanie') {
    return (
      <mesh position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.18, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.6]} />
        <meshStandardMaterial color="#6a4f9e" />
      </mesh>
    );
  }
  return null;
}

/* -------------------------------------------------------------------------- */
/*                             KEYBOARD CONTROLS                              */
/* -------------------------------------------------------------------------- */

export function setVirtualKey(key: string, active: boolean) {
  const normalizedKey = key?.toLowerCase?.();
  if (!normalizedKey) return;

  if (active) {
    pressedKeys.add(normalizedKey);
  } else {
    pressedKeys.delete(normalizedKey);
  }
}

function useKeyboardControls() {
  useEffect(() => {
    const isTypingTarget = (target: EventTarget | null) =>
      target instanceof HTMLElement &&
      (target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable);

    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;

      const normalizedKey = event.key?.toLowerCase?.();
      if (!normalizedKey) return;

      pressedKeys.add(normalizedKey);
    };

    const onKeyUp = (event: KeyboardEvent) => {
      const normalizedKey = event.key?.toLowerCase?.();
      if (!normalizedKey) return;

      pressedKeys.delete(normalizedKey);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);

      pressedKeys.clear();
    };
  }, []);
}

/* -------------------------------------------------------------------------- */
/*                                   PLAYER                                   */
/* -------------------------------------------------------------------------- */

export function Player() {
  useKeyboardControls();

  const groupRef = useRef<THREE.Group>(null);

  const position = useMemo(() => new THREE.Vector3(0, 0.45, 2.2), []);
  const movementVector = useMemo(() => new THREE.Vector3(), []);

  const facingDirectionRef = useRef<FacingDirection>('down');

  const currentFrameRef = useRef(0);

  const animationTimerRef = useRef(0);
  const lastPublishedPositionRef = useRef<[number, number, number]>([
    position.x,
    position.y,
    position.z,
  ]);

  const setPlayerPosition = usePortfolioStore((state) => state.setPlayerPosition);
  const currentRoomId = usePortfolioStore((state) => state.currentRoomId);
  const room = rooms[currentRoomId];

  const baseSheet = useTexture(SPRITE_SHEET_URL);
  const shirtColor = useCharacterStore((state) => state.shirtColor);
  const pantsColor = useCharacterStore((state) => state.pantsColor);
  const hat = useCharacterStore((state) => state.hat);
  const name = useCharacterStore((state) => state.name);

  const spriteSheet = useMemo(() => {
    const image = baseSheet.image as HTMLImageElement | undefined;
    if (!image || typeof document === 'undefined') return baseSheet;
    const swaps = buildSwaps(shirtColor, pantsColor);
    if (swaps.length === 0) return baseSheet;
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return baseSheet;
    ctx.drawImage(image, 0, 0);
    recolorCanvas(ctx, canvas.width, canvas.height, swaps);
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, [baseSheet, shirtColor, pantsColor]);

  /* ------------------------------------------------------------------------ */
  /*                              ROOM TRANSITION                             */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    // snap to the new room's spawn point (set by the store's setRoom action)
    const [spawnX, spawnY, spawnZ] = usePortfolioStore.getState().playerPosition;
    position.set(spawnX, spawnY, spawnZ);
    lastPublishedPositionRef.current = [spawnX, spawnY, spawnZ];

    if (groupRef.current) {
      groupRef.current.position.copy(position);
    }
  }, [currentRoomId, position]);

  /* ------------------------------------------------------------------------ */
  /*                             TEXTURE SETTINGS                             */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    spriteSheet.magFilter = THREE.NearestFilter;
    spriteSheet.minFilter = THREE.NearestFilter;

    spriteSheet.generateMipmaps = false;

    spriteSheet.wrapS = THREE.ClampToEdgeWrapping;
    spriteSheet.wrapT = THREE.ClampToEdgeWrapping;

    spriteSheet.repeat.set(1 / COLUMNS, 1 / ROWS);

    spriteSheet.needsUpdate = true;
  }, [spriteSheet]);

  /* ------------------------------------------------------------------------ */
  /*                                  UPDATE                                  */
  /* ------------------------------------------------------------------------ */

  useFrame((_state, delta) => {
    const speed = 2.3;

    const direction = movementVector;
    direction.set(0, 0, 0);

    if (pressedKeys.has('w') || pressedKeys.has('arrowup')) {
      direction.z -= 1;
    }

    if (pressedKeys.has('s') || pressedKeys.has('arrowdown')) {
      direction.z += 1;
    }

    if (pressedKeys.has('a') || pressedKeys.has('arrowleft')) {
      direction.x -= 1;
    }

    if (pressedKeys.has('d') || pressedKeys.has('arrowright')) {
      direction.x += 1;
    }

    const moving = direction.lengthSq() > 0;

    /* ---------------------------------------------------------------------- */
    /*                                MOVEMENT                                */
    /* ---------------------------------------------------------------------- */

    if (moving) {
      direction.normalize();

      const nextX = THREE.MathUtils.clamp(
        position.x + direction.x * speed * delta,
        room.bounds.minX,
        room.bounds.maxX,
      );

      const nextZ = THREE.MathUtils.clamp(
        position.z + direction.z * speed * delta,
        room.bounds.minZ,
        room.bounds.maxZ,
      );

      const canMoveX = !collidesAt(room.colliders, nextX, position.z);
      const canMoveZ = !collidesAt(room.colliders, position.x, nextZ);
      const canMoveDiagonal = !collidesAt(room.colliders, nextX, nextZ);

      if (canMoveDiagonal) {
        position.x = nextX;
        position.z = nextZ;
      } else {
        if (canMoveX) position.x = nextX;
        if (canMoveZ) position.z = nextZ;
      }

      /* -------------------------------------------------------------------- */
      /*                              DIRECTION                               */
      /* -------------------------------------------------------------------- */

      if (Math.abs(direction.x) > Math.abs(direction.z)) {
        facingDirectionRef.current = direction.x < 0 ? 'left' : 'right';
      } else {
        facingDirectionRef.current = direction.z < 0 ? 'up' : 'down';
      }

      animationTimerRef.current += delta;

      if (animationTimerRef.current >= 1 / WALK_FPS) {
        animationTimerRef.current = 0;

        currentFrameRef.current++;
      }
    } else {
      currentFrameRef.current = 0;
    }

    /* ---------------------------------------------------------------------- */
    /*                            SELECT ANIMATION                            */
    /* ---------------------------------------------------------------------- */

    let animationKey: AnimationKey = 'idleDown';

    if (moving) {
      switch (facingDirectionRef.current) {
        case 'left':
          animationKey = 'walkLeft';
          break;

        case 'right':
          animationKey = 'walkRight';
          break;

        case 'up':
          animationKey = 'walkUp';
          break;

        case 'down':
          animationKey = 'walkDown';
          break;
      }
    } else {
      animationKey = 'idleDown';
    }

    const animation = ANIMATIONS[animationKey];

    const frame = animation.frames[currentFrameRef.current % animation.frames.length] ?? 0;

    /* ---------------------------------------------------------------------- */
    /*                             SPRITE OFFSET                              */
    /* ---------------------------------------------------------------------- */

    const offsetX = frame / COLUMNS;

    const offsetY = 1 - (animation.row + 1) / ROWS;

    spriteSheet.offset.set(offsetX, offsetY);

    /* ---------------------------------------------------------------------- */
    /*                               POSITIONING                              */
    /* ---------------------------------------------------------------------- */

    if (groupRef.current) {
      groupRef.current.position.copy(position);
    }

    const [lastX, lastY, lastZ] = lastPublishedPositionRef.current;
    if (lastX !== position.x || lastY !== position.y || lastZ !== position.z) {
      const nextPosition: [number, number, number] = [position.x, position.y, position.z];
      lastPublishedPositionRef.current = nextPosition;
      setPlayerPosition(nextPosition);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.45, 2.2]}>
      {/* SHADOW */}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.16, 24]} />

        <meshStandardMaterial color="#000000" transparent opacity={0.25} />
      </mesh>

      {/* SPRITE */}

      <sprite position={[0, 0.62, 0]} scale={[0.95, 0.95, 1]}>
        <spriteMaterial map={spriteSheet} transparent alphaTest={0.1} />
      </sprite>

      <HatMesh hat={hat} />

      {name ? (
        <Html center distanceFactor={6} position={[0, 1.32, 0]}>
          <div className="player-name-tag">{name}</div>
        </Html>
      ) : null}
    </group>
  );
}
