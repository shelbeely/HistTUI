/**
 * Material Design 3 (Material You) Color System
 * Based on primary color: #6750A4 (Expressive Purple)
 * 
 * References:
 * - https://m3.material.io/styles/color/system/overview
 * - https://m3.material.io/styles/motion/overview
 * - https://github.com/material-components/material-web
 */

export interface MD3ColorScheme {
  // Primary colors
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  
  // Secondary colors
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  
  // Tertiary colors
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  
  // Error colors
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;
  
  // Surface colors
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  surfaceDim: string;
  surfaceBright: string;
  surfaceContainerLowest: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
  
  // Outline colors
  outline: string;
  outlineVariant: string;
  
  // Other colors
  shadow: string;
  scrim: string;
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;
}

/**
 * Material Design 3 Dark Color Scheme
 * Generated from primary color #6750A4 using Material Theme Builder
 */
export const md3DarkScheme: MD3ColorScheme = {
  // Primary - Expressive Purple (#6750A4)
  primary: '#D0BCFF',
  onPrimary: '#381E72',
  primaryContainer: '#4F378B',
  onPrimaryContainer: '#EADDFF',
  
  // Secondary - Complementary Purple-Pink
  secondary: '#CCC2DC',
  onSecondary: '#332D41',
  secondaryContainer: '#4A4458',
  onSecondaryContainer: '#E8DEF8',
  
  // Tertiary - Accent Pink
  tertiary: '#EFB8C8',
  onTertiary: '#492532',
  tertiaryContainer: '#633B48',
  onTertiaryContainer: '#FFD8E4',
  
  // Error - Material standard red
  error: '#F2B8B5',
  onError: '#601410',
  errorContainer: '#8C1D18',
  onErrorContainer: '#F9DEDC',
  
  // Surface - Dark theme backgrounds
  surface: '#141218',
  onSurface: '#E6E0E9',
  surfaceVariant: '#49454F',
  onSurfaceVariant: '#CAC4D0',
  surfaceDim: '#141218',
  surfaceBright: '#3B383E',
  surfaceContainerLowest: '#0F0D13',
  surfaceContainerLow: '#1D1B20',
  surfaceContainer: '#211F26',
  surfaceContainerHigh: '#2B2930',
  surfaceContainerHighest: '#36343B',
  
  // Outline
  outline: '#938F99',
  outlineVariant: '#49454F',
  
  // Other
  shadow: '#000000',
  scrim: '#000000',
  inverseSurface: '#E6E0E9',
  inverseOnSurface: '#322F35',
  inversePrimary: '#6750A4',
};

/**
 * Material Design 3 Light Color Scheme
 * Generated from primary color #6750A4 using Material Theme Builder
 */
export const md3LightScheme: MD3ColorScheme = {
  // Primary - Expressive Purple (#6750A4)
  primary: '#6750A4',
  onPrimary: '#FFFFFF',
  primaryContainer: '#EADDFF',
  onPrimaryContainer: '#21005D',
  
  // Secondary - Complementary Purple-Pink
  secondary: '#625B71',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#E8DEF8',
  onSecondaryContainer: '#1D192B',
  
  // Tertiary - Accent Pink
  tertiary: '#7D5260',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#FFD8E4',
  onTertiaryContainer: '#31111D',
  
  // Error - Material standard red
  error: '#B3261E',
  onError: '#FFFFFF',
  errorContainer: '#F9DEDC',
  onErrorContainer: '#410E0B',
  
  // Surface - Light theme backgrounds
  surface: '#FEF7FF',
  onSurface: '#1D1B20',
  surfaceVariant: '#E7E0EC',
  onSurfaceVariant: '#49454F',
  surfaceDim: '#DED8E1',
  surfaceBright: '#FEF7FF',
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#F7F2FA',
  surfaceContainer: '#F3EDF7',
  surfaceContainerHigh: '#ECE6F0',
  surfaceContainerHighest: '#E6E0E9',
  
  // Outline
  outline: '#79747E',
  outlineVariant: '#CAC4D0',
  
  // Other
  shadow: '#000000',
  scrim: '#000000',
  inverseSurface: '#322F35',
  inverseOnSurface: '#F5EFF7',
  inversePrimary: '#D0BCFF',
};

/**
 * Material Design 3 Motion/Animation Durations
 * Based on Material Motion System
 * https://m3.material.io/styles/motion/duration
 */
export const md3Motion = {
  // Duration tokens (in milliseconds)
  duration: {
    short1: 50,   // Fastest - Small utility-focused transitions
    short2: 100,  // Fast - Small element state changes
    short3: 150,  // Normal - Small element transitions
    short4: 200,  // Extended short - Medium element transitions
    medium1: 250, // Medium - Standard transitions
    medium2: 300, // Standard - Most common duration
    medium3: 350, // Extended medium - Larger transitions
    medium4: 400, // Long medium - Complex transitions
    long1: 450,   // Long - Large element transitions
    long2: 500,   // Extended long - Complex state changes
    long3: 550,   // Very long - Screen transitions
    long4: 600,   // Longest - Full screen transitions
    extraLong1: 700,  // Extra long - Complex screen changes
    extraLong2: 800,  // Very extra long - Major app transitions
    extraLong3: 900,  // Ultra long - Special transitions
    extraLong4: 1000, // Maximum - Reserved for special cases
  },
  
  // Easing curves
  easing: {
    // Standard easing - Most common
    standard: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
    
    // Emphasized easing - For important transitions
    emphasized: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
    emphasizedDecelerate: 'cubic-bezier(0.05, 0.7, 0.1, 1.0)',
    emphasizedAccelerate: 'cubic-bezier(0.3, 0.0, 0.8, 0.15)',
    
    // Legacy easing (for compatibility)
    legacy: 'cubic-bezier(0.4, 0.0, 0.2, 1.0)',
    legacyDecelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1.0)',
    legacyAccelerate: 'cubic-bezier(0.4, 0.0, 1.0, 1.0)',
  },
  
  // Animation patterns
  patterns: {
    // Fade in/out
    fadeIn: {
      duration: 150,
      easing: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
    },
    fadeOut: {
      duration: 75,
      easing: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
    },
    
    // Container transform
    containerTransform: {
      duration: 300,
      easing: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
    },
    
    // Elevation changes
    elevationChange: {
      duration: 200,
      easing: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
    },
    
    // State changes
    stateChange: {
      duration: 100,
      easing: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
    },
  },
};

/**
 * Material Design 3 State Layers (for terminal adaptation)
 * Opacity values for different interaction states
 */
export const md3StateLayer = {
  hover: 0.08,
  focus: 0.12,
  press: 0.12,
  drag: 0.16,
  disabled: 0.38,
};

/**
 * Material Design 3 Elevation (adapted for terminal)
 * Using color intensity instead of shadows
 */
export const md3Elevation = {
  level0: 0,    // No elevation
  level1: 1,    // Slight elevation (cards)
  level2: 2,    // Medium elevation (modals, dialogs)
  level3: 3,    // High elevation (floating action buttons)
  level4: 4,    // Higher elevation (navigation drawer)
  level5: 5,    // Highest elevation (top app bar)
};

/**
 * Helper function to get color scheme based on terminal color mode
 */
export function getMD3ColorScheme(isDark: boolean = true): MD3ColorScheme {
  return isDark ? md3DarkScheme : md3LightScheme;
}

/**
 * Helper function to apply state layer to color (for terminal)
 * Returns a modified color with opacity applied
 */
export function applyStateLayer(baseColor: string, state: keyof typeof md3StateLayer): string {
  // For terminal, we'll return the base color as-is since terminals don't support opacity
  // In a real implementation, you might want to calculate a lighter/darker variant
  return baseColor;
}
