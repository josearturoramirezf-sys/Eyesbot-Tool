import React, { useState } from 'react';
import {
  RobotConfig,
} from '../types/robot';
import {
  Save,
  RotateCcw,
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  VolumeX,
  Sparkles,
} from 'lucide-react';
import { Translations } from '../i18n/translations';

interface SettingsViewProps {
  config: RobotConfig;
  onUpdateConfig: (newConfig: Partial<RobotConfig>) => void;
  onResetToDefault: () => void;
  onSaveToStorage: () => void;
  onClose: () => void;
  t: Translations;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  config,
  onUpdateConfig,
  onResetToDefault,
  onSaveToStorage,
  onClose,
  t,
}) => {
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  const handleSave = () => {
    onSaveToStorage();
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2800);
  };

  const handleConfirmReset = () => {
    onResetToDefault();
    setShowResetConfirm(false);
  };

  // Ready-to-use robot personality profiles
  const applyPreset = (presetName: string) => {
    if (presetName === 'cyber_guardian') {
      onUpdateConfig({
        currentEmotion: 'DEFAULT',
        eyeColor: '#00E5FF',
        glowBlur: 28,
        eyeShape: 'cyber',
        blinkInterval: 5.0,
        blinkMode: 'exact',
        lerpSpeed: 0.12,
        swayAmplitude: 0.8,
      });
    } else if (presetName === 'kawaii_pet') {
      onUpdateConfig({
        currentEmotion: 'CUTE',
        eyeColor: '#FF2A85',
        glowBlur: 26,
        eyeShape: 'rounded',
        blinkInterval: 2.5,
        blinkMode: 'natural',
        lerpSpeed: 0.08,
        swayAmplitude: 1.2,
      });
    } else if (presetName === 'alert_guard') {
      onUpdateConfig({
        currentEmotion: 'ANGRY',
        eyeColor: '#FF1744',
        glowBlur: 32,
        eyeShape: 'cyber',
        blinkInterval: 6.0,
        blinkMode: 'exact',
        lerpSpeed: 0.14,
        swayAmplitude: 0.5,
      });
    } else if (presetName === 'original_droid') {
      onResetToDefault();
    }
  };

  return (
    <div className="flex flex-col h-full text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
            {t.settingsView.title}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t.settingsView.subtitle}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-5 py-3 pb-8">
        {/* LOS DOS BOTONES PRINCIPALES Y CLARAMENTE DIFERENCIADOS */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3.5 shadow-md">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            {t.settingsView.mainActions}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* BOTÓN 1: GUARDAR CONFIGURACIÓN */}
            <button
              type="button"
              onClick={handleSave}
              className={`min-h-[52px] p-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] shadow-lg ${
                saveSuccess
                  ? 'bg-emerald-600 text-white shadow-emerald-500/30'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
              }`}
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  <span>{t.settingsView.saveSuccess}</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 fill-current" />
                  <span>{t.settingsView.saveBtn}</span>
                </>
              )}
            </button>

            {/* BOTÓN 2: BORRAR / RESTABLECER A VALORES DE FÁBRICA */}
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="min-h-[52px] p-3 rounded-xl font-bold text-sm bg-red-950/60 hover:bg-red-900/80 text-red-200 border border-red-700/60 flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] shadow-lg shadow-red-950/20"
            >
              <RotateCcw className="w-5 h-5 text-red-400" />
              <span>{t.settingsView.resetBtn}</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-400 px-1 leading-relaxed">
            {t.settingsView.saveDisclaimer}
          </p>
        </div>

        {/* Modal de confirmación de restablecimiento */}
        {showResetConfirm && (
          <div className="p-4 rounded-2xl bg-red-950/90 border border-red-700 text-white space-y-3 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2 text-red-300 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{t.settingsView.confirmTitle}</span>
            </div>
            <p className="text-xs text-red-200/90 leading-relaxed">
              {t.settingsView.confirmDesc}
            </p>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-slate-300 text-xs font-semibold hover:bg-slate-800"
              >
                {t.settingsView.cancel}
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md"
              >
                {t.settingsView.confirmReset}
              </button>
            </div>
          </div>
        )}

        {/* Perfiles Rápidos (Presets) */}
        <div className="space-y-2.5">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-slate-400" />
            {t.settingsView.presetsTitle}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              {
                id: 'original_droid',
                title: t.settingsView.presets.original.title,
                desc: t.settingsView.presets.original.desc,
                color: '#00BD00',
              },
              {
                id: 'cyber_guardian',
                title: t.settingsView.presets.cyber.title,
                desc: t.settingsView.presets.cyber.desc,
                color: '#00E5FF',
              },
              {
                id: 'kawaii_pet',
                title: t.settingsView.presets.kawaii.title,
                desc: t.settingsView.presets.kawaii.desc,
                color: '#FF2A85',
              },
              {
                id: 'alert_guard',
                title: t.settingsView.presets.alert.title,
                desc: t.settingsView.presets.alert.desc,
                color: '#FF1744',
              },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p.id)}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-left hover:border-slate-700 hover:bg-slate-900/60 transition-all active:scale-95 flex items-start gap-2.5"
              >
                <span
                  className="w-3 h-3 rounded-full mt-0.5 shrink-0"
                  style={{
                    backgroundColor: p.color,
                    boxShadow: `0 0 6px ${p.color}`,
                  }}
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">{p.title}</div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">{p.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sonidos y Retroalimentación */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
              {config.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                {t.settingsView.soundTitle}
              </div>
              <div className="text-[11px] text-slate-400">
                {t.settingsView.soundSubtitle}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onUpdateConfig({ soundEnabled: !config.soundEnabled })}
            className={`min-h-[44px] px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              config.soundEnabled
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {config.soundEnabled ? t.settingsView.soundEnabled : t.settingsView.soundDisabled}
          </button>
        </div>
      </div>
    </div>
  );
};
