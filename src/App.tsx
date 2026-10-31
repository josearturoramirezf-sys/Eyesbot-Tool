import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  RobotConfig,
  DEFAULT_ROBOT_CONFIG,
  STORAGE_KEY,
} from './types/robot';
import { toggleFullscreen, isFullscreen } from './utils/fullscreen';
import { getSystemLanguage, TRANSLATIONS, LanguageCode } from './i18n/translations';
import { RobotCanvas } from './components/RobotCanvas';
import { BottomNavBar, TabId } from './components/BottomNavBar';
import { EmotionsView } from './components/EmotionsView';
import { ColorView } from './components/ColorView';
import { TimingsView } from './components/TimingsView';
import { SettingsView } from './components/SettingsView';
import { ChevronDown, Sparkles } from 'lucide-react';

export default function App() {
  // Automatic system language synchronization
  const [lang, setLang] = useState<LanguageCode>(() => getSystemLanguage());

  useEffect(() => {
    const handleLangChange = () => {
      setLang(getSystemLanguage());
    };
    window.addEventListener('languagechange', handleLangChange);
    return () => window.removeEventListener('languagechange', handleLangChange);
  }, []);

  const t = TRANSLATIONS[lang];

  // Load initial config from localStorage if present
  const [config, setConfig] = useState<RobotConfig>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          return { ...DEFAULT_ROBOT_CONFIG, ...parsed };
        }
      } catch (err) {
        console.warn('Could not load stored robot config:', err);
      }
    }
    return DEFAULT_ROBOT_CONFIG;
  });

  // UI state
  const [activeTab, setActiveTab] = useState<TabId>('eyes');
  const [isUiVisible, setIsUiVisible] = useState<boolean>(true);
  const [inFullscreen, setInFullscreen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fullscreen state sync listener
  useEffect(() => {
    const handleFsChange = () => {
      const fs = isFullscreen();
      setInFullscreen(fs);
      if (fs) {
        // Automatically collapse open menus upon entering fullscreen
        setActiveTab('eyes');
      }
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    document.addEventListener('mozfullscreenchange', handleFsChange);
    document.addEventListener('MSFullscreenChange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
      document.removeEventListener('mozfullscreenchange', handleFsChange);
      document.removeEventListener('MSFullscreenChange', handleFsChange);
    };
  }, []);

  const handleToggleFullscreen = useCallback(async () => {
    const fs = await toggleFullscreen();
    setInFullscreen(fs);
    if (fs) {
      setActiveTab('eyes');
    }
  }, []);

  // Trigger blink programmatic ref
  const triggerBlinkRef = useRef<(() => void) | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  }, []);

  const handleUpdateConfig = useCallback((newPartial: Partial<RobotConfig>) => {
    setConfig((prev) => ({
      ...prev,
      ...newPartial,
    }));
  }, []);

  const handleSaveToStorage = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      showToast(t.toasts.saved);
    } catch (err) {
      console.error('Error saving to storage:', err);
    }
  }, [config, showToast, t.toasts.saved]);

  const handleResetToDefault = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setConfig({ ...DEFAULT_ROBOT_CONFIG });
      showToast(t.toasts.reset);
    } catch (err) {
      console.error('Error resetting config:', err);
    }
  }, [showToast, t.toasts.reset]);

  const handleSelectTab = (tab: TabId) => {
    if (tab === 'eyes') {
      // If tapping eyes tab, close drawer to showcase full eyes view
      setActiveTab('eyes');
    } else {
      setActiveTab(tab);
      setIsUiVisible(true);
    }
  };

  const handleClosePanel = () => {
    setActiveTab('eyes');
  };

  const isPanelOpen = activeTab !== 'eyes';

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black select-none font-sans">
      {/* 1. Real-time Fullscreen Robot Animated Eyes Canvas */}
      <RobotCanvas
        config={config}
        onUpdateConfig={handleUpdateConfig}
        isUiVisible={isUiVisible}
        onToggleUiVisibility={() => setIsUiVisible((v) => !v)}
        activeTab={activeTab}
        onSelectTab={(tab) => handleSelectTab(tab as TabId)}
        triggerBlinkRef={triggerBlinkRef}
        inFullscreen={inFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        t={t}
      />

      {/* 2. Slide-up Settings Drawer / Configuration Sheet (Hidden when in fullscreen) */}
      {isPanelOpen && !inFullscreen && (
        <div className="fixed inset-x-0 bottom-0 top-0 z-30 pointer-events-none flex flex-col justify-end">
          {/* Backdrop dimming above drawer on mobile so eyes remain partially visible or interactive */}
          <div
            className="flex-1 pointer-events-auto"
            onClick={handleClosePanel}
            aria-hidden="true"
          />

          <section
            aria-label="Panel de configuración del robot"
            className="pointer-events-auto w-full max-w-xl mx-auto max-h-[75vh] sm:max-h-[70vh] flex flex-col bg-slate-950/95 backdrop-blur-2xl border-t sm:border-x sm:rounded-t-3xl border-slate-800 shadow-2xl pb-20 animate-in slide-in-from-bottom duration-300"
          >
            {/* Grab Handle & Close Bar */}
            <div
              onClick={handleClosePanel}
              className="w-full pt-3 pb-1 flex flex-col items-center justify-center cursor-pointer group shrink-0"
              title="Toca para colapsar y ver ojos a pantalla completa"
            >
              <div className="w-12 h-1.5 bg-slate-700 group-hover:bg-slate-500 rounded-full transition-colors" />
              <div className="flex items-center gap-1 text-[11px] text-slate-500 group-hover:text-slate-300 mt-1">
                <span>Cerrar panel</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Scrollable View Content */}
            <div className="flex-1 px-4 sm:px-6 overflow-y-auto">
              {activeTab === 'emotions' && (
                <EmotionsView
                  config={config}
                  onUpdateConfig={handleUpdateConfig}
                  onClose={handleClosePanel}
                  t={t}
                />
              )}

              {activeTab === 'color' && (
                <ColorView
                  config={config}
                  onUpdateConfig={handleUpdateConfig}
                  onClose={handleClosePanel}
                  t={t}
                />
              )}

              {activeTab === 'timing' && (
                <TimingsView
                  config={config}
                  onUpdateConfig={handleUpdateConfig}
                  onTriggerBlink={() => {
                    if (triggerBlinkRef.current) {
                      triggerBlinkRef.current();
                    }
                  }}
                  onClose={handleClosePanel}
                  t={t}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsView
                  config={config}
                  onUpdateConfig={handleUpdateConfig}
                  onResetToDefault={handleResetToDefault}
                  onSaveToStorage={handleSaveToStorage}
                  onClose={handleClosePanel}
                  t={t}
                />
              )}
            </div>
          </section>
        </div>
      )}

      {/* 3. Fixed Bottom Navigation Bar (Hidden when in fullscreen or when user toggles UI off) */}
      <div
        className={`transition-all duration-300 ${
          isUiVisible && !inFullscreen
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <BottomNavBar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          accentColor={config.eyeColor}
          t={t}
        />
      </div>

      {/* 4. Toast Notification (Only shown outside fullscreen) */}
      {toastMessage && !inFullscreen && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-slate-900/95 backdrop-blur-md border border-emerald-500/50 text-xs font-semibold text-emerald-300 shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </main>
  );
}
