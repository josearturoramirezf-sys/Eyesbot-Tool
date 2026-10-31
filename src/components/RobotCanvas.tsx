import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  RobotConfig,
  EMOTION_METADATA,
  EmotionKey,
  EmotionTarget,
} from '../types/robot';
import { toggleFullscreen, isFullscreen } from '../utils/fullscreen';
import { playBlinkSound, playEmotionChirp } from '../utils/audio';
import { Maximize2, Minimize2, Sliders, Volume2, VolumeX, Eye } from 'lucide-react';

import { Translations } from '../i18n/translations';

interface RobotCanvasProps {
  config: RobotConfig;
  onUpdateConfig: (newConfig: Partial<RobotConfig>) => void;
  isUiVisible: boolean;
  onToggleUiVisibility: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  triggerBlinkRef: React.MutableRefObject<(() => void) | null>;
  inFullscreen: boolean;
  onToggleFullscreen: () => void;
  t: Translations;
}

export const RobotCanvas: React.FC<RobotCanvasProps> = ({
  config,
  onUpdateConfig,
  isUiVisible,
  onToggleUiVisibility,
  activeTab,
  onSelectTab,
  triggerBlinkRef,
  inFullscreen,
  onToggleFullscreen,
  t,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState<number>(0);
  const [playlistProgress, setPlaylistProgress] = useState<number>(0);

  // References for animation loop to avoid re-binding
  const animStateRef = useRef<EmotionTarget>({
    ...EMOTION_METADATA[config.currentEmotion].target,
  });
  const configRef = useRef(config);
  configRef.current = config;

  const blinkScaleYRef = useRef<number>(1.0);
  const isBlinkingRef = useRef<boolean>(false);
  const nextBlinkTimeRef = useRef<number>(Date.now() + 2000);
  const manualBlinkTriggeredRef = useRef<boolean>(false);

  // Pointer tracking for interactive eye look
  const pointerLookRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  // Track sequence timing
  const sequenceStartTimeRef = useRef<number>(Date.now());
  const activeEmotionRef = useRef<EmotionKey>(config.currentEmotion);

  // Double tap detection
  const lastTapTimeRef = useRef<number>(0);

  // Expose trigger manual blink
  useEffect(() => {
    triggerBlinkRef.current = () => {
      manualBlinkTriggeredRef.current = true;
      isBlinkingRef.current = true;
    };
    return () => {
      triggerBlinkRef.current = null;
    };
  }, [triggerBlinkRef]);

  // When config.currentEmotion changes in manual mode
  useEffect(() => {
    if (!config.isSequentialMode) {
      activeEmotionRef.current = config.currentEmotion;
      if (config.soundEnabled) {
        playEmotionChirp(config.currentEmotion);
      }
    }
  }, [config.currentEmotion, config.isSequentialMode, config.soundEnabled]);

  // Screen interaction handlers (Double tap & Pointer follow)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const currentTime = Date.now();
    const tapLength = currentTime - lastTapTimeRef.current;
    if (tapLength < 320 && tapLength > 40) {
      onToggleFullscreen();
    }
    lastTapTimeRef.current = currentTime;

    if (config.followPointer && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      pointerLookRef.current.targetX = normX * 0.35;
      pointerLookRef.current.targetY = normY * 0.25;
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (config.followPointer && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      pointerLookRef.current.targetX = Math.max(-0.45, Math.min(0.45, normX * 0.4));
      pointerLookRef.current.targetY = Math.max(-0.35, Math.min(0.35, normY * 0.3));
    }
  };

  const handlePointerLeave = () => {
    pointerLookRef.current.targetX = 0;
    pointerLookRef.current.targetY = 0;
  };

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isRunning = true;

    function lerp(start: number, end: number, amt: number) {
      return (1 - amt) * start + amt * end;
    }

    function drawRoundRect(
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      w: number,
      h: number,
      r: number,
      shape: 'rounded' | 'cyber' | 'pill'
    ) {
      if (shape === 'pill') {
        r = w / 2;
      }
      if (w < 2 * r) r = w / 2;
      if (h < 2 * r) r = h / 2;

      context.beginPath();
      if (shape === 'cyber') {
        // Chamfered cyber edges
        const chamfer = Math.min(r * 0.9, 18);
        context.moveTo(x + chamfer, y);
        context.lineTo(x + w - chamfer, y);
        context.lineTo(x + w, y + chamfer);
        context.lineTo(x + w, y + h - chamfer);
        context.lineTo(x + w - chamfer, y + h);
        context.lineTo(x + chamfer, y + h);
        context.lineTo(x, y + h - chamfer);
        context.lineTo(x, y + chamfer);
        context.closePath();
      } else {
        context.moveTo(x + r, y);
        context.arcTo(x + w, y, x + w, y + h, r);
        context.arcTo(x + w, y + h, x, y + h, r);
        context.arcTo(x, y + h, x, y, r);
        context.arcTo(x, y, x + w, y, r);
        context.closePath();
      }
      context.fill();
    }

    function drawEye(
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      w: number,
      h: number,
      radius: number,
      isLeft: boolean,
      cfg: RobotConfig,
      state: EmotionTarget,
      blinkScale: number,
      lookOffsetX: number,
      lookOffsetY: number
    ) {
      context.save();

      const effScaleY = Math.max(0.04, state.scaleY * blinkScale);
      const centerY = y + h / 2 + h * state.offsetEyeY + lookOffsetY;
      const centerX = x + w / 2 + lookOffsetX;

      context.translate(centerX, centerY);
      context.scale(1, effScaleY);
      context.translate(-centerX, -centerY);

      // Neon Glow effect
      const glow = cfg.glowBlur || 25;
      context.shadowColor = cfg.eyeColor;
      context.shadowBlur = glow;

      // Base eye fill
      context.fillStyle = cfg.eyeColor;
      drawRoundRect(context, x, y, w, h, radius, cfg.eyeShape);

      // Additional interior bright core for hyper-neon realism
      if (glow > 15) {
        context.shadowBlur = Math.min(glow * 0.5, 12);
        context.fillStyle = cfg.eyeColor;
        drawRoundRect(context, x, y, w, h, radius, cfg.eyeShape);
      }

      // Cut out eyelids using the background color with excess padding to block the glow
      context.shadowBlur = 0;
      context.fillStyle = cfg.backgroundColor || '#030314';
      const pad = w * 0.7;

      const cutL = isLeft ? state.topL : state.topR;
      const cutR = isLeft ? state.topR : state.topL;

      // Upper eyelid cut
      if (cutL > 0.005 || cutR > 0.005) {
        context.beginPath();
        context.moveTo(x - pad, y - pad);
        context.lineTo(x + w + pad, y - pad);
        context.lineTo(x + w + pad, y + h * cutR);
        context.lineTo(x - pad, y + h * cutL);
        context.closePath();
        context.fill();
      }

      // Bottom curved eyelid cut (for kawaii / cute happy curved eyes)
      if (state.botC > 0.005) {
        context.beginPath();
        const arcY = y + h + h * (0.65 - state.botC);
        context.arc(x + w / 2, arcY, w * 0.95, 0, Math.PI * 2);
        context.fill();
      }

      context.restore();
    }

    const render = (time: number) => {
      if (!isRunning) return;
      const currentConfig = configRef.current;

      // Ensure canvas matches window dimensions smoothly
      const cWidth = window.innerWidth;
      const cHeight = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;

      if (canvas.width !== cWidth * dpr || canvas.height !== cHeight * dpr) {
        canvas.width = cWidth * dpr;
        canvas.height = cHeight * dpr;
        canvas.style.width = `${cWidth}px`;
        canvas.style.height = `${cHeight}px`;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Background clear
      ctx.fillStyle = currentConfig.backgroundColor || '#030314';
      ctx.fillRect(0, 0, cWidth, cHeight);

      // 1. Handle Sequential Mode Playlist advancement
      const enabledPlaylist = currentConfig.playlist.filter((p) => p.enabled);
      if (currentConfig.isSequentialMode && enabledPlaylist.length > 0) {
        const now = Date.now();
        const activeItem = enabledPlaylist[currentPlaylistIndex % enabledPlaylist.length];
        const itemDuration = (activeItem?.duration || currentConfig.defaultDuration || 8) * 1000;
        const elapsed = now - sequenceStartTimeRef.current;

        setPlaylistProgress(Math.min(100, (elapsed / itemDuration) * 100));

        if (elapsed >= itemDuration) {
          const nextIndex = (currentPlaylistIndex + 1) % enabledPlaylist.length;
          setCurrentPlaylistIndex(nextIndex);
          const nextItem = enabledPlaylist[nextIndex];
          activeEmotionRef.current = nextItem.emotion;
          sequenceStartTimeRef.current = now;

          if (currentConfig.soundEnabled) {
            playEmotionChirp(nextItem.emotion);
          }
          onUpdateConfig({ currentEmotion: nextItem.emotion });
        }
      }

      // 2. Autonomous & Manual Blinking Engine
      const now = Date.now();
      if ((now > nextBlinkTimeRef.current || manualBlinkTriggeredRef.current) && !isBlinkingRef.current) {
        isBlinkingRef.current = true;
        manualBlinkTriggeredRef.current = false;
        if (currentConfig.soundEnabled) {
          playBlinkSound();
        }
      }

      if (isBlinkingRef.current) {
        blinkScaleYRef.current -= 0.22;
        if (blinkScaleYRef.current <= 0.04) {
          blinkScaleYRef.current = 0.04;
          isBlinkingRef.current = false;

          // Schedule next blink based on config
          const baseInterval = (currentConfig.blinkInterval || 4.0) * 1000;
          if (currentConfig.blinkMode === 'natural') {
            const jitter = (Math.random() - 0.5) * 1800;
            nextBlinkTimeRef.current = now + Math.max(1200, baseInterval + jitter);
          } else {
            nextBlinkTimeRef.current = now + Math.max(800, baseInterval);
          }
        }
      } else {
        if (blinkScaleYRef.current < 1.0) {
          blinkScaleYRef.current += 0.22;
          if (blinkScaleYRef.current > 1.0) blinkScaleYRef.current = 1.0;
        }
      }

      // 3. Interpolate Emotion Shape (Lerp)
      const targetMood = EMOTION_METADATA[activeEmotionRef.current]?.target || EMOTION_METADATA.DEFAULT.target;
      const speed = currentConfig.lerpSpeed || 0.08;
      const animState = animStateRef.current;

      animState.topL = lerp(animState.topL, targetMood.topL, speed);
      animState.topR = lerp(animState.topR, targetMood.topR, speed);
      animState.botC = lerp(animState.botC, targetMood.botC, speed);
      animState.scaleY = lerp(animState.scaleY, targetMood.scaleY, speed);
      animState.offsetEyeY = lerp(animState.offsetEyeY, targetMood.offsetEyeY, speed);

      // 4. Pointer smooth follow
      const pointer = pointerLookRef.current;
      pointer.x = lerp(pointer.x, pointer.targetX, 0.1);
      pointer.y = lerp(pointer.y, pointer.targetY, 0.1);

      // 5. Geometry calculation
      const isLandscape = cWidth > cHeight;
      const baseDim = isLandscape ? cHeight : cWidth;
      const scaleMultiplier = currentConfig.eyeScale || 1.0;
      const spacingMultiplier = currentConfig.eyeSpacing || 1.0;

      const eyeWidth = baseDim * 0.28 * scaleMultiplier;
      const eyeHeight = eyeWidth * 1.48;
      const eyeRadius =
        currentConfig.eyeShape === 'pill'
          ? eyeWidth / 2
          : currentConfig.eyeShape === 'cyber'
          ? eyeWidth * 0.18
          : eyeWidth * 0.30;

      const centerDist = (isLandscape ? cWidth * 0.22 : cWidth * 0.26) * spacingMultiplier;
      const leftEyeX = cWidth / 2 - centerDist - eyeWidth / 2;
      const rightEyeX = cWidth / 2 + centerDist - eyeWidth / 2;
      const eyeY = cHeight / 2 - eyeHeight / 2;

      // 6. Organic Sway calculation
      const swayAmp = currentConfig.swayEnabled ? currentConfig.swayAmplitude || 1.0 : 0;
      const maxOffsetX = eyeWidth * 0.18 * swayAmp;
      const speedX = 0.0012;
      const speedY = 0.0008;
      const swayOffset = Math.sin(time * speedX) * maxOffsetX;
      const verticalSway = Math.cos(time * speedY) * (eyeHeight * 0.04 * swayAmp);

      const lookPixelX = pointer.x * (eyeWidth * 0.8);
      const lookPixelY = pointer.y * (eyeHeight * 0.5);

      const currentLeftX = leftEyeX + swayOffset;
      const currentRightX = rightEyeX + swayOffset;
      const currentEyeY = eyeY + verticalSway;

      // Draw Left and Right eyes
      drawEye(
        ctx,
        currentLeftX,
        currentEyeY,
        eyeWidth,
        eyeHeight,
        eyeRadius,
        true,
        currentConfig,
        animState,
        blinkScaleYRef.current,
        lookPixelX,
        lookPixelY
      );

      drawEye(
        ctx,
        currentRightX,
        currentEyeY,
        eyeWidth,
        eyeHeight,
        eyeRadius,
        false,
        currentConfig,
        animState,
        blinkScaleYRef.current,
        lookPixelX,
        lookPixelY
      );

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
    };
  }, [onUpdateConfig, currentPlaylistIndex]);

  const activeEmotionInfo = EMOTION_METADATA[config.currentEmotion] || EMOTION_METADATA.DEFAULT;
  const localizedEmotionName = t.emotions[config.currentEmotion]?.name || activeEmotionInfo.name;

  return (
    <div className="relative w-full h-full overflow-hidden bg-black select-none touch-none">
      {/* Real-time WebGL/2D Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onDoubleClick={onToggleFullscreen}
        className="w-full h-full block cursor-pointer"
        title={
          inFullscreen
            ? t.header.doubleTapExitHint
            : t.header.doubleTapHint
        }
      />

      {/* Floating Header Overlay: Shown ONLY when NOT in fullscreen */}
      {!inFullscreen && (
        <div
          className={`absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none transition-opacity duration-300 z-30 ${
            isUiVisible ? 'opacity-100' : 'opacity-0 hover:opacity-100'
          }`}
        >
          {/* Left: Active Emotion Status & Sequence Indicator */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={() => onSelectTab('emotions')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-xs font-medium text-slate-200 hover:bg-slate-800 transition-colors shadow-lg active:scale-95"
              title={localizedEmotionName}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shadow-sm"
                style={{ backgroundColor: config.eyeColor }}
              />
              <span className="font-semibold tracking-wide text-white">
                {localizedEmotionName}
              </span>
              {config.isSequentialMode && (
                <span className="text-[10px] text-emerald-400 font-mono tracking-tight ml-1 px-1.5 py-0.5 rounded bg-emerald-950/70 border border-emerald-800/60">
                  {t.header.auto}
                </span>
              )}
            </button>

            {config.isSequentialMode && (
              <div className="hidden sm:flex items-center w-24 h-1.5 bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/50">
                <div
                  className="h-full bg-emerald-400 transition-all duration-150 rounded-full"
                  style={{ width: `${playlistProgress}%` }}
                />
              </div>
            )}
          </div>

          {/* Right: Floating Quick Actions (Audio, Toggle UI, Fullscreen) */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Sound Toggle */}
            <button
              onClick={() => onUpdateConfig({ soundEnabled: !config.soundEnabled })}
              className={`min-h-[44px] min-w-[44px] rounded-full backdrop-blur-md border flex items-center justify-center transition-all active:scale-90 ${
                config.soundEnabled
                  ? 'bg-slate-800/90 text-emerald-400 border-emerald-500/40 shadow-lg'
                  : 'bg-slate-900/70 text-slate-400 border-slate-800/60 hover:text-slate-200'
              }`}
              title={config.soundEnabled ? t.header.soundOn : t.header.soundOff}
              aria-label="Sound"
            >
              {config.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            {/* Toggle Fullscreen Floating Icon */}
            <button
              onClick={onToggleFullscreen}
              className="min-h-[44px] min-w-[44px] rounded-full backdrop-blur-md border flex items-center justify-center transition-all active:scale-90 bg-slate-900/80 text-white border-slate-700/80 hover:bg-slate-800 hover:border-slate-600"
              title={t.header.fullscreen}
              aria-label="Fullscreen"
            >
              <Maximize2 className="w-5 h-5" />
            </button>

            {/* Toggle Controls/Ajustes Visibility */}
            <button
              onClick={onToggleUiVisibility}
              className={`min-h-[44px] min-w-[44px] rounded-full backdrop-blur-md border flex items-center justify-center transition-all active:scale-90 ${
                isUiVisible
                  ? 'bg-slate-800/90 text-white border-slate-600'
                  : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-white'
              }`}
              title={isUiVisible ? t.header.hideUi : t.header.showUi}
              aria-label="UI Visibility"
            >
              {isUiVisible ? <Eye className="w-5 h-5" /> : <Sliders className="w-5 h-5" />}
            </button>
          </div>
        </div>
      )}

      {/* Floating Hint when in pure mode without UI (ONLY when NOT in fullscreen) */}
      {!inFullscreen && !isUiVisible && (
        <div
          onClick={onToggleUiVisibility}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-slate-900/60 backdrop-blur-md border border-slate-800 text-[11px] text-slate-400 opacity-40 hover:opacity-100 transition-opacity cursor-pointer z-20 pointer-events-auto"
        >
          {t.header.tapToSettingsHint}
        </div>
      )}
    </div>
  );
};
