# HistTUI Complete Demo - Documentation

A fully interactive, neurodivergent-friendly HTML/CSS/JS demo that replicates all HistTUI screens with Remotion compatibility.

## 🎯 Overview

This complete demo includes **all 6 main screens** plus commit detail view, with full keyboard navigation, neurodivergent-friendly theming, and Remotion-compatible structure for video generation.

## 📁 Files

- **demo-complete.html** - Complete HTML structure with all 7 screens
- **demo-complete.css** - Comprehensive styling with 5 neurodivergent-friendly themes
- **demo-complete.js** - Full interactivity with state management

## ✨ Features

### All Screens Implemented

1. **📊 Timeline** (Press 1)
   - Browse commits with vim navigation
   - View commit hash, message, author, date
   - Select commits with j/k keys
   - Press Enter to view details

2. **🌿 Branches & Tags** (Press 2)
   - Switch between branches and tags
   - See branch indicators (⭐ for current)
   - View commit counts and dates
   - Tab navigation between views

3. **🌳 File Tree Explorer** (Press 3)
   - Navigate directory structure
   - Folder/file icons
   - File sizes displayed
   - Indent levels for hierarchy

4. **📈 Activity Dashboard** (Press 4)
   - Repository statistics
   - Top contributors with visual bars
   - Recent activity timeline
   - Hot files by change count

5. **💾 Repository Manager** (Press 5)
   - Multi-repo management
   - Cache status indicators
   - Add/delete/update operations
   - Quick switching between repos

6. **🎯 Code Planner** (Press 6)
   - Specification list
   - Status indicators (🟢🟡⚪)
   - Detail view with AI suggestions
   - Template-based creation

7. **💬 Commit Details**
   - Full commit metadata
   - Files changed list
   - Diff viewer
   - Syntax-highlighted diffs

### Keyboard Navigation

**Screen Switching:**
- `1` - Timeline
- `2` - Branches & Tags
- `3` - File Tree
- `4` - Activity Dashboard
- `5` - Repository Manager
- `6` - Code Planner

**Navigation:**
- `j` or `↓` - Move down
- `k` or `↑` - Move up
- `g` - Jump to first
- `G` - Jump to last
- `h` or `←` or `Esc` - Go back

**Actions:**
- `Enter` - Select/View details
- `?` - Toggle help
- `/` - Search
- `q` - Quit (shows alert)
- `d` - Toggle diff (on commit detail)

**Repository Manager:**
- `a` - Add repository
- `d` - Delete repository
- `u` - Update from remote

**Code Planner:**
- `n` - New specification
- `c` - Context manager
- `t` - Browse templates

### Neurodivergent-Friendly Themes

Click the **🎨 Theme** button to switch:

1. **Default** - Material Design 3 (#6750A4)
   - Modern purple theme
   - Good contrast
   - Clean styling

2. **Calm** - Autism-Friendly
   - Soft blue tones (#7BA8D4)
   - Light background
   - Reduced motion
   - Gentle colors

3. **High Contrast**
   - Black background
   - Bright green accents (#00FF00)
   - Maximum readability
   - Clear distinctions

4. **Colorblind Safe**
   - Blue/orange palette
   - Accessible to all color vision types
   - Clear differentiation
   - Tested color combinations

5. **Monochrome Focus**
   - Black and white only
   - Eliminates color distractions
   - Pure focus on content
   - ADHD-friendly

### Accessibility Features

- ✅ **Reduced Motion** - Respects `prefers-reduced-motion`
- ✅ **Keyboard-first** - All features accessible via keyboard
- ✅ **Screen reader friendly** - Semantic HTML
- ✅ **High contrast support** - Multiple theme options
- ✅ **Visual feedback** - Key presses shown in status bar
- ✅ **Clear focus indicators** - Selected items highlighted
- ✅ **Responsive design** - Works on mobile/tablet

## 🎥 Remotion Compatibility

The demo is structured for Remotion video generation:

### API Access

```javascript
// Access the demo API
const demo = window.histtuiDemo;

// Switch screens programmatically
demo.api.switchScreen('timeline');
demo.api.switchScreen('branches');
demo.api.switchScreen('files');

// Apply themes
demo.api.applyTheme('calm');
demo.api.applyTheme('high-contrast');

// Navigate items
demo.api.moveSelection('down');
demo.api.moveSelection('up');
demo.api.moveSelection('first');
demo.api.moveSelection('last');

// Get current state
const screen = demo.api.getCurrentScreen();
const theme = demo.api.getCurrentTheme();
```

### State Management

The demo maintains state in `window.histtuiDemo.state`:

```javascript
{
  currentScreen: 'timeline',
  currentTheme: 'default',
  helpVisible: false,
  selectedItems: {
    timeline: 0,
    branches: 0,
    files: 0,
    repos: 0,
    planner: 0
  }
}
```

### Recording with Remotion

1. **Install Remotion**:
```bash
npm install remotion
```

2. **Create Composition**:
```typescript
import {Composition} from 'remotion';

export const RemotionRoot = () => {
  return (
    <Composition
      id="HistTUI"
      component={HistTUIDemo}
      durationInFrames={300}
      fps={30}
      width={1400}
      height={900}
    />
  );
};
```

3. **Render Video**:
```bash
npx remotion render src/index.ts HistTUI out/demo.mp4
```

## 🚀 Usage

### Open in Browser

```bash
# Navigate to repo directory
cd /path/to/HistTUI

# Open the complete demo
open demo-complete.html          # macOS
xdg-open demo-complete.html      # Linux
start demo-complete.html         # Windows
```

### Interact

1. **Click theme button** (top right) to change theme
2. **Press number keys 1-6** to switch screens
3. **Use j/k or arrow keys** to navigate items
4. **Press Enter** to view details
5. **Press ?** to toggle help panel

### Test All Features

```javascript
// Open browser console and try:

// Switch to each screen
for (let i = 1; i <= 6; i++) {
  setTimeout(() => {
    document.querySelector(`.tab[data-screen]:nth-child(${i})`).click();
  }, i * 1000);
}

// Cycle through themes
const themes = ['default', 'calm', 'high-contrast', 'colorblind', 'monochrome'];
themes.forEach((theme, i) => {
  setTimeout(() => {
    window.histtuiDemo.api.applyTheme(theme);
  }, i * 2000);
});
```

## 🎨 Visual Design Principles

### Neurodivergent-Friendly

1. **Clear Structure** - Consistent layout across all screens
2. **Visual Hierarchy** - Headers, borders, spacing
3. **Reduced Clutter** - Only essential information
4. **Focus Indicators** - Clear selection highlighting
5. **Predictable Behavior** - Same keys work everywhere

### Material Design 3

- **Primary Color**: #6750A4 (purple)
- **Typography**: Monospace fonts for terminal feel
- **Spacing**: 8px grid system
- **Borders**: Subtle lines and boxes
- **Animations**: Smooth but minimal

## 📊 Technical Details

### Performance

- **HTML**: 25KB (all screens)
- **CSS**: 16KB (all themes)
- **JS**: 18KB (full interactivity)
- **Total**: ~59KB (no dependencies)

### Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers

### No Build Required

- Pure HTML/CSS/JavaScript
- No frameworks or dependencies
- Works offline
- Instant loading

## 🆚 Real App vs Complete Demo

| Feature | Real App | Complete Demo |
|---------|----------|---------------|
| Screens | 9 screens | 7 screens (all main + detail) |
| Data | Live git repository | Sample data |
| Git Operations | Full read access | Visual simulation |
| Search | SQLite FTS | Alert placeholder |
| AI Features | Real LLM integration | Visual mockup |
| Performance | Terminal native | Browser DOM |
| Themes | 8+ themes | 5 themes |
| Installation | Bun/Node required | Just open HTML |

## 🔄 Update from Simple Demo

The simple `demo.html` had only 2 screens. This complete version adds:

- ✅ 4 additional main screens (Files, Dashboard, Repos, Planner)
- ✅ Commit detail screen
- ✅ 5 neurodivergent-friendly themes
- ✅ Theme selector UI
- ✅ Complete keyboard navigation
- ✅ State management
- ✅ Remotion API compatibility
- ✅ Accessibility features
- ✅ Responsive design
- ✅ Visual feedback
- ✅ Console API

## 📝 Creating GIFs with Remotion

### Basic Setup

1. **Create Remotion Project**:
```bash
npx create-video --remotion
cd my-video
```

2. **Add HistTUI Demo**:
```bash
# Copy demo files
cp ../HistTUI/demo-complete.* public/
```

3. **Create Demo Component**:
```typescript
import {useCurrentFrame, useVideoConfig, Iframe} from 'remotion';

export const HistTUIDemo = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  
  // Calculate which screen to show
  const screenIndex = Math.floor(frame / (fps * 2)) % 6;
  const screens = ['timeline', 'branches', 'files', 'dashboard', 'repos', 'planner'];
  
  return (
    <Iframe
      src="/demo-complete.html"
      width={1400}
      height={900}
    />
  );
};
```

4. **Render GIF**:
```bash
npx remotion render src/index.ts HistTUI out/demo.gif
```

### Advanced Recording

Use Playwright to control the demo:

```typescript
import {Page} from 'playwright';

// Navigate screens
await page.keyboard.press('1'); // Timeline
await page.waitForTimeout(2000);
await page.keyboard.press('2'); // Branches
await page.waitForTimeout(2000);

// Change themes
await page.click('#theme-toggle');
await page.click('[data-theme="calm"]');
await page.waitForTimeout(2000);

// Navigate items
await page.keyboard.press('j');
await page.keyboard.press('j');
await page.keyboard.press('Enter');
```

## 🎯 Next Steps

To create production videos:

1. ✅ Complete demo is ready
2. ⏳ Set up Remotion project
3. ⏳ Create recording scripts
4. ⏳ Render individual screen GIFs
5. ⏳ Create combined demo video
6. ⏳ Add voiceover or captions

## 📚 Additional Resources

- [Remotion Documentation](https://www.remotion.dev/docs)
- [Material Design 3](https://m3.material.io/)
- [Neurodiversity Design](https://neurodiversity.design/)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 🤝 Contributing

To extend the demo:

1. Add new screens in HTML
2. Style in CSS with theme support
3. Add keyboard handlers in JS
4. Update state management
5. Test accessibility
6. Document changes

---

**Ready to record!** All screens are complete, visually accurate, and Remotion-compatible. 🎬
