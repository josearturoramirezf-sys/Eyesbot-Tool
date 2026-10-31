import React from 'react';
import { RobotConfig } from '../types/robot';
import { Clock, Eye, Play, Pause, RefreshCw, Zap, Compass } from 'lucide-react';
import { Translations } from '../i18n/translations';

interface TimingsViewProps {
  config: RobotConfig;
  onUpdateConfig: (newConfig: Partial<RobotConfig>) => void;
  onTriggerBlink: () => void;
  onClose: () => void;
  t: Translations;
}

export const TimingsView: React.FC<TimingsViewProps> = ({
  config,
  onUpdateConfig,
  onTriggerBlink,
  onClose,
  t,
}) => {
  const BLINK_PRESETS = [1.5, 2.5, 3.5, 4.0, 5.5, 8.0];
  const DURATION_PRESETS = [4, 6, 8, 10, 15, 20];

  const handleApplyUniformDuration = (duration: number) => {
    const updatedPlaylist = config.playlist.map((item) => ({
      ...item,
      duration,
    }));
    onUpdateConfig({
      defaultDuration: duration,
      playlist: updatedPlaylist,
    });
  };

  return (
    <div className="flex flex-col h-full text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            {t.timingsView.title}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t.timingsView.subtitle}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-5 py-3 pb-8">
        {/* PARPADEO AUTÓNOMO: Card Principal */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-md">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-400" />
                {t.timingsView.blinkTitle}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {t.timingsView.blinkSubtitle}
              </p>
            </div>

            {/* Test Blink Button */}
            <button
              type="button"
              onClick={onTriggerBlink}
              className="min-h-[44px] px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-transform active:scale-95 shadow-md shadow-emerald-500/20 shrink-0"
              title={t.timingsView.blinkNow}
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>{t.timingsView.blinkNow}</span>
            </button>
          </div>

          {/* Current Blink Time Slider & Indicator */}
          <div className="space-y-2 pt-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">{t.timingsView.exactInterval}</span>
              <span className="font-mono text-emerald-400 font-bold text-sm bg-slate-950 px-2.5 py-0.5 rounded border border-slate-800">
                {config.blinkInterval.toFixed(1)} {t.timingsView.seconds}
              </span>
            </div>

            <input
              type="range"
              min={1.0}
              max={12.0}
              step={0.5}
              value={config.blinkInterval}
              onChange={(e) =>
                onUpdateConfig({ blinkInterval: parseFloat(e.target.value) })
              }
              className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
          </div>

          {/* Quick Blink Presets */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {t.timingsView.quickBlinkPresets}
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {BLINK_PRESETS.map((seconds) => {
                const isActive = Math.abs(config.blinkInterval - seconds) < 0.1;
                return (
                  <button
                    key={seconds}
                    type="button"
                    onClick={() => onUpdateConfig({ blinkInterval: seconds })}
                    className={`min-h-[40px] px-2 py-1 rounded-xl text-xs font-mono font-semibold border transition-all active:scale-95 ${
                      isActive
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {seconds}s
                  </button>
                );
              })}
            </div>
          </div>

          {/* Blink Mode Toggle: Exact vs Natural */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-white block">
                {t.timingsView.blinkModeTitle}
              </span>
              <span className="text-[11px] text-slate-400">
                {config.blinkMode === 'exact'
                  ? t.timingsView.blinkModeStrictDesc
                  : t.timingsView.blinkModeNaturalDesc}
              </span>
            </div>

            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => onUpdateConfig({ blinkMode: 'exact' })}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  config.blinkMode === 'exact'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.timingsView.exact}
              </button>
              <button
                type="button"
                onClick={() => onUpdateConfig({ blinkMode: 'natural' })}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  config.blinkMode === 'natural'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.timingsView.natural}
              </button>
            </div>
          </div>
        </div>

        {/* SECUENCIA Y DURACIÓN DE ANIMACIONES */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-md">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-emerald-400" />
                {t.timingsView.seqDurationTitle}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {t.timingsView.seqDurationSubtitle}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                onUpdateConfig({ isSequentialMode: !config.isSequentialMode })
              }
              className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
                config.isSequentialMode
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                  : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}
            >
              {config.isSequentialMode ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>{t.timingsView.active}</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{t.timingsView.paused}</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Duration Presets for Whole Sequence */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {t.timingsView.uniformDurationTitle}
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {DURATION_PRESETS.map((sec) => {
                const isActive = config.defaultDuration === sec;
                return (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => handleApplyUniformDuration(sec)}
                    className={`min-h-[40px] px-2 py-1 rounded-xl text-xs font-mono font-semibold border transition-all active:scale-95 ${
                      isActive
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {sec} {t.timingsView.segShort}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Global Duration Slider */}
          <div className="space-y-2 pt-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">{t.timingsView.baseDuration}</span>
              <span className="font-mono text-emerald-400 font-bold text-sm bg-slate-950 px-2.5 py-0.5 rounded border border-slate-800">
                {config.defaultDuration} s
              </span>
            </div>

            <input
              type="range"
              min={2}
              max={30}
              step={1}
              value={config.defaultDuration}
              onChange={(e) => handleApplyUniformDuration(parseInt(e.target.value) || 8)}
              className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
          </div>
        </div>

        {/* DINÁMICA DE MOVIMIENTO Y TRANSICIONES */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="text-sm font-bold text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-400" />
            {t.timingsView.dynamicsTitle}
          </div>

          {/* Lerp Transition Speed */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">{t.timingsView.lerpSpeedTitle}</span>
              <span className="font-mono text-emerald-400 font-semibold">
                {config.lerpSpeed <= 0.05
                  ? t.timingsView.lerpCinematic
                  : config.lerpSpeed <= 0.09
                  ? t.timingsView.lerpSmooth
                  : t.timingsView.lerpFast}
              </span>
            </div>
            <input
              type="range"
              min={0.04}
              max={0.16}
              step={0.01}
              value={config.lerpSpeed}
              onChange={(e) =>
                onUpdateConfig({ lerpSpeed: parseFloat(e.target.value) })
              }
              className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
          </div>

          {/* Sway & Pointer toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-800">
            <label className="min-h-[44px] flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 cursor-pointer hover:bg-slate-950">
              <span className="text-xs font-medium text-slate-300">
                {t.timingsView.swayTitle}
              </span>
              <input
                type="checkbox"
                checked={config.swayEnabled}
                onChange={(e) => onUpdateConfig({ swayEnabled: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-500 accent-emerald-500 cursor-pointer"
              />
            </label>

            <label className="min-h-[44px] flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 cursor-pointer hover:bg-slate-950">
              <span className="text-xs font-medium text-slate-300">
                {t.timingsView.followPointerTitle}
              </span>
              <input
                type="checkbox"
                checked={config.followPointer}
                onChange={(e) => onUpdateConfig({ followPointer: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-500 accent-emerald-500 cursor-pointer"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
