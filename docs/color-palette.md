# Material Design 3 Color Palette

HistTUI uses Material Design 3 theming with a carefully selected color palette optimized for terminal readability.

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║                    Material Design 3 Color Palette                            ║
╚═══════════════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────────────┐
│ PRIMARY COLORS                                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ████████████  Primary          #6750A4    RGB(103, 80, 164)                │
│                Deep Purple - Main brand color, headers, highlights           │
│                                                                              │
│  ████████████  Primary Light    #7965AF    RGB(121, 101, 175)               │
│                Lighter variant for hover states and accents                  │
│                                                                              │
│  ████████████  Primary Dark     #563A91    RGB(86, 58, 145)                 │
│                Darker variant for active states and depth                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ SEMANTIC COLORS                                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ████████████  Success          #98C379    RGB(152, 195, 121)               │
│                Green - Additions, success messages, positive actions         │
│                                                                              │
│  ████████████  Warning          #E5C07B    RGB(229, 192, 123)               │
│                Yellow - Warnings, modifications, caution states              │
│                                                                              │
│  ████████████  Error            #E06C75    RGB(224, 108, 117)               │
│                Red - Deletions, errors, destructive actions                  │
│                                                                              │
│  ████████████  Info             #61AFEF    RGB(97, 175, 239)                │
│                Blue - Information, links, secondary accents                  │
│                                                                              │
│  ████████████  Cyan             #56B6C2    RGB(86, 182, 194)                │
│                Cyan - Special highlights, tertiary accents                   │
│                                                                              │
│  ████████████  Magenta          #C678DD    RGB(198, 120, 221)               │
│                Purple - Tags, labels, special markers                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ NEUTRAL COLORS                                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ████████████  Background       #0C0C0C    RGB(12, 12, 12)                  │
│                Deep black - Primary background                               │
│                                                                              │
│  ████████████  Surface          #1E1E1E    RGB(30, 30, 30)                  │
│                Dark gray - Elevated surfaces, cards, panels                  │
│                                                                              │
│  ████████████  Foreground       #CCCCCC    RGB(204, 204, 204)               │
│                Light gray - Primary text color                               │
│                                                                              │
│  ████████████  Muted            #888888    RGB(136, 136, 136)               │
│                Medium gray - Secondary text, deemphasized content            │
│                                                                              │
│  ████████████  Border           #333333    RGB(51, 51, 51)                  │
│                Dark gray - Borders, separators, dividers                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

╔═══════════════════════════════════════════════════════════════════════════════╗
║ COLOR USAGE GUIDE                                                             ║
╚═══════════════════════════════════════════════════════════════════════════════╝

  Commit Additions       → Success (#98C379)
  Commit Deletions       → Error (#E06C75)
  Commit Modifications   → Warning (#E5C07B)
  
  Branch Names           → Cyan (#56B6C2)
  Tag Names              → Magenta (#C678DD)
  Current Item           → Primary (#6750A4)
  
  Links & Navigation     → Info (#61AFEF)
  Status Messages        → Info (#61AFEF)
  
  Screen Headers         → Primary (#6750A4)
  Active Selection       → Primary Light (#7965AF)
  Keyboard Shortcuts     → Cyan (#56B6C2)

╔═══════════════════════════════════════════════════════════════════════════════╗
║ ACCESSIBILITY FEATURES                                                        ║
╚═══════════════════════════════════════════════════════════════════════════════╝

  ✓ WCAG AA Compliant contrast ratios
  ✓ Colorblind-friendly palette (tested for Deuteranopia & Protanopia)
  ✓ High contrast mode support
  ✓ Terminal 256-color fallback support
  ✓ Neurodiversity-friendly (reduced visual noise)
```

## Implementation

Colors are defined in `src/config/inkui-theme.ts` and applied throughout the application using the @inkjs/ui theming system.

```typescript
// Primary color from Material Design 3
const primary = {
  base: '#6750A4',
  light: '#7965AF',
  dark: '#563A91',
};
```

See [MATERIAL_DESIGN_3.md](../MATERIAL_DESIGN_3.md) for complete theming documentation.
