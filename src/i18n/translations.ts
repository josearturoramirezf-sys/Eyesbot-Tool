import { EmotionKey } from '../types/robot';

export type LanguageCode = 'es' | 'en';

export function getSystemLanguage(): LanguageCode {
  if (typeof navigator === 'undefined') return 'es';
  const lang = (navigator.language || (navigator.languages && navigator.languages[0]) || 'es').toLowerCase();
  if (lang.startsWith('es')) return 'es';
  return 'en';
}

export interface Translations {
  tabs: {
    eyes: string;
    emotions: string;
    color: string;
    timing: string;
    settings: string;
  };
  header: {
    auto: string;
    soundOn: string;
    soundOff: string;
    fullscreen: string;
    exitFullscreen: string;
    showUi: string;
    hideUi: string;
    doubleTapHint: string;
    doubleTapExitHint: string;
    tapToSettingsHint: string;
  };
  emotionsView: {
    title: string;
    subtitle: string;
    seqActiveTitle: string;
    seqInactiveTitle: string;
    seqActiveDesc: string;
    seqInactiveDesc: string;
    pause: string;
    activateAuto: string;
    catalogTitle: string;
    onScreen: string;
    inSequence: string;
    omitted: string;
    secondsShort: string;
  };
  emotions: Record<EmotionKey, { name: string; description: string }>;
  colorView: {
    title: string;
    subtitle: string;
    activeColor: string;
    customBtn: string;
    neonPalette: string;
    glowIntensity: string;
    glowSubtle: string;
    glowStandard: string;
    glowUltra: string;
    shapeTitle: string;
    shapes: {
      rounded: { label: string; desc: string };
      cyber: { label: string; desc: string };
      pill: { label: string; desc: string };
    };
    bgTitle: string;
    bgPresets: Record<string, string>;
    colorPresets: Record<string, string>;
  };
  timingsView: {
    title: string;
    subtitle: string;
    blinkTitle: string;
    blinkSubtitle: string;
    blinkNow: string;
    exactInterval: string;
    seconds: string;
    quickBlinkPresets: string;
    blinkModeTitle: string;
    blinkModeStrictDesc: string;
    blinkModeNaturalDesc: string;
    exact: string;
    natural: string;
    seqDurationTitle: string;
    seqDurationSubtitle: string;
    active: string;
    paused: string;
    uniformDurationTitle: string;
    segShort: string;
    baseDuration: string;
    dynamicsTitle: string;
    lerpSpeedTitle: string;
    lerpCinematic: string;
    lerpSmooth: string;
    lerpFast: string;
    swayTitle: string;
    followPointerTitle: string;
  };
  settingsView: {
    title: string;
    subtitle: string;
    mainActions: string;
    saveBtn: string;
    saveSuccess: string;
    resetBtn: string;
    saveDisclaimer: string;
    confirmTitle: string;
    confirmDesc: string;
    cancel: string;
    confirmReset: string;
    presetsTitle: string;
    presets: {
      original: { title: string; desc: string };
      cyber: { title: string; desc: string };
      kawaii: { title: string; desc: string };
      alert: { title: string; desc: string };
    };
    soundTitle: string;
    soundSubtitle: string;
    soundEnabled: string;
    soundDisabled: string;
  };
  toasts: {
    saved: string;
    reset: string;
  };
}

export const TRANSLATIONS: Record<LanguageCode, Translations> = {
  es: {
    tabs: {
      eyes: 'Rostro',
      emotions: 'Emociones',
      color: 'Color',
      timing: 'Tiempos',
      settings: 'Ajustes',
    },
    header: {
      auto: 'AUTO',
      soundOn: 'Sonidos droide activados',
      soundOff: 'Sonidos desactivados',
      fullscreen: 'Activar pantalla completa continua',
      exitFullscreen: 'Salir de pantalla completa',
      showUi: 'Mostrar panel de control',
      hideUi: 'Ocultar panel de control (Modo Solo Ojos)',
      doubleTapHint: 'Doble toque en cualquier zona vacía para alternar pantalla completa',
      doubleTapExitHint: 'Doble toque para salir de pantalla completa',
      tapToSettingsHint: 'Doble toque para pantalla completa · Toca para mostrar ajustes',
    },
    emotionsView: {
      title: 'Estados Emocionales del Robot',
      subtitle: 'Selecciona una expresión instantánea o activa el ciclo automático.',
      seqActiveTitle: 'Modo Secuencial Activo',
      seqInactiveTitle: 'Modo Expresión Fija',
      seqActiveDesc: 'Alternando emociones continuamente según la lista',
      seqInactiveDesc: 'Manteniendo la emoción seleccionada',
      pause: 'Pausar',
      activateAuto: 'Activar Auto',
      catalogTitle: 'Catálogo de Emociones',
      onScreen: 'En pantalla',
      inSequence: 'En Secuencia',
      omitted: 'Omitida',
      secondsShort: 's',
    },
    emotions: {
      DEFAULT: {
        name: 'Normal / Neutro',
        description: 'Expresión estándar equilibrada y despierta',
      },
      TIRED: {
        name: 'Cansado',
        description: 'Párpados superiores caídos con leve pesadez',
      },
      SAD: {
        name: 'Triste',
        description: 'Corte oblicuo hacia afuera con mirada decaída',
      },
      ANGRY: {
        name: 'Enojado',
        description: 'Corte agudo e intenso hacia el entrecejo',
      },
      SUSPICIOUS: {
        name: 'Sospechoso',
        description: 'Ojos entrecerrados y mirada analítica',
      },
      CUTE: {
        name: 'Ternura / Feliz',
        description: 'Arco inferior semicircular estilo kawaii amigable',
      },
      WONDER: {
        name: 'Asombro',
        description: 'Mirada amplia de curiosidad e impacto',
      },
      SURPRISED: {
        name: 'Sorprendido',
        description: 'Ojos bien abiertos y ligeramente elevados',
      },
      SLEEPY: {
        name: 'Somnoliento',
        description: 'Párpados casi cerrados en estado de reposo',
      },
      LOVING: {
        name: 'Cariñoso',
        description: 'Mirada dulce y relajada con arco suave',
      },
    },
    colorView: {
      title: 'Color y Emisión de Ojos',
      subtitle: 'Personaliza el tono neón, la intensidad de brillo y la forma visual.',
      activeColor: 'Color Activo',
      customBtn: 'Personalizado',
      neonPalette: 'Paleta Neón Cyber',
      glowIntensity: 'Intensidad del Resplandor (Glow)',
      glowSubtle: 'Sutil (10px)',
      glowStandard: 'Estándar (25px)',
      glowUltra: 'Ultrabrillante (50px)',
      shapeTitle: 'Forma Geométrica',
      shapes: {
        rounded: { label: 'Suave / Original', desc: 'Bordes clásicos' },
        cyber: { label: 'Cyber / Biselado', desc: 'Esquinas cortadas' },
        pill: { label: 'Píldora', desc: 'Cilindro curvo' },
      },
      bgTitle: 'Fondo del Entorno',
      bgPresets: {
        '#000000': 'Negro Puro',
        '#030314': 'Cyber Deep (Original)',
        '#050B14': 'Azul Espacial',
        '#0B0F17': 'Gris Carbón',
      },
      colorPresets: {
        '#00BD00': 'Verde Neón (Original)',
        '#00E5FF': 'Cyan Cyberpunk',
        '#2563EB': 'Azul Eléctrico',
        '#A855F7': 'Morado Neón',
        '#FF2A85': 'Rosa Neón',
        '#FF1744': 'Rojo Alerta',
        '#FFD600': 'Amarillo Centella',
        '#FF9100': 'Ámbar Cálido',
        '#E0F2FE': 'Blanco Glaciar',
        '#76FF03': 'Verde Lima',
      },
    },
    timingsView: {
      title: 'Tiempos y Dinámica de Animación',
      subtitle: 'Configura el ritmo de secuencias, intervalos de parpadeo y cadencia visual.',
      blinkTitle: 'Intervalo de Parpadeo Autónomo',
      blinkSubtitle: 'Define el tiempo exacto en que el robot pestañea de manera autónoma.',
      blinkNow: 'Parpadear Ya',
      exactInterval: 'Intervalo exacto:',
      seconds: 'segundos',
      quickBlinkPresets: 'Ajustes rápidos de parpadeo',
      blinkModeTitle: 'Modo de Parpadeo',
      blinkModeStrictDesc: 'Estricto al segundo programado',
      blinkModeNaturalDesc: 'Orgánico (leve variación de ±0.8s)',
      exact: 'Exacto',
      natural: 'Natural',
      seqDurationTitle: 'Duración de Estados y Animación Secuencial',
      seqDurationSubtitle: 'Reproducción continua una tras otra cuando hay más de una emoción configurada.',
      active: 'Activo',
      paused: 'Pausado',
      uniformDurationTitle: 'Asignar duración uniforme a todas las emociones',
      segShort: 'seg',
      baseDuration: 'Duración base por emoción:',
      dynamicsTitle: 'Fluidez y Comportamiento Orgánico',
      lerpSpeedTitle: 'Velocidad de transición entre emociones:',
      lerpCinematic: 'Cinemática / Lenta',
      lerpSmooth: 'Suave (Recomendada)',
      lerpFast: 'Rápida',
      swayTitle: 'Oscilación Orgánica (Sway)',
      followPointerTitle: 'Seguir Puntero / Toque',
    },
    settingsView: {
      title: 'Gestión y Ajustes del Sistema',
      subtitle: 'Guarda tus configuraciones personalizadas o restaura los valores de fábrica.',
      mainActions: 'Acciones Principales de Configuración',
      saveBtn: 'Guardar Configuración Actual',
      saveSuccess: '¡Ajustes Guardados con Éxito!',
      resetBtn: 'Restablecer a Valores de Fábrica',
      saveDisclaimer: '* Al presionar Guardar, tus colores, intervalos de parpadeo y emociones se almacenan permanentemente en tu navegador.',
      confirmTitle: '¿Confirmar restablecimiento de fábrica?',
      confirmDesc: 'Esta acción borrará todas tus preferencias personalizadas (colores neón, secuencias y tiempos) y restaurará el estado original del robot verde neón.',
      cancel: 'Cancelar',
      confirmReset: 'Sí, Restablecer Todo',
      presetsTitle: 'Perfiles Rápidos de Personalidad',
      presets: {
        original: { title: 'Droide Clásico', desc: 'Verde neón original (#00BD00)' },
        cyber: { title: 'Cyber Guardián', desc: 'Cyan de alta alerta, mirada veloz' },
        kawaii: { title: 'Mascota Kawaii', desc: 'Rosa ternura con parpadeo rápido' },
        alert: { title: 'Centinela Furia', desc: 'Rojo defensivo con párpado agudo' },
      },
      soundTitle: 'Efectos Sonoros Droide',
      soundSubtitle: 'Sutiles bips sintetizados al parpadear o cambiar emoción',
      soundEnabled: 'Activado',
      soundDisabled: 'Silencio',
    },
    toasts: {
      saved: 'Configuración guardada en memoria.',
      reset: 'Ajustes restablecidos a valores de fábrica.',
    },
  },
  en: {
    tabs: {
      eyes: 'Face',
      emotions: 'Emotions',
      color: 'Color',
      timing: 'Timings',
      settings: 'Settings',
    },
    header: {
      auto: 'AUTO',
      soundOn: 'Droid sounds enabled',
      soundOff: 'Sounds disabled',
      fullscreen: 'Enable continuous fullscreen',
      exitFullscreen: 'Exit fullscreen',
      showUi: 'Show control panel',
      hideUi: 'Hide control panel (Eyes Only Mode)',
      doubleTapHint: 'Double tap anywhere on the screen to toggle fullscreen',
      doubleTapExitHint: 'Double tap to exit fullscreen',
      tapToSettingsHint: 'Double tap for fullscreen · Tap to show settings',
    },
    emotionsView: {
      title: 'Robot Emotional States',
      subtitle: 'Select an instant expression or activate autonomous cycle.',
      seqActiveTitle: 'Sequential Mode Active',
      seqInactiveTitle: 'Fixed Expression Mode',
      seqActiveDesc: 'Continuously cycling through enabled emotions',
      seqInactiveDesc: 'Maintaining current selected emotion',
      pause: 'Pause',
      activateAuto: 'Auto Cycle',
      catalogTitle: 'Emotion Catalog',
      onScreen: 'Live',
      inSequence: 'In Sequence',
      omitted: 'Omitted',
      secondsShort: 's',
    },
    emotions: {
      DEFAULT: {
        name: 'Normal / Neutral',
        description: 'Standard balanced and alert gaze',
      },
      TIRED: {
        name: 'Tired',
        description: 'Heavy upper eyelids with gentle droop',
      },
      SAD: {
        name: 'Sad',
        description: 'Outward downward slant with gloomy look',
      },
      ANGRY: {
        name: 'Angry',
        description: 'Sharp acute brow slant with fierce focus',
      },
      SUSPICIOUS: {
        name: 'Suspicious',
        description: 'Squinted calculating analytical glance',
      },
      CUTE: {
        name: 'Cute / Happy',
        description: 'Upward curved bottom arch kawaii smile',
      },
      WONDER: {
        name: 'Wonder',
        description: 'Wide expressive eyes filled with curiosity',
      },
      SURPRISED: {
        name: 'Surprised',
        description: 'Wide elevated open eyes',
      },
      SLEEPY: {
        name: 'Sleepy',
        description: 'Nearly closed eyelids in resting state',
      },
      LOVING: {
        name: 'Loving',
        description: 'Gentle affectionate curve with sweet gaze',
      },
    },
    colorView: {
      title: 'Eye Color & Emission',
      subtitle: 'Customize neon tint, glow radiance, and geometric shape.',
      activeColor: 'Active Color',
      customBtn: 'Custom Color',
      neonPalette: 'Cyber Neon Palette',
      glowIntensity: 'Radiance Intensity (Glow)',
      glowSubtle: 'Subtle (10px)',
      glowStandard: 'Standard (25px)',
      glowUltra: 'Ultra Bright (50px)',
      shapeTitle: 'Geometric Eye Shape',
      shapes: {
        rounded: { label: 'Smooth / Classic', desc: 'Classic rounded corners' },
        cyber: { label: 'Cyber / Chamfer', desc: 'Cut angular edges' },
        pill: { label: 'Pill', desc: 'Curved cylinder' },
      },
      bgTitle: 'Environment Background',
      bgPresets: {
        '#000000': 'Pure Black',
        '#030314': 'Cyber Deep (Original)',
        '#050B14': 'Space Navy',
        '#0B0F17': 'Charcoal Slate',
      },
      colorPresets: {
        '#00BD00': 'Neon Green (Original)',
        '#00E5FF': 'Cyberpunk Cyan',
        '#2563EB': 'Electric Blue',
        '#A855F7': 'Neon Purple',
        '#FF2A85': 'Neon Pink',
        '#FF1744': 'Alert Red',
        '#FFD600': 'Lightning Yellow',
        '#FF9100': 'Warm Amber',
        '#E0F2FE': 'Glacier White',
        '#76FF03': 'Lime Green',
      },
    },
    timingsView: {
      title: 'Timings & Animation Dynamics',
      subtitle: 'Configure sequence rhythm, autonomous blink intervals, and cadence.',
      blinkTitle: 'Autonomous Blink Interval',
      blinkSubtitle: 'Defines the exact frequency the robot blinks autonomously.',
      blinkNow: 'Blink Now',
      exactInterval: 'Exact interval:',
      seconds: 'seconds',
      quickBlinkPresets: 'Quick blink presets',
      blinkModeTitle: 'Blink Mode',
      blinkModeStrictDesc: 'Strict to the exact configured second',
      blinkModeNaturalDesc: 'Organic (subtle ±0.8s natural jitter)',
      exact: 'Exact',
      natural: 'Natural',
      seqDurationTitle: 'Emotion Duration & Sequential Cycle',
      seqDurationSubtitle: 'Continuous sequence execution one after another.',
      active: 'Active',
      paused: 'Paused',
      uniformDurationTitle: 'Apply uniform duration to all emotions',
      segShort: 'sec',
      baseDuration: 'Base duration per emotion:',
      dynamicsTitle: 'Organic Fluidity & Movement',
      lerpSpeedTitle: 'Transition speed between emotions:',
      lerpCinematic: 'Cinematic / Slow',
      lerpSmooth: 'Smooth (Recommended)',
      lerpFast: 'Fast',
      swayTitle: 'Organic Sway Motion',
      followPointerTitle: 'Follow Pointer / Touch',
    },
    settingsView: {
      title: 'System Management & Settings',
      subtitle: 'Save custom configurations or restore factory defaults.',
      mainActions: 'Primary Configuration Actions',
      saveBtn: 'Save Current Configuration',
      saveSuccess: 'Settings Saved Successfully!',
      resetBtn: 'Restore Factory Defaults',
      saveDisclaimer: '* Clicking Save permanently stores your colors, blink intervals, and emotions in your browser.',
      confirmTitle: 'Confirm factory reset?',
      confirmDesc: 'This will erase all custom preferences (neon colors, sequences, timings) and restore original green droid settings.',
      cancel: 'Cancel',
      confirmReset: 'Yes, Restore All',
      presetsTitle: 'Quick Personality Profiles',
      presets: {
        original: { title: 'Classic Droid', desc: 'Original neon green (#00BD00)' },
        cyber: { title: 'Cyber Guardian', desc: 'High alert cyan with quick glance' },
        kawaii: { title: 'Kawaii Pet', desc: 'Loving pink with playful blinks' },
        alert: { title: 'Fury Sentinel', desc: 'Defensive red with sharp brow' },
      },
      soundTitle: 'Droid Sound Effects',
      soundSubtitle: 'Subtle synthesized chirps on blink or emotion change',
      soundEnabled: 'Enabled',
      soundDisabled: 'Muted',
    },
    toasts: {
      saved: 'Configuration saved to memory.',
      reset: 'Settings restored to factory defaults.',
    },
  },
};
