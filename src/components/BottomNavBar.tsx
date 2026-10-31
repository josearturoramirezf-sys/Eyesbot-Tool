import React from 'react';
import { Smile, Palette, Clock, SlidersHorizontal, Monitor } from 'lucide-react';

import { Translations } from '../i18n/translations';

export type TabId = 'eyes' | 'emotions' | 'color' | 'timing' | 'settings';

interface BottomNavBarProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  accentColor: string;
  t: Translations;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onSelectTab,
  accentColor,
  t,
}) => {
  const tabs: Array<{
    id: TabId;
    label: string;
    icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  }> = [
    { id: 'eyes', label: t.tabs.eyes, icon: Monitor },
    { id: 'emotions', label: t.tabs.emotions, icon: Smile },
    { id: 'color', label: t.tabs.color, icon: Palette },
    { id: 'timing', label: t.tabs.timing, icon: Clock },
    { id: 'settings', label: t.tabs.settings, icon: SlidersHorizontal },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/85 backdrop-blur-xl border-t border-slate-800/80 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5 transition-transform duration-300"
      aria-label="Navegación principal del robot"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 gap-1 items-center">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`min-h-[52px] min-w-[44px] flex flex-col items-center justify-center rounded-xl transition-all duration-200 relative group active:scale-95 ${
                isActive
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
              aria-selected={isActive}
              role="tab"
            >
              {/* Active Tab Glow Pill Indicator */}
              {isActive && (
                <span
                  className="absolute top-1 w-6 h-0.5 rounded-full"
                  style={{
                    backgroundColor: accentColor,
                    boxShadow: `0 0 10px ${accentColor}`,
                  }}
                />
              )}

              <div
                className={`p-1 rounded-lg transition-transform ${
                  isActive ? 'scale-110' : 'group-hover:scale-105'
                }`}
                style={{
                  color: isActive ? accentColor : undefined,
                }}
              >
                <Icon className="w-5 h-5 stroke-[2.2]" />
              </div>

              <span
                className={`text-[11px] font-medium tracking-tight whitespace-nowrap truncate max-w-[58px] ${
                  isActive ? 'font-semibold text-slate-100' : 'text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
