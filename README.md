# HistTUI 🚀

**Interactive Git History TUI** - Explore repository history like a pro with a beautiful terminal interface.

> Inspired by the best terminal UIs: lazygit, k9s, tig, htop, btop

## ✨ Features

- **📈 Activity Dashboard** - First screen on launch! Visualize repository activity, top contributors, and commit patterns at a glance.
- **📊 Commit Timeline** - Browse commits with vim-style navigation (j/k). Filter by author, date, path, or message.
- **💬 Commit Details** - View full commit info, file changes, and diffs in a beautiful split view.
- **🌿 Branch & Tag Explorer** - Navigate all branches and tags with clear indicators for current/remote branches.
- **🔥 File Hotspots** - Identify most-changed files and potential maintenance risks.
- **⚡ Blazing Fast** - Native Bun SQLite indexing means instant searches, even in massive repositories.
- **🔌 Plugin-Ready** - Extensible architecture for custom dashboards and screens.
- **⌨️ Keyboard-First** - Vim-style navigation (j/k/g/G), quick shortcuts (1-4 for screens), and discoverable help (?).
- **🔒 Read-Only Safety** - Never writes to your repository. Pure exploration mode.
- **💾 Smart Caching** - Clone once, explore instantly. Updates on demand.

## 🚀 Quick Start

### For Humans

```bash
# Run directly with bunx (no install needed!)
bunx histtui https://github.com/user/repo

# Or install globally
bun install -g histtui
histtui https://github.com/user/repo

# Use a local repository
histtui /path/to/repo
```

**First run:** Clones and indexes the repository (takes a moment for large repos)  
**Subsequent runs:** Lightning fast! Uses cached data.

### Navigation

- **j/k or ↑↓** - Navigate lists
- **Enter** - View details
- **1** - Timeline screen
- **2** - Branches & Tags
- **3** - File Tree
- **4** - Activity Dashboard (default)
- **/** - Search
- **?** - Toggle help
- **q** - Quit

<details>
<summary><strong>For AI Agents / LLMs</strong></summary>

**Step 0:** Verify Bun installation
```bash
bun --version  # Must be 1.3.5 or higher
```

**Step 1:** Install HistTUI
```bash
bun install -g histtui
```

**Step 2:** Run with a repository URL
```bash
histtui https://github.com/user/repo
```

**Step 3:** Verify it's working
- App should display "Cloning..." then show Activity Dashboard (repository statistics and overview)
- Press `j`/`k` to navigate, press `1` to view Timeline
- Press `q` to quit

**Common Issues:**
```bash
# If clone fails, try with skip-update
histtui https://github.com/user/repo --skip-update

# Check cache status
histtui cache --list

# Clear cache if corrupted
histtui cache --clear

# Enable debug logging
histtui https://github.com/user/repo --debug
# Check logs at ~/.histtui/debug.log
```

**Configuration:**
```bash
# View current config
histtui config

# Custom cache directory
histtui https://github.com/user/repo --cache-dir /custom/path

# Limit commits indexed (for huge repos)
histtui https://github.com/user/repo --max-commits 5000
```

</details>

## ⌨️ Keyboard Shortcuts

### Global
| Key | Action |
|-----|--------|
| `q` or `Ctrl+C` | Quit |
| `?` or `h` | Toggle help |
| `/` or `Ctrl+F` | Search |
| `1` | Commit Timeline |
| `2` | Branches & Tags |
| `3` | File Tree |
| `4` | Activity Dashboard (default) |

### Navigation (Vim-style)
| Key | Action |
|-----|--------|
| `j` or `↓` | Move down |
| `k` or `↑` | Move up |
| `h` or `←` | Move left / Go back |
| `l` or `→` | Move right / Enter |
| `Ctrl+D` or `PgDn` | Page down |
| `Ctrl+U` or `PgUp` | Page up |
| `g` or `Home` | Jump to top |
| `G` or `End` | Jump to bottom |

### Commit Timeline
| Key | Action |
|-----|--------|
| `Enter` | View commit details |
| `/` | Filter commits |

### Commit Detail
| Key | Action |
|-----|--------|
| `d` | Toggle diff view |
| `←` | Back to timeline |

### Branches & Tags
| Key | Action |
|-----|--------|
| `Tab` | Switch between branches and tags |

## 🏗️ Architecture

HistTUI is built with clean layer separation:

```
┌─────────────────────────────────────────┐
│           CLI Entry Point               │
│        (Commander.js + Ink)             │
└─────────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
┌───────▼──────┐    ┌────────▼─────────┐
│  Git Layer   │    │  Cache Manager   │
│ (simple-git) │    │ (Repository      │
│              │    │  Caching)        │
└──────┬───────┘    └──────────────────┘
       │
┌──────▼───────────────────────────────┐
│         SQLite Database              │
│    (Indexed Git History)             │
└──────┬───────────────────────────────┘
       │
┌──────▼───────────────────────────────┐
│      UI Components (Ink/React)       │
│  Built with @inkjs/ui + Custom       │
│  • Timeline  • Commit Detail         │
│  • Branches  • Dashboards            │
└──────────────────────────────────────┘
       │
┌──────▼───────────────────────────────┐
│       Plugin System (Optional)       │
│  Custom Screens, Dashboards,         │
│  Indexers                            │
└──────────────────────────────────────┘
```

**Read-Only by Design:** All git operations are read-only (log, show, diff). No commits, pushes, or modifications.

**Native Bun Support:** Uses bun:sqlite (Bun's native SQLite implementation) for optimal performance.

**Async-Friendly:** Large repository support with progress indicators. UI never freezes.

**UI Components:** Built with [Ink](https://github.com/vadimdemedes/ink) (React for CLIs) and [@inkjs/ui](https://github.com/vadimdemedes/ink-ui) (comprehensive component library) for a polished terminal experience.

**Extension Points:** Plugin API allows adding custom dashboards, screens, and data indexers.

### 🎨 UI Components

HistTUI uses **[@inkjs/ui](https://github.com/vadimdemedes/ink-ui)** - a comprehensive collection of customizable UI components for terminal interfaces. All components are themed to match HistTUI's neurodiversity-friendly color schemes.

**Available Components:**

- **TextInput** - Enhanced text input with autocomplete support and placeholder text
- **Spinner** - Beautiful loading indicators (dots, line, arc, bounce styles)
- **ProgressBar** - Visual progress tracking for long operations
- **Badge** - Status badges and labels (success, error, warning, info)
- **StatusMessage** - Informative bordered status messages
- **Alert** - Bold attention-grabbing alerts for critical information
- **Select & MultiSelect** - Interactive selection menus with keyboard navigation
- **ConfirmInput** - Y/n confirmation prompts for user actions
- **UnorderedList & OrderedList** - Formatted lists with custom markers

**Benefits:**
- **Consistent Design** - All components follow the same visual language
- **Themed** - Automatically adapt to HistTUI's color schemes (default, high-contrast, dyslexia-friendly)
- **Accessible** - High contrast ratios and clear visual feedback
- **Keyboard-First** - Full keyboard navigation support

<details>
<summary><strong>For AI Agents / LLMs - Detailed Architecture</strong></summary>

**Core Layers:**

1. **CLI Layer** (`src/cli.ts`)
   - Argument parsing with Commander.js
   - Launches Ink-based TUI
   - Configuration management

2. **Git Layer** (`src/core/git/`)
   - `GitClient`: Wraps simple-git for all git operations
   - Methods: `clone()`, `getAllCommits()`, `getCommitDetail()`, `getBranches()`, `getTags()`, `getFileTree()`
   - Read-only operations only

3. **Cache Layer** (`src/core/cache/`)
   - `CacheManager`: Repository caching in `~/.histtui/cache/`
   - Stores cloned repos by URL hash
   - Tracks last updated, commit counts

4. **Database Layer** (`src/core/database/`)
   - `GitDatabase`: SQLite schema and queries
   - Uses bun:sqlite (Bun's native SQLite implementation)
   - Tables: `commits`, `branches`, `tags`, `file_changes`, `metadata`, `plugin_tables`
   - Indexes on date, author for fast queries

5. **Indexer Layer** (`src/core/indexer/`)
   - `GitIndexer`: Coordinates Git → Database
   - Batch processing for performance
   - Progress reporting

6. **UI Layer** (`src/components/`)
   - React/Ink components
   - Uses @inkjs/ui component library (v2.0.0)
   - Theme provider in `src/config/inkui-theme.ts` maps HistTUI themes to @inkjs/ui
   - Screens: Timeline, CommitDetail, Branches
   - Dashboards: ActivityDashboard (default first screen), others
   - Common components: BoxBorder, StatusBar, ListItem, Badge, Alert, etc.
   - Custom hooks: useKeyboard, useListNavigation, useSearch

7. **Plugin System** (`src/plugins/`)
   - `PluginManager`: Loads and manages plugins
   - `PluginAPI`: Exposed to plugins
   - Plugins can register: custom screens, dashboards, indexers

**Data Flow:**
```
Git Repo → GitClient.clone() → CacheManager (stores local copy)
           ↓
GitClient.getAllCommits() → GitIndexer → GitDatabase (SQLite)
           ↓
UI Components query GitDatabase → Render with Ink
```

**Plugin Development:**
```typescript
// Example plugin
export default {
  name: 'my-plugin',
  version: '1.0.0',
  description: 'Custom dashboard',
  async init(api: PluginAPI) {
    api.registerDashboard({
      id: 'my-dashboard',
      name: 'My Dashboard',
      async query(db) {
        return db.prepare('SELECT * FROM commits LIMIT 10').all();
      },
      render(data) {
        return <Box>{/* Custom UI */}</Box>;
      },
    });
  },
};
```

**Using @inkjs/ui Components:**

HistTUI integrates [@inkjs/ui](https://github.com/vadimdemedes/ink-ui) for consistent UI components. Import from '@inkjs/ui':

```typescript
import { TextInput, Spinner, Badge, Alert, StatusMessage } from '@inkjs/ui';
import { ThemeProvider } from '@inkjs/ui';
import { createInkUITheme } from './config/inkui-theme.js';

// Components are themed automatically via ThemeProvider in App.tsx
function MyComponent() {
  return (
    <>
      <Spinner type="dots" label="Loading..." />
      <Badge variant="success">Complete</Badge>
      <Alert variant="info" title="Notice">
        This is an informational alert
      </Alert>
      <TextInput 
        placeholder="Search commits..." 
        value={value}
        onChange={setValue}
      />
    </>
  );
}
```

**Available @inkjs/ui components:**
- `<TextInput>` - Text input with autocomplete
- `<Spinner type="dots|line|arc|bounce">` - Loading indicators
- `<ProgressBar value={0.5}>` - Progress tracking
- `<Badge variant="success|error|warning|info">` - Status badges
- `<StatusMessage variant="...">` - Bordered messages
- `<Alert variant="..." title="...">` - Bold alerts
- `<Select>` / `<MultiSelect>` - Selection menus
- `<ConfirmInput>` - Y/n prompts
- `<UnorderedList>` / `<OrderedList>` - Lists

**Theme Integration:**

All @inkjs/ui components are themed via `src/config/inkui-theme.ts`:
```typescript
import { createInkUITheme } from './config/inkui-theme.js';

// Theme maps HistTUI colors to @inkjs/ui components:
// - primary → spinner/badges/highlights
// - success/error/warning/info → status variants
// - foreground/background → text and containers
// - border → input borders and boxes

const theme = createInkUITheme('default'); // or 'high-contrast', 'dyslexia-friendly'
```

</details>

## 🔌 Plugin System

HistTUI is designed for extensibility. Plugins can add:

- **Custom Screens** - New top-level views
- **Custom Dashboards** - Data visualizations
- **Custom Indexers** - Additional data extraction from commits

See [PLUGIN_GUIDE.md](./PLUGIN_GUIDE.md) for full documentation.

## 📦 Installation & Development

<details>
<summary><strong>For Developers</strong></summary>

### Prerequisites
- Bun 1.3.5+ 
- Git

### Development Setup
```bash
# Clone the repository
git clone https://github.com/shelbeely/HistTUI.git
cd HistTUI

# Install dependencies
bun install

# Run in development mode
bun run dev -- https://github.com/user/repo

# Build
bun run build

# Run built version
bun dist/cli.js https://github.com/user/repo
```

### Project Structure
```
HistTUI/
├── src/
│   ├── cli.ts                 # CLI entry point
│   ├── components/            # UI components
│   │   ├── App.tsx           # Main app
│   │   ├── AppContext.tsx    # State management
│   │   ├── common/           # Shared UI components
│   │   ├── screens/          # Main screens
│   │   └── dashboards/       # Dashboard screens
│   ├── core/                 # Core functionality
│   │   ├── cache/           # Repository caching
│   │   ├── database/        # SQLite operations
│   │   ├── git/             # Git operations
│   │   └── indexer/         # Git history indexing
│   ├── plugins/             # Plugin system
│   ├── config/              # Configuration management
│   ├── utils/               # Utility functions
│   └── types/               # TypeScript definitions
├── .github/
│   └── agents/
│       └── histtui-maintainer.md  # Custom agent definition
├── package.json
├── tsconfig.json
└── README.md
```

### Adding a New Screen
1. Create component in `src/components/screens/`
2. Add to AppContext screen type
3. Register in App.tsx switch statement
4. Add keyboard shortcut in hooks.ts

### Adding a Dashboard
1. Create component in `src/components/dashboards/`
2. Add data query method to GitDatabase
3. Register in App.tsx
4. Add to dashboard navigation

</details>

## 🎯 Roadmap

- [ ] File tree navigator with markdown preview
- [ ] Hotspots & ownership dashboards
- [ ] Global search and command palette
- [ ] Interactive rebase visualization (read-only)
- [ ] Commit graph visualization
- [ ] Blame view for files
- [ ] Export reports (PDF, HTML)
- [ ] Comparison view (branches, commits)
- [ ] Performance metrics dashboard

## 🙏 Inspiration & Attribution

HistTUI draws inspiration from amazing TUI tools:

- [lazygit](https://github.com/jesseduffield/lazygit) - Terminal UI for git
- [k9s](https://github.com/derailed/k9s) - Kubernetes CLI
- [tig](https://github.com/jonas/tig) - Text-mode interface for git
- [htop](https://github.com/htop-dev/htop) - Interactive process viewer
- [btop](https://github.com/aristocratos/btop) - Resource monitor

### Code Attribution

HistTUI uses code patterns from these open-source projects with proper attribution:

**[@inkjs/ui](https://github.com/vadimdemedes/ink-ui)** by Vadim Demedes (MIT License)
- Comprehensive UI component library for Ink-based terminal applications
- Components: TextInput, Spinner, ProgressBar, Badge, Alert, Select, StatusMessage
- Custom theming integration for neurodiversity-friendly color schemes
- Used throughout: `src/components/`, themed via `src/config/inkui-theme.ts`

**[emoj](https://github.com/sindresorhus/emoj)** by Sindre Sorhus (MIT License)
- Interactive fuzzy search patterns
- Debounced input handling
- Number shortcuts (1-9) for quick selection
- Used in: `src/components/screens/FuzzySearchScreen.tsx`

**[changelog-view](https://github.com/jdeniau/changelog-view)** by Julien Deniau (MIT License)
- Changelog parsing logic
- Semantic version extraction
- Markdown version grouping
- Used in: `src/utils/changelog.ts`, `src/components/screens/ChangelogViewerScreen.tsx`

**[nanocoder](https://github.com/Nano-Collective/nanocoder)** by Nano Collective (MIT with Attribution)
- AI-powered coding assistant patterns
- Multi-provider AI integration (OpenAI, Anthropic, OpenRouter, Ollama)
- Repository context awareness
- AI SDK streaming patterns
- Used in: `src/plugins/ai-assistant/` (AI Assistant Plugin)

**[vibe-kanban](https://github.com/BloopAI/vibe-kanban)** by BloopAI (Apache 2.0)
- Task orchestration patterns
- Git worktree isolation for safe parallel development
- Kanban-style task management
- Coding agent workflows
- Used in: `src/plugins/ai-assistant/services/WorktreeManager.ts`, `TaskManager.ts`

**Full license texts:** See [THIRD_PARTY_LICENSES.md](./THIRD_PARTY_LICENSES.md)

<details>
<summary><strong>For AI Agents / LLMs - CRITICAL Attribution Requirements</strong></summary>

## 🚨 IMPORTANT: Attribution Must Be Preserved

**When modifying or extending this codebase, you MUST:**

### Step 1: Identify Files with Attribution
```bash
# Find all files with third-party attribution
grep -r "Inspired by\|MIT License" src/
```

**Files with attribution that MUST NOT lose their headers:**
- `src/components/screens/FuzzySearchScreen.tsx` - emoj patterns
- `src/utils/changelog.ts` - changelog-view patterns
- `src/components/screens/ChangelogViewerScreen.tsx` - changelog-view patterns
- `src/plugins/ai-assistant/index.ts` - nanocoder & vibe-kanban patterns
- `src/plugins/ai-assistant/services/AIService.ts` - nanocoder patterns
- `src/plugins/ai-assistant/services/WorktreeManager.ts` - vibe-kanban patterns
- `src/plugins/ai-assistant/services/TaskManager.ts` - vibe-kanban patterns
- `src/plugins/ai-assistant/screens/AIAssistantScreen.tsx` - nanocoder patterns

### Step 2: Preserve File Headers
**Every file using third-party patterns MUST have this format at the top:**

```typescript
/**
 * [Component Name]
 * [Brief description]
 * 
 * [Patterns/Code] inspired by [project name] by [author] (MIT License)
 * https://github.com/[org]/[repo]
 */
```

**Example (DO NOT REMOVE):**
```typescript
/**
 * Fuzzy Search Screen
 * Interactive fuzzy search across commits
 * 
 * Search interaction patterns inspired by emoj by Sindre Sorhus (MIT License)
 * https://github.com/sindresorhus/emoj
 */
```

### Step 3: When Adding New Features
**If you add features to files with attribution:**
- ✅ KEEP the existing attribution header
- ✅ Do NOT remove or modify attribution comments
- ✅ Add your own changes below the header
- ❌ NEVER remove copyright/license references

### Step 4: Verification Commands
```bash
# Verify attribution is intact
cat src/components/screens/FuzzySearchScreen.tsx | head -10
cat src/utils/changelog.ts | head -10

# Should output headers like:
# "Search interaction patterns inspired by emoj by Sindre Sorhus"
# "Changelog parsing inspired by changelog-view by Julien Deniau"
```

### Step 5: Required Files
**These files MUST exist and MUST NOT be deleted:**
- `THIRD_PARTY_LICENSES.md` - Full MIT license text
- `README.md` - Attribution section (this section)
- Source file headers - Attribution comments in files

### Step 6: License Compatibility
**We use ISC license. Compatible with:**
- ✅ MIT (emoj, changelog-view) - Used with attribution
- ✅ MIT with Attribution (nanocoder) - Not yet used, will require credit
- ❌ GPL-3.0 (wiki-cli) - NOT used, incompatible

**If you add dependencies:**
```bash
# Check license before using
npm info [package] license

# Only use MIT, ISC, BSD, Apache-2.0
# NEVER use GPL, AGPL, or other copyleft licenses
```

### Step 7: Attribution Checklist
Before committing code changes:
- [ ] File headers with attribution are intact
- [ ] THIRD_PARTY_LICENSES.md exists and is complete
- [ ] README.md attribution section is accurate
- [ ] No GPL-licensed code was copied
- [ ] New dependencies are license-compatible

### Step 8: Error Recovery
**If attribution is accidentally removed:**
```bash
# Restore from git history
git log --all --full-history -- src/components/screens/FuzzySearchScreen.tsx
git checkout [commit-hash] -- src/components/screens/FuzzySearchScreen.tsx

# Or restore the header manually:
# See THIRD_PARTY_LICENSES.md for correct attribution format
```

### Why This Matters
- **Legal compliance** - MIT license requires attribution
- **Ethical coding** - Credit original authors
- **Community trust** - Open source depends on proper attribution
- **License violations** - Removing attribution violates MIT license terms

**REMEMBER:** Attribution is not optional. It is a legal requirement of the MIT License.

</details>

## 📄 License

ISC

## 🤝 Contributing

Contributions welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

**Made with 🚀 for developers who live in the terminal**

## 🤖 AI Assistant Plugin

HistTUI includes a powerful AI-powered coding assistant that brings agentic coding capabilities directly to your terminal.

**Features:**
- 💬 **AI Chat** - Ask questions about your repository, get code explanations, refactoring suggestions
- 📋 **Task Management** - Kanban-style task board for organizing coding work
- 🌳 **Git Worktrees** - Isolated development environments for each task
- ⚡ **Command Execution** - Safely run commands with AI assistance
- 🔌 **Multi-Provider** - OpenAI, Anthropic, OpenRouter, or Ollama

**Quick Start:**
```bash
# Set your API key (choose one)
export OPENROUTER_API_KEY="sk-..."  # Recommended: access to many models
export OPENAI_API_KEY="sk-..."
export ANTHROPIC_API_KEY="sk-..."

# Launch HistTUI
histtui https://github.com/user/repo

# Press 'a' to open AI Assistant
```

**Keyboard Shortcuts:**
- `a` - Open AI Assistant
- `Tab` - Switch between Chat, Tasks, Worktrees, Help
- `Enter` - Send message (in chat mode)
- `Esc` - Exit AI Assistant

### Configuration

Create `~/.histtui/ai-config.json`:
```json
{
  "provider": "openrouter",
  "model": "anthropic/claude-3.5-sonnet",
  "maxTokens": 4000,
  "temperature": 0.7
}
```

**Supported Providers:**
- `openrouter` - Access 100+ models (recommended)
- `openai` - GPT-4, GPT-3.5
- `anthropic` - Claude 3.5 Sonnet, Claude 3 Opus
- `ollama` - Local models (Llama 2, Mistral, etc.)

### Task Orchestration

The AI Assistant includes a kanban-style task board inspired by vibe-kanban:

```bash
# Tasks are organized in columns:
- 📝 Todo
- 🔨 In Progress (with worktree)
- 👀 Review
- ✅ Done
- 🚫 Blocked
```

Each task can have:
- Isolated git worktree for safe development
- Associated branch and commits
- Priority levels (low, medium, high, critical)
- Tags and assignees

### Git Worktrees

Tasks in "In Progress" status automatically get their own git worktree:

```
~/.histtui/worktrees/
  └── task-abc123/          # Isolated worktree
      ├── .git              # Separate git directory
      └── src/              # Independent working copy
```

**Benefits:**
- Work on multiple tasks in parallel
- No branch switching conflicts
- Safe AI-assisted changes
- Easy cleanup when task is done

### Security & Safety

The AI Assistant includes safety controls:

**File Operations:**
- ✅ Allowed: `.ts`, `.tsx`, `.js`, `.jsx`, `.json`, `.md`, `.yaml`
- ❌ Denied: `node_modules/`, `.git/`, `.env`, `dist/`, `build/`

**Command Execution:**
- ✅ Allowed: `npm`, `node`, `python`, `go`, `git`, `test`
- ❌ Denied: `rm`, `sudo`, `shutdown`, `format`
- ⏱️ 30-second timeout on all commands

All operations run in isolated worktrees, never in your main repository.

