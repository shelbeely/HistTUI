# HistTUI Keyboard Cheat Sheet

**Tri-Fold Reference Guide** • Version 1.1.0 • US Letter Landscape

---

## Panel 1 (Front Cover - Outside Right)

### HistTUI
**Keyboard Cheat Sheet**

Interactive Git History TUI  
Explore repository history with vim-style navigation

**Quick Reference Guide**  
Material Design 3 • AI-Powered • Multi-Repo

Version 1.1.0

---

## Panel 2 (Inside Left)

### Screen Navigation

**Press number keys to jump between screens:**

- **1** — Timeline View
- **2** — Branches & Tags
- **3** — File Tree Explorer
- **4** — Activity Dashboard
- **5** — Repository Manager
- **6** — Code Planner

### Global Commands

- **q** — Quit application
- **Ctrl+C** — Force quit
- **?** or **h** — Toggle help overlay
- **/** — Search/Filter
- **Ctrl+F** — Search (alternate)
- **Esc** — Go back/Cancel

### Tab Navigation

- **Tab** — Next tab
- **Ctrl+N** — Next tab (alternate)
- **Shift+Tab** — Previous tab
- **Ctrl+P** — Previous tab (alternate)

---

## Panel 3 (Inside Center)

### Vim-Style Movement

**Basic Navigation:**

- **j** or **↓** — Move down
- **k** or **↑** — Move up
- **h** or **←** — Move left/Go back
- **l** or **→** — Move right/Select
- **Enter** — Select/Confirm

**Fast Navigation:**

- **Ctrl+D** — Page down
- **Ctrl+U** — Page up
- **PgDn** — Page down (alternate)
- **PgUp** — Page up (alternate)
- **g** — Jump to top/first item
- **G** — Jump to bottom/last item
- **Home** — Jump to start
- **End** — Jump to end

### Timeline Screen

- **Enter** — View commit details
- **/** — Filter commits
- **1-6** — Switch screens

---

## Panel 4 (Inside Right)

### Commit Detail View

- **d** — Toggle diff view mode
- **←** or **Esc** — Back to timeline
- **j/k** — Navigate file changes
- **Tab** — Switch panels

### Branches & Tags

- **Tab** — Switch between branches/tags
- **Enter** — View branch history
- **/** — Search branches

### File Tree Explorer

- **Enter** or **→** — Open folder/view file
- **←** — Back to parent folder
- **h** — Collapse current folder
- **/** — Search files

### Repository Manager

- **a** — Add new repository
- **d** — Delete cached repository
- **u** — Update from remote
- **Enter** — Switch to repository
- **Esc** — Back to dashboard

---

## Panel 5 (Back Inside - Outside Center)

### Code Planner

- **n** — Create new specification
- **c** — Open context manager
- **t** — Browse templates
- **Enter** — Edit selected spec
- **d** — Delete specification
- **f** — Filter by status
- **Esc** — Back to dashboard

### Search/Filter Screen

- **Type** — Search query
- **Enter** — Go to result
- **Esc** — Cancel search
- **↑↓** or **j/k** — Navigate results

**Filter Syntax:**

- `author:name` — By author
- `after:2024-01-01` — By date
- `path:src/` — By file path
- `fix memory` — Text search

---

## Panel 6 (Back Cover - Outside Left)

### Tips & Tricks

**First-Time Users:**

1. Setup wizard appears on first launch
2. Choose AI provider (OpenAI, Anthropic, etc.)
3. Enter API key (securely masked)
4. Press 's' to skip if needed

**Power User Tips:**

- Use **g** then **G** for quick jumps
- Combine **/** with filters for precise searches
- Press **?** in any screen for contextual help
- Number keys (1-6) work from any screen
- Repository switching (Press 5) is instant

**Multi-Repo Workflow:**

1. Press **5** for Repository Manager
2. Press **a** to add repositories
3. Press **Enter** to switch instantly
4. All repos stay cached (no re-clone)

**Performance:**

- Initial indexing: ~30-60s for large repos
- Subsequent loads: <2 seconds (cached)
- Search speed: <100ms with SQLite FTS

**AI Features:**

- Press **6** for Code Planner
- Create specs with templates
- Get AI implementation suggestions
- Review before coding

### Quick Troubleshooting

**App won't start?**
- Check Node/Bun version (≥1.3.5)
- Run: `histtui --debug`

**Slow performance?**
- First launch indexes repo (one-time)
- Check: `histtui cache --list`

**Need help?**
- Press **?** for inline help
- Visit: github.com/shelbeely/HistTUI

---

**Print Instructions:** Print on US Letter (8.5" × 11"), landscape orientation, double-sided. Fold into thirds with Panel 1 as front cover.
