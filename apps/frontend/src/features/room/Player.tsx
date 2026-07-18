'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';
import { usePortfolioStore } from '@/lib/store';
import { useCharacterStore } from '@/lib/character-store';
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

  const spriteSheet = useTexture(SPRITE_SHEET_URL);
  const name = useCharacterStore((state) => state.name);

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

      {name ? (
        <Html center distanceFactor={6} position={[0, 1.32, 0]}>
          <div className="player-name-tag">{name}</div>
        </Html>
      ) : null}
    </group>
  );
}
