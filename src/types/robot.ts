export type EmotionKey =
  | 'DEFAULT'
  | 'TIRED'
  | 'SAD'
  | 'ANGRY'
  | 'SUSPICIOUS'
  | 'CUTE'
  | 'WONDER'
  | 'SURPRISED'
  | 'SLEEPY'
  | 'LOVING';

export interface EmotionTarget {
  topL: number;
  topR: number;
  botC: number;
  scaleY: number;
  offsetEyeY: number;
}

export interface PlaylistItem {
  emotion: EmotionKey;
  duration: number; // in seconds
  enabled: boolean;
}

export interface RobotConfig {
  currentEmotion: EmotionKey;
  isSequentialMode: boolean;
  defaultDuration: number; // in seconds
  playlist: PlaylistItem[];
  
  // Color & Visuals
  eyeColor: string;
  glowBlur: number;
  backgroundColor: string;
  eyeShape: 'rounded' | 'cyber' | 'pill';
  eyeScale: number; // 0.8 to 1.3
  eyeSpacing: number; // 0.8 to 1.3
  
  // Timing & Animation
  blinkInterval: number; // in seconds
  blinkMode: 'exact' | 'natural'; // exact: precise interval; natural: adds subtle randomized jitter
  lerpSpeed: number; // 0.04 to 0.16
  swayEnabled: boolean;
  swayAmplitude: number;
  followPointer: boolean;
  
  // Audio feedback
  soundEnabled: boolean;
}

export const EMOTION_METADATA: Record<
  EmotionKey,
  {
    name: string;
    description: string;
    target: EmotionTarget;
    badgeColor: string;
  }
> = {
  DEFAULT: {
    name: 'Normal / Neutro',
    description: 'Expresión estándar equilibrada y despierta',
    target: { topL: 0, topR: 0, botC: 0, scaleY: 1.0, offsetEyeY: 0 },
    badgeColor: '#10B981',
  },
  TIRED: {
    name: 'Cansado',
    description: 'Párpados superiores caídos con leve pesadez',
    target: { topL: 0.52, topR: 0.52, botC: 0, scaleY: 0.85, offsetEyeY: 0.05 },
    badgeColor: '#64748B',
  },
  SAD: {
    name: 'Triste',
    description: 'Corte oblicuo hacia afuera con mirada decaída',
    target: { topL: 0.42, topR: 0.0, botC: 0, scaleY: 0.95, offsetEyeY: 0 },
    badgeColor: '#38BDF8',
  },
  ANGRY: {
    name: 'Enojado',
    description: 'Corte agudo e intenso hacia el entrecejo',
    target: { topL: 0.0, topR: 0.45, botC: 0, scaleY: 0.9, offsetEyeY: 0 },
    badgeColor: '#EF4444',
  },
  SUSPICIOUS: {
    name: 'Sospechoso',
    description: 'Ojos entrecerrados y mirada analítica',
    target: { topL: 0.48, topR: 0.48, botC: 0, scaleY: 0.7, offsetEyeY: -0.02 },
    badgeColor: '#F59E0B',
  },
  CUTE: {
    name: 'Ternura / Feliz',
    description: 'Arco inferior semicircular estilo kawaii amigable',
    target: { topL: 0.0, topR: 0.0, botC: 0.45, scaleY: 1.05, offsetEyeY: -0.03 },
    badgeColor: '#EC4899',
  },
  WONDER: {
    name: 'Asombro',
    description: 'Mirada amplia de curiosidad e impacto',
    target: { topL: 0.30, topR: 0.0, botC: 0, scaleY: 1.1, offsetEyeY: -0.02 },
    badgeColor: '#A855F7',
  },
  SURPRISED: {
    name: 'Sorprendido',
    description: 'Ojos bien abiertos y ligeramente elevados',
    target: { topL: 0.0, topR: 0.0, botC: 0, scaleY: 1.25, offsetEyeY: -0.06 },
    badgeColor: '#06B6D4',
  },
  SLEEPY: {
    name: 'Somnoliento',
    description: 'Párpados casi cerrados en estado de reposo',
    target: { topL: 0.72, topR: 0.72, botC: 0.1, scaleY: 0.6, offsetEyeY: 0.08 },
    badgeColor: '#818CF8',
  },
  LOVING: {
    name: 'Cariñoso',
    description: 'Mirada dulce y relajada con arco suave',
    target: { topL: 0.15, topR: 0.15, botC: 0.35, scaleY: 1.02, offsetEyeY: -0.02 },
    badgeColor: '#F43F5E',
  },
};

export const COLOR_PRESETS = [
  { name: 'Verde Neón (Original)', hex: '#00BD00', glow: 25 },
  { name: 'Cyan Cyberpunk', hex: '#00E5FF', glow: 28 },
  { name: 'Azul Eléctrico', hex: '#2563EB', glow: 24 },
  { name: 'Morado Neón', hex: '#A855F7', glow: 26 },
  { name: 'Rosa Neón', hex: '#FF2A85', glow: 26 },
  { name: 'Rojo Alerta', hex: '#FF1744', glow: 30 },
  { name: 'Amarillo Centella', hex: '#FFD600', glow: 24 },
  { name: 'Ámbar Cálido', hex: '#FF9100', glow: 22 },
  { name: 'Blanco Glaciar', hex: '#E0F2FE', glow: 20 },
  { name: 'Verde Lima', hex: '#76FF03', glow: 25 },
];

export const BACKGROUND_PRESETS = [
  { name: 'Negro Puro', hex: '#000000' },
  { name: 'Cyber Deep (Original)', hex: '#030314' },
  { name: 'Azul Espacial', hex: '#050B14' },
  { name: 'Gris Carbón', hex: '#0B0F17' },
];

export const DEFAULT_ROBOT_CONFIG: RobotConfig = {
  currentEmotion: 'DEFAULT',
  isSequentialMode: true,
  defaultDuration: 8,
  playlist: [
    { emotion: 'DEFAULT', duration: 8, enabled: true },
    { emotion: 'TIRED', duration: 8, enabled: true },
    { emotion: 'SAD', duration: 8, enabled: true },
    { emotion: 'ANGRY', duration: 8, enabled: true },
    { emotion: 'SUSPICIOUS', duration: 8, enabled: true },
    { emotion: 'CUTE', duration: 8, enabled: true },
    { emotion: 'WONDER', duration: 8, enabled: true },
  ],
  eyeColor: '#00BD00',
  glowBlur: 25,
  backgroundColor: '#030314',
  eyeShape: 'rounded',
  eyeScale: 1.0,
  eyeSpacing: 1.0,
  blinkInterval: 4.0,
  blinkMode: 'natural',
  lerpSpeed: 0.08,
  swayEnabled: true,
  swayAmplitude: 1.0,
  followPointer: true,
  soundEnabled: false,
};

export const STORAGE_KEY = 'robot_eyes_pro_custom_config_v1';
