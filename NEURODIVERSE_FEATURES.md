# 🧠 Neurodiversity Features Guide

**HistTUI is specifically designed for ADHD and autism developers.** This guide covers all neurodiversity-friendly features.

## 🎯 Table of Contents

- [Pomodoro Timer](#-pomodoro-timer)
- [Focus Mode](#-focus-mode)
- [Sensory Controls](#-sensory-controls)
- [Routine Templates](#-routine-templates)
- [Gamification](#-gamification-system)
- [Themes](#-accessibility-themes)
- [Time Tracking](#-time-tracking)
- [Configuration](#%EF%B8%8F-configuration)

---

## 🍅 Pomodoro Timer

**Perfect for ADHD time management and focus.**

### Features
- 25-minute work sessions (customizable)
- 5-minute short breaks
- 15-minute long breaks (every 4 sessions)
- Visual countdown in status bar
- Audio alerts (can be disabled)
- Auto-pause on idle detection
- Session statistics

### Usage

```bash
# Start with Pomodoro mode
histtui --pomodoro <repo-url>

# Custom durations (50 min work, 10 min break)
histtui --pomodoro --work 50 --break 10 <repo-url>

# Silent mode (no sounds)
histtui --pomodoro --silent <repo-url>
```

### Keyboard Shortcuts
- `P` - Start/pause Pomodoro
- `Shift+P` - Skip to next phase
- `Ctrl+P` - Reset timer

### Configuration

```json
{
  "pomodoro": {
    "enabled": true,
    "workDuration": 25,
    "breakDuration": 5,
    "longBreakDuration": 15,
    "sessionsBeforeLongBreak": 4,
    "autoStart": false,
    "soundEnabled": true,
    "soundVolume": 0.5
  }
}
```

---

## 🎯 Focus Mode

**Eliminate distractions for deep work.**

### Features
- Hide non-essential UI elements
- Zen mode (absolute minimal UI)
- Dim inactive panels
- Block notifications during focus
- Track focus sessions
- Calculate focus score (based on interruptions)

### Usage

```bash
# Launch in focus mode
histtui --focus <repo-url>

# Zen mode (minimal UI)
histtui --focus --zen <repo-url>
```

### Keyboard Shortcuts
- `F` - Toggle focus mode
- `Shift+F` - Toggle zen mode

### Focus Score
- Starts at 100
- -10 points per interruption
- Minimum 0

### Configuration

```json
{
  "focusMode": {
    "hideStatusBar": false,
    "hideBreadcrumbs": true,
    "hideHelpHints": true,
    "dimInactive": true,
    "notificationsOff": true,
    "zenMode": false
  }
}
```

---

## 🔊 Sensory Controls

**Fine-tune your sensory experience.**

### Visual Settings
- **Density:** Compact / Normal / Spacious
- **Animations:** None / Slow / Normal / Fast
- **Font Scale:** 0.8x - 2.0x
- **Line Height:** 1.0 - 2.0
- **Color Saturation:** 0.0 - 2.0
- **Contrast:** 0.5 - 2.0

### Audio Settings
- **Sound Type:** Beep / Chime / Voice / None
- **Volume:** 0.0 - 1.0
- **Notifications:** Duration, position, batching

### Presets

**Minimal Sensory** (Autism-friendly):
- Spacious layout
- No animations
- Large text (1.2x)
- High line height (1.8)
- Low saturation (0.5)
- Sounds off

**High Stimulation** (ADHD-friendly):
- Compact layout
- Fast animations
- Vibrant colors (1.5x saturation)
- Higher contrast (1.3)
- Audio enabled

### Usage

```bash
# Open sensory control panel
histtui sensory

# Use a preset
histtui --sensory minimal <repo-url>
```

### Configuration

```json
{
  "sensory": {
    "visualDensity": "normal",
    "animationSpeed": "slow",
    "fontScale": 1.0,
    "lineHeight": 1.5,
    "colorSaturation": 1.0,
    "contrast": 1.0,
    "soundEnabled": true,
    "soundVolume": 0.5,
    "soundType": "beep"
  }
}
```

---

## 📋 Routine Templates

**Reduce decision fatigue with pre-defined workflows.**

### Built-in Templates

**1. Morning Deep Work** (120 min)
- Review goals (5 min)
- Enable focus mode
- Start Pomodoro
- Deep work session (90 min)

**2. Quick Bug Fix** (45 min)
- Review issue (5 min)
- Locate code (10 min)
- Apply fix (15 min)
- Test fix (10 min)
- Commit (5 min)

**3. End of Day Review** (30 min)
- View stats (5 min)
- Review commits (10 min)
- Plan tomorrow (10 min)
- Celebrate wins (5 min)

### Usage

```bash
# Use a routine template
histtui --routine morning-deep-work <repo-url>

# List all templates
histtui routines --list

# Create custom template
histtui routines --create
```

### Keyboard Shortcuts
- `R` - Open routine selector
- `Space` - Complete current step
- `S` - Skip current step
- `Esc` - Exit routine

### Auto-Suggestions

Routines are automatically suggested based on time of day:
- **Morning (6am-12pm):** Deep Work
- **Afternoon (12pm-5pm):** Quick tasks
- **Evening (5pm-10pm):** Review and planning

---

## 🎮 Gamification System

**Motivation through achievements and XP.**

### Features
- XP points for all activities
- Level system (1-100)
- Achievement badges
- Daily challenges
- Personal bests tracking
- Progress bars everywhere

### Achievements

**Streak Achievements:**
- 🔥 Week Warrior - 7 day streak (100 XP)
- 🏆 Month Master - 30 day streak (500 XP)

**Milestone Achievements:**
- 💯 Century - 100 commits (200 XP)
- 🌟 Millennium - 1000 commits (1000 XP)
- ⏱️ Centurion - 100 hours coded (300 XP)

**Mastery Achievements:**
- 🎯 Focus Master - 50 focus sessions (250 XP)
- 🍅 Tomato King - 100 Pomodoros (300 XP)

### XP System
- Commit: 10 XP
- Focus session: 25 XP
- Pomodoro complete: 15 XP
- Daily streak: 50 XP
- Achievement unlock: Varies

### Usage

```bash
# View achievements
histtui achievements

# View your progress
histtui profile
```

### Configuration

```json
{
  "gamification": {
    "enabled": true,
    "showAchievements": true,
    "showXP": true,
    "celebrationAnimations": true
  }
}
```

---

## 🎨 Accessibility Themes

**6 professionally designed themes.**

### 1. High Contrast
Maximum readability for ADHD.
- Bright colors on black background
- Clear focus indicators
- No distractions

### 2. Calm
Reduced stimulation for autism.
- Soft, pastel colors
- Low saturation
- Comfortable for long sessions

### 3. Colorblind Safe
Deuteranopia/Protanopia friendly.
- Blue/orange palette
- No red/green confusion
- High contrast

### 4. Solarized Neurodivergent
Science-based readability.
- Proven contrast ratios
- Reduced blue light
- Warm, comfortable

### 5. Monochrome Focus
Zero color distractions.
- Pure grayscale
- Maximum text contrast
- Perfect for hyperfocus

### 6. Default
Modern, balanced theme.

### Usage

```bash
# Use a theme
histtui --theme high-contrast <repo-url>

# List all themes
histtui themes --list

# Preview themes
histtui themes --preview
```

---

## ⏱️ Time Tracking

**WakaTime-like local tracking.**

See [ACCESSIBILITY.md](./ACCESSIBILITY.md) for detailed time tracking features.

---

## ⚙️ Configuration

**Complete configuration example:**

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
    "idleTimeout": 300,
    "trackFiles": true,
    "trackLanguages": true
  },
  "ui": {
    "theme": "high-contrast",
    "showBreadcrumbs": true,
    "showHelpHints": true,
    "animations": "reduced"
  },
  "pomodoro": {
    "enabled": true,
    "workDuration": 25,
    "breakDuration": 5,
    "soundEnabled": true
  },
  "focusMode": {
    "hideStatusBar": false,
    "hideBreadcrumbs": true,
    "notificationsOff": true
  },
  "sensory": {
    "visualDensity": "spacious",
    "animationSpeed": "slow",
    "fontScale": 1.2,
    "soundVolume": 0.3
  },
  "gamification": {
    "enabled": true,
    "showAchievements": true,
    "celebrationAnimations": false
  },
  "routines": {
    "autoSuggest": true,
    "favoriteTemplate": "morning-deep-work"
  }
}
```

### Configuration File Location
`~/.histtui/config.json`

---

## 💡 Tips for ADHD Developers

1. **Use Pomodoro** to break work into manageable chunks
2. **Enable gamification** for motivation boosts
3. **High contrast theme** reduces visual overwhelm
4. **Time tracking** helps understand your patterns
5. **Routine templates** eliminate decision fatigue

## 💡 Tips for Autism Developers

1. **Calm theme** reduces sensory overload
2. **Reduced motion** prevents distraction
3. **Predictable routines** create structure
4. **Focus mode** eliminates surprises
5. **Detailed stats** satisfy pattern recognition needs

---

## 🔒 Privacy

All features are **100% local**:
- No external API calls
- No cloud sync
- No tracking
- Export data anytime
- You control everything

---

<details>
<summary><strong>For AI Agents / LLMs - Feature Requirements</strong></summary>

**When modifying neurodiversity features, you MUST:**

1. **Preserve all accessibility options** - Never remove settings
2. **Test with extreme configurations** - Max font size, no animations, zen mode
3. **Maintain predictability** - No surprise UI changes
4. **Keep customization** - Users must control their experience
5. **No forced features** - Everything must be opt-in

**Verification:**
```bash
# Test Pomodoro
histtui --pomodoro --silent test-repo

# Test focus mode
histtui --focus --zen test-repo

# Test sensory presets
histtui --sensory minimal test-repo

# Verify config loads
cat ~/.histtui/config.json | jq .pomodoro
```

**Required Tests:**
- Pomodoro timer countdown
- Focus mode UI hiding
- Sensory preset application
- Routine template execution
- Achievement unlock logic
- XP calculation
- Theme application

</details>
