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

  'solarized-neurodivergent': {
    name: 'Solarized Neurodivergent',
    colors: {
      primary: '#268BD2',
      secondary: '#2AA198',
      success: '#859900',
      warning: '#B58900',
      error: '#DC322F',
      info: '#268BD2',
      background: '#FDF6E3',
      foreground: '#657B83',
      muted: '#93A1A1',
      border: '#EEE8D5',
      focusBorder: '#268BD2',
    },
    accessibility: {
      highContrast: true,
      reducedMotion: true,
      colorblindSafe: true,
    },
  },

  'monochrome-focus': {
    name: 'Monochrome Focus',
    colors: {
      primary: '#FFFFFF',
      secondary: '#D0D0D0',
      success: '#FFFFFF',
      warning: '#A0A0A0',
      error: '#808080',
      info: '#D0D0D0',
      background: '#000000',
      foreground: '#FFFFFF',
      muted: '#808080',
      border: '#404040',
      focusBorder: '#FFFFFF',
    },
    accessibility: {
      highContrast: true,
      reducedMotion: true,
      colorblindSafe: true,
    },
  },

  // Popular community themes
  'dracula': {
    name: 'Dracula',
    colors: {
      primary: '#BD93F9',
      secondary: '#FF79C6',
      success: '#50FA7B',
      warning: '#F1FA8C',
      error: '#FF5555',
      info: '#8BE9FD',
      background: '#282A36',
      foreground: '#F8F8F2',
      muted: '#6272A4',
      border: '#44475A',
      focusBorder: '#BD93F9',
    },
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      colorblindSafe: false,
    },
  },

  'nord': {
    name: 'Nord',
    colors: {
      primary: '#88C0D0',
      secondary: '#81A1C1',
      success: '#A3BE8C',
      warning: '#EBCB8B',
      error: '#BF616A',
      info: '#5E81AC',
      background: '#2E3440',
      foreground: '#ECEFF4',
      muted: '#4C566A',
      border: '#3B4252',
      focusBorder: '#88C0D0',
    },
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      colorblindSafe: true,
    },
  },

  'gruvbox': {
    name: 'Gruvbox Dark',
    colors: {
      primary: '#FABD2F',
      secondary: '#B8BB26',
      success: '#B8BB26',
      warning: '#FE8019',
      error: '#FB4934',
      info: '#83A598',
      background: '#282828',
      foreground: '#EBDBB2',
      muted: '#928374',
      border: '#3C3836',
      focusBorder: '#FABD2F',
    },
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      colorblindSafe: true,
    },
  },

  'catppuccin': {
    name: 'Catppuccin Mocha',
    colors: {
      primary: '#CBA6F7',
      secondary: '#F5C2E7',
      success: '#A6E3A1',
      warning: '#F9E2AF',
      error: '#F38BA8',
      info: '#89B4FA',
      background: '#1E1E2E',
      foreground: '#CDD6F4',
      muted: '#6C7086',
      border: '#313244',
      focusBorder: '#CBA6F7',
    },
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      colorblindSafe: false,
    },
  },

  'tokyo-night': {
    name: 'Tokyo Night',
    colors: {
      primary: '#7AA2F7',
      secondary: '#BB9AF7',
      success: '#9ECE6A',
      warning: '#E0AF68',
      error: '#F7768E',
      info: '#7DCFFF',
      background: '#1A1B26',
      foreground: '#C0CAF5',
      muted: '#565F89',
      border: '#24283B',
      focusBorder: '#7AA2F7',
    },
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      colorblindSafe: false,
    },
  },

  'ayu': {
    name: 'Ayu Dark',
    colors: {
      primary: '#59C2FF',
      secondary: '#FFB454',
      success: '#AAD94C',
      warning: '#FFB454',
      error: '#F07178',
      info: '#59C2FF',
      background: '#0A0E14',
      foreground: '#B3B1AD',
      muted: '#4D5566',
      border: '#11151C',
      focusBorder: '#59C2FF',
    },
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      colorblindSafe: false,
    },
  },

  'night-owl': {
    name: 'Night Owl',
    colors: {
      primary: '#82AAFF',
      secondary: '#C792EA',
      success: '#ADDB67',
      warning: '#FFCB6B',
      error: '#EF5350',
      info: '#7FDBCA',
      background: '#011627',
      foreground: '#D6DEEB',
      muted: '#5F7E97',
      border: '#1D3B53',
      focusBorder: '#82AAFF',
    },
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      colorblindSafe: false,
    },
  },

  'material-dark': {
    name: 'Material Dark',
    colors: {
      primary: '#82AAFF',
      secondary: '#C792EA',
      success: '#C3E88D',
      warning: '#FFCB6B',
      error: '#F07178',
      info: '#89DDFF',
      background: '#263238',
      foreground: '#EEFFFF',
      muted: '#546E7A',
      border: '#37474F',
      focusBorder: '#82AAFF',
    },
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      colorblindSafe: false,
    },
  },

  'material-ocean': {
    name: 'Material Ocean',
    colors: {
      primary: '#82AAFF',
      secondary: '#C792EA',
      success: '#C3E88D',
      warning: '#FFCB6B',
      error: '#F07178',
      info: '#89DDFF',
      background: '#0F111A',
      foreground: '#8F93A2',
      muted: '#464B5D',
      border: '#1E2030',
      focusBorder: '#82AAFF',
    },
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      colorblindSafe: false,
    },
  },

  'solarized-dark': {
    name: 'Solarized Dark',
    colors: {
      primary: '#268BD2',
      secondary: '#2AA198',
      success: '#859900',
      warning: '#B58900',
      error: '#DC322F',
      info: '#268BD2',
      background: '#002B36',
      foreground: '#839496',
      muted: '#586E75',
      border: '#073642',
      focusBorder: '#268BD2',
    },
    accessibility: {
      highContrast: true,
      reducedMotion: false,
      colorblindSafe: true,
    },
  },

  'solarized-light': {
    name: 'Solarized Light',
    colors: {
      primary: '#268BD2',
      secondary: '#2AA198',
      success: '#859900',
      warning: '#B58900',
      error: '#DC322F',
      info: '#268BD2',
      background: '#FDF6E3',
      foreground: '#657B83',
      muted: '#93A1A1',
      border: '#EEE8D5',
      focusBorder: '#268BD2',
    },
    accessibility: {
      highContrast: true,
      reducedMotion: false,
      colorblindSafe: true,
    },
  },
};

export function getTheme(name: string): Theme {
  return themes[name] || themes['default'];
}

export function getAllThemes(): Record<string, Theme> {
  return { ...themes };
}

export function getThemesByAccessibility(feature: keyof Theme['accessibility']): Theme[] {
  return Object.values(themes).filter(theme => theme.accessibility[feature]);
}
