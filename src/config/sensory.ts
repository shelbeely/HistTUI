/**
 * Sensory Configuration
 * Fine-grained control over visual and audio sensory experience
 * Designed for autism and sensory processing sensitivity
 */

export interface SensoryConfig {
  // Visual
  visualDensity: 'compact' | 'normal' | 'spacious';
  animationSpeed: 'none' | 'slow' | 'normal' | 'fast';
  fontScale: number; // 0.8 - 2.0
  lineHeight: number; // 1.0 - 2.0
  colorSaturation: number; // 0.0 - 2.0
  contrast: number; // 0.5 - 2.0
  
  // Audio
  soundEnabled: boolean;
  soundVolume: number; // 0.0 - 1.0
  soundType: 'beep' | 'chime' | 'voice' | 'none';
  
  // Notifications
  notificationDuration: number; // seconds
  notificationPosition: 'top' | 'bottom' | 'center';
  batchNotifications: boolean;
}

export const sensoryPresets: Record<string, SensoryConfig> = {
  'minimal-sensory': {
    visualDensity: 'spacious',
    animationSpeed: 'none',
    fontScale: 1.2,
    lineHeight: 1.8,
    colorSaturation: 0.5,
    contrast: 1.2,
    soundEnabled: false,
    soundVolume: 0,
    soundType: 'none',
    notificationDuration: 10,
    notificationPosition: 'bottom',
    batchNotifications: true,
  },
  
  'high-stimulation': {
    visualDensity: 'compact',
    animationSpeed: 'fast',
    fontScale: 0.9,
    lineHeight: 1.2,
    colorSaturation: 1.5,
    contrast: 1.3,
    soundEnabled: true,
    soundVolume: 0.7,
    soundType: 'chime',
    notificationDuration: 3,
    notificationPosition: 'top',
    batchNotifications: false,
  },
  
  'balanced': {
    visualDensity: 'normal',
    animationSpeed: 'normal',
    fontScale: 1.0,
    lineHeight: 1.5,
    colorSaturation: 1.0,
    contrast: 1.0,
    soundEnabled: true,
    soundVolume: 0.5,
    soundType: 'beep',
    notificationDuration: 5,
    notificationPosition: 'top',
    batchNotifications: false,
  },
  
  'custom': {
    // User-defined
    visualDensity: 'normal',
    animationSpeed: 'slow',
    fontScale: 1.0,
    lineHeight: 1.5,
    colorSaturation: 1.0,
    contrast: 1.0,
    soundEnabled: true,
    soundVolume: 0.5,
    soundType: 'beep',
    notificationDuration: 5,
    notificationPosition: 'top',
    batchNotifications: true,
  },
};

export function getSensoryPreset(name: string): SensoryConfig {
  return sensoryPresets[name] || sensoryPresets['balanced'];
}

export function getSpacingMultiplier(density: 'compact' | 'normal' | 'spacious'): number {
  switch (density) {
    case 'compact': return 0.7;
    case 'spacious': return 1.5;
    default: return 1.0;
  }
}

export function getAnimationDuration(speed: 'none' | 'slow' | 'normal' | 'fast'): number {
  switch (speed) {
    case 'none': return 0;
    case 'slow': return 600;
    case 'fast': return 150;
    default: return 300;
  }
}

export function applySaturation(color: string, saturation: number): string {
  // Simple saturation adjustment - in real implementation would use color manipulation library
  return color; // Placeholder
}

export function applyContrast(color: string, contrast: number): string {
  // Simple contrast adjustment - in real implementation would use color manipulation library
  return color; // Placeholder
}
