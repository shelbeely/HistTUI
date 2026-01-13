/**
 * @inkjs/ui Theme Configuration
 * Maps HistTUI themes to @inkjs/ui theme structure
 */

import { extendTheme, defaultTheme, type Theme as InkUITheme } from '@inkjs/ui';
import type { BoxProps, TextProps } from 'ink';
import { getTheme } from './themes.js';

/**
 * Creates a custom @inkjs/ui theme based on HistTUI theme name
 */
export function createInkUITheme(themeName: string = 'default'): InkUITheme {
  const histtuiTheme = getTheme(themeName);
  
  return extendTheme(defaultTheme, {
    components: {
      // Spinner customization
      Spinner: {
        styles: {
          frame: (): TextProps => ({
            color: histtuiTheme.colors.primary,
          }),
          label: (): TextProps => ({
            color: histtuiTheme.colors.foreground,
          }),
        },
      },
      
      // TextInput customization
      TextInput: {
        styles: {
          container: (): BoxProps => ({
            borderStyle: 'round',
            borderColor: histtuiTheme.colors.border,
          }),
          input: (): TextProps => ({
            color: histtuiTheme.colors.foreground,
          }),
          placeholder: (): TextProps => ({
            color: histtuiTheme.colors.muted,
          }),
          cursor: (): TextProps => ({
            color: histtuiTheme.colors.primary,
          }),
        },
      },
      
      // Select customization
      Select: {
        styles: {
          container: (): BoxProps => ({
            borderStyle: 'round',
            borderColor: histtuiTheme.colors.border,
          }),
          item: (): TextProps => ({
            color: histtuiTheme.colors.foreground,
          }),
          selectedItem: (): TextProps => ({
            color: histtuiTheme.colors.primary,
            bold: true,
          }),
          indicator: (): TextProps => ({
            color: histtuiTheme.colors.primary,
          }),
        },
      },
      
      // Badge customization
      Badge: {
        styles: {
          success: (): TextProps => ({
            color: histtuiTheme.colors.success,
            bold: true,
          }),
          error: (): TextProps => ({
            color: histtuiTheme.colors.error,
            bold: true,
          }),
          warning: (): TextProps => ({
            color: histtuiTheme.colors.warning,
            bold: true,
          }),
          info: (): TextProps => ({
            color: histtuiTheme.colors.info,
            bold: true,
          }),
        },
      },
      
      // StatusMessage customization
      StatusMessage: {
        styles: {
          container: (): BoxProps => ({
            borderStyle: 'round',
            paddingX: 1,
          }),
          success: (): BoxProps => ({
            borderColor: histtuiTheme.colors.success,
          }),
          error: (): BoxProps => ({
            borderColor: histtuiTheme.colors.error,
          }),
          warning: (): BoxProps => ({
            borderColor: histtuiTheme.colors.warning,
          }),
          info: (): BoxProps => ({
            borderColor: histtuiTheme.colors.info,
          }),
        },
      },
      
      // Alert customization
      Alert: {
        styles: {
          container: (): BoxProps => ({
            borderStyle: 'bold',
            paddingX: 1,
            paddingY: 0,
          }),
          success: (): BoxProps => ({
            borderColor: histtuiTheme.colors.success,
          }),
          error: (): BoxProps => ({
            borderColor: histtuiTheme.colors.error,
          }),
          warning: (): BoxProps => ({
            borderColor: histtuiTheme.colors.warning,
          }),
          info: (): BoxProps => ({
            borderColor: histtuiTheme.colors.info,
          }),
        },
      },
      
      // ProgressBar customization
      ProgressBar: {
        styles: {
          container: (): BoxProps => ({}),
          bar: (): TextProps => ({
            color: histtuiTheme.colors.primary,
          }),
          percentage: (): TextProps => ({
            color: histtuiTheme.colors.foreground,
          }),
        },
      },
      
      // ConfirmInput customization
      ConfirmInput: {
        styles: {
          container: (): BoxProps => ({}),
          text: (): TextProps => ({
            color: histtuiTheme.colors.foreground,
          }),
          hint: (): TextProps => ({
            color: histtuiTheme.colors.muted,
          }),
        },
      },
      
      // UnorderedList customization
      UnorderedList: {
        styles: {
          container: (): BoxProps => ({}),
          item: (): TextProps => ({
            color: histtuiTheme.colors.foreground,
          }),
          marker: (): TextProps => ({
            color: histtuiTheme.colors.primary,
          }),
        },
      },
      
      // OrderedList customization
      OrderedList: {
        styles: {
          container: (): BoxProps => ({}),
          item: (): TextProps => ({
            color: histtuiTheme.colors.foreground,
          }),
          number: (): TextProps => ({
            color: histtuiTheme.colors.primary,
          }),
        },
      },
    },
  });
}

/**
 * Get default @inkjs/ui theme (for HistTUI)
 */
export function getDefaultInkUITheme(): InkUITheme {
  return createInkUITheme('default');
}
