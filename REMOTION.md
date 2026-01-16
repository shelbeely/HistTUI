# Remotion GIF Generation Guide

This guide explains how to generate professional demo GIFs using Remotion for the HistTUI project.

## What is Remotion?

Remotion is a framework for creating videos programmatically using React. It allows us to:
- Define video compositions as React components
- Control animations frame-by-frame
- Render high-quality videos or GIFs
- Automate the entire video creation process

## Why Remotion?

Instead of manually recording screen captures, Remotion provides:
- ✅ **Reproducible** - Same output every time
- ✅ **Programmable** - Full control over timing and transitions
- ✅ **High Quality** - Crisp, professional output
- ✅ **Automated** - No manual recording needed
- ✅ **Version Controlled** - Video logic lives in code

## Project Structure

```
HistTUI/
├── remotion/                    # Remotion project root
│   ├── index.ts                 # Entry point (registers compositions)
│   ├── Root.tsx                 # Defines all 7 compositions
│   ├── compositions/            # Individual video compositions
│   │   ├── OverviewScreens.tsx      # All 6 screens cycle
│   │   ├── TimelineNavigation.tsx   # j/k navigation
│   │   ├── ThemesShowcase.tsx       # 5 themes
│   │   ├── DashboardStats.tsx       # Dashboard view
│   │   ├── FileTreeExplorer.tsx     # File tree
│   │   ├── CodePlanner.tsx          # Planner view
│   │   └── HelpPanel.tsx            # Help overlay
│   ├── components/              # Reusable components
│   │   └── DemoFrame.tsx        # Iframe wrapper for demo
│   └── README.md                # Remotion-specific docs
├── remotion.config.ts           # Remotion configuration
├── scripts/
│   └── render-remotion-gifs.sh  # Automated rendering script
├── demo-complete.html           # HTML demo (rendered in videos)
├── demo-complete.css            # Demo styling
└── demo-complete.js             # Demo interactivity
```

## Compositions

All compositions are **1280×720** @ **30 FPS**:

### 1. Overview Screens (15s)
**ID**: `overview-screens`  
**Duration**: 450 frames (15 seconds)  
**Description**: Cycles through all 6 main screens

```tsx
// Transitions every 75 frames (2.5s per screen)
Timeline (0-75) → Branches (75-150) → Files (150-225) → 
Dashboard (225-300) → Repos (300-375) → Planner (375-450)
```

### 2. Timeline Navigation (10s)
**ID**: `timeline-navigation`  
**Duration**: 300 frames (10 seconds)  
**Description**: Demonstrates vim-style j/k navigation

```tsx
// Selection changes every 30 frames
selectedIndex = floor((frame % 150) / 30)
// Shows commit selection and detail view
```

### 3. Themes Showcase (15s)
**ID**: `themes-showcase`  
**Duration**: 450 frames (15 seconds)  
**Description**: Cycles through all 5 neurodivergent-friendly themes

```tsx
// Transitions every 90 frames (3s per theme)
Default (0-90) → Calm (90-180) → High Contrast (180-270) → 
Colorblind (270-360) → Monochrome (360-450)
```

### 4. Dashboard Stats (8s)
**ID**: `dashboard-stats`  
**Duration**: 240 frames (8 seconds)  
**Description**: Activity dashboard with stats

### 5. File Tree Explorer (8s)
**ID**: `file-tree-explorer`  
**Duration**: 240 frames (8 seconds)  
**Description**: File tree navigation

### 6. Code Planner (10s)
**ID**: `code-planner`  
**Duration**: 300 frames (10 seconds)  
**Description**: AI spec creation workflow

### 7. Help Panel (6s)
**ID**: `help-panel`  
**Duration**: 180 frames (6 seconds)  
**Description**: Help overlay toggle

```tsx
// Help panel visible between frames 30-150
showHelp = frame > 30 && frame < 150
```

## How It Works

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│ Remotion Composition (React Component)                  │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ DemoFrame Component                                 │ │
│  │                                                      │ │
│  │  ┌──────────────────────────────────────────────┐  │ │
│  │  │ <Iframe src="demo-complete.html?params" />   │  │ │
│  │  │                                                │  │ │
│  │  │  Loads actual HTML demo with:                 │  │ │
│  │  │  - screen=timeline                            │  │ │
│  │  │  - theme=calm                                 │  │ │
│  │  │  - selected=2                                 │  │ │
│  │  │  - help=true                                  │  │ │
│  │  └──────────────────────────────────────────────┘  │ │
│  │                                                      │ │
│  │  Frame-by-frame rendering controlled by             │ │
│  │  useCurrentFrame() hook                             │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  Remotion renders each frame to PNG/JPEG                │
│  FFmpeg converts frames to MP4/GIF                      │
└─────────────────────────────────────────────────────────┘
```

### Frame-Based Animation

Remotion uses `useCurrentFrame()` to get the current frame number:

```tsx
const frame = useCurrentFrame(); // 0, 1, 2, 3, ...

// Calculate which screen to show
const currentScreen = 
  frame < 75 ? 'timeline' :
  frame < 150 ? 'branches' :
  frame < 225 ? 'files' :
  'dashboard';

// Pass to DemoFrame
<DemoFrame screen={currentScreen} theme="default" />
```

### URL Parameter Control

The `demo-complete.html` accepts URL parameters:

```
demo-complete.html?screen=timeline&theme=calm&selected=2&help=true
```

Parameters:
- `screen` - Which screen to display (`timeline`, `branches`, `files`, `dashboard`, `repos`, `planner`)
- `theme` - Which theme to apply (`default`, `calm`, `high-contrast`, `colorblind`, `monochrome`)
- `selected` - Selected item index (0-9)
- `help` - Show help panel (`true`/`false`)

## Usage

### 1. Preview in Remotion Studio

Launch the interactive studio to preview and edit compositions:

```bash
npm run remotion:studio
```

This opens `http://localhost:3000` with:
- Live preview of all compositions
- Timeline scrubbing
- Real-time editing
- Composition selector

### 2. Render a Single Composition

Render one composition to MP4:

```bash
npx remotion render overview-screens output.mp4
```

Render directly to GIF:

```bash
npx remotion render overview-screens output.gif --codec gif
```

### 3. Render All GIFs (Automated)

Run the automated script to generate all 7 GIFs:

```bash
npm run generate-gifs
```

Or directly:

```bash
./scripts/render-remotion-gifs.sh
```

This script:
1. Renders each composition to MP4 (h264 codec)
2. Converts each MP4 to optimized GIF using ffmpeg
3. Outputs to `gifs/remotion/`

**Output:**
- `gifs/remotion/01-overview-screens.gif` (~2-3 MB)
- `gifs/remotion/02-timeline-navigation.gif` (~1-2 MB)
- `gifs/remotion/03-themes-showcase.gif` (~2-3 MB)
- `gifs/remotion/04-dashboard-stats.gif` (~1-2 MB)
- `gifs/remotion/05-file-tree.gif` (~1-2 MB)
- `gifs/remotion/06-code-planner.gif` (~1-2 MB)
- `gifs/remotion/07-help-panel.gif` (~1 MB)

**Total**: ~10-15 MB for all GIFs

## Customization

### Change Video Quality

Edit `remotion.config.ts`:

```ts
import { Config } from '@remotion/cli/config';

// Higher quality frames (default: jpeg)
Config.setVideoImageFormat('png');

// Lower CRF = higher quality (default: 23, range: 0-51)
Config.setCrf(18);

// Overwrite existing files
Config.setOverwriteOutput(true);
```

### Adjust Composition Timing

Edit `remotion/Root.tsx`:

```tsx
<Composition
  id="overview-screens"
  component={OverviewScreens}
  durationInFrames={600}  // Change from 450 to 600 (20s instead of 15s)
  fps={30}
  width={1280}
  height={720}
/>
```

### Modify Transition Timing

Edit individual composition files (e.g., `remotion/compositions/OverviewScreens.tsx`):

```tsx
// Change transition timing
const currentScreen = 
  frame < 100 ? 'timeline' :     // Longer on timeline
  frame < 150 ? 'branches' :     // Shorter on branches
  frame < 250 ? 'files' :        // Longer on files
  'dashboard';
```

### Change Video Dimensions

For different aspect ratios:

```tsx
// 1080p (16:9)
<Composition width={1920} height={1080} />

// Square (1:1)
<Composition width={1080} height={1080} />

// Vertical (9:16)
<Composition width={1080} height={1920} />
```

### Add New Compositions

1. Create new composition file in `remotion/compositions/`:

```tsx
// remotion/compositions/MyNewDemo.tsx
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { DemoFrame } from '../components/DemoFrame';

export const MyNewDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#1a1a1a' }}>
      <DemoFrame screen="timeline" theme="default" />
    </AbsoluteFill>
  );
};
```

2. Register in `remotion/Root.tsx`:

```tsx
import { MyNewDemo } from './compositions/MyNewDemo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Existing compositions */}
      <Composition
        id="my-new-demo"
        component={MyNewDemo}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
```

## Advanced Features

### Interpolation

Smooth transitions between values:

```tsx
import { interpolate } from 'remotion';

const frame = useCurrentFrame();

// Fade in
const opacity = interpolate(frame, [0, 30], [0, 1], {
  extrapolateRight: 'clamp'
});

// Scale up
const scale = interpolate(frame, [0, 60], [0.8, 1], {
  extrapolateRight: 'clamp'
});

<div style={{ opacity, transform: `scale(${scale})` }}>
  <DemoFrame screen="timeline" theme="default" />
</div>
```

### Spring Animations

Natural, physics-based animations:

```tsx
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

const scale = spring({
  frame,
  fps,
  from: 0.8,
  to: 1,
  config: {
    damping: 100,
    stiffness: 200
  }
});
```

### Audio Integration

Add background music or sound effects:

```tsx
import { Audio } from 'remotion';

<>
  <Audio src="music.mp3" volume={0.3} />
  <DemoFrame screen="timeline" theme="default" />
</>
```

## Troubleshooting

### "Cannot find module 'remotion'"

Install dependencies:

```bash
npm install -D remotion @remotion/cli
```

### GIF conversion fails

Ensure ffmpeg is installed:

```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt-get install ffmpeg

# Windows
# Download from https://ffmpeg.org/download.html
```

Verify installation:

```bash
ffmpeg -version
```

### Iframe doesn't load demo

Check that `demo-complete.html` exists at the expected path:

```bash
ls -la demo-complete.html
```

Update the path in `remotion/components/DemoFrame.tsx` if needed:

```tsx
src={`file://${process.cwd()}/demo-complete.html?...`}
```

### Rendering is slow

Rendering can take time. Expected durations:
- **15s video**: ~2-5 minutes to render
- **All 7 compositions**: ~15-30 minutes total

Speed up rendering:
- Reduce frame count (lower duration)
- Lower resolution (e.g., 1280×720 → 960×540)
- Use JPEG instead of PNG frames
- Enable concurrency: `--concurrency 4`

### Out of memory errors

Remotion can be memory-intensive. Solutions:
- Close other applications
- Increase Node.js memory: `NODE_OPTIONS=--max-old-space-size=8192 npm run generate-gifs`
- Render compositions individually instead of all at once

## Performance Tips

### Optimize GIF Size

The render script uses ffmpeg with optimal settings:

```bash
ffmpeg -i input.mp4 \
  -vf "fps=15,scale=800:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
  -loop 0 output.gif
```

This:
- Reduces FPS to 15 (from 30) - 50% smaller
- Scales to 800px wide - adjustable
- Uses lanczos scaling - high quality
- Generates optimal color palette - smaller file

### Reduce FPS for GIFs

Lower FPS is fine for GIFs (human eye perceives 12-15 fps as smooth):

```tsx
<Composition
  fps={15}  // Instead of 30
  // ...
/>
```

### Shorter Durations

Keep compositions under 15 seconds for reasonable GIF sizes:

```tsx
durationInFrames={300}  // 10s @ 30fps
// vs
durationInFrames={600}  // 20s @ 30fps (2x file size)
```

## Deployment

### CI/CD Integration

Add to GitHub Actions:

```yaml
- name: Generate Demo GIFs
  run: |
    npm install
    npm run generate-gifs
    
- name: Upload GIFs
  uses: actions/upload-artifact@v3
  with:
    name: demo-gifs
    path: gifs/remotion/*.gif
```

### Automated Regeneration

Regenerate GIFs on demo changes:

```yaml
on:
  push:
    paths:
      - 'demo-complete.html'
      - 'demo-complete.css'
      - 'demo-complete.js'
      - 'remotion/**'
```

## Comparison: Remotion vs Playwright

| Feature | Remotion | Playwright (Previous) |
|---------|----------|----------------------|
| **Method** | React components, programmatic | Browser automation, screen capture |
| **Quality** | High (direct rendering) | Medium (screen capture) |
| **Reproducibility** | Perfect (deterministic) | Good (browser-dependent) |
| **Control** | Frame-by-frame precision | Timing-based |
| **File Size** | Optimized (~2 MB per GIF) | Larger (~4 MB per GIF) |
| **Speed** | Slower (full render) | Faster (real-time capture) |
| **Dependencies** | ~100 MB (Remotion) | ~400 MB (Playwright browsers) |
| **Customization** | Full React/CSS | Limited to HTML demo |
| **Learning Curve** | Steeper (React knowledge) | Easier (JavaScript) |

**Recommendation**: Use Remotion for production-quality GIFs, Playwright for quick iteration.

## Resources

- [Remotion Documentation](https://www.remotion.dev/docs/)
- [Remotion Examples](https://github.com/remotion-dev/remotion/tree/main/packages/example)
- [Remotion Discord](https://discord.gg/remotion)
- [FFmpeg Documentation](https://ffmpeg.org/documentation.html)

## License

This Remotion project is part of HistTUI and follows the same license.
