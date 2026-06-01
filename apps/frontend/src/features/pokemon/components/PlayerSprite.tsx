'use client';

import React, { useEffect, useRef } from 'react';

const SPRITE_SHEET = '/assets/models/man-character-spritesheet.png';
const FRAME_WIDTH = 50;
const FRAME_HEIGHT = 50;
const ROWS = 5;

type Props = {
  alt?: string;
  width?: number;
  height?: number;
};

export default function PlayerSprite({ alt = 'Marco', width = 132, height = 132 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const image = new Image();
    image.src = SPRITE_SHEET;
    imageRef.current = image;

    let mounted = true;

    const draw = () => {
      if (!mounted) return;

      const canvas = canvasRef.current;
      if (!canvas || !image.complete || image.width === 0 || image.height === 0) return;

      const context = canvas.getContext('2d');
      if (!context) return;

      const frameX = 0;
      const frameY = Math.min(3, ROWS - 1);
      const sourceX = frameX * FRAME_WIDTH;
      const sourceY = frameY * FRAME_HEIGHT;

      context.imageSmoothingEnabled = false;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(
        image,
        sourceX,
        sourceY,
        FRAME_WIDTH,
        FRAME_HEIGHT,
        0,
        0,
        canvas.width,
        canvas.height,
      );
    };

    const onLoad = () => draw();
    image.addEventListener('load', onLoad);

    draw();

    return () => {
      mounted = false;
      image.removeEventListener('load', onLoad);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;

    const image = imageRef.current;
    if (!image || !image.complete || image.width === 0 || image.height === 0) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.imageSmoothingEnabled = false;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, FRAME_HEIGHT * 3, FRAME_WIDTH, FRAME_HEIGHT, 0, 0, width, height);
  }, [width, height]);

  return (
    <div className="player-sprite" aria-label={alt}>
      <canvas ref={canvasRef} className="player-sprite-canvas" />
    </div>
  );
}
