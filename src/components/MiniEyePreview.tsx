import React, { useEffect, useRef } from 'react';
import { EmotionTarget } from '../types/robot';

interface MiniEyePreviewProps {
  target: EmotionTarget;
  color: string;
  shape?: 'rounded' | 'cyber' | 'pill';
  glowBlur?: number;
  backgroundColor?: string;
  className?: string;
}

export const MiniEyePreview: React.FC<MiniEyePreviewProps> = ({
  target,
  color,
  shape = 'rounded',
  glowBlur = 20,
  backgroundColor = '#0b1120', // Matches slate-950/slate-900 background
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High DPI crisp rendering
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 2 : 2;
    const width = 60;
    const height = 42;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.save();
    ctx.scale(dpr, dpr);

    // Clear background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Standard eye geometry
    const eyeWidth = 14;
    const eyeHeight = 22;
    const spacing = 10;
    const eyeRadius = shape === 'pill' ? eyeWidth / 2 : shape === 'cyber' ? 2 : 4;

    const totalWidth = eyeWidth * 2 + spacing;
    const startX = (width - totalWidth) / 2;
    const baseY = (height - eyeHeight) / 2;
    const midX = width / 2;

    function drawRoundRect(x: number, y: number, w: number, h: number, r: number) {
      if (shape === 'pill') r = w / 2;
      if (w < 2 * r) r = w / 2;
      if (h < 2 * r) r = h / 2;

      ctx!.beginPath();
      if (shape === 'cyber') {
        const chamfer = 2;
        ctx!.moveTo(x + chamfer, y);
        ctx!.lineTo(x + w - chamfer, y);
        ctx!.lineTo(x + w, y + chamfer);
        ctx!.lineTo(x + w, y + h - chamfer);
        ctx!.lineTo(x + w - chamfer, y + h);
        ctx!.lineTo(x + chamfer, y + h);
        ctx!.lineTo(x, y + h - chamfer);
        ctx!.lineTo(x, y + chamfer);
      } else {
        ctx!.moveTo(x + r, y);
        ctx!.arcTo(x + w, y, x + w, y + h, r);
        ctx!.arcTo(x + w, y + h, x, y + h, r);
        ctx!.arcTo(x, y + h, x, y, r);
        ctx!.arcTo(x, y, x + w, y, r);
      }
      ctx!.closePath();
      ctx!.fill();
    }

    function renderSingleEye(x: number, y: number, isLeft: boolean) {
      ctx!.save();

      const effScaleY = Math.max(0.08, target.scaleY);
      const centerY = y + eyeHeight / 2 + eyeHeight * target.offsetEyeY;
      const centerX = x + eyeWidth / 2;

      ctx!.translate(centerX, centerY);
      ctx!.scale(1, effScaleY);
      ctx!.translate(-centerX, -centerY);

      // 1. Draw eye base with subtle neon glow
      const blur = Math.min(glowBlur * 0.25, 5);
      ctx!.shadowColor = color;
      ctx!.shadowBlur = blur;
      ctx!.fillStyle = color;
      drawRoundRect(x, y, eyeWidth, eyeHeight, eyeRadius);

      // 2. Isolate the eyelid cutout so it NEVER bleeds or paints over the adjacent eye
      ctx!.save();
      ctx!.beginPath();
      if (isLeft) {
        ctx!.rect(0, 0, midX, height);
      } else {
        ctx!.rect(midX, 0, width - midX, height);
      }
      ctx!.clip();

      ctx!.shadowBlur = 0;
      ctx!.fillStyle = backgroundColor;

      // Dark polygon with +15% wider coverage to cleanly mask glow and corners
      const padOuter = 7; // enlarged by 15%+
      const padInner = 2; // controlled towards center bridge
      const padLeft = isLeft ? padOuter : padInner;
      const padRight = isLeft ? padInner : padOuter;

      const cutL = isLeft ? target.topL : target.topR;
      const cutR = isLeft ? target.topR : target.topL;

      // Upper eyelid cut (15% wider polygon with clean coverage)
      if (cutL > 0.005 || cutR > 0.005) {
        ctx!.beginPath();
        ctx!.moveTo(x - padLeft, y - 12);
        ctx!.lineTo(x + eyeWidth + padRight, y - 12);
        ctx!.lineTo(x + eyeWidth + padRight, y + eyeHeight * cutR);
        ctx!.lineTo(x - padLeft, y + eyeHeight * cutL);
        ctx!.closePath();
        ctx!.fill();
      }

      // Bottom curved eyelid cut (+15% wider curvature)
      if (target.botC > 0.005) {
        ctx!.beginPath();
        const arcY = y + eyeHeight + eyeHeight * (0.65 - target.botC);
        ctx!.arc(x + eyeWidth / 2, arcY, eyeWidth * 1.09, 0, Math.PI * 2);
        ctx!.fill();
      }

      ctx!.restore(); // Restores eyelid clip
      ctx!.restore(); // Restores scale/translate transform
    }

    // Draw left and right eyes symmetrically
    renderSingleEye(startX, baseY, true);
    renderSingleEye(startX + eyeWidth + spacing, baseY, false);

    ctx.restore();
  }, [target, color, shape, glowBlur, backgroundColor]);

  return (
    <canvas
      ref={canvasRef}
      className={`rounded-lg border border-slate-800/90 shrink-0 ${className}`}
      width={60}
      height={42}
    />
  );
};
