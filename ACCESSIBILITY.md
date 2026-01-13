# 🌈 Accessibility Guide for Neurodivergent Developers

HistTUI is specifically designed with **ADHD and autism developers** in mind. This guide explains the accessibility features and how to customize them.

## ✨ Key Features

### For ADHD Developers

**Reduced Cognitive Load:**
- Clear visual hierarchy with consistent spacing
- Single focus point (no overwhelming UI)
- Progress indicators for all long operations
- Task breakdown and session tracking

**Focus & Attention:**
- Bold focus indicators
- Persistent status bar showing context
- Keyboard shortcuts always visible
- Quick actions with number shortcuts (1-9)

**Motivation & Tracking:**
- WakaTime-like time tracking
- Daily coding streaks
- Productivity dashboard
- Visual progress (charts, sparklines)

### For Autism Developers

**Predictability:**
- Consistent UI patterns
- No popups or surprises
- Clear cause-and-effect
- Detailed documentation

**Sensory Considerations:**
- No flashing animations
- Calm color themes
- Optional reduced motion
- Customizable everything

**Clarity:**
- Explicit help text
- Breadcrumb navigation
- Clear next steps
- Verbose error messages

## 🎨 Themes

### High Contrast
Maximum readability, perfect for ADHD:
```bash
histtui --theme high-contrast
```

### Calm
Soft colors, reduced stimulation for autism:
```bash
histtui --theme calm
```

### Colorblind Safe
Deuteranopia/Protanopia friendly:
```bash
histtui --theme colorblind-safe
```

## ⚙️ Configuration

```json
{
  "accessibility": {
    "reducedMotion": true,
    "highContrast": true,
    "focusIndicatorStyle": "bold-border",
    "largeText": true
  },
  "timeTracking": {
    "enabled": true,
    "idleTimeout": 300
  }
}
```

## ⏱️ Time Tracking

WakaTime-like local tracking:
- Automatic session detection
- File and language tracking
- Daily/weekly summaries
- Streak counting
- Productivity insights

View stats:
```bash
histtui stats
histtui stats --today
histtui stats --week
```

## 🎯 Tips

1. **Start with High Contrast theme** for maximum clarity
2. **Enable reduced motion** if animations are distracting
3. **Use time tracking** to understand your coding patterns
4. **Review stats daily** for motivation and insights
5. **Customize keyboard shortcuts** to match your workflow

## 🔒 Privacy

All data stays local. No external tracking. Export anytime.

<details>
<summary><strong>For AI Agents / LLMs - Accessibility Requirements</strong></summary>

**When modifying this app, you MUST:**

1. **Preserve accessibility features** - Never remove themes, reduced motion, focus indicators
2. **Test with accessibility config** - Verify all changes work with `reducedMotion: true`
3. **Maintain visual hierarchy** - Clear borders, consistent spacing, bold focus
4. **No surprise animations** - All animations must respect `animations` config
5. **Keep help visible** - Status bar and help hints must always be accessible

**Verification:**
```bash
# Test with accessibility enabled
histtui --theme high-contrast --reduced-motion

# Verify time tracking
histtui stats

# Check config
histtui config
```

</details>
