# Remotion GIF Generation

This directory contains the Remotion project for generating professional demo GIFs from the HistTUI HTML demo.

## Structure

```
remotion/
├── index.ts              # Entry point (registers Root)
├── Root.tsx              # Defines all compositions
├── compositions/         # Individual video compositions
│   ├── OverviewScreens.tsx     # Cycles through all 6 screens
│   ├── TimelineNavigation.tsx  # Vim navigation demo
│   ├── ThemesShowcase.tsx      # All 5 themes
│   ├── DashboardStats.tsx      # Activity dashboard
│   ├── FileTreeExplorer.tsx    # File tree
│   ├── CodePlanner.tsx         # Code planner
│   └── HelpPanel.tsx           # Help overlay
└── components/           # Reusable components
    └── DemoFrame.tsx     # Iframe wrapper for demo-complete.html
```

## Compositions

All compositions are 1280x720 @ 30fps:

1. **overview-screens** (15s) - Cycles through Timeline → Branches → Files → Dashboard → Repos → Planner
2. **timeline-navigation** (10s) - Demonstrates j/k navigation and commit selection
3. **themes-showcase** (15s) - Shows all 5 neurodivergent-friendly themes
4. **dashboard-stats** (8s) - Activity dashboard with stats
5. **file-tree-explorer** (8s) - File tree navigation
6. **code-planner** (10s) - AI spec creation workflow
7. **help-panel** (6s) - Help overlay toggle

## Usage

### Preview in Remotion Studio

```bash
npx remotion studio
```

### Render a Single Composition

```bash
# Render to MP4
npx remotion render overview-screens output.mp4

# Render to GIF directly
npx remotion render overview-screens output.gif --codec gif
```

### Render All GIFs

```bash
# Run the automated script
./scripts/render-remotion-gifs.sh
```

This will:
1. Render all 7 compositions to MP4 (h264 codec)
2. Convert each MP4 to an optimized GIF using ffmpeg
3. Output to `gifs/remotion/`

## How It Works

Each Remotion composition:
1. Loads `demo-complete.html` via `<Iframe>`
2. Passes URL parameters to control screen, theme, selection
3. Uses `useCurrentFrame()` to animate state changes
4. Renders frames to video using Remotion's rendering engine

The DemoFrame component wraps the HTML demo in an iframe with:
- Controlled screen switching
- Theme selection
- Navigation state
- Help panel visibility

## Customization

### Change Video Quality

Edit `remotion.config.ts`:

```ts
Config.setVideoImageFormat('png'); // Higher quality than jpeg
Config.setCrf(18); // Lower CRF = higher quality (default 23)
```

### Adjust Timing

Edit individual composition files in `compositions/` to change:
- `durationInFrames` - Length of video
- Frame-based logic - When transitions occur

### Modify Dimensions

Edit `Root.tsx` composition definitions:

```tsx
<Composition
  id="overview-screens"
  width={1920}  // 1080p
  height={1080}
  // ...
/>
```

## Dependencies

- `remotion` - React-based video rendering
- `@remotion/cli` - Command-line tools
- `ffmpeg` - For MP4 → GIF conversion (must be installed separately)

## Troubleshooting

### "Cannot find module 'remotion'"

```bash
npm install -D remotion @remotion/cli
```

### GIF conversion fails

Install ffmpeg:

```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt-get install ffmpeg

# Windows
# Download from https://ffmpeg.org/download.html
```

### Iframe doesn't load

Ensure `demo-complete.html` exists and the path in `DemoFrame.tsx` is correct.

## Output

Generated GIFs are saved to `gifs/remotion/`:
- `01-overview-screens.gif` (~2-3 MB)
- `02-timeline-navigation.gif` (~1-2 MB)
- `03-themes-showcase.gif` (~2-3 MB)
- `04-dashboard-stats.gif` (~1-2 MB)
- `05-file-tree.gif` (~1-2 MB)
- `06-code-planner.gif` (~1-2 MB)
- `07-help-panel.gif` (~1 MB)

Total size: ~10-15 MB for all 7 GIFs.
