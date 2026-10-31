import React from 'react';
import {
  RobotConfig,
  COLOR_PRESETS,
  BACKGROUND_PRESETS,
} from '../types/robot';
import { Palette, Sun, Eye, Paintbrush } from 'lucide-react';
import { Translations } from '../i18n/translations';

interface ColorViewProps {
  config: RobotConfig;
  onUpdateConfig: (newConfig: Partial<RobotConfig>) => void;
  onClose: () => void;
  t: Translations;
}

export const ColorView: React.FC<ColorViewProps> = ({
  config,
  onUpdateConfig,
  onClose,
  t,
}) => {
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onUpdateConfig({ eyeColor: val });
  };

  const handleGlowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateConfig({ glowBlur: Number(e.target.value) });
  };

  return (
    <div className="flex flex-col h-full text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Palette className="w-4 h-4 text-emerald-400" />
            {t.colorView.title}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t.colorView.subtitle}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-5 py-3 pb-8">
        {/* Live Eye Color Showcase Preview */}
        <div className="p-4 rounded-2xl bg-black/80 border border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Miniature Glow Eye Pair */}
            <div className="flex items-center gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800/80">
              <div
                className="w-4 h-8 transition-all"
                style={{
                  backgroundColor: config.eyeColor,
                  boxShadow: `0 0 ${config.glowBlur}px ${config.eyeColor}`,
                  borderRadius:
                    config.eyeShape === 'pill'
                      ? '9999px'
                      : config.eyeShape === 'cyber'
                      ? '4px'
                      : '8px',
                }}
              />
              <div
                className="w-4 h-8 transition-all"
                style={{
                  backgroundColor: config.eyeColor,
                  boxShadow: `0 0 ${config.glowBlur}px ${config.eyeColor}`,
                  borderRadius:
                    config.eyeShape === 'pill'
                      ? '9999px'
                      : config.eyeShape === 'cyber'
                      ? '4px'
                      : '8px',
                }}
              />
            </div>

            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>{t.colorView.activeColor}</span>
                <span
                  className="w-3 h-3 rounded-full border border-white/30"
                  style={{ backgroundColor: config.eyeColor }}
                />
              </div>
              <div className="text-xs font-mono text-slate-400 uppercase mt-0.5">
                {config.eyeColor} · {config.glowBlur}px Glow
              </div>
            </div>
          </div>

          {/* Color Picker Native Trigger */}
          <label className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white flex items-center gap-2 cursor-pointer transition-colors active:scale-95 shrink-0">
            <Paintbrush className="w-4 h-4 text-emerald-400" />
            <span>{t.colorView.customBtn}</span>
            <input
              type="color"
              value={config.eyeColor}
              onChange={handleHexChange}
              className="sr-only"
            />
          </label>
        </div>

        {/* Section: Paleta Neón Prediseñada */}
        <div className="space-y-2.5">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
            {t.colorView.neonPalette}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {COLOR_PRESETS.map((preset) => {
              const isSelected = config.eyeColor.toLowerCase() === preset.hex.toLowerCase();
              const localizedName = t.colorView.colorPresets[preset.hex] || preset.name;

              return (
                <button
                  key={preset.hex}
                  type="button"
                  onClick={() =>
                    onUpdateConfig({
                      eyeColor: preset.hex,
                      glowBlur: preset.glow,
                    })
                  }
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-slate-900 border-white/60 shadow-lg ring-1 ring-white/30'
                      : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40'
                  }`}
                >
                  <span
                    className="w-5 h-5 rounded-full shrink-0 border border-white/20 transition-transform"
                    style={{
                      backgroundColor: preset.hex,
                      boxShadow: `0 0 10px ${preset.hex}`,
                    }}
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white truncate">
                      {localizedName}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase">
                      {preset.hex}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section: Intensidad de Resplandor Neón */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-white flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400" />
              {t.colorView.glowIntensity}
            </span>
            <span className="font-mono text-emerald-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              {config.glowBlur} px
            </span>
          </div>

          <input
            type="range"
            min={10}
            max={50}
            step={1}
            value={config.glowBlur}
            onChange={handleGlowChange}
            className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />

          <div className="flex justify-between text-[11px] text-slate-400">
            <span>{t.colorView.glowSubtle}</span>
            <span>{t.colorView.glowStandard}</span>
            <span>{t.colorView.glowUltra}</span>
          </div>
        </div>

        {/* Section: Geometría y Forma del Ojo */}
        <div className="space-y-2.5">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            {t.colorView.shapeTitle}
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'rounded', label: t.colorView.shapes.rounded.label, desc: t.colorView.shapes.rounded.desc },
              { id: 'cyber', label: t.colorView.shapes.cyber.label, desc: t.colorView.shapes.cyber.desc },
              { id: 'pill', label: t.colorView.shapes.pill.label, desc: t.colorView.shapes.pill.desc },
            ].map((shape) => {
              const isActive = config.eyeShape === shape.id;
              return (
                <button
                  key={shape.id}
                  type="button"
                  onClick={() =>
                    onUpdateConfig({
                      eyeShape: shape.id as 'rounded' | 'cyber' | 'pill',
                    })
                  }
                  className={`p-3 rounded-xl border text-center transition-all ${
                    isActive
                      ? 'bg-slate-900 border-emerald-500/80 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900/40'
                  }`}
                >
                  <div className="text-xs font-bold text-white">{shape.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{shape.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section: Fondo de la Pantalla */}
        <div className="space-y-2.5">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
            {t.colorView.bgTitle}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {BACKGROUND_PRESETS.map((bg) => {
              const isSelected = config.backgroundColor === bg.hex;
              const localizedBg = t.colorView.bgPresets[bg.hex] || bg.name;
              return (
                <button
                  key={bg.hex}
                  type="button"
                  onClick={() => onUpdateConfig({ backgroundColor: bg.hex })}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500/80 text-white'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-slate-700 shrink-0"
                    style={{ backgroundColor: bg.hex }}
                  />
                  <span className="text-xs font-medium truncate">{localizedBg}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
