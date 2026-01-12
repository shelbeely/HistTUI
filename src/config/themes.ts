/**
 * Theme Configuration - Neurodiversity-friendly themes
 * Designed for ADHD and autism developers with accessibility in mind
 */

import type { Theme } from '../types/index.js';

export const themes: Record<string, Theme> = {
  'high-contrast': {
    name: 'High Contrast',
    colors: {
      primary: '#00FF00',
      secondary: '#00CCFF',
      success: '#00FF00',
      warning: '#FFFF00',
      error: '#FF0000',
      info: '#00CCFF',
      background: '#000000',
      foreground: '#FFFFFF',
      muted: '#808080',
      border: '#FFFFFF',
      focusBorder: '#00FF00',
    },
    accessibility: {
      highContrast: true,
      reducedMotion: true,
      colorblindSafe: true,
    },
  },
  
  'calm': {
    name: 'Calm (Autism-Friendly)',
    colors: {
      primary: '#7BA8D4',
      secondary: '#A8C8E4',
      success: '#8BC48A',
      warning: '#F0C987',
      error: '#E89B9B',
      info: '#9ECAE1',
      background: '#F5F7FA',
      foreground: '#2C3E50',
      muted: '#95A5A6',
      border: '#D6E0E8',
      focusBorder: '#7BA8D4',
    },
    accessibility: {
      highContrast: false,
      reducedMotion: true,
      colorblindSafe: true,
    },
  },

  'colorblind-safe': {
    name: 'Colorblind Safe',
    colors: {
      primary: '#0077BB',
      secondary: '#33BBEE',
      success: '#009988',
      warning: '#EE7733',
      error: '#CC3311',
      info: '#33BBEE',
      background: '#FFFFFF',
      foreground: '#000000',
      muted: '#999999',
      border: '#CCCCCC',
      focusBorder: '#0077BB',
    },
    accessibility: {
      highContrast: true,
      reducedMotion: false,
      colorblindSafe: true,
    },
  },

  'default': {
    name: 'Default',
    colors: {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
      background: '#1F2937',
      foreground: '#F9FAFB',
      muted: '#6B7280',
      border: '#374151',
      focusBorder: '#3B82F6',
    },
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      colorblindSafe: false,
    },
  },
};

export function getTheme(name: string): Theme {
  return themes[name] || themes['default'];
}
