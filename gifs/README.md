# HistTUI Demo GIFs

Animated GIF demonstrations of all HistTUI features captured from the interactive HTML demo.

## 📁 GIFs Created

### 1. Overview - All Screens (01-overview-screens.gif)
**Duration**: 13 seconds | **Size**: 468 KB
- Cycles through all 6 main screens
- Shows screen transitions with keyboard shortcuts (1-6)
- Demonstrates the complete interface

### 2. Timeline Navigation (02-timeline-navigation.gif)
**Duration**: 10 seconds | **Size**: 203 KB
- Vim-style navigation (j/k keys)
- Jump to first/last commit (g/G keys)
- View commit details (Enter key)
- Shows smooth selection movement

### 3. Theme Showcase (03-themes-showcase.gif)
**Duration**: 16 seconds | **Size**: 411 KB
- All 5 neurodivergent-friendly themes:
  - Default (Material Design 3)
  - Calm (Autism-Friendly)
  - High Contrast
  - Colorblind Safe
  - Monochrome Focus
- Theme selector interaction

### 4. Activity Dashboard (04-dashboard-stats.gif)
**Duration**: 3.5 seconds | **Size**: 100 KB
- Repository statistics
- Top contributors with visual bars
- Recent activity timeline
- Hot files by change count

### 5. File Tree Explorer (05-file-tree.gif)
**Duration**: 5.4 seconds | **Size**: 105 KB
- Directory structure navigation
- Folder/file icons
- Selection movement
- Hierarchical display

### 6. Code Planner (06-code-planner.gif)
**Duration**: 6 seconds | **Size**: 145 KB
- Specification list
- AI-powered suggestions
- Problem/requirements/solution format
- Status indicators

### 7. Help Panel (07-help-panel.gif)
**Duration**: 5.5 seconds | **Size**: 148 KB
- Keyboard shortcuts overlay
- Toggle on/off with '?' key
- Complete command reference

## 🎬 Generation Method

**Current Implementation: Playwright + ffmpeg**

The GIFs were generated using:
1. **Playwright** - Browser automation to interact with `demo-complete.html`
2. **PNG Frames** - Captured at 10 fps during interactions
3. **ffmpeg** - Converted PNG sequences to optimized GIFs

**Generation Script**: `scripts/generate-demo-gifs.cjs`

### Run the Generator

```bash
# Install dependencies
npm install

# Generate all GIFs
node scripts/generate-demo-gifs.cjs
```

## 🎥 Alternative: Remotion (Not Yet Implemented)

The demo is Remotion-compatible with the exposed API:

```javascript
// API available at window.histtuiDemo.api
switchScreen('timeline');
applyTheme('calm');
moveSelection('down');
```

### To Use Remotion (Future Enhancement)

1. **Install Remotion**:
```bash
npm install remotion
```

2. **Create Remotion Composition**:
```typescript
import {Composition} from 'remotion';
import {HistTUIDemo} from './HistTUIDemo';

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

## 📊 Technical Details

**Capture Settings**:
- Resolution: 1400×900
- Frame Rate: 10 fps
- Format: Animated GIF
- Optimization: Palette generation for smaller file sizes

**Total Size**: ~1.6 MB (all 7 GIFs)

## 🚀 Usage in Documentation

Add GIFs to README or docs:

```markdown
![Screen Navigation](gifs/01-overview-screens.gif)
![Theme Showcase](gifs/03-themes-showcase.gif)
```

## 🔄 Regenerate GIFs

To regenerate all GIFs:

```bash
# Clean old GIFs
rm -rf gifs/*.gif gifs/.temp*

# Generate new ones
node scripts/generate-demo-gifs.cjs
```

## 📝 Customization

Edit `scripts/generate-demo-gifs.cjs` to:
- Add new scenarios
- Change timing/duration
- Adjust frame rate
- Modify viewport size

Example scenario:
```javascript
{
  name: '08-custom-workflow',
  actions: [
    { type: 'key', key: '1' },
    { type: 'wait', duration: 1000 },
    { type: 'key', key: 'j' },
    { type: 'wait', duration: 500 },
    { type: 'key', key: 'Enter' },
    { type: 'wait', duration: 2000 },
  ]
}
```

---

**All GIFs are optimized for web use and GitHub markdown compatibility!**
