'use client';

import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import ErrorBoundary from '@/components/ErrorBoundary';
import { AudioManager } from './AudioManager';
import { RoomScene } from './RoomScene';

type RoomStageProps = {
  activeObjectId: string | null;
  nearestHint: string | null;
};

type RenderProfile = {
  antialias: boolean;
  dpr: [number, number];
  powerPreference: WebGLPowerPreference;
  shadows: boolean;
};

type DeviceNavigator = Navigator & {
  deviceMemory?: number;
};

function getRenderProfile(): RenderProfile {
  if (typeof window === 'undefined') {
    return {
      antialias: true,
      dpr: [1, 1.5],
      powerPreference: 'high-performance',
      shadows: true,
    };
  }

  const navigatorWithDeviceMemory = navigator as DeviceNavigator;
  const deviceMemory = navigatorWithDeviceMemory.deviceMemory ?? 8;
  const hardwareConcurrency = navigator.hardwareConcurrency ?? 8;
  const prefersReducedMotion =
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const compactViewport = window.innerWidth < 960;
  const lowPowerDevice =
    deviceMemory <= 4 || hardwareConcurrency <= 4 || prefersReducedMotion || compactViewport;

  return lowPowerDevice
    ? {
        antialias: false,
        dpr: [0.75, 1],
        powerPreference: 'default',
        shadows: false,
      }
    : {
        antialias: true,
        dpr: [1, 1.5],
        powerPreference: 'high-performance',
        shadows: true,
      };
}

export default function RoomStage({ activeObjectId, nearestHint }: RoomStageProps) {
  const renderProfile = useMemo(() => getRenderProfile(), []);

  return (
    <>
      <AudioManager />
      <section className="room-stage" aria-label="Interactive portfolio room">
        <ErrorBoundary>
          <Canvas
            camera={{ position: [0, 4.2, 6.5], fov: 45 }}
            dpr={renderProfile.dpr}
            gl={{
              alpha: false,
              antialias: renderProfile.antialias,
              depth: true,
              failIfMajorPerformanceCaveat: false,
              powerPreference: renderProfile.powerPreference,
              preserveDrawingBuffer: false,
              stencil: false,
            }}
            shadows={renderProfile.shadows}
          >
            <Suspense fallback={null}>
              <RoomScene
                activeObjectId={activeObjectId}
                enableShadows={renderProfile.shadows}
              />
            </Suspense>
          </Canvas>
        </ErrorBoundary>
        <div className="hud">
          <p>{nearestHint ? `Press E: ${nearestHint}` : 'Move near an object'}</p>
        </div>
      </section>
    </>
  );
}
