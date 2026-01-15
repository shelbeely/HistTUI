# HistTUI HTML/CSS Demo

A static HTML/CSS replica of the HistTUI terminal user interface. This demo visually replicates the TUI experience in a browser, showcasing the Material Design 3 themed interface without requiring terminal access.

## Purpose

Since HistTUI is a Terminal User Interface (TUI) that uses text characters in a terminal, this demo provides a visual representation that can be:
- Shared easily via web browsers
- Embedded in presentations
- Used for design mockups
- Demonstrated to users without Node.js/Bun installation

## Files

- **demo.html** - Main HTML structure with Timeline and Branches screens
- **demo.css** - Complete styling matching Material Design 3 theme
- **demo.js** - Interactive keyboard navigation and screen switching

## Features

### Visual Accuracy
- ✅ Material Design 3 color scheme (#6750A4 primary)
- ✅ Monospace font matching terminal output
- ✅ Status bar with repo name and screen indicator
- ✅ Commit list with hash, message, author, and timestamp
- ✅ Branch list with indicators
- ✅ Help panel overlay
- ✅ Tab navigation bar
- ✅ Border styling matching terminal box-drawing characters

### Interactive Elements
- ✅ Keyboard shortcuts (1-6 for screen switching)
- ✅ j/k or arrow keys for navigation
- ✅ g/G for jump to first/last
- ✅ ? to toggle help panel
- ✅ Enter to view commit details (shows alert in demo)
- ✅ Tab switching between screens
- ✅ Click to select commits
- ✅ Visual feedback for key presses

## Usage

### Open in Browser
```bash
# Navigate to the repo directory
cd /path/to/HistTUI

# Open in default browser
open demo.html          # macOS
xdg-open demo.html      # Linux
start demo.html         # Windows
```

### Keyboard Shortcuts

**Navigation:**
- `j` or `↓` - Move down
- `k` or `↑` - Move up
- `g` - Jump to first item
- `G` - Jump to last item

**Screen Switching:**
- `1` - Timeline view
- `2` - Branches & Tags
- `3` - File Tree (not implemented in demo)
- `4` - Activity Dashboard (not implemented in demo)
- `5` - Repository Manager (not implemented in demo)
- `6` - Code Planner (not implemented in demo)

**Actions:**
- `?` - Toggle help panel
- `Enter` - View commit details (shows alert)
- `/` - Search (shows alert)
- `q` - Quit (shows alert)

## Technical Details

### Color Palette (Material Design 3)
```css
--md3-primary: #6750A4     /* Purple - main brand color */
--md3-success: #98c379     /* Green - success states */
--md3-warning: #e5c07b     /* Yellow - warnings */
--md3-error: #e06c75       /* Red - errors */
--md3-info: #61afef        /* Blue - information */
--md3-cyan: #56b6c2        /* Cyan - highlights */
--md3-background: #0c0c0c  /* Deep black */
--md3-foreground: #cccccc  /* Light gray text */
```

### Grid Layout
```
Status Bar (6750A4 background)
├─ Left: Repo name, Screen name
└─ Right: Time, AG-UI indicator

Content Area
├─ Header (title + subtitle)
├─ Help Panel (togglable)
└─ List Items (commits/branches)

Footer
└─ Hint text

Tab Bar
└─ 6 tabs for screen switching
```

## Differences from Real App

This is a **static demo** and differs from the actual HistTUI in these ways:

| Feature | Real App | Demo |
|---------|----------|------|
| Technology | React + Ink (terminal) | HTML + CSS + JS |
| Data Source | Live git repository | Hardcoded sample data |
| Performance | Native terminal rendering | Browser DOM rendering |
| Commit Details | Full diff viewer | Alert placeholder |
| Search | SQLite FTS with filters | Alert placeholder |
| File Tree | Live filesystem browsing | Not implemented |
| Code Planner | AI-powered specs | Not implemented |
| Multi-repo | Cache manager | Not implemented |

## Extending the Demo

To add more screens or features:

1. **Add new screen HTML** in `demo.html`:
```html
<div class="screen" id="your-screen" style="display: none;">
    <!-- Your content -->
</div>
```

2. **Add styling** in `demo.css`:
```css
.your-element {
    /* Your styles */
}
```

3. **Add interactivity** in `demo.js`:
```javascript
// Handle keyboard shortcuts
// Update UI elements
```

## Real App vs Demo

To experience the **real HistTUI** with:
- Live git repository analysis
- SQLite-powered instant search
- AI-powered code planning
- Multi-repository management
- Real commit diffs and file browsing

Install and run the actual application:

```bash
# Install
bun install -g histtui

# Run
histtui https://github.com/shelbeely/HistTUI
```

## License

This demo uses the same ISC license as HistTUI.

See [LICENSE](../LICENSE) for details.

---

**Note:** This demo is for visual representation only. For full functionality, use the actual HistTUI terminal application.
