'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { usePortfolioStore } from '@/lib/store';

const pressedKeys = new Set<string>();

/* -------------------------------------------------------------------------- */
/*                               SPRITE CONFIG                                */
/* -------------------------------------------------------------------------- */

const SPRITE_SHEET_URL = '/assets/models/man-character-spritesheet.png';

const FRAME_WIDTH = 96;
const FRAME_HEIGHT = 96;

const WALK_FPS = 8;

const ANIMATIONS = {
  idleDown: {
    row: 0,
    frames: [0, 1, 2, 3, 4],
  },

  idleLeft: {
    row: 1,
    frames: [0, 1, 2, 3, 4],
  },

  walkLeft: {
    row: 2,
    frames: [0, 1, 2, 3, 4],
  },

  walkRight: {
    row: 3,
    frames: [0, 1, 2, 3, 4],
  },

  walkDown: {
    row: 4,
    frames: [0, 1, 2, 3, 4],
  },

  walkUp: {
    row: 5,
    frames: [0, 1, 2, 3, 4],
  },
} as const;

type AnimationKey = keyof typeof ANIMATIONS;

type FacingDirection = 'down' | 'left' | 'right' | 'up';

type Collider = {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
};

/* -------------------------------------------------------------------------- */
/*                             PLAYER COLLISIONS                              */
/* -------------------------------------------------------------------------- */

const PLAYER_RADIUS = 0.22;

const ROOM_LIMITS = {
  minX: -3.25,
  maxX: 3.25,
  minZ: -2.35,
  maxZ: 2.65,
} as const;

const ROOM_COLLIDERS: Collider[] = [
  { minX: -3.1, maxX: -2.05, minZ: -2.65, maxZ: -1.55 },
  { minX: -3.35, maxX: -1.25, minZ: 1.02, maxZ: 2.58 },
  { minX: 2.42, maxX: 3.35, minZ: 0.28, maxZ: 2.08 },
  { minX: 2.74, maxX: 3.32, minZ: -1.54, maxZ: -0.88 },
  { minX: 1.52, maxX: 2.94, minZ: -3.1, maxZ: -2.66 },
  { minX: -1.08, maxX: 1.08, minZ: -3.1, maxZ: -2.58 },
  { minX: -3.35, maxX: -2.9, minZ: -0.08, maxZ: 0.98 },
];

function collidesAt(x: number, z: number) {
  for (const collider of ROOM_COLLIDERS) {
    const overlapsX =
      x + PLAYER_RADIUS > collider.minX &&
      x - PLAYER_RADIUS < collider.maxX;

    const overlapsZ =
      z + PLAYER_RADIUS > collider.minZ &&
      z - PLAYER_RADIUS < collider.maxZ;

    if (overlapsX && overlapsZ) return true;
  }

  return false;
}

/* -------------------------------------------------------------------------- */
/*                              KEYBOARD INPUT                                */
/* -------------------------------------------------------------------------- */

export function setVirtualKey(key: string, active: boolean) {
  if (active) {
    pressedKeys.add(key.toLowerCase());
  } else {
    pressedKeys.delete(key.toLowerCase());
  }
}

function useKeyboardControls() {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      pressedKeys.add(event.key.toLowerCase());
    };

    const onKeyUp = (event: KeyboardEvent) => {
      pressedKeys.delete(event.key.toLowerCase());
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

  const position = useMemo(
    () => new THREE.Vector3(0, 0.45, 2.2),
    []
  );

  const facingDirectionRef = useRef<FacingDirection>('down');

  const currentFrameRef = useRef(0);
  const animationTimeRef = useRef(0);

  const setPlayerPosition = usePortfolioStore(
    (state) => state.setPlayerPosition
  );

  const spriteSheet = useTexture(SPRITE_SHEET_URL);

  /* ------------------------------------------------------------------------ */
  /*                             TEXTURE SETTINGS                             */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    spriteSheet.magFilter = THREE.NearestFilter;
    spriteSheet.minFilter = THREE.NearestFilter;

    spriteSheet.generateMipmaps = false;

    spriteSheet.wrapS = THREE.ClampToEdgeWrapping;
    spriteSheet.wrapT = THREE.ClampToEdgeWrapping;

    if (spriteSheet.image) {
      spriteSheet.repeat.set(
        FRAME_WIDTH / spriteSheet.image.width,
        FRAME_HEIGHT / spriteSheet.image.height
      );
    }

    spriteSheet.needsUpdate = true;
  }, [spriteSheet]);

  /* ------------------------------------------------------------------------ */
  /*                                ANIMATION                                 */
  /* ------------------------------------------------------------------------ */

  useFrame((_state, delta) => {
    const speed = 2.3;

    const direction = new THREE.Vector3();

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
        ROOM_LIMITS.minX,
        ROOM_LIMITS.maxX
      );

      const nextZ = THREE.MathUtils.clamp(
        position.z + direction.z * speed * delta,
        ROOM_LIMITS.minZ,
        ROOM_LIMITS.maxZ
      );

      const canMoveX = !collidesAt(nextX, position.z);
      const canMoveZ = !collidesAt(position.x, nextZ);
      const canMoveDiagonal = !collidesAt(nextX, nextZ);

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
        facingDirectionRef.current =
          direction.x < 0 ? 'left' : 'right';
      } else {
        facingDirectionRef.current =
          direction.z < 0 ? 'up' : 'down';
      }

      /* -------------------------------------------------------------------- */
      /*                              FRAME TIMER                              */
      /* -------------------------------------------------------------------- */

      animationTimeRef.current += delta;

      if (animationTimeRef.current >= 1 / WALK_FPS) {
        animationTimeRef.current = 0;

        currentFrameRef.current =
          (currentFrameRef.current + 1) % 5;
      }
    } else {
      currentFrameRef.current = 0;
      animationTimeRef.current = 0;
    }

    /* ---------------------------------------------------------------------- */
    /*                          SELECT ANIMATION                              */
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
      switch (facingDirectionRef.current) {
        case 'left':
          animationKey = 'idleLeft';
          break;

        case 'right':
          animationKey = 'walkRight';
          break;

        case 'up':
          animationKey = 'walkUp';
          break;

        case 'down':
          animationKey = 'idleDown';
          break;
      }
    }

    const animation = ANIMATIONS[animationKey];

    const frame =
      animation.frames[currentFrameRef.current] ?? 0;

    const textureWidth = spriteSheet.image?.width ?? FRAME_WIDTH;
    const textureHeight = spriteSheet.image?.height ?? FRAME_HEIGHT;

    const columns = textureWidth / FRAME_WIDTH;
    const rows = textureHeight / FRAME_HEIGHT;

    const offsetX = (frame % columns) / columns;

    const offsetY =
      1 - (animation.row + 1) / rows;

    spriteSheet.offset.set(offsetX, offsetY);

    /* ---------------------------------------------------------------------- */
    /*                              POSITIONING                               */
    /* ---------------------------------------------------------------------- */

    if (groupRef.current) {
      groupRef.current.position.copy(position);
    }

    setPlayerPosition([
      position.x,
      position.y,
      position.z,
    ]);
  });

  return (
    <group
      ref={groupRef}
      position={[0, 0.45, 2.2]}
    >
      {/* Shadow */}

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, 0]}
      >
        <circleGeometry args={[0.16, 24]} />

        <meshStandardMaterial
          color='#000000'
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Character Sprite */}

      <sprite
        position={[0, 0.58, 0]}
        scale={[1.15, 1.15, 1]}
      >
        <spriteMaterial
          map={spriteSheet}
          transparent
          alphaTest={0.1}
        />
      </sprite>
    </group>
  );
}