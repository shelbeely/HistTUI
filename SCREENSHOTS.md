# 📸 HistTUI Screenshots Gallery

Complete visual guide to all HistTUI features. All screenshots are SVG animations that can be viewed in modern browsers and README files.

---

## 🚀 First-Time Setup Wizard

<div align="center">

![Setup Wizard](./screenshots/01-setup-wizard.svg)

</div>

**What it does:**
- Configures LLM provider (OpenAI, Anthropic, OpenRouter, Ollama)
- Sets up API keys with secure masked input
- Selects AI model from 12+ available options
- Configures AG-UI agent endpoint (optional)
- Saves settings to `~/.histtui/config.json`

**How to access:**
- Shown automatically on first launch
- Or run: `histtui config` to reconfigure

---

## 📈 Activity Dashboard (Default Screen)

<div align="center">

![Activity Dashboard](./screenshots/02-activity-dashboard.svg)

</div>

**What it shows:**
- Repository statistics and commit counts
- Top contributors with their commit counts
- Recent activity timeline
- Commit frequency patterns
- Quick navigation to other screens

**How to access:**
- Press `4` from any screen
- Default first screen after setup

**Keyboard shortcuts:**
- `j/k` - Navigate items
- `1-6` - Switch to other screens
- `?` - Toggle help overlay

---

## 📊 Commit Timeline

<div align="center">

![Commit Timeline](./screenshots/03-timeline.svg)

</div>

**What it shows:**
- Complete commit history with infinite scroll
- Commit hashes, authors, dates, and messages
- Visual branch indicators
- Search/filter results

**How to access:**
- Press `1` from any screen

**Keyboard shortcuts:**
- `j/k` or `↑↓` - Navigate commits
- `Enter` - View commit details
- `/` - Filter commits
- `g` - Jump to top
- `G` - Jump to bottom
- `Ctrl+D/U` - Page down/up

**Filtering:**
- By author: `author:username`
- By date: `after:2024-01-01`
- By path: `path:src/`
- By message: any text search

---

## 💬 Commit Details & Diff Viewer

<div align="center">

![Commit Details](./screenshots/04-commit-detail.svg)

</div>

**What it shows:**
- Full commit information (hash, author, date, message)
- List of changed files with stats (+/- lines)
- Syntax-highlighted diff viewer
- Split view layout

**How to access:**
- Press `Enter` on any commit in Timeline
- Navigate from commit list

**Keyboard shortcuts:**
- `j/k` - Navigate through changes
- `d` - Toggle diff view mode
- `←` or `Esc` - Back to timeline
- `Tab` - Switch between file list and diff view

**Features:**
- Color-coded additions (green) and deletions (red)
- File path navigation
- Inline diff context

---

## 🌿 Branches & Tags

<div align="center">

![Branches](./screenshots/05-branches.svg)

</div>

**What it shows:**
- All local and remote branches
- Current branch indicator (⭐)
- Branch last commit date
- Tag list with annotations
- Remote tracking status

**How to access:**
- Press `2` from any screen

**Keyboard shortcuts:**
- `j/k` - Navigate branches/tags
- `Tab` - Switch between branches and tags tabs
- `Enter` - View branch history (read-only)
- `/` - Search branches

**Safety:**
- Read-only mode (no checkout operations)
- Safe browsing of all branches
- No git modifications

---

## 🌳 File Tree Explorer

<div align="center">

![File Tree](./screenshots/06-file-tree.svg)

</div>

**What it shows:**
- Complete repository file structure
- Expandable/collapsible directories
- File size and type indicators
- Current path breadcrumb
- Markdown preview support

**How to access:**
- Press `3` from any screen

**Keyboard shortcuts:**
- `j/k` - Navigate files/folders
- `Enter` or `→` - Open folder or view file
- `←` - Go back to parent folder
- `h` - Collapse current folder
- `/` - Search files

**Features:**
- Syntax highlighting for code files
- Beautiful markdown rendering
- Binary file detection
- Directory size calculation

---

## 💾 Multi-Repository Manager

<div align="center">

![Repo Manager](./screenshots/07-repo-manager.svg)

</div>

**What it shows:**
- List of all cached repositories
- Repository URL and local path
- Commit count and last update time
- Cache size information
- Quick actions menu

**How to access:**
- Press `5` from any screen

**Keyboard shortcuts:**
- `j/k` - Navigate repositories
- `Enter` - Switch to selected repository
- `a` - Add new repository
- `d` - Delete cached repository
- `u` - Update repository from remote
- `Esc` - Back to previous screen

**Features:**
- Instant repository switching (no restart)
- Smart caching system
- Background updates
- Automatic cleanup of old caches

---

## 🎯 Code Planner

<div align="center">

![Code Planner](./screenshots/08-code-planner.svg)

</div>

**What it shows:**
- List of code specifications
- Spec status (Draft, In Progress, Complete)
- Creation date and templates
- Project context information
- AI integration status

**How to access:**
- Press `6` from any screen

**Keyboard shortcuts:**
- `j/k` - Navigate specs
- `n` - Create new spec
- `c` - Open context manager
- `t` - Browse templates
- `Enter` - Edit selected spec
- `d` - Delete spec
- `f` - Filter by status
- `Esc` - Back to dashboard

**Features:**
- Structured spec templates (Feature, Bug Fix, Refactor, etc.)
- Project context management (tech stack, style guide, goals)
- AG-UI integration for AI-powered planning
- Persistent storage per repository in `~/.histtui/projects/`
- Safe iteration - review plans before code generation

**Templates:**
- ✨ New Feature - Add new functionality
- 🐛 Bug Fix - Fix defects
- ♻️ Refactor - Improve code structure
- 📚 Documentation - Update docs
- 🎨 UI/UX - Improve user interface
- ⚡ Performance - Optimize performance
- 🔒 Security - Security improvements

---

## 🔍 Fuzzy Search

<div align="center">

![Search](./screenshots/09-search.svg)

</div>

**What it shows:**
- Real-time search input
- Fuzzy match results
- Search across commits, files, and content
- Match highlighting
- Result count

**How to access:**
- Press `/` or `Ctrl+F` from any screen

**Keyboard shortcuts:**
- Type to search
- `Enter` - Go to selected result
- `Esc` - Cancel search
- `↑↓` - Navigate results

**Search capabilities:**
- Commit messages (instant)
- File names (pattern matching)
- File content (full-text search)
- Author names
- Branch and tag names
- Fuzzy matching algorithm

**Powered by:**
- SQLite FTS (Full-Text Search)
- Fuse.js for fuzzy matching
- Real-time indexing

---

## 📊 Technical Details

**Screenshot Specifications:**
- **Format:** SVG (animated)
- **Terminal Size:** 120 columns × 35 rows
- **Capture Tool:** asciinema + termtosvg
- **Theme:** Material Design 3 (Primary: #6750A4)
- **Font:** System monospace
- **Color Depth:** 256 colors

**Viewing:**
- SVG files can be viewed in:
  - Modern web browsers (Chrome, Firefox, Safari, Edge)
  - GitHub README files
  - Documentation sites
  - Markdown viewers
- Each SVG contains ANSI color codes for accurate terminal colors
- Animations loop automatically

**File Sizes:**
- `.cast` files: ~5-7 KB (asciinema recording)
- `.svg` files: ~12-15 KB (rendered animation)
- Total: ~200 KB for all screenshots

---

## 🎨 Material Design 3 Theme

HistTUI uses Material Design 3 theming throughout:

- **Primary Color:** `#6750A4` (Purple)
- **Success:** `#98c379` (Green)
- **Warning:** `#e5c07b` (Yellow)
- **Error:** `#e06c75` (Red)
- **Info:** `#c678dd` (Magenta)

All screenshots showcase this consistent theming with:
- Color-coded UI elements
- State layers and elevation
- Dynamic color adaptation
- Beautiful terminal experience

---

## 🚀 Want to Try HistTUI?

```bash
# Install and run
bun install -g histtui
histtui https://github.com/user/repo

# Or run directly
bunx histtui https://github.com/torvalds/linux
```

**Learn more:**
- [Main README](./README.md)
- [Installation Guide](./README.md#-installation)
- [Keyboard Shortcuts](./README.md#%EF%B8%8F-keyboard-shortcuts)
- [Architecture](./ARCHITECTURE.md)
- [Contributing](./CONTRIBUTING.md)

---

<div align="center">

**HistTUI** - Explore Git history like never before 🚀

[GitHub](https://github.com/shelbeely/HistTUI) • [Issues](https://github.com/shelbeely/HistTUI/issues) • [Discussions](https://github.com/shelbeely/HistTUI/discussions)

</div>
