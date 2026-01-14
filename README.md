<div align="center">

# 🚀 HistTUI

### Interactive Git History TUI with Generative AI

**Explore repository history like a pro with a beautiful terminal interface**

[![Version](https://img.shields.io/badge/version-1.1.0-6750A4.svg)](https://github.com/shelbeely/HistTUI/releases)
[![License](https://img.shields.io/badge/license-ISC-green.svg)](./LICENSE)
[![Bun](https://img.shields.io/badge/bun-%3E%3D1.3.5-black.svg)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Ink](https://img.shields.io/badge/Ink-6.6-purple.svg)](https://github.com/vadimdemedes/ink)
[![AG-UI](https://img.shields.io/badge/AG--UI-Enabled-orange.svg)](https://github.com/ag-ui/ag-ui)

![HistTUI Demo](https://via.placeholder.com/800x400/6750A4/FFFFFF?text=HistTUI+Demo+GIF)

</div>

---

## ✨ Highlights

<table>
<tr>
<td width="33%" align="center">

### 🤖 **AI-Powered**
Generative UI with AG-UI protocol  
Real-time insights & analysis

</td>
<td width="33%" align="center">

### ⚡ **Blazing Fast**
Native Bun SQLite indexing  
Instant searches in massive repos

</td>
<td width="33%" align="center">

### 🎨 **Beautiful**
Material Design 3 theming  
Built with @inkjs/ui components

</td>
</tr>
<tr>
<td width="33%" align="center">

### ⌨️ **Keyboard-First**
Vim-style navigation  
One-key screen switching

</td>
<td width="33%" align="center">

### 🚀 **One Command**
`bun run launch`  
Auto-setup wizard included

</td>
<td width="33%" align="center">

### 💾 **Multi-Repo**
Clone once, switch instantly  
Smart caching system

</td>
</tr>
</table>

> 💡 Inspired by the best terminal UIs: [lazygit](https://github.com/jesseduffield/lazygit), [k9s](https://github.com/derailed/k9s), [tig](https://github.com/jonas/tig), [htop](https://github.com/htop-dev/htop), [btop](https://github.com/aristocratos/btop)

---

## 📑 Table of Contents

- [Quick Start](#-quick-start)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Installation](#-installation)
- [Keyboard Shortcuts](#️-keyboard-shortcuts)
- [Code Planner](#-code-planner)
- [Architecture](#️-architecture)
- [Plugin System](#-plugin-system)
- [AI Assistant](#-ai-assistant-plugin)
- [Technical Specification](#-technical-specification)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Quick Start

### Launch with AG-UI (Recommended)

The fastest way to experience HistTUI with AI-powered features:

```bash
# Single command to launch everything!
bun run launch

# Or with a specific repository
bun run launch https://github.com/facebook/react
```

**✨ What happens:**
1. 🚀 AG-UI Agent Server starts on port 3001
2. 🎨 HistTUI launches with full generative UI capabilities
3. 🤖 First-launch setup wizard (if needed):
   - LLM provider selection (OpenAI, Anthropic, OpenRouter, Ollama)
   - API key configuration (securely masked input)
   - Model selection (12+ models available)
   - Settings saved to `~/.histtui/config.json`

### Standard Installation

```bash
# Using bunx (no installation required)
bunx histtui https://github.com/torvalds/linux

# Or install globally
bun install -g histtui
histtui https://github.com/vercel/next.js

# Local repository
histtui /path/to/repo
```

**🎯 Navigation Basics:**
```
j/k or ↑↓     → Navigate lists
1-5           → Switch screens instantly
/             → Search
?             → Toggle help
q             → Quit
```

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
- App should display "Cloning..." then show Activity Dashboard
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
```

</details>

---

## ✨ Features

### 🎯 Core Features

<table>
<tr>
<td width="50%">

#### 📈 Activity Dashboard
- 🏠 **Default first screen** on launch
- 📊 Repository statistics and insights
- 👥 Top contributors visualization
- 📅 Commit patterns and trends
- 🔥 Recent activity timeline

#### 📊 Commit Timeline
- 📜 **Browse all commits** with infinite scroll
- ⌨️ **Vim-style navigation** (j/k/g/G)
- 🔍 **Smart filtering** by author, date, path, message
- ⚡ **Instant search** powered by SQLite FTS

#### 💬 Commit Details
- 📄 **Full commit information** display
- 📝 **File changes** with diff viewer
- 🎨 **Syntax-highlighted** diffs
- ↔️ **Split view** layout

</td>
<td width="50%">

#### 🌿 Branch & Tag Explorer
- 🔀 **Navigate all branches** and tags
- 🎯 **Current branch** indicator
- 🌐 **Remote tracking** status
- 🏷️ **Tag annotations** visible

#### 💾 Multi-Repo Manager
- 📚 **Switch between repositories** instantly
- 🗂️ **Smart caching** system
- 🔄 **Update on demand**
- 💨 **No restart required** (press '5')

#### 🎯 Code Planner
- 📝 **Create code specs** with structured templates
- 🤖 **AI-powered planning** with AG-UI integration
- 💡 **Project context** management (tech stack, style guide, goals)
- 👀 **Safe iteration** - review plans before code generation
- 💾 **Persistent storage** per repository

#### 🔥 File Hotspots
- 🎯 **Identify most-changed files**
- ⚠️ **Maintenance risk detection**
- 📈 **Change frequency analysis**
- 🗺️ **Codebase heatmap**

</td>
</tr>
</table>

### 🤖 Generative AI Features (AG-UI Protocol)

<div align="center">

![AG-UI Enabled](https://img.shields.io/badge/Powered%20by-AG--UI-orange?style=for-the-badge)
![Material Design 3](https://img.shields.io/badge/Theme-Material%20Design%203-6750A4?style=for-the-badge)

</div>

HistTUI integrates the **AG-UI protocol** for true generative terminal UI:

| Feature | Description |
|---------|-------------|
| 💬 **Real-Time AI Insights** | Get intelligent analysis of commits, patterns, and code quality streamed live |
| 🎨 **Dynamic UI Generation** | AI generates contextual components (badges, alerts, suggestions) on-the-fly |
| 📊 **Smart Recommendations** | Proactive suggestions for code improvements and repository health |
| 🔄 **Streaming Updates** | Watch AI analysis happen in real-time in the status bar |
| 🎯 **Context-Aware** | AI understands your repository structure, history, and current focus |
| 🛠️ **Multi-Provider Support** | Works with OpenAI, Anthropic, OpenRouter, or local Ollama models |
| 🚀 **One-Command Launch** | `bun run launch` starts both agent server and TUI together |

### 🎨 Design & UX

- **Material Design 3** theming with primary color `#6750A4`
- **[@inkjs/ui](https://github.com/vadimdemedes/ink-ui)** component library integration
- **Neurodiversity-friendly** color schemes (default, high-contrast, dyslexia-friendly)
- **Keyboard-first** navigation with Vim-style bindings
- **Read-only safety** - Never writes to your repository

### ⚡ Performance

- **Native Bun SQLite** indexing for maximum speed
- **Smart caching** - Clone once, explore forever
- **Async-friendly** - Never freezes, even with massive repos
- **Instant searches** with full-text search indexing

---

## 📸 Screenshots

<div align="center">

### 📈 Activity Dashboard (Default Screen)
![Activity Dashboard](https://via.placeholder.com/900x500/6750A4/FFFFFF?text=Activity+Dashboard+-+Repository+Stats+%26+Contributors)

*View repository statistics, top contributors, and recent activity at a glance*

---

### 📊 Commit Timeline
![Commit Timeline](https://via.placeholder.com/900x500/6750A4/FFFFFF?text=Commit+Timeline+-+Browse+History+with+Vim+Navigation)

*Browse commits with instant filtering and vim-style navigation*

---

### 💬 Commit Details & Diff Viewer
![Commit Details](https://via.placeholder.com/900x500/6750A4/FFFFFF?text=Commit+Details+-+Full+Diff+View+with+Syntax+Highlighting)

*View full commit information with syntax-highlighted diffs*

---

### 🤖 AI Assistant (AG-UI Powered)
![AI Assistant](https://via.placeholder.com/900x500/6750A4/FFFFFF?text=AI+Assistant+-+Real-time+Insights+%26+Code+Analysis)

*Get AI-powered insights and code analysis in real-time*

</div>

---

## 📦 Installation

### Prerequisites

- **Bun** 1.3.5 or higher ([Install Bun](https://bun.sh))
- **Git** (for repository cloning)

### Global Installation

```bash
# Install globally with bun
bun install -g histtui

# Run from anywhere
histtui https://github.com/user/repo
```

### Development Setup

```bash
# Clone the repository
git clone https://github.com/shelbeely/HistTUI.git
cd HistTUI

# Install dependencies
bun install

# Run in development mode
bun run dev -- https://github.com/user/repo

# Build for production
bun run build

# Run built version
bun dist/cli.js https://github.com/user/repo
```

### First-Launch Wizard

When launching with `bun run launch` for the first time, you'll see an interactive setup wizard:

```
🚀 HistTUI Setup Wizard

1️⃣  Select LLM Provider:
    ○ OpenAI (GPT-4, GPT-3.5)
    ● Anthropic (Claude 3.5 Sonnet)
    ○ OpenRouter (100+ models)
    ○ Ollama (Local models)

2️⃣  API Key: ****************** (securely masked)

3️⃣  Model Selection:
    ● claude-3-5-sonnet-20241022
    ○ claude-3-opus-20240229
    ○ gpt-4-turbo

4️⃣  Configuration saved to ~/.histtui/config.json ✓
```

---

## ⌨️ Keyboard Shortcuts

### 🌐 Global Shortcuts

| Key | Action | Description |
|-----|--------|-------------|
| `q` or `Ctrl+C` | **Quit** | Exit HistTUI |
| `?` or `h` | **Help** | Toggle help overlay |
| `/` or `Ctrl+F` | **Search** | Open search/filter |
| `1` | **Timeline** | Jump to Commit Timeline |
| `2` | **Branches** | Jump to Branches & Tags |
| `3` | **File Tree** | Jump to File Tree Explorer |
| `4` | **Dashboard** | Jump to Activity Dashboard (default) |
| `5` | **Repos** | Jump to Repository Manager |
| `6` | **Code Planner** | Jump to Code Planner (agent-driven development) |

### ⌨️ Navigation (Vim-Style)

| Key | Action | Description |
|-----|--------|-------------|
| `j` or `↓` | **Move Down** | Move cursor down |
| `k` or `↑` | **Move Up** | Move cursor up |
| `h` or `←` | **Back/Left** | Go back or move left |
| `l` or `→` | **Enter/Right** | Select item or move right |
| `Ctrl+D` or `PgDn` | **Page Down** | Scroll down one page |
| `Ctrl+U` or `PgUp` | **Page Up** | Scroll up one page |
| `g` or `Home` | **Jump to Top** | Go to first item |
| `G` or `End` | **Jump to Bottom** | Go to last item |

### 📊 Screen-Specific Shortcuts

#### Commit Timeline
| Key | Action |
|-----|--------|
| `Enter` | View commit details |
| `/` | Filter commits (author, date, message) |

#### Commit Detail
| Key | Action |
|-----|--------|
| `d` | Toggle diff view mode |
| `←` or `Esc` | Back to timeline |

#### Branches & Tags
| Key | Action |
|-----|--------|
| `Tab` | Switch between branches and tags |
| `Enter` | Checkout branch (view-only) |

#### Code Planner
| Key | Action |
|-----|--------|
| `n` | Create new spec |
| `c` | Open context manager |
| `t` | Browse templates |
| `d` | Delete selected spec |
| `f` | Filter by status |
| `Enter` | Edit selected spec |
| `Esc` | Back to dashboard |

---

## 🎯 Code Planner

**Agent-driven development for planning and executing code changes.**

Press `6` from any screen to access the Code Planner - an in-app system for creating specifications, maintaining project context, and working with AI agents to plan and execute code changes.

### Key Features

- **📝 Structured Specs** - Create detailed specifications with problem statements, requirements, constraints, and acceptance criteria
- **🎯 Project Context** - Maintain tech stack, style guides, architecture patterns, and product goals
- **🤖 AI Integration** - Send specs + context to AG-UI agents for intelligent implementation plans
- **👀 Safe Iteration** - Review AI-generated plans before any code is written
- **💾 Persistent Storage** - All data stored locally per repository in `~/.histtui/projects/`

### Quick Start

1. **Press `6`** to open Code Planner
2. **Press `n`** to create a new spec, or **`t`** to browse templates
3. **Press `c`** to set up project context (tech stack, style guide, goals)
4. Create specs using predefined templates:
   - ✨ **New Feature** - Add new functionality
   - 🐛 **Bug Fix** - Fix defects
   - ♻️ **Refactor** - Improve code structure
   - 📚 **Documentation** - Add/improve docs
   - 🧪 **Add Tests** - Improve coverage
   - 🏗️ **Architecture** - Make architectural changes

### Spec Templates

Each template provides a structured format:

```typescript
{
  title: "Feature: Add code ownership view",
  description: "Display file ownership and bus factor metrics",
  context: {
    problem: "Hard to identify code ownership risks",
    requirements: ["Show top contributors", "Calculate bus factor"],
    constraints: ["Must work with existing DB schema"],
    acceptanceCriteria: ["User can see ownership breakdown"]
  },
  priority: "high",
  tags: ["feature", "dashboard"]
}
```

### Project Context

Store comprehensive project information used by AI agents:

```json
{
  "techStack": {
    "languages": ["TypeScript"],
    "frameworks": ["React", "Ink"],
    "tools": ["Bun"]
  },
  "styleGuide": {
    "codeStyle": "TypeScript strict mode",
    "namingConventions": "camelCase for variables"
  },
  "productGoals": {
    "vision": "Beautiful Git history explorer",
    "objectives": ["Fast navigation", "Accessible UI"]
  },
  "architecture": {
    "patterns": ["Component-driven UI"],
    "layers": ["CLI", "Core", "UI", "Plugins"]
  }
}
```

### AI-Powered Planning

When you request a plan:
1. Code Planner sends your spec + project context to AG-UI agent
2. Agent analyzes and generates implementation plan with steps, risks, and file changes
3. You review the plan before any code is written
4. Execute approved plans with confidence

### File Storage

```
~/.histtui/projects/
└── <repo-hash>/
    ├── context.json      # Project context
    └── specs/            # Code specifications
        ├── spec-1.json
        ├── spec-2.json
        └── ...
```

### Use Cases

**For Your Projects:**
- Plan new features with structured specs
- Maintain project documentation and context
- Get AI help with implementation plans
- Share context across team members

**For HistTUI Development:**
- We use Code Planner to develop HistTUI itself
- All new features start as specs
- AI helps generate implementation plans

### Full Documentation

See **[CODE_PLANNER.md](./CODE_PLANNER.md)** for comprehensive guide including:
- Detailed user guide
- Spec template reference
- Project context format
- AI integration details
- Keyboard shortcuts
- Best practices
- Troubleshooting

---

## 🏗️ Architecture

<details>
<summary><strong>📐 System Architecture Overview</strong></summary>

HistTUI is built with clean layer separation for maintainability and extensibility:

```
┌─────────────────────────────────────────────────────────────┐
│                     CLI Entry Point                         │
│              (Commander.js + Ink + Bun)                     │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┴───────────────┐
         │                               │
┌────────▼──────────┐          ┌────────▼─────────────┐
│   Git Layer       │          │   Cache Manager      │
│  (simple-git)     │          │  (Repository Cache)  │
│  - clone()        │          │  ~/.histtui/cache/   │
│  - getAllCommits()│          │  - Smart hashing     │
│  - getBranches()  │          │  - Update tracking   │
└────────┬──────────┘          └──────────────────────┘
         │
┌────────▼────────────────────────────────────────────────────┐
│              SQLite Database (Bun Native)                   │
│  Tables: commits, branches, tags, file_changes, metadata   │
│  Indexes: date, author, message (FTS), path                │
└────────┬────────────────────────────────────────────────────┘
         │
┌────────▼────────────────────────────────────────────────────┐
│              Indexer (Git → Database)                       │
│  - Batch processing for performance                         │
│  - Progress reporting                                       │
│  - Incremental updates                                      │
└────────┬────────────────────────────────────────────────────┘
         │
┌────────▼────────────────────────────────────────────────────┐
│           UI Layer (Ink + React + @inkjs/ui)                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ ThemeProvider (Material Design 3 - #6750A4)          │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │ AGUIProvider (Generative UI Protocol)          │  │   │
│  │  │  ┌──────────────────────────────────────────┐  │  │   │
│  │  │  │ Screens:                                 │  │  │   │
│  │  │  │  • Timeline        • CommitDetail        │  │  │   │
│  │  │  │  • Branches        • FileTree            │  │  │   │
│  │  │  │  • ActivityDashboard (default)          │  │  │   │
│  │  │  │  • RepositoryManager                    │  │  │   │
│  │  │  └──────────────────────────────────────────┘  │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└────────┬────────────────────────────────────────────────────┘
         │
┌────────▼────────────────────────────────────────────────────┐
│           Plugin System (Optional Extensions)               │
│  - Custom screens and dashboards                            │
│  - Custom indexers                                          │
│  - Plugin API with hooks                                    │
└─────────────────────────────────────────────────────────────┘
```

### 🔑 Key Principles

- **Read-Only by Design**: All git operations are read-only (log, show, diff). No commits, pushes, or modifications.
- **Native Bun Performance**: Uses `bun:sqlite` for optimal performance without native dependencies.
- **Async-Friendly**: Large repository support with progress indicators. UI never freezes.
- **Component-Based UI**: Built with [Ink](https://github.com/vadimdemedes/ink) (React for CLIs) and [@inkjs/ui](https://github.com/vadimdemedes/ink-ui).
- **Extensible**: Plugin API allows adding custom dashboards, screens, and data indexers.

### 🎨 UI Component Library

HistTUI uses **[@inkjs/ui](https://github.com/vadimdemedes/ink-ui)** for consistent, themed components:

| Component | Usage |
|-----------|-------|
| `<TextInput>` | Enhanced text input with autocomplete |
| `<Spinner>` | Loading indicators (dots, line, arc, bounce) |
| `<ProgressBar>` | Visual progress tracking |
| `<Badge>` | Status badges (success, error, warning, info) |
| `<StatusMessage>` | Bordered status messages |
| `<Alert>` | Bold attention-grabbing alerts |
| `<Select>` / `<MultiSelect>` | Interactive selection menus |
| `<ConfirmInput>` | Y/n confirmation prompts |

All components are automatically themed to match HistTUI's **Material Design 3** color scheme (`#6750A4`) and neurodiversity-friendly palettes.

</details>

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
   - Built with React and **Ink** (React renderer for terminal UIs)
   - Enhanced with **@inkjs/ui** component library (v2.0.0)
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

**Using @inkjs/ui Components:**

```typescript
import { TextInput, Spinner, Badge, Alert } from '@inkjs/ui';
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
    </>
  );
}
```

</details>

---

## 🔌 Plugin System

<div align="center">

![Extensible](https://img.shields.io/badge/Extensible-Plugin%20API-brightgreen)

</div>

HistTUI is designed for extensibility. Create custom plugins to extend functionality:

### 📦 What Can Plugins Do?

<table>
<tr>
<td width="33%">

#### 🖥️ Custom Screens
Add new top-level views accessible via keyboard shortcuts

</td>
<td width="33%">

#### 📊 Custom Dashboards
Create data visualizations and analytics views

</td>
<td width="33%">

#### 🔍 Custom Indexers
Extract additional data from commits and repository history

</td>
</tr>
</table>

### 🚀 Quick Plugin Example

```typescript
// my-plugin.ts
export default {
  name: 'my-dashboard-plugin',
  version: '1.0.0',
  description: 'Custom repository analytics',
  
  async init(api: PluginAPI) {
    api.registerDashboard({
      id: 'custom-analytics',
      name: 'Analytics Dashboard',
      
      async query(db) {
        return db.prepare(`
          SELECT 
            author,
            COUNT(*) as commits,
            SUM(files_changed) as files
          FROM commits
          GROUP BY author
          ORDER BY commits DESC
          LIMIT 10
        `).all();
      },
      
      render(data) {
        return (
          <Box flexDirection="column">
            <Text bold>📊 Top Contributors</Text>
            {data.map(row => (
              <Text key={row.author}>
                {row.author}: {row.commits} commits, {row.files} files
              </Text>
            ))}
          </Box>
        );
      }
    });
  }
};
```

### 📚 Documentation

For complete plugin development guide, see **[PLUGIN_GUIDE.md](./PLUGIN_GUIDE.md)**

---

## 🤖 AI Assistant Plugin

<div align="center">

![AI Powered](https://img.shields.io/badge/AI-Powered-orange)
![Multi-Provider](https://img.shields.io/badge/Multi--Provider-OpenAI%20%7C%20Anthropic%20%7C%20Ollama-blue)

</div>

HistTUI includes a powerful **AI-powered coding assistant** that brings agentic coding capabilities directly to your terminal.

### ✨ Features

| Feature | Description |
|---------|-------------|
| 💬 **AI Chat** | Ask questions about your repository, get code explanations, refactoring suggestions |
| 📋 **Task Management** | Kanban-style task board for organizing coding work |
| 🌳 **Git Worktrees** | Isolated development environments for each task |
| ⚡ **Command Execution** | Safely run commands with AI assistance |
| 🔌 **Multi-Provider** | Works with OpenAI, Anthropic, OpenRouter, or Ollama |

### 🚀 Quick Start

```bash
# Set your API key (choose one)
export OPENROUTER_API_KEY="sk-..."  # Recommended: access to many models
export OPENAI_API_KEY="sk-..."
export ANTHROPIC_API_KEY="sk-..."

# Launch HistTUI
bun run launch https://github.com/user/repo

# Press 'a' to open AI Assistant
```

### ⌨️ AI Assistant Shortcuts

| Key | Action |
|-----|--------|
| `a` | Open AI Assistant |
| `Tab` | Switch between Chat, Tasks, Worktrees, Help |
| `Enter` | Send message (in chat mode) |
| `Esc` | Exit AI Assistant |

### ⚙️ Configuration

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

### 📋 Task Orchestration

The AI Assistant includes a **kanban-style task board** inspired by [vibe-kanban](https://github.com/BloopAI/vibe-kanban):

```
┌─────────────────────────────────────────────────────────┐
│  📝 Todo  │  🔨 In Progress  │  👀 Review  │  ✅ Done  │
├───────────┼──────────────────┼─────────────┼───────────┤
│ Task 1    │ Task 2           │ Task 3      │ Task 4    │
│ Task 5    │ (+ worktree)     │             │ Task 6    │
└───────────┴──────────────────┴─────────────┴───────────┘
```

Each task can have:
- 🌳 Isolated git worktree for safe development
- 🔀 Associated branch and commits
- 🎯 Priority levels (low, medium, high, critical)
- 🏷️ Tags and assignees

### 🌳 Git Worktrees

Tasks in "In Progress" status automatically get their own git worktree:

```
~/.histtui/worktrees/
  └── task-abc123/          # Isolated worktree
      ├── .git              # Separate git directory
      └── src/              # Independent working copy
```

**Benefits:**
- ✅ Work on multiple tasks in parallel
- ✅ No branch switching conflicts
- ✅ Safe AI-assisted changes
- ✅ Easy cleanup when task is done

### 🔒 Security & Safety

The AI Assistant includes safety controls:

**File Operations:**
- ✅ **Allowed:** `.ts`, `.tsx`, `.js`, `.jsx`, `.json`, `.md`, `.yaml`
- ❌ **Denied:** `node_modules/`, `.git/`, `.env`, `dist/`, `build/`

**Command Execution:**
- ✅ **Allowed:** `npm`, `node`, `python`, `go`, `git`, `test`
- ❌ **Denied:** `rm`, `sudo`, `shutdown`, `format`
- ⏱️ **30-second timeout** on all commands

All operations run in **isolated worktrees**, never in your main repository.

---

## 📋 Technical Specification

<div align="center">

[![Complete Specification](https://img.shields.io/badge/Complete-Technical%20Specification-6750A4)](./SPECIFICATION.md)

</div>

For developers, contributors, and integrators, HistTUI provides a **comprehensive technical specification document** that serves as the authoritative reference for the entire project.

### What's Inside SPECIFICATION.md

📖 **[Read the Complete Specification →](./SPECIFICATION.md)**

The specification covers:

<table>
<tr>
<td width="50%">

#### Part I: Foundation
- Complete project overview
- System architecture diagrams
- Full tech stack with versions
- File organization (67+ files)

#### Part II: Core Systems
- Configuration system reference
- Cache system internals
- Git layer API
- Database schema & queries
- Indexer implementation

#### Part III: User Interface
- UI architecture patterns
- Complete component catalog
- Screen specifications
- Material Design 3 theming
- Keyboard shortcut reference

</td>
<td width="50%">

#### Part IV: Advanced Features
- Plugin development guide
- AG-UI protocol integration
- Code Planner system
- Time tracking implementation
- Multi-repository support

#### Part V: Reference
- Complete API documentation
- TypeScript type definitions
- Database schema (all tables)
- Integration points
- Security best practices
- Performance optimizations

</td>
</tr>
</table>

### Use Cases for SPECIFICATION.md

| Audience | Use Case |
|----------|----------|
| **Contributors** | Understand architecture before making changes |
| **Plugin Developers** | Reference API contracts and extension points |
| **Integrators** | Learn integration points (AG-UI, git, database) |
| **Code Reviewers** | Verify changes align with architectural patterns |
| **Technical Writers** | Reference for creating additional documentation |
| **AI Agents** | Complete context for understanding and modifying code |

### Quick Links

- 📋 **[SPECIFICATION.md](./SPECIFICATION.md)** - Complete technical reference
- 🏗️ **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Architecture deep-dive
- ⚙️ **[CONFIGURATION.md](./CONFIGURATION.md)** - Configuration options
- 🔌 **[PLUGIN_GUIDE.md](./PLUGIN_GUIDE.md)** - Plugin development
- 🎯 **[CODE_PLANNER.md](./CODE_PLANNER.md)** - Code planning system
- 🤖 **[AGUI_INTEGRATION.md](./AGUI_INTEGRATION.md)** - AG-UI protocol
- 🎨 **[MATERIAL_DESIGN_3.md](./MATERIAL_DESIGN_3.md)** - Design system
- 📦 **[COMPONENTS.md](./COMPONENTS.md)** - Component catalog

---

## 🎯 Roadmap

### 🚧 In Progress

- [ ] **File tree navigator** with markdown preview
- [ ] **Hotspots dashboard** - Identify high-churn files
- [ ] **Ownership dashboard** - Code ownership and bus factor analysis
- [ ] **Global search** and command palette (`Ctrl+P`)

### 🔮 Planned Features

- [ ] **Interactive rebase visualization** (read-only preview)
- [ ] **Commit graph visualization** with ASCII art
- [ ] **Blame view** for files
- [ ] **Export reports** (PDF, HTML, Markdown)
- [ ] **Comparison view** (branches, commits, tags)
- [ ] **Performance metrics** dashboard
- [ ] **Code complexity** analysis
- [ ] **Dependency graph** visualization

### 💡 Ideas & Experiments

- [ ] **Collaborative features** - Share repository views
- [ ] **Custom themes** with live preview
- [ ] **Plugin marketplace** for community extensions
- [ ] **Integration with GitHub/GitLab** APIs
- [ ] **Time-travel debugging** for code evolution

---

## 🙏 Inspiration & Attribution

<div align="center">

HistTUI draws inspiration from amazing TUI tools:

[![lazygit](https://img.shields.io/badge/lazygit-Terminal%20UI%20for%20git-blue)](https://github.com/jesseduffield/lazygit)
[![k9s](https://img.shields.io/badge/k9s-Kubernetes%20CLI-blue)](https://github.com/derailed/k9s)
[![tig](https://img.shields.io/badge/tig-Text%20mode%20git-blue)](https://github.com/jonas/tig)
[![htop](https://img.shields.io/badge/htop-Process%20viewer-blue)](https://github.com/htop-dev/htop)
[![btop](https://img.shields.io/badge/btop-Resource%20monitor-blue)](https://github.com/aristocratos/btop)

</div>

### 📜 Code Attribution

HistTUI uses code patterns from these open-source projects with proper attribution:

<details>
<summary><strong>📦 Third-Party Components</strong></summary>

#### [@inkjs/ui](https://github.com/vadimdemedes/ink-ui) by Vadim Demedes (MIT License)
- Comprehensive UI component library for Ink-based terminal applications
- Components: TextInput, Spinner, ProgressBar, Badge, Alert, Select, StatusMessage
- Custom theming integration for neurodiversity-friendly color schemes
- Used throughout: `src/components/`, themed via `src/config/inkui-theme.ts`

#### [emoj](https://github.com/sindresorhus/emoj) by Sindre Sorhus (MIT License)
- Interactive fuzzy search patterns
- Debounced input handling
- Number shortcuts (1-9) for quick selection
- Used in: `src/components/screens/FuzzySearchScreen.tsx`

#### [changelog-view](https://github.com/jdeniau/changelog-view) by Julien Deniau (MIT License)
- Changelog parsing logic
- Semantic version extraction
- Markdown version grouping
- Used in: `src/utils/changelog.ts`, `src/components/screens/ChangelogViewerScreen.tsx`

#### [nanocoder](https://github.com/Nano-Collective/nanocoder) by Nano Collective (MIT with Attribution)
- AI-powered coding assistant patterns
- Multi-provider AI integration (OpenAI, Anthropic, OpenRouter, Ollama)
- Repository context awareness
- AI SDK streaming patterns
- Used in: `src/plugins/ai-assistant/` (AI Assistant Plugin)

#### [vibe-kanban](https://github.com/BloopAI/vibe-kanban) by BloopAI (Apache 2.0)
- Task orchestration patterns
- Git worktree isolation for safe parallel development
- Kanban-style task management
- Coding agent workflows
- Used in: `src/plugins/ai-assistant/services/WorktreeManager.ts`, `TaskManager.ts`

**Full license texts:** See [THIRD_PARTY_LICENSES.md](./THIRD_PARTY_LICENSES.md)

</details>

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

### Step 2: Preserve File Headers
Every file using third-party patterns MUST have this format at the top:

```typescript
/**
 * [Component Name]
 * [Brief description]
 * 
 * [Patterns/Code] inspired by [project name] by [author] (MIT License)
 * https://github.com/[org]/[repo]
 */
```

### Step 3: Verification Commands
```bash
# Verify attribution is intact
cat src/components/screens/FuzzySearchScreen.tsx | head -10
cat src/utils/changelog.ts | head -10
```

**REMEMBER:** Attribution is not optional. It is a legal requirement of the MIT License.

</details>

---

## 🤝 Contributing

<div align="center">

We welcome contributions! 🎉

[![Contributors](https://img.shields.io/badge/Contributors-Welcome-brightgreen)](./CONTRIBUTING.md)
[![Good First Issue](https://img.shields.io/badge/Good%20First%20Issue-Available-blue)](https://github.com/shelbeely/HistTUI/labels/good%20first%20issue)

</div>

### 🚀 Quick Contribution Guide

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** and test thoroughly
4. **Commit with emoji** (✨ feat: Add amazing feature)
5. **Push to your fork** (`git push origin feature/amazing-feature`)
6. **Open a Pull Request**

### 📝 Contribution Areas

<table>
<tr>
<td width="33%">

#### 🐛 Bug Fixes
Help us squash bugs and improve stability

</td>
<td width="33%">

#### ✨ New Features
Add new screens, dashboards, or capabilities

</td>
<td width="33%">

#### 📚 Documentation
Improve guides, examples, and tutorials

</td>
</tr>
<tr>
<td width="33%">

#### 🔌 Plugins
Create and share custom plugins

</td>
<td width="33%">

#### 🎨 UI/UX
Enhance visual design and usability

</td>
<td width="33%">

#### 🧪 Testing
Write tests and improve coverage

</td>
</tr>
</table>

### 📚 Development Docs

For detailed development setup and guidelines, see **[CONTRIBUTING.md](./CONTRIBUTING.md)**

---

## 📄 License

<div align="center">

**ISC License**

Copyright (c) 2026 HistTUI Contributors

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

See [LICENSE](./LICENSE) for full text.

</div>

---

## 🌟 Star History

<div align="center">

[![Star History Chart](https://api.star-history.com/svg?repos=shelbeely/HistTUI&type=Date)](https://star-history.com/#shelbeely/HistTUI&Date)

</div>

---

## 📞 Connect & Support

<div align="center">

### Found a bug? Have a feature request?

[![Issues](https://img.shields.io/badge/Issues-Report%20Here-red)](https://github.com/shelbeely/HistTUI/issues)
[![Discussions](https://img.shields.io/badge/Discussions-Join%20Community-blue)](https://github.com/shelbeely/HistTUI/discussions)

### Show your support

If you like HistTUI, consider:
- ⭐ **Starring the repository**
- 🐦 **Sharing on social media**
- 💬 **Spreading the word**

</div>

---

<div align="center">

**Made with 🚀 for developers who live in the terminal**

![Built with Bun](https://img.shields.io/badge/Built%20with-Bun-black?logo=bun)
![Built with Ink](https://img.shields.io/badge/Built%20with-Ink-purple)
![Powered by TypeScript](https://img.shields.io/badge/Powered%20by-TypeScript-blue?logo=typescript)

</div>

