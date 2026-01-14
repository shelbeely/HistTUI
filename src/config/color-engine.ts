/**
 * Material Design 3 Dynamic Color Engine
 * Uses @material/material-color-utilities to generate full tonal palettes
 * from a single source color (#6750A4)
 */

import {
  argbFromHex,
  hexFromArgb,
  Hct,
  TonalPalette,
  Scheme,
  SchemeContent,
  SchemeExpressive,
  SchemeFidelity,
  SchemeMonochrome,
  SchemeNeutral,
  SchemeVibrant,
} from '@material/material-color-utilities';

/**
 * Available Material Design 3 scheme variants
 */
export type MD3SchemeVariant = 
  | 'content'      // Content-focused (default)
  | 'expressive'   // Expressive, artistic
  | 'fidelity'     // High fidelity to source color
  | 'monochrome'   // Monochromatic
  | 'neutral'      // Neutral, calm
  | 'vibrant';     // Vibrant, energetic

/**
 * Complete Material Design 3 color scheme
 * Generated from a single source color
 */
export interface DynamicColorScheme {
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
  
  // Source information
  sourceColor: string;
  variant: MD3SchemeVariant;
  isDark: boolean;
}

/**
 * Tonal palette information
 */
export interface TonalPaletteInfo {
  name: string;
  palette: TonalPalette;
  tones: {
    0: string;   // Pure black
    10: string;
    20: string;
    30: string;
    40: string;
    50: string;
    60: string;
    70: string;
    80: string;
    90: string;
    95: string;
    99: string;
    100: string; // Pure white
  };
}

/**
 * Complete color palette set
 */
export interface ColorPalettes {
  primary: TonalPaletteInfo;
  secondary: TonalPaletteInfo;
  tertiary: TonalPaletteInfo;
  neutral: TonalPaletteInfo;
  neutralVariant: TonalPaletteInfo;
  error: TonalPaletteInfo;
}

/**
 * Color Engine - Generates dynamic Material Design 3 color schemes
 */
export class MaterialColorEngine {
  private sourceColor: string;
  private sourceArgb: number;
  private hct: Hct;
  
  constructor(sourceColor: string = '#6750A4') {
    this.sourceColor = sourceColor;
    this.sourceArgb = argbFromHex(sourceColor);
    this.hct = Hct.fromInt(this.sourceArgb);
  }
  
  /**
   * Generate tonal palettes from source color
   */
  generatePalettes(): ColorPalettes {
    const hue = this.hct.hue;
    const chroma = this.hct.chroma;
    
    // Generate tonal palettes
    const primary = TonalPalette.fromHueAndChroma(hue, Math.max(48, chroma));
    const secondary = TonalPalette.fromHueAndChroma(hue, 16);
    const tertiary = TonalPalette.fromHueAndChroma(hue + 60, 24);
    const neutral = TonalPalette.fromHueAndChroma(hue, 4);
    const neutralVariant = TonalPalette.fromHueAndChroma(hue, 8);
    const error = TonalPalette.fromHueAndChroma(25, 84);
    
    return {
      primary: this.createPaletteInfo('Primary', primary),
      secondary: this.createPaletteInfo('Secondary', secondary),
      tertiary: this.createPaletteInfo('Tertiary', tertiary),
      neutral: this.createPaletteInfo('Neutral', neutral),
      neutralVariant: this.createPaletteInfo('Neutral Variant', neutralVariant),
      error: this.createPaletteInfo('Error', error),
    };
  }
  
  /**
   * Create palette info with all tone values
   */
  private createPaletteInfo(name: string, palette: TonalPalette): TonalPaletteInfo {
    return {
      name,
      palette,
      tones: {
        0: hexFromArgb(palette.tone(0)),
        10: hexFromArgb(palette.tone(10)),
        20: hexFromArgb(palette.tone(20)),
        30: hexFromArgb(palette.tone(30)),
        40: hexFromArgb(palette.tone(40)),
        50: hexFromArgb(palette.tone(50)),
        60: hexFromArgb(palette.tone(60)),
        70: hexFromArgb(palette.tone(70)),
        80: hexFromArgb(palette.tone(80)),
        90: hexFromArgb(palette.tone(90)),
        95: hexFromArgb(palette.tone(95)),
        99: hexFromArgb(palette.tone(99)),
        100: hexFromArgb(palette.tone(100)),
      },
    };
  }
  
  /**
   * Generate color scheme using specified variant
   */
  generateScheme(isDark: boolean = true, variant: MD3SchemeVariant = 'expressive'): DynamicColorScheme {
    let scheme: Scheme;
    
    // Select scheme variant
    switch (variant) {
      case 'content':
        scheme = new SchemeContent(this.hct, isDark, 0);
        break;
      case 'expressive':
        scheme = new SchemeExpressive(this.hct, isDark, 0);
        break;
      case 'fidelity':
        scheme = new SchemeFidelity(this.hct, isDark, 0);
        break;
      case 'monochrome':
        scheme = new SchemeMonochrome(this.hct, isDark, 0);
        break;
      case 'neutral':
        scheme = new SchemeNeutral(this.hct, isDark, 0);
        break;
      case 'vibrant':
        scheme = new SchemeVibrant(this.hct, isDark, 0);
        break;
      default:
        scheme = new SchemeExpressive(this.hct, isDark, 0);
    }
    
    return {
      // Primary
      primary: hexFromArgb(scheme.primary),
      onPrimary: hexFromArgb(scheme.onPrimary),
      primaryContainer: hexFromArgb(scheme.primaryContainer),
      onPrimaryContainer: hexFromArgb(scheme.onPrimaryContainer),
      
      // Secondary
      secondary: hexFromArgb(scheme.secondary),
      onSecondary: hexFromArgb(scheme.onSecondary),
      secondaryContainer: hexFromArgb(scheme.secondaryContainer),
      onSecondaryContainer: hexFromArgb(scheme.onSecondaryContainer),
      
      // Tertiary
      tertiary: hexFromArgb(scheme.tertiary),
      onTertiary: hexFromArgb(scheme.onTertiary),
      tertiaryContainer: hexFromArgb(scheme.tertiaryContainer),
      onTertiaryContainer: hexFromArgb(scheme.onTertiaryContainer),
      
      // Error
      error: hexFromArgb(scheme.error),
      onError: hexFromArgb(scheme.onError),
      errorContainer: hexFromArgb(scheme.errorContainer),
      onErrorContainer: hexFromArgb(scheme.onErrorContainer),
      
      // Surface
      surface: hexFromArgb(scheme.surface),
      onSurface: hexFromArgb(scheme.onSurface),
      surfaceVariant: hexFromArgb(scheme.surfaceVariant),
      onSurfaceVariant: hexFromArgb(scheme.onSurfaceVariant),
      surfaceDim: hexFromArgb(scheme.surfaceDim),
      surfaceBright: hexFromArgb(scheme.surfaceBright),
      surfaceContainerLowest: hexFromArgb(scheme.surfaceContainerLowest),
      surfaceContainerLow: hexFromArgb(scheme.surfaceContainerLow),
      surfaceContainer: hexFromArgb(scheme.surfaceContainer),
      surfaceContainerHigh: hexFromArgb(scheme.surfaceContainerHigh),
      surfaceContainerHighest: hexFromArgb(scheme.surfaceContainerHighest),
      
      // Outline
      outline: hexFromArgb(scheme.outline),
      outlineVariant: hexFromArgb(scheme.outlineVariant),
      
      // Other
      shadow: hexFromArgb(scheme.shadow),
      scrim: hexFromArgb(scheme.scrim),
      inverseSurface: hexFromArgb(scheme.inverseSurface),
      inverseOnSurface: hexFromArgb(scheme.inverseOnSurface),
      inversePrimary: hexFromArgb(scheme.inversePrimary),
      
      // Source information
      sourceColor: this.sourceColor,
      variant,
      isDark,
    };
  }
  
  /**
   * Get all available scheme variants for preview
   */
  getAllVariants(isDark: boolean = true): Record<MD3SchemeVariant, DynamicColorScheme> {
    return {
      content: this.generateScheme(isDark, 'content'),
      expressive: this.generateScheme(isDark, 'expressive'),
      fidelity: this.generateScheme(isDark, 'fidelity'),
      monochrome: this.generateScheme(isDark, 'monochrome'),
      neutral: this.generateScheme(isDark, 'neutral'),
      vibrant: this.generateScheme(isDark, 'vibrant'),
    };
  }
}

/**
 * Default color engine instance with HistTUI brand color
 */
export const defaultColorEngine = new MaterialColorEngine('#6750A4');

/**
 * Get default color scheme (expressive dark)
 */
export function getDefaultColorScheme(): DynamicColorScheme {
  return defaultColorEngine.generateScheme(true, 'expressive');
}

/**
 * Get default palettes
 */
export function getDefaultPalettes(): ColorPalettes {
  return defaultColorEngine.generatePalettes();
}

/**
 * Create color engine from custom source color
 */
export function createColorEngine(sourceColor: string): MaterialColorEngine {
  return new MaterialColorEngine(sourceColor);
}

/**
 * Generate scheme from hex color
 */
export function generateSchemeFromHex(
  hexColor: string,
  isDark: boolean = true,
  variant: MD3SchemeVariant = 'expressive'
): DynamicColorScheme {
  const engine = new MaterialColorEngine(hexColor);
  return engine.generateScheme(isDark, variant);
}

/**
 * Helper: Convert ARGB to hex
 */
export function argbToHex(argb: number): string {
  return hexFromArgb(argb);
}

/**
 * Helper: Convert hex to ARGB
 */
export function hexToArgb(hex: string): number {
  return argbFromHex(hex);
}
