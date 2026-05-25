'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePortfolioStore } from '@/lib/store';

const pressedKeys = new Set<string>();

export function setVirtualKey(key: string, active: boolean) {
  if (active) {
    pressedKeys.add(key);
  } else {
    pressedKeys.delete(key);
  }
}

function useKeyboardControls() {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => pressedKeys.add(event.key.toLowerCase());
    const onKeyUp = (event: KeyboardEvent) => pressedKeys.delete(event.key.toLowerCase());

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      pressedKeys.clear();
    };
  }, []);
}

export function Player() {
  useKeyboardControls();
  const groupRef = useRef<THREE.Group>(null);
  const position = useMemo(() => new THREE.Vector3(0, 0.45, 2.2), []);
  const setPlayerPosition = usePortfolioStore((state) => state.setPlayerPosition);

  useFrame((_state, delta) => {
    const speed = 2.3;
    const direction = new THREE.Vector3(0, 0, 0);

    if (pressedKeys.has('w') || pressedKeys.has('arrowup')) direction.z -= 1;
    if (pressedKeys.has('s') || pressedKeys.has('arrowdown')) direction.z += 1;
    if (pressedKeys.has('a') || pressedKeys.has('arrowleft')) direction.x -= 1;
    if (pressedKeys.has('d') || pressedKeys.has('arrowright')) direction.x += 1;

    if (direction.lengthSq() > 0) {
      direction.normalize();
      position.addScaledVector(direction, speed * delta);
      position.x = THREE.MathUtils.clamp(position.x, -3.25, 3.25);
      position.z = THREE.MathUtils.clamp(position.z, -2.35, 2.65);

      if (groupRef.current) {
        groupRef.current.rotation.y = Math.atan2(direction.x, direction.z);
      }
    }

    groupRef.current?.position.copy(position);
    setPlayerPosition([position.x, position.y, position.z]);
  });

  return (
    <group ref={groupRef} position={[0, 0.45, 2.2]}>
      <mesh castShadow position={[0, 0.3, 0]}>
        <boxGeometry args={[0.36, 0.6, 0.3]} />
        <meshStandardMaterial color="#345995" />
      </mesh>
      <mesh castShadow position={[0, 0.78, 0]}>
        <boxGeometry args={[0.3, 0.28, 0.3]} />
        <meshStandardMaterial color="#f2c9a7" />
      </mesh>
      <mesh castShadow position={[-0.11, -0.05, 0]}>
        <boxGeometry args={[0.12, 0.32, 0.14]} />
        <meshStandardMaterial color="#2b2d42" />
      </mesh>
      <mesh castShadow position={[0.11, -0.05, 0]}>
        <boxGeometry args={[0.12, 0.32, 0.14]} />
        <meshStandardMaterial color="#2b2d42" />
      </mesh>
    </group>
  );
}
