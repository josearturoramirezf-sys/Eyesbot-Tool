import React from 'react';
import {
  RobotConfig,
  EmotionKey,
  EMOTION_METADATA,
} from '../types/robot';
import { Wrench, Play, Pause, Check, Clock } from 'lucide-react';
import { MiniEyePreview } from './MiniEyePreview';
import { Translations } from '../i18n/translations';

interface EmotionsViewProps {
  config: RobotConfig;
  onUpdateConfig: (newConfig: Partial<RobotConfig>) => void;
  onClose: () => void;
  t: Translations;
}

export const EmotionsView: React.FC<EmotionsViewProps> = ({
  config,
  onUpdateConfig,
  onClose,
  t,
}) => {
  const emotionKeys = Object.keys(EMOTION_METADATA) as EmotionKey[];

  const handleSelectEmotion = (emotion: EmotionKey) => {
    onUpdateConfig({
      currentEmotion: emotion,
    });
  };

  const toggleSequentialMode = () => {
    onUpdateConfig({
      isSequentialMode: !config.isSequentialMode,
    });
  };

  const togglePlaylistEmotion = (emotion: EmotionKey) => {
    const exists = config.playlist.some((item) => item.emotion === emotion);
    let updatedPlaylist = [...config.playlist];

    if (exists) {
      updatedPlaylist = updatedPlaylist.map((item) =>
        item.emotion === emotion ? { ...item, enabled: !item.enabled } : item
      );
    } else {
      updatedPlaylist.push({
        emotion,
        duration: config.defaultDuration || 8,
        enabled: true,
      });
    }

    onUpdateConfig({ playlist: updatedPlaylist });
  };

  const updateEmotionDuration = (emotion: EmotionKey, duration: number) => {
    const updatedPlaylist = config.playlist.map((item) =>
      item.emotion === emotion ? { ...item, duration } : item
    );
    onUpdateConfig({ playlist: updatedPlaylist });
  };

  return (
    <div className="flex flex-col h-full text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Wrench className="w-4 h-4 text-emerald-400" />
            {t.emotionsView.title}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t.emotionsView.subtitle}
          </p>
        </div>
      </div>

      {/* Sequential Mode Switcher Banner */}
      <div className="my-3 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSequentialMode}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              config.isSequentialMode
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            aria-label={config.isSequentialMode ? t.emotionsView.pause : t.emotionsView.activateAuto}
          >
            {config.isSequentialMode ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 ml-0.5 fill-current" />
            )}
          </button>
          <div>
            <div className="text-sm font-semibold text-white">
              {config.isSequentialMode ? t.emotionsView.seqActiveTitle : t.emotionsView.seqInactiveTitle}
            </div>
            <div className="text-xs text-slate-400">
              {config.isSequentialMode
                ? t.emotionsView.seqActiveDesc
                : t.emotionsView.seqInactiveDesc}
            </div>
          </div>
        </div>

        <button
          onClick={toggleSequentialMode}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
            config.isSequentialMode
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
              : 'bg-slate-800 text-slate-300 border border-slate-700 hover:text-white'
          }`}
        >
          {config.isSequentialMode ? t.emotionsView.pause : t.emotionsView.activateAuto}
        </button>
      </div>

      {/* Emotion Grid */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2 pb-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1 pt-1">
          {t.emotionsView.catalogTitle}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {emotionKeys.map((key) => {
            const info = EMOTION_METADATA[key];
            const isCurrent = config.currentEmotion === key;
            const playlistItem = config.playlist.find((p) => p.emotion === key);
            const isInPlaylist = playlistItem ? playlistItem.enabled : false;
            const localizedEmotion = t.emotions[key] || { name: info.name, description: info.description };

            return (
              <div
                key={key}
                className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between relative group ${
                  isCurrent
                    ? 'bg-slate-900/90 border-slate-600 shadow-lg ring-1 ring-emerald-500/30'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40'
                }`}
              >
                {/* Main Card Click Area */}
                <button
                  type="button"
                  onClick={() => handleSelectEmotion(key)}
                  className="w-full text-left flex items-start justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {/* NO DOTS / NO CIRCLES - Removed per user request & anti-slop rules */}
                      <span
                        className={`text-sm font-bold truncate ${
                          isCurrent ? 'text-white' : 'text-slate-200'
                        }`}
                      >
                        {localizedEmotion.name}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-1.5 py-0.2 rounded shrink-0">
                          {t.emotionsView.onScreen}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {localizedEmotion.description}
                    </p>
                  </div>

                  {/* Real Canvas Mathematical Preview of the exact emotion */}
                  <MiniEyePreview
                    target={info.target}
                    color={config.eyeColor}
                    shape={config.eyeShape}
                    glowBlur={config.glowBlur}
                    backgroundColor={isCurrent ? '#0f172a' : '#090d16'}
                    className={isCurrent ? 'ring-1 ring-white/30' : ''}
                  />
                </button>

                {/* Sub-bar: Playlist sequence toggle & duration */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/70 flex items-center justify-between gap-2 text-xs">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlaylistEmotion(key);
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-colors ${
                      isInPlaylist
                        ? 'bg-slate-800 text-emerald-400 border border-emerald-900/60'
                        : 'bg-slate-900/80 text-slate-400 hover:text-slate-300 border border-slate-800'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                        isInPlaylist
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                          : 'border-slate-600'
                      }`}
                    >
                      {isInPlaylist && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    <span>{isInPlaylist ? t.emotionsView.inSequence : t.emotionsView.omitted}</span>
                  </button>

                  {isInPlaylist && (
                    <div className="flex items-center gap-1.5 text-slate-400 bg-slate-900/90 px-2 py-0.5 rounded-lg border border-slate-800">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <input
                        type="number"
                        min={1}
                        max={60}
                        value={playlistItem?.duration || config.defaultDuration || 8}
                        onChange={(e) => {
                          const val = Math.max(1, Math.min(60, Number(e.target.value) || 8));
                          updateEmotionDuration(key, val);
                        }}
                        className="w-9 bg-transparent text-right font-mono text-xs text-white focus:outline-none"
                      />
                      <span className="text-[11px] text-slate-400">{t.emotionsView.secondsShort}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
