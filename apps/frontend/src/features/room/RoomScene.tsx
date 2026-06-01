'use client';

import { Html, Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useMemo } from 'react';
import * as THREE from 'three';
import { usePortfolioStore } from '@/lib/store';
import { Player } from './Player';
import { roomObjects, type RoomObject } from './room-objects';

function MailboxProp() {
  // swapped with bookshelf: now placed where bookshelf used to be
  return (
    <group position={[2.95, 0, 1.2]}>
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

const floorSeams = [-2.25, -1.7, -1.15, -0.6, -0.05, 0.5, 1.05, 1.6, 2.15] as const;
const deskKeyRows = [-0.5, -0.38, -0.26] as const;
const deskKeyColumns = [-0.42, -0.28, -0.14, 0, 0.14, 0.28, 0.42] as const;
const bookRows = [0.28, 0.72, 1.17, 1.62] as const;
const bookColors = ['#d96c5f', '#e8c36a', '#5d9ca6', '#8f6db6', '#72a66a'] as const;
const whiteboardNotes = [
  { color: '#f1d78c', position: [-0.76, 1.88, 0.09] as [number, number, number], rotation: 0.04 },
  { color: '#f4a261', position: [-0.18, 1.74, 0.09] as [number, number, number], rotation: -0.06 },
  { color: '#8db8e6', position: [0.52, 1.9, 0.09] as [number, number, number], rotation: 0.08 },
  { color: '#9bd58a', position: [0.76, 1.44, 0.09] as [number, number, number], rotation: -0.03 },
] as const;

function FloorDetails() {
  const seamGeo = useMemo(() => new THREE.BoxGeometry(7.12, 0.012, 0.018), []);
  const seamMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#6d4932', roughness: 1 }),
    [],
  );

  return (
    <group>
      {floorSeams.map((z) => (
        <mesh key={z} receiveShadow position={[0, 0.06, z]} geometry={seamGeo} material={seamMat} />
      ))}
      <mesh receiveShadow position={[0.1, 0.075, 0.5]}>
        <boxGeometry args={[3.06, 0.025, 1.86]} />
        <meshStandardMaterial color="#375f58" roughness={0.94} />
      </mesh>
      <mesh receiveShadow position={[0.1, 0.09, -0.36]}>
        <boxGeometry args={[2.76, 0.018, 0.05]} />
        <meshStandardMaterial color="#d7b478" roughness={0.9} />
      </mesh>
      <mesh receiveShadow position={[0.1, 0.09, 1.36]}>
        <boxGeometry args={[2.76, 0.018, 0.05]} />
        <meshStandardMaterial color="#d7b478" roughness={0.9} />
      </mesh>
      <mesh receiveShadow position={[-1.24, 0.09, 0.5]}>
        <boxGeometry args={[0.05, 0.018, 1.64]} />
        <meshStandardMaterial color="#d7b478" roughness={0.9} />
      </mesh>
      <mesh receiveShadow position={[1.44, 0.09, 0.5]}>
        <boxGeometry args={[0.05, 0.018, 1.64]} />
        <meshStandardMaterial color="#d7b478" roughness={0.9} />
      </mesh>
    </group>
  );
}

function BaseboardTrim() {
  const horizontalGeo = useMemo(() => new THREE.BoxGeometry(7.36, 0.16, 0.06), []);
  const verticalGeo = useMemo(() => new THREE.BoxGeometry(0.06, 0.16, 5.78), []);
  const mat1 = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#7e5b42', roughness: 0.9 }),
    [],
  );
  const mat2 = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#806149', roughness: 0.9 }),
    [],
  );

  return (
    <group>
      <mesh receiveShadow position={[0, 0.28, -2.91]} geometry={horizontalGeo} material={mat1} />
      <mesh receiveShadow position={[-3.64, 0.28, 0]} geometry={verticalGeo} material={mat2} />
      <mesh receiveShadow position={[3.64, 0.28, 0]} geometry={verticalGeo} material={mat2} />
    </group>
  );
}

function DeskSetup() {
  const keyGeo = useMemo(() => new THREE.BoxGeometry(0.07, 0.018, 0.045), []);
  const keyMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#c9d0d6', roughness: 0.64 }),
    [],
  );

  return (
    <group position={[-2.7, 0, -2.1]}>
      <mesh castShadow receiveShadow position={[0, 0.48, -0.2]}>
        <boxGeometry args={[1.95, 0.14, 0.9]} />
        <meshStandardMaterial color="#5a3f31" roughness={0.82} />
      </mesh>
      <mesh castShadow position={[-0.88, 0.25, -0.53]}>
        <boxGeometry args={[0.12, 0.46, 0.12]} />
        <meshStandardMaterial color="#4f3529" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0.88, 0.25, -0.53]}>
        <boxGeometry args={[0.12, 0.46, 0.12]} />
        <meshStandardMaterial color="#4f3529" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[-0.88, 0.25, 0.13]}>
        <boxGeometry args={[0.12, 0.46, 0.12]} />
        <meshStandardMaterial color="#4f3529" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0.88, 0.25, 0.13]}>
        <boxGeometry args={[0.12, 0.46, 0.12]} />
        <meshStandardMaterial color="#4f3529" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 0.88, -0.52]}>
        <boxGeometry args={[1.25, 0.82, 0.12]} />
        <meshStandardMaterial color="#1c232a" emissive="#5db6ff" emissiveIntensity={0.14} />
      </mesh>
      <mesh castShadow position={[0, 0.89, -0.45]}>
        <boxGeometry args={[1.03, 0.62, 0.035]} />
        <meshStandardMaterial color="#162c38" emissive="#7fcfff" emissiveIntensity={0.28} />
      </mesh>
      <mesh castShadow position={[0, 0.52, -0.5]}>
        <boxGeometry args={[0.2, 0.16, 0.08]} />
        <meshStandardMaterial color="#2b3038" roughness={0.74} />
      </mesh>
      <mesh castShadow position={[0, 0.48, -0.38]}>
        <boxGeometry args={[0.54, 0.05, 0.16]} />
        <meshStandardMaterial color="#2b3038" roughness={0.74} />
      </mesh>
      <mesh castShadow position={[-0.36, 0.58, -0.26]}>
        <boxGeometry args={[0.45, 0.24, 0.3]} />
        <meshStandardMaterial color="#d6d2c4" roughness={0.7} />
      </mesh>
      <mesh castShadow position={[0.43, 0.62, -0.34]}>
        <boxGeometry args={[0.24, 0.34, 0.22]} />
        <meshStandardMaterial color="#2a2e37" roughness={0.72} />
      </mesh>
      <group position={[0, 0.59, -0.08]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.04, 0.045, 0.34]} />
          <meshStandardMaterial color="#242a31" roughness={0.78} />
        </mesh>
        {deskKeyRows.map((z, rowIndex) =>
          deskKeyColumns.map((x, columnIndex) => (
            <mesh
              castShadow
              key={`${rowIndex}-${columnIndex}`}
              position={[x + rowIndex * 0.035, 0.04, z + 0.34]}
              geometry={keyGeo}
              material={keyMat}
            />
          )),
        )}
      </group>
      <mesh castShadow position={[0.64, 0.61, 0.02]}>
        <boxGeometry args={[0.18, 0.045, 0.28]} />
        <meshStandardMaterial color="#20252c" roughness={0.68} />
      </mesh>
      <group position={[-0.72, 0.63, 0.06]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.07, 0.18, 16]} />
          <meshStandardMaterial color="#f0e4bf" roughness={0.6} />
        </mesh>
        <mesh castShadow position={[0.07, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.05, 0.01, 8, 14]} />
          <meshStandardMaterial color="#f0e4bf" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

function NintendoSwitchProp() {
  return (
    <group position={[3.2, 0.58, 2.05]} rotation={[0, 90, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.3, 0.18, 0.018]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.011]}>
        <boxGeometry args={[0.2, 0.14, 0.002]} />
        <meshStandardMaterial color="#0d1117" emissive="#4fc3f7" emissiveIntensity={0.18} />
      </mesh>
      <mesh castShadow position={[-0.17, 0, 0]}>
        <boxGeometry args={[0.04, 0.18, 0.022]} />
        <meshStandardMaterial color="#e53935" roughness={0.5} />
      </mesh>
      <mesh castShadow position={[0.17, 0, 0]}>
        <boxGeometry args={[0.04, 0.18, 0.022]} />
        <meshStandardMaterial color="#1e88e5" roughness={0.5} />
      </mesh>
      <pointLight position={[0, 0, 0.08]} color="#4fc3f7" intensity={0.1} distance={0.8} />
    </group>
  );
}

function BedProp() {
  return (
    <group position={[-2.35, 0, 1.8]}>
      <mesh castShadow receiveShadow position={[0, 0.26, 0]}>
        <boxGeometry args={[2.1, 0.42, 1.45]} />
        <meshStandardMaterial color="#8562a1" roughness={0.82} />
      </mesh>
      <mesh castShadow position={[0, 0.52, 0]}>
        <boxGeometry args={[2.04, 0.08, 1.39]} />
        <meshStandardMaterial color="#cbc2db" roughness={0.86} />
      </mesh>
      <mesh castShadow position={[0.32, 0.61, 0.2]}>
        <boxGeometry args={[1.36, 0.1, 1.02]} />
        <meshStandardMaterial color="#7e5f9e" roughness={0.84} />
      </mesh>
      <mesh castShadow position={[-0.75, 0.64, -0.35]}>
        <boxGeometry args={[0.5, 0.2, 0.48]} />
        <meshStandardMaterial color="#f0e4bf" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[-1.16, 0.58, 0.86]}>
        <boxGeometry args={[0.42, 0.46, 0.42]} />
        <meshStandardMaterial color="#59402f" roughness={0.88} />
      </mesh>
      <mesh castShadow position={[-1.16, 0.96, 0.86]}>
        <cylinderGeometry args={[0.16, 0.22, 0.22, 18]} />
        <meshStandardMaterial color="#f1c982" emissive="#f2c06e" emissiveIntensity={0.2} />
      </mesh>
      <pointLight position={[-1.16, 1.08, 0.86]} color="#ffd59a" intensity={0.22} distance={2.8} />
    </group>
  );
}

function BookshelfProp() {
  const shelfGeo = useMemo(() => new THREE.BoxGeometry(0.82, 0.04, 1.48), []);
  const shelfMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#735d49', roughness: 0.84 }),
    [],
  );
  const bookGeo1 = useMemo(() => new THREE.BoxGeometry(0.16, 0.34, 0.08), []);
  const bookGeo2 = useMemo(() => new THREE.BoxGeometry(0.16, 0.42, 0.08), []);
  const bookMaterials = useMemo(
    () => bookColors.map((color) => new THREE.MeshStandardMaterial({ color, roughness: 0.78 })),
    [],
  );

  // swapped with mailbox: now placed where mailbox used to be
  return (
    <group position={[3.02, 0, -1.16]}>
      <mesh castShadow receiveShadow position={[0, 0.92, 0]}>
        <boxGeometry args={[0.78, 1.9, 1.58]} />
        <meshStandardMaterial color="#5c4c3b" roughness={0.86} />
      </mesh>
      {bookRows.map((y) => (
        <mesh
          castShadow
          key={`shelf-${y}`}
          position={[0, y, 0]}
          geometry={shelfGeo}
          material={shelfMat}
        />
      ))}
      {bookRows
        .slice(0, -1)
        .map((y, rowIndex) =>
          bookColors.map((color, columnIndex) => (
            <mesh
              castShadow
              key={`${rowIndex}-${color}`}
              position={[0.03, y + 0.18, -0.56 + columnIndex * 0.27 + rowIndex * 0.03]}
              rotation={[0, 0, (columnIndex % 2 === 0 ? 1 : -1) * 0.04]}
              geometry={columnIndex % 2 === 0 ? bookGeo1 : bookGeo2}
              material={bookMaterials[columnIndex]}
            />
          )),
        )}
      <mesh castShadow position={[0.03, 1.82, 0.48]}>
        <boxGeometry args={[0.2, 0.16, 0.2]} />
        <meshStandardMaterial color="#d6bf84" roughness={0.7} />
      </mesh>
    </group>
  );
}

function ProjectBoardProp() {
  return (
    <group position={[0, 0, -2.82]}>
      <mesh castShadow receiveShadow position={[0, 1.62, 0]}>
        <boxGeometry args={[2.35, 1.48, 0.08]} />
        <meshStandardMaterial color="#4d684a" roughness={0.84} />
      </mesh>
      <mesh castShadow position={[0, 1.62, 0.05]}>
        <boxGeometry args={[2.13, 1.26, 0.04]} />
        <meshStandardMaterial color="#f2ecd4" roughness={0.7} />
      </mesh>
      {whiteboardNotes.map((note) => (
        <mesh
          castShadow
          key={`${note.color}-${note.position[0]}`}
          position={note.position}
          rotation={[0, 0, note.rotation]}
        >
          <boxGeometry args={[0.38, 0.3, 0.025]} />
          <meshStandardMaterial color={note.color} roughness={0.82} />
        </mesh>
      ))}
      <mesh castShadow position={[0.16, 1.57, 0.09]} rotation={[0, 0, -0.14]}>
        <boxGeometry args={[1.32, 0.025, 0.02]} />
        <meshStandardMaterial color="#43515b" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[-0.2, 1.36, 0.09]} rotation={[0, 0, 0.08]}>
        <boxGeometry args={[1.02, 0.025, 0.02]} />
        <meshStandardMaterial color="#43515b" roughness={0.8} />
      </mesh>
    </group>
  );
}

function OpenCeilingLight() {
  return (
    <group position={[0.25, 2.94, 0.2]}>
      <mesh castShadow position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.38, 12]} />
        <meshStandardMaterial color="#5e5145" roughness={0.72} />
      </mesh>
      <mesh castShadow position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.28, 0.18, 0.18, 24]} />
        <meshStandardMaterial color="#e8cf9f" emissive="#f0cb84" emissiveIntensity={0.34} />
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
        // place the interaction button at the marker (floor) so the "button" is on the floor
        <Html center position={[markerPosition[0], markerPosition[1] + 0.02, markerPosition[2]]}>
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
      <FloorDetails />

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
      <BaseboardTrim />
      <DeskSetup />
      <NintendoSwitchProp />
      <BedProp />
      <BookshelfProp />
      <ProjectBoardProp />

      <PortraitProp />
      <PosterWallProps />
      <MailboxProp />
      <OpenCeilingLight />
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
      <pointLight position={[3.6, 1.9, 1.05]} color="#ffd99a" intensity={0.95} />
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
