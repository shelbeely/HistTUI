# 🎨 Material Design 3 Integration Guide

**HistTUI's Beautiful Terminal UI powered by Material You**

HistTUI implements Material Design 3 (Material You) for a modern, cohesive terminal experience. This guide documents the complete color system, motion patterns, and terminal adaptations.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Primary Color](#-primary-color)
- [Color Scheme](#-color-scheme)
- [Motion System](#-motion-system)
- [Terminal Adaptations](#-terminal-adaptations)
- [Usage Examples](#-usage-examples)
- [Color Tokens Reference](#-color-tokens-reference)

---

## 🌈 Overview

HistTUI uses **Material Design 3 (Material You)** design system adapted for terminal UIs:

- **Primary Color**: `#6750A4` (Expressive Purple)
- **Color Scheme**: Generated using [Material Theme Builder](https://m3.material.io/theme-builder)
- **Motion System**: MD3 duration and easing tokens
- **Components**: Built with [@inkjs/ui](https://github.com/vadimdemedes/ink-ui)

### Why Material Design 3?

✅ **Consistent Design Language** - Professional, modern aesthetic  
✅ **Accessibility First** - WCAG compliant color contrasts  
✅ **Dark/Light Themes** - Full color schemes for both modes  
✅ **Adaptive Colors** - Dynamic color roles for different states

### References

- [Material Design 3 Official Docs](https://m3.material.io/)
- [Color System Overview](https://m3.material.io/styles/color/system/overview)
- [Motion Guidelines](https://m3.material.io/styles/motion/overview)
- [Material Components Web](https://github.com/material-components/material-web)

---

## 🎯 Primary Color

**Primary Color: `#6750A4` (Expressive Purple)**

This rich purple represents:
- **Innovation** and **Technology**
- **Creativity** in developer tools
- **Premium** experience
- **Clarity** with high contrast

### Color Psychology

Purple combines the **calm stability of blue** and the **fierce energy of red**, perfect for a developer tool that's both **powerful and approachable**.

---

## 🌓 Color Scheme

HistTUI uses **dual color schemes** for maximum compatibility:

### Dark Scheme (Default)

**Used in terminals with dark backgrounds**

| Color Role | Hex | Usage |
|------------|-----|-------|
| `primary` | `#D0BCFF` | Primary actions, highlights, active states |
| `onPrimary` | `#381E72` | Text on primary color |
| `primaryContainer` | `#4F378B` | Contained buttons, chips |
| `onPrimaryContainer` | `#EADDFF` | Text on primary container |
| `secondary` | `#CCC2DC` | Secondary actions, less emphasis |
| `onSecondary` | `#332D41` | Text on secondary color |
| `secondaryContainer` | `#4A4458` | Secondary containers |
| `onSecondaryContainer` | `#E8DEF8` | Text on secondary container |
| `tertiary` | `#EFB8C8` | Accent color, highlights |
| `onTertiary` | `#492532` | Text on tertiary color |
| `tertiaryContainer` | `#633B48` | Tertiary containers |
| `onTertiaryContainer` | `#FFD8E4` | Text on tertiary container |
| `error` | `#F2B8B5` | Error states, destructive actions |
| `onError` | `#601410` | Text on error color |
| `errorContainer` | `#8C1D18` | Error containers |
| `onErrorContainer` | `#F9DEDC` | Text on error container |

#### Surface Colors (Dark)

| Color Role | Hex | Usage |
|------------|-----|-------|
| `surface` | `#141218` | Base surface (main background) |
| `onSurface` | `#E6E0E9` | Text on surface |
| `surfaceVariant` | `#49454F` | Variant surface (panels, cards) |
| `onSurfaceVariant` | `#CAC4D0` | Text on surface variant |
| `surfaceDim` | `#141218` | Dimmed surface |
| `surfaceBright` | `#3B383E` | Bright surface |
| `surfaceContainerLowest` | `#0F0D13` | Lowest elevation container |
| `surfaceContainerLow` | `#1D1B20` | Low elevation container |
| `surfaceContainer` | `#211F26` | Standard container |
| `surfaceContainerHigh` | `#2B2930` | High elevation container |
| `surfaceContainerHighest` | `#36343B` | Highest elevation container |

#### Outline & Other Colors (Dark)

| Color Role | Hex | Usage |
|------------|-----|-------|
| `outline` | `#938F99` | Border outlines |
| `outlineVariant` | `#49454F` | Variant outlines |
| `shadow` | `#000000` | Shadow color |
| `scrim` | `#000000` | Scrim overlay |
| `inverseSurface` | `#E6E0E9` | Inverse surface (tooltips) |
| `inverseOnSurface` | `#322F35` | Text on inverse surface |
| `inversePrimary` | `#6750A4` | Primary color in inverse contexts |

### Light Scheme (Alternative)

**Used in terminals with light backgrounds**

| Color Role | Hex | Usage |
|------------|-----|-------|
| `primary` | `#6750A4` | Primary actions, highlights |
| `onPrimary` | `#FFFFFF` | Text on primary color |
| `primaryContainer` | `#EADDFF` | Contained buttons |
| `onPrimaryContainer` | `#21005D` | Text on primary container |
| `secondary` | `#625B71` | Secondary actions |
| `onSecondary` | `#FFFFFF` | Text on secondary |
| `secondaryContainer` | `#E8DEF8` | Secondary containers |
| `onSecondaryContainer` | `#1D192B` | Text on secondary container |
| `tertiary` | `#7D5260` | Accent color |
| `onTertiary` | `#FFFFFF` | Text on tertiary |
| `tertiaryContainer` | `#FFD8E4` | Tertiary containers |
| `onTertiaryContainer` | `#31111D` | Text on tertiary container |

*(Full light scheme color table available in `/src/config/material-design-3.ts`)*

---

## ⚡ Motion System

Material Design 3 defines **precise motion patterns** for delightful animations. HistTUI adapts these for terminal rendering.

### Duration Tokens

| Token | Duration | Usage |
|-------|----------|-------|
| `short1` | 50ms | Fastest - Small utility transitions |
| `short2` | 100ms | Fast - Small element state changes |
| `short3` | 150ms | Normal - Small element transitions |
| `short4` | 200ms | Extended short - Medium transitions |
| `medium1` | 250ms | Medium - Standard transitions |
| `medium2` | 300ms | **Most common** - Standard duration |
| `medium3` | 350ms | Extended medium - Larger transitions |
| `medium4` | 400ms | Long medium - Complex transitions |
| `long1` | 450ms | Long - Large element transitions |
| `long2` | 500ms | Extended long - Complex state changes |
| `long3` | 550ms | Very long - Screen transitions |
| `long4` | 600ms | Longest - Full screen transitions |
| `extraLong1` | 700ms | Extra long - Complex screen changes |
| `extraLong2` | 800ms | Very extra long - Major app transitions |
| `extraLong3` | 900ms | Ultra long - Special transitions |
| `extraLong4` | 1000ms | Maximum - Reserved for special cases |

### Easing Curves

Material Design 3 uses specific easing functions for natural motion:

```typescript
// Standard easing - Most common
standard: 'cubic-bezier(0.2, 0.0, 0, 1.0)'

// Emphasized easing - For important transitions
emphasized: 'cubic-bezier(0.2, 0.0, 0, 1.0)'
emphasizedDecelerate: 'cubic-bezier(0.05, 0.7, 0.1, 1.0)'
emphasizedAccelerate: 'cubic-bezier(0.3, 0.0, 0.8, 0.15)'

// Legacy easing (for compatibility)
legacy: 'cubic-bezier(0.4, 0.0, 0.2, 1.0)'
legacyDecelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1.0)'
legacyAccelerate: 'cubic-bezier(0.4, 0.0, 1.0, 1.0)'
```

### Animation Patterns

Pre-configured patterns for common animations:

```typescript
// Fade in/out
fadeIn: { duration: 150ms, easing: 'standard' }
fadeOut: { duration: 75ms, easing: 'standard' }

// Container transform
containerTransform: { duration: 300ms, easing: 'standard' }

// Elevation changes
elevationChange: { duration: 200ms, easing: 'standard' }

// State changes
stateChange: { duration: 100ms, easing: 'standard' }
```

---

## 🖥️ Terminal Adaptations

Terminal UIs have unique constraints compared to web/mobile. Here's how HistTUI adapts MD3:

### State Layers

**Opacity values for interaction states:**

| State | Opacity | Terminal Adaptation |
|-------|---------|---------------------|
| Hover | 8% | Color brightness adjustment |
| Focus | 12% | Border color change |
| Press | 12% | Background color shift |
| Drag | 16% | Slight color variation |
| Disabled | 38% | Dimmed text color |

**Note:** Terminals don't support transparency, so we use **color brightness variations** instead.

### Elevation System

In Material Design, elevation = shadows. In terminals, elevation = **color intensity**:

| Level | Elevation | Terminal Implementation |
|-------|-----------|------------------------|
| `level0` | 0 | Base surface color |
| `level1` | 1 | `surfaceContainerLow` |
| `level2` | 2 | `surfaceContainer` |
| `level3` | 3 | `surfaceContainerHigh` |
| `level4` | 4 | Border accent colors |
| `level5` | 5 | Primary color borders |

### Typography

Material Design uses **Roboto** font family. In terminals:

- Use **bold** for emphasis (replaces font weight)
- Use **colors** for hierarchy (replaces font size)
- Use **spacing** for grouping (replaces margins)

---

## 💡 Usage Examples

### Example 1: Primary Button

```typescript
import { Box, Text } from 'ink';
import { md3DarkScheme } from './config/material-design-3';

function PrimaryButton({ label, onClick }) {
  return (
    <Box 
      borderStyle="round" 
      borderColor={md3DarkScheme.primary}
      paddingX={2}
      paddingY={1}
    >
      <Text bold color={md3DarkScheme.primary}>
        {label}
      </Text>
    </Box>
  );
}
```

### Example 2: Error Alert

```typescript
import { Alert } from '@inkjs/ui';
import { md3DarkScheme } from './config/material-design-3';

function ErrorMessage({ message }) {
  return (
    <Alert variant="error">
      <Text color={md3DarkScheme.onErrorContainer}>
        {message}
      </Text>
    </Alert>
  );
}
```

### Example 3: Surface Card

```typescript
import { Box, Text } from 'ink';
import { md3DarkScheme } from './config/material-design-3';

function SurfaceCard({ title, content }) {
  return (
    <Box 
      flexDirection="column"
      borderStyle="round"
      borderColor={md3DarkScheme.outline}
      padding={2}
    >
      <Text bold color={md3DarkScheme.onSurface}>
        {title}
      </Text>
      <Text color={md3DarkScheme.onSurfaceVariant}>
        {content}
      </Text>
    </Box>
  );
}
```

### Example 4: Animated Transition

```typescript
import { md3Motion } from './config/material-design-3';

// Use duration tokens for consistent timing
setTimeout(() => {
  setVisible(true);
}, md3Motion.duration.medium2); // 300ms
```

---

## 📋 Color Tokens Reference

### Quick Access

All color tokens are defined in `/src/config/material-design-3.ts`:

```typescript
import { md3DarkScheme, md3LightScheme, getMD3ColorScheme } from './config/material-design-3';

// Get color scheme based on terminal mode
const colorScheme = getMD3ColorScheme(isDark);

// Use specific colors
console.log(colorScheme.primary);        // #D0BCFF (dark mode)
console.log(colorScheme.surface);        // #141218 (dark mode)
console.log(colorScheme.error);          // #F2B8B5 (dark mode)
```

### Helper Functions

```typescript
import { applyStateLayer, md3StateLayer } from './config/material-design-3';

// Apply state layer (hover, focus, press, etc.)
const hoverColor = applyStateLayer(baseColor, 'hover');
const focusColor = applyStateLayer(baseColor, 'focus');
```

---

## 🎓 Best Practices

### Do's ✅

- **Use semantic color roles** (`primary`, `error`) instead of hard-coded hex values
- **Follow motion duration tokens** for consistent timing
- **Maintain color contrast** ratios (WCAG AA minimum: 4.5:1 for text)
- **Use surface variants** for proper elevation hierarchy
- **Apply state layers** for interactive feedback

### Don'ts ❌

- **Don't mix light/dark tokens** - Always use complete scheme
- **Don't override primary color** - Keep `#6750A4` for brand consistency
- **Don't use random durations** - Use motion tokens
- **Don't skip elevation levels** - Follow 0-5 scale
- **Don't use pure black/white** - Use `surface` and `onSurface` tokens

---

## 🔗 Related Documentation

- [COMPONENTS.md](./COMPONENTS.md) - See MD3 colors in UI components
- [CONFIGURATION.md](./CONFIGURATION.md) - Theme configuration options
- [INKUI_INTEGRATION.md](./INKUI_INTEGRATION.md) - @inkjs/ui component usage

---

<details>
<summary><h3>For AI Agents / LLMs</h3></summary>

## Implementation Steps

**Step 0:** Import MD3 color scheme

```bash
# View the complete color scheme definition
cat src/config/material-design-3.ts
```

**Step 1:** Use color tokens in components

```typescript
import { md3DarkScheme } from '@/config/material-design-3';

// Example: Colored text
<Text color={md3DarkScheme.primary}>Primary Text</Text>

// Example: Border colors
<Box borderColor={md3DarkScheme.outline}>...</Box>

// Example: Background colors (via custom wrapper)
<Box backgroundColor={md3DarkScheme.surfaceContainer}>...</Box>
```

**Step 2:** Apply motion durations

```typescript
import { md3Motion } from '@/config/material-design-3';

// Use duration tokens
const duration = md3Motion.duration.medium2; // 300ms
const easing = md3Motion.easing.standard;
```

**Step 3:** Verify color usage

```bash
# Search for hard-coded colors (should be rare)
grep -r "#[0-9A-Fa-f]\{6\}" src/components --include="*.tsx"

# Check for proper imports
grep -r "md3DarkScheme\|md3LightScheme" src/components
```

**Step 4:** Test accessibility

```bash
# Verify color contrast ratios using online tools:
# https://webaim.org/resources/contrastchecker/
# - Text contrast: Minimum 4.5:1 (WCAG AA)
# - Large text: Minimum 3:1
```

## Color Token Mapping

```typescript
// Primary use cases
primary          → Buttons, active states, highlights
onPrimary        → Text on primary-colored backgrounds

// Secondary use cases
secondary        → Secondary actions, less emphasis
onSecondary      → Text on secondary-colored backgrounds

// Tertiary use cases
tertiary         → Accent highlights, special states
onTertiary       → Text on tertiary-colored backgrounds

// Error use cases
error            → Error messages, destructive actions
onError          → Text on error-colored backgrounds

// Surface use cases
surface          → Main background
onSurface        → Primary text color
surfaceVariant   → Panel backgrounds
onSurfaceVariant → Secondary text color
```

## Troubleshooting

**Issue:** Colors look wrong in terminal

```bash
# Check terminal color support
echo $COLORTERM  # Should show 'truecolor' or '24bit'

# Test 24-bit color support
printf "\x1b[38;2;103;80;164mPrimary Color Test\x1b[0m\n"
```

**Issue:** Motion feels too slow/fast

```typescript
// Adjust duration multiplier in config
const adjustedDuration = md3Motion.duration.medium2 * 0.8; // 20% faster
```

**Issue:** Contrast issues in light terminals

```typescript
// Force dark scheme for better contrast
import { md3DarkScheme } from '@/config/material-design-3';
const colors = md3DarkScheme; // Always use dark
```

</details>

---

**Last Updated:** 2026-01-14  
**Material Design Version:** 3 (Material You)  
**HistTUI Version:** 1.1.0
