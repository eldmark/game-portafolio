'use client';

import React, { useEffect, useRef, useState } from 'react';

const SPRITE_MAP: Record<string, string> = {
  alex: '/assets/models/gangster-pixel-character-sprite-sheets-pack/Junior/Idle.png',
  diana: '/assets/models/gangster-pixel-character-sprite-sheets-pack/mid/Run.png',
  rafael: '/assets/models/gangster-pixel-character-sprite-sheets-pack/Senior/Idle.png',
};

type Props = {
  opponentId: string;
  alt?: string;
  width?: number; // display width in px
  height?: number; // display height in px
  fps?: number;
};

export default function PokemonSprite({
  opponentId,
  alt,
  width = 120,
  height = 120,
  fps = 8,
}: Props) {
  const src = SPRITE_MAP[opponentId] ?? '/assets/models/man-character-spritesheet.png';
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [frames, setFrames] = useState(1);
  const frameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    imgRef.current = img;
    let mounted = true;

    const onLoad = () => {
      if (!mounted) return;
      const imgW = img.width;
      const imgH = img.height;
      // Assume horizontal strip where each frame is square (height == frame height)
      const assumedFrame = imgH || imgW; // avoid 0
      const count = assumedFrame > 0 ? Math.max(1, Math.floor(imgW / assumedFrame)) : 1;
      setFrames(count);
      drawFrame(0, img, count, assumedFrame);
      startLoop(img, count, assumedFrame);
    };

    const onError = () => {
      // fallback: do nothing
    };

    img.addEventListener('load', onLoad);
    img.addEventListener('error', onError);

    return () => {
      mounted = false;
      img.removeEventListener('load', onLoad);
      img.removeEventListener('error', onError);
      stopLoop();
    };
  }, [src, fps, width, height]);

  function drawFrame(idx: number, img: HTMLImageElement, count: number, frameSize: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // pixel art crisp
    ctx.imageSmoothingEnabled = false;
    // source frame box
    const sx = Math.min(idx * frameSize, img.width - frameSize);
    const sy = 0;
    const sWidth = frameSize;
    const sHeight = frameSize;
    // clear and draw scaled to canvas size
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
  }

  function startLoop(img: HTMLImageElement, count: number, frameSize: number) {
    stopLoop();
    if (count <= 1) return;
    const ms = 1000 / Math.max(1, fps);
    intervalRef.current = window.setInterval(() => {
      frameRef.current = (frameRef.current + 1) % count;
      drawFrame(frameRef.current, img, count, frameSize);
    }, ms);
  }

  function stopLoop() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }

  // update canvas size when props change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
    // redraw current frame
    const img = imgRef.current;
    if (img) {
      const frameSize = img.height || img.width;
      drawFrame(frameRef.current, img, frames, frameSize);
    }
  }, [width, height, frames]);

  return (
    <div
      style={{
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-label={alt ?? opponentId}
    >
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }}
      />
    </div>
  );
}
