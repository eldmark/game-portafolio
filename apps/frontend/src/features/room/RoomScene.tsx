'use client';

import { Html, Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useMemo } from 'react';
import * as THREE from 'three';
import { usePortfolioStore } from '@/lib/store';
import { Player } from './Player';
import { roomObjects, type RoomObject } from './room-objects';

function MailboxProp() {
  return (
    <group position={[3.02, 0, -1.16]}>
      <mesh castShadow position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 1, 14]} />
        <meshStandardMaterial color="#7a573d" />
      </mesh>
      <mesh castShadow position={[0.02, 0.88, 0]}>
        <boxGeometry args={[0.5, 0.34, 0.34]} />
        <meshStandardMaterial color="#bf5a4f" roughness={0.82} />
      </mesh>
      <mesh castShadow rotation={[0, 0, -0.24]} position={[0.03, 1.02, 0.17]}>
        <boxGeometry args={[0.5, 0.08, 0.14]} />
        <meshStandardMaterial color="#d86b5f" />
      </mesh>
      <mesh castShadow position={[0.24, 0.95, 0]}>
        <boxGeometry args={[0.06, 0.28, 0.04]} />
        <meshStandardMaterial color="#f2d0a4" />
      </mesh>
      <mesh castShadow position={[0.26, 1.06, 0]}>
        <boxGeometry args={[0.12, 0.04, 0.04]} />
        <meshStandardMaterial color="#d44343" />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.28, 18]} />
        <meshStandardMaterial color="#000000" transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

function PortraitProp() {
  return (
    <group position={[-3.69, 0, 0.42]}>
      <mesh castShadow position={[0, 1.62, 0]}>
        <boxGeometry args={[0.08, 1.44, 1.06]} />
        <meshStandardMaterial color="#73492f" />
      </mesh>
      <mesh castShadow position={[0.05, 1.62, 0]}>
        <boxGeometry args={[0.03, 1.24, 0.88]} />
        <meshStandardMaterial color="#c7b38a" />
      </mesh>
      <mesh castShadow position={[0.07, 1.82, 0]}>
        <boxGeometry args={[0.02, 0.18, 0.72]} />
        <meshStandardMaterial color="#35506a" emissive="#6a9dbe" emissiveIntensity={0.08} />
      </mesh>
      <mesh castShadow position={[0.07, 1.48, 0]}>
        <boxGeometry args={[0.02, 0.36, 0.52]} />
        <meshStandardMaterial color="#d9c39d" />
      </mesh>
      <mesh castShadow position={[0.07, 1.46, -0.17]}>
        <boxGeometry args={[0.02, 0.12, 0.14]} />
        <meshStandardMaterial color="#4f3529" />
      </mesh>
    </group>
  );
}

function PosterWallProps() {
  return (
    <group position={[2.02, 0, -2.95]}>
      <mesh castShadow position={[-0.52, 1.75, 0.02]}>
        <boxGeometry args={[0.9, 1.28, 0.03]} />
        <meshStandardMaterial color="#2f4b68" />
      </mesh>
      <mesh castShadow position={[-0.52, 1.76, 0.03]}>
        <boxGeometry args={[0.74, 1.06, 0.02]} />
        <meshStandardMaterial color="#f3ecd7" />
      </mesh>
      <mesh castShadow position={[0.38, 1.98, 0.02]}>
        <boxGeometry args={[0.96, 0.9, 0.03]} />
        <meshStandardMaterial color="#394e63" />
      </mesh>
      <mesh castShadow position={[0.38, 1.98, 0.03]}>
        <boxGeometry args={[0.8, 0.74, 0.02]} />
        <meshStandardMaterial color="#8db8e6" emissive="#99ceff" emissiveIntensity={0.08} />
      </mesh>
      <mesh castShadow rotation={[0, 0, 0.09]} position={[0.88, 1.34, 0.03]}>
        <boxGeometry args={[0.26, 0.34, 0.02]} />
        <meshStandardMaterial color="#f4a261" />
      </mesh>
      <mesh castShadow rotation={[0, 0, -0.07]} position={[0.58, 1.22, 0.03]}>
        <boxGeometry args={[0.28, 0.22, 0.02]} />
        <meshStandardMaterial color="#f1d78c" />
      </mesh>
    </group>
  );
}

function InteractableObject({
  object,
  active,
  onOpen,
}: {
  object: RoomObject;
  active: boolean;
  onOpen: () => void;
}) {
  const markerPosition: [number, number, number] = object.markerPosition ?? [
    object.position[0],
    Math.max(0.2, object.size[1] * 0.2),
    object.position[2],
  ];
  const markerHeight = markerPosition[1];

  return (
    <group>
      <group position={object.position}>
        <mesh onClick={onOpen}>
          <boxGeometry args={object.size} />
          <meshStandardMaterial
            transparent
            opacity={0}
            depthWrite={false}
            color={object.color}
            emissive={active ? '#4b8f8c' : '#000000'}
          />
        </mesh>
      </group>
      <mesh castShadow position={markerPosition}>
        <cylinderGeometry args={[0.1, 0.13, 0.08, 14]} />
        <meshStandardMaterial color={active ? '#f4a261' : '#5a4a3b'} />
      </mesh>
      <mesh position={[markerPosition[0], markerHeight + 0.09, markerPosition[2]]}>
        <sphereGeometry args={[0.07, 14, 14]} />
        <meshStandardMaterial
          color={active ? '#ffd89a' : '#8f7e67'}
          emissive={active ? '#ffbe63' : '#000000'}
          emissiveIntensity={active ? 0.55 : 0}
        />
      </mesh>
      {active ? (
        <Text
          position={[markerPosition[0], markerHeight + 0.35, markerPosition[2]]}
          color="#f8f4e3"
          fontSize={0.14}
          anchorX="center"
          anchorY="middle"
        >
          {object.label}
        </Text>
      ) : null}
      {active ? (
        <Html center position={[markerPosition[0], markerHeight + 0.6, markerPosition[2]]}>
          <button className="world-prompt" onClick={onOpen} type="button">
            E - {object.hint}
          </button>
        </Html>
      ) : null}
    </group>
  );
}

function CameraRig() {
  const playerPosition = usePortfolioStore((state) => state.playerPosition);
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  const lookAt = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    target.set(playerPosition[0], 4.2, playerPosition[2] + 4.9);
    lookAt.set(playerPosition[0], 0.6, playerPosition[2] - 0.35);
    camera.position.lerp(target, 0.08);
    camera.lookAt(lookAt);
  });

  return null;
}

function RoomShell() {
  return (
    <group>
      <mesh receiveShadow position={[0, -0.03, 0]}>
        <boxGeometry args={[7.5, 0.1, 6]} />
        <meshStandardMaterial color="#7f5b3f" />
      </mesh>

      <mesh receiveShadow position={[0, 0.02, 0]}>
        <boxGeometry args={[7.2, 0.02, 5.7]} />
        <meshStandardMaterial color="#91633f" roughness={0.96} metalness={0} />
      </mesh>

      <mesh receiveShadow position={[0, 1.5, -3]}>
        <boxGeometry args={[7.5, 3, 0.12]} />
        <meshStandardMaterial color="#36424d" />
      </mesh>
      <mesh receiveShadow position={[-3.75, 1.5, 0]}>
        <boxGeometry args={[0.12, 3, 6]} />
        <meshStandardMaterial color="#5d4b3f" />
      </mesh>
      <mesh receiveShadow position={[3.75, 1.5, 0]}>
        <boxGeometry args={[0.12, 3, 6]} />
        <meshStandardMaterial color="#5d4b3f" />
      </mesh>
      <mesh receiveShadow position={[0, 3.04, 0]}>
        <boxGeometry args={[7.5, 0.1, 6]} />
        <meshStandardMaterial color="#2f3943" />
      </mesh>

      <mesh receiveShadow position={[0.1, 0.04, 0.5]}>
        <boxGeometry args={[2.9, 0.02, 1.7]} />
        <meshStandardMaterial color="#5f8f82" />
      </mesh>

      <group position={[-2.7, 0, -2.1]}>
        <mesh castShadow receiveShadow position={[0, 0.48, -0.2]}>
          <boxGeometry args={[1.95, 0.14, 0.9]} />
          <meshStandardMaterial color="#5a3f31" />
        </mesh>
        <mesh castShadow position={[-0.88, 0.25, -0.53]}>
          <boxGeometry args={[0.12, 0.46, 0.12]} />
          <meshStandardMaterial color="#4f3529" />
        </mesh>
        <mesh castShadow position={[0.88, 0.25, -0.53]}>
          <boxGeometry args={[0.12, 0.46, 0.12]} />
          <meshStandardMaterial color="#4f3529" />
        </mesh>
        <mesh castShadow position={[-0.88, 0.25, 0.13]}>
          <boxGeometry args={[0.12, 0.46, 0.12]} />
          <meshStandardMaterial color="#4f3529" />
        </mesh>
        <mesh castShadow position={[0.88, 0.25, 0.13]}>
          <boxGeometry args={[0.12, 0.46, 0.12]} />
          <meshStandardMaterial color="#4f3529" />
        </mesh>
        <mesh castShadow position={[0, 0.88, -0.52]}>
          <boxGeometry args={[1.25, 0.82, 0.12]} />
          <meshStandardMaterial color="#1c232a" emissive="#5db6ff" emissiveIntensity={0.12} />
        </mesh>
        <mesh castShadow position={[-0.36, 0.58, -0.26]}>
          <boxGeometry args={[0.45, 0.24, 0.3]} />
          <meshStandardMaterial color="#d6d2c4" />
        </mesh>
        <mesh castShadow position={[0.43, 0.62, -0.34]}>
          <boxGeometry args={[0.24, 0.34, 0.22]} />
          <meshStandardMaterial color="#2a2e37" />
        </mesh>
      </group>

      <group position={[-2.35, 0, 1.8]}>
        <mesh castShadow receiveShadow position={[0, 0.26, 0]}>
          <boxGeometry args={[2.1, 0.42, 1.45]} />
          <meshStandardMaterial color="#8562a1" />
        </mesh>
        <mesh castShadow position={[0, 0.52, 0]}>
          <boxGeometry args={[2.04, 0.08, 1.39]} />
          <meshStandardMaterial color="#cbc2db" />
        </mesh>
        <mesh castShadow position={[-0.75, 0.62, -0.35]}>
          <boxGeometry args={[0.45, 0.22, 0.45]} />
          <meshStandardMaterial color="#f0e4bf" />
        </mesh>
      </group>

      <group position={[2.95, 0, 1.2]}>
        <mesh castShadow receiveShadow position={[0, 0.92, 0]}>
          <boxGeometry args={[0.78, 1.9, 1.58]} />
          <meshStandardMaterial color="#5c4c3b" />
        </mesh>
        <mesh castShadow position={[0, 1.4, 0]}>
          <boxGeometry args={[0.82, 0.04, 1.48]} />
          <meshStandardMaterial color="#735d49" />
        </mesh>
        <mesh castShadow position={[0, 0.95, 0]}>
          <boxGeometry args={[0.82, 0.04, 1.48]} />
          <meshStandardMaterial color="#735d49" />
        </mesh>
        <mesh castShadow position={[0, 0.5, 0]}>
          <boxGeometry args={[0.82, 0.04, 1.48]} />
          <meshStandardMaterial color="#735d49" />
        </mesh>
      </group>

      <group position={[0, 0, -2.82]}>
        <mesh castShadow receiveShadow position={[0, 1.62, 0]}>
          <boxGeometry args={[2.35, 1.48, 0.08]} />
          <meshStandardMaterial color="#4d684a" />
        </mesh>
        <mesh castShadow position={[0, 1.62, 0.05]}>
          <boxGeometry args={[2.13, 1.26, 0.04]} />
          <meshStandardMaterial color="#f2ecd4" />
        </mesh>
      </group>

      <PortraitProp />
      <PosterWallProps />
      <MailboxProp />

      <mesh castShadow position={[0, 2.78, 0.2]}>
        <cylinderGeometry args={[0.22, 0.22, 0.08, 18]} />
        <meshStandardMaterial color="#e8cf9f" emissive="#f0cb84" emissiveIntensity={0.32} />
      </mesh>
    </group>
  );
}

export function RoomScene({ activeObjectId }: { activeObjectId: string | null }) {
  const setOverlay = usePortfolioStore((state) => state.setOverlay);

  return (
    <>
      <color attach="background" args={['#161b22']} />
      <fog attach="fog" args={['#161b22', 7.5, 13]} />
      <ambientLight intensity={0.52} />
      <directionalLight castShadow position={[2.2, 5.1, 2.6]} intensity={0.94} />
      <pointLight position={[-2.7, 1.9, -2.1]} color="#ffd99a" intensity={0.95} />
      <pointLight position={[0.4, 2.85, 0.2]} color="#ffcb80" intensity={0.68} distance={8} />
      <pointLight position={[0.4, 2.1, -2.8]} color="#8ec8ff" intensity={0.4} distance={5.8} />
      <RoomShell />
      {roomObjects.map((object) => (
        <InteractableObject
          active={object.id === activeObjectId}
          key={object.id}
          object={object}
          onOpen={() => setOverlay(object.overlay)}
        />
      ))}
      <Player />
      <CameraRig />
    </>
  );
}
