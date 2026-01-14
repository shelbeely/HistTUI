# 📋 HistTUI Complete Technical Specification

**Version:** 1.1.0  
**Last Updated:** 2026-01-14  
**Status:** Production

> **The Authoritative Reference Document for HistTUI**
> 
> This specification provides complete documentation of HistTUI's architecture, features, APIs, data models, and capabilities. Whether you're contributing to HistTUI, building plugins, integrating with external systems, or using HistTUI for your projects, this document is your comprehensive guide.

---

## 📑 Table of Contents

### Part I: Foundation
1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [Tech Stack](#3-tech-stack)
4. [File Organization](#4-file-organization)

### Part II: Core Systems
5. [Configuration System](#5-configuration-system)
6. [Cache System](#6-cache-system)
7. [Git Layer](#7-git-layer)
8. [Database Layer](#8-database-layer)
9. [Indexer System](#9-indexer-system)

### Part III: User Interface
10. [UI Architecture](#10-ui-architecture)
11. [Component Catalog](#11-component-catalog)
12. [Screens & Dashboards](#12-screens--dashboards)
13. [Theme System](#13-theme-system)
14. [Keyboard Shortcuts](#14-keyboard-shortcuts)

### Part IV: Advanced Features
15. [Plugin System](#15-plugin-system)
16. [AG-UI Integration](#16-ag-ui-integration)
17. [Code Planner](#17-code-planner)
18. [Time Tracking](#18-time-tracking)
19. [Multi-Repository Support](#19-multi-repository-support)

### Part V: Reference
20. [API Reference](#20-api-reference)
21. [Data Models](#21-data-models)
22. [Database Schema](#22-database-schema)
23. [Integration Points](#23-integration-points)
24. [Security](#24-security)
25. [Performance](#25-performance)

---

## 1. Project Overview

### 1.1 What is HistTUI?

**HistTUI** is an interactive Git History Terminal User Interface built with Ink and React. It provides a beautiful, keyboard-driven interface for exploring repository history, inspired by tools like lazygit, k9s, tig, htop, and btop.

### 1.2 Core Mission

Enable developers to:
- **Explore** git history with blazing-fast performance
- **Analyze** repository patterns and contributor activity
- **Navigate** codebases at any point in time
- **Plan** code changes with AI-assisted specifications
- **Track** development time and productivity

### 1.3 Key Principles

| Principle | Description |
|-----------|-------------|
| **Read-Only Safety** | Never modifies repositories. All git operations are safe reads. |
| **Keyboard-First UX** | Vim-style navigation with discoverable shortcuts. |
| **Performance** | SQLite indexing for instant searches in massive repos. |
| **Extensibility** | Clean plugin API for custom screens and dashboards. |
| **Accessibility** | Material Design 3 with neurodiversity-friendly themes. |
| **AI-Powered** | Generative UI with AG-UI protocol integration. |

### 1.4 Current Capabilities

✅ **Browse & Explore**
- Navigate commit history with vim-style controls
- View commit details and diffs with syntax highlighting
- Explore file trees at any commit
- Search commits by author, date, message, or file path

✅ **Analyze & Visualize**
- Repository activity dashboard (default first screen)
- Top contributors visualization
- File hotspots (most-changed files)
- Commit patterns and trends

✅ **Plan & Execute**
- Code Planner for structured specifications
- Project context management (tech stack, style guide, goals)
- AI-powered implementation planning
- Safe iteration workflow

✅ **Track & Monitor**
- Time tracking with idle detection
- Session management
- File-level activity tracking
- Language statistics

✅ **Multi-Repository**
- Switch between repositories instantly
- Smart caching system
- No restart required

---

## 2. Architecture

### 2.1 System Overview

HistTUI follows a layered architecture with clear separation of concerns:

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                        CLI Entry Point                          │
│                     (Commander.js + Bun)                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
         ┌───────────────┴──────────────┐
         │                              │
┌────────▼─────────┐          ┌────────▼────────────┐
│   Git Layer      │          │   Cache Manager     │
│  (simple-git)    │          │  ~/.histtui/cache/  │
│  - clone()       │          │  - Smart hashing    │
│  - log()         │          │  - Update tracking  │
│  - show()        │          │  - Repository info  │
└────────┬─────────┘          └─────────────────────┘
         │
┌────────▼──────────────────────────────────────────────────┐
│            SQLite Database (Bun Native)                   │
│  Tables: commits, branches, tags, file_changes,          │
│          metadata, time_sessions, code_specs              │
└────────┬──────────────────────────────────────────────────┘
         │
┌────────▼──────────────────────────────────────────────────┐
│              Indexer (Git → Database)                     │
│  - Batch processing (100 commits/batch)                   │
│  - Progress reporting                                     │
│  - Incremental updates                                    │
└────────┬──────────────────────────────────────────────────┘
         │
┌────────▼──────────────────────────────────────────────────┐
│         UI Layer (Ink + React + @inkjs/ui)                │
│  ┌────────────────────────────────────────────────────┐   │
│  │ ThemeProvider (Material Design 3 - #6750A4)        │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │ AGUIProvider (Generative UI Protocol)        │  │   │
│  │  │  ┌────────────────────────────────────────┐  │  │   │
│  │  │  │ AppProvider (Global State)             │  │  │   │
│  │  │  │  - Screens & Dashboards                │  │  │   │
│  │  │  │  - Common Components                   │  │  │   │
│  │  │  │  - GenerativeStatusBar                 │  │  │   │
│  │  │  └────────────────────────────────────────┘  │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  └────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────┘
         │
┌────────▼──────────────────────────────────────────────────┐
│         Plugin System (Optional Extensions)               │
│  - Custom screens and dashboards                          │
│  - Custom indexers                                        │
│  - Plugin API with hooks                                  │
└───────────────────────────────────────────────────────────┘
\`\`\`

### 2.2 Layer Descriptions

#### 2.2.1 CLI Layer
**Location**: `src/cli.ts`  
**Purpose**: Application entry point and command-line interface

**Responsibilities**:
- Parse command-line arguments with Commander.js
- Initialize configuration from files and environment
- Launch Ink-based TUI
- Provide cache and config management subcommands
- Handle process lifecycle and error boundaries

**Key APIs**:
\`\`\`bash
histtui <repo-url> [options]        # Main command
histtui config                       # View configuration
histtui cache --list                 # List cached repos
histtui cache --clear                # Clear cache
\`\`\`

#### 2.2.2 Configuration Layer
**Location**: `src/config/`  
**Purpose**: Manage application settings and user preferences

**Components**:
- `ConfigManager` - Loads/saves config from `~/.histtui/config.json`
- `inkui-theme.ts` - Theme definitions and Material Design 3 mapping
- Default configuration with sensible defaults

**Configuration Schema**: See [Section 5: Configuration System](#5-configuration-system)

#### 2.2.3 Cache Layer
**Location**: `src/core/cache/`  
**Purpose**: Manage cloned repositories for fast access

**Components**:
- `CacheManager` - Repository caching and metadata
- Smart URL hashing for consistent cache keys
- Update tracking and staleness detection

**Cache Structure**:
\`\`\`
~/.histtui/
├── cache/
│   ├── <repo-hash-1>/
│   │   ├── .git/              # Cloned repository
│   │   ├── histtui.db         # SQLite database
│   │   └── cache-info.json    # Metadata
│   └── <repo-hash-2>/
│       └── ...
├── projects/                  # Code Planner data
│   └── <repo-hash>/
│       ├── context.json       # Project context
│       └── specs/             # Code specifications
├── config.json                # User configuration
└── time-tracking.db           # Time tracking database
\`\`\`

#### 2.2.4 Git Layer
**Location**: `src/core/git/`  
**Purpose**: Interface with git repositories (read-only)

**Components**:
- `GitClient` - Wraps simple-git library
- All operations are read-only for safety
- Batch operations for performance

**Key Methods**: See [Section 7: Git Layer](#7-git-layer)

#### 2.2.5 Database Layer
**Location**: `src/core/database/`  
**Purpose**: Index and query git history with SQLite

**Components**:
- `GitDatabase` - SQLite database wrapper using `bun:sqlite`
- Schema management and migrations
- Prepared statements for all queries
- Full-text search indexing

**Schema**: See [Section 22: Database Schema](#22-database-schema)

#### 2.2.6 Indexer Layer
**Location**: `src/core/indexer/`  
**Purpose**: Coordinate Git → Database indexing

**Components**:
- `GitIndexer` - Orchestrates indexing process
- Batch processing (100 commits per batch)
- Progress reporting with phases
- Incremental update support

**Workflow**:
1. Check if already indexed
2. Fetch commits from git (GitClient)
3. Batch process commits
4. Insert into database (GitDatabase)
5. Index branches and tags
6. Save metadata
7. Report completion

#### 2.2.7 UI Layer
**Location**: `src/components/`  
**Purpose**: User interface with Ink/React

**Structure**:
\`\`\`
components/
├── App.tsx                    # Main app orchestration
├── AppContext.tsx             # Global state management
├── InkUIShowcase.tsx          # @inkjs/ui component showcase
├── common/                    # Reusable components
│   ├── UI.tsx                # BoxBorder, StatusBar, Header, etc.
│   ├── hooks.ts              # useKeyboard, useListNavigation
│   ├── RepoInputScreen.tsx   # Repository selection
│   ├── SetupWizard.tsx       # First-launch wizard
│   └── GenerativeStatusBar.tsx  # AG-UI status bar
├── screens/                  # Main screens
│   ├── TimelineScreen.tsx
│   ├── CommitDetailScreen.tsx
│   ├── BranchesScreen.tsx
│   ├── FileTreeScreen.tsx
│   ├── CodePlannerScreen.tsx
│   ├── RepoManagerScreen.tsx
│   ├── FuzzySearchScreen.tsx
│   └── ChangelogViewerScreen.tsx
├── dashboards/               # Dashboard screens
│   └── ActivityDashboard.tsx  (default first screen)
└── examples/
    └── InkUIExamples.tsx     # Component examples
\`\`\`

**State Management**:
- `AppContext` provides global state via React Context
- Screens use `useApp()` hook to access context
- Local state with `useState` for screen-specific data
- AG-UI state via `useAgentState()` hook

#### 2.2.8 Plugin System
**Location**: `src/plugins/`  
**Purpose**: Extensibility without core modifications

**Components**:
- `PluginManager` - Loads and manages plugins
- `PluginAPI` - Interface exposed to plugins
- Built-in plugins (currently no built-in plugins loaded by default)

**Plugin Interface**: See [Section 15: Plugin System](#15-plugin-system)

#### 2.2.9 Code Planner Layer
**Location**: `src/core/code-planner/`  
**Purpose**: Agent-driven development system

**Components**:
- `ProjectContextManager` - Manages project context
- `SpecStorage` - Manages code specifications
- `templates.ts` - Predefined spec templates

**Storage**:
\`\`\`
~/.histtui/projects/<repo-hash>/
├── context.json              # Project context
└── specs/                    # Code specifications
    ├── spec-1.json
    ├── spec-2.json
    └── ...
\`\`\`

#### 2.2.10 Time Tracking Layer
**Location**: `src/core/time-tracking/`  
**Purpose**: Track development time and productivity

**Components**:
- `TimeTracker` - Main time tracking orchestrator
- `TimeDatabase` - SQLite database for sessions
- `ActivityDetector` - Idle detection
- `StatisticsCalculator` - Productivity metrics

**Database**: `~/.histtui/time-tracking.db`

#### 2.2.11 AG-UI Layer
**Location**: `src/core/ag-ui/`  
**Purpose**: Generative UI with AG-UI protocol

**Components**:
- `AGUIProvider.tsx` - React provider for AG-UI state
- `AgentClient.ts` - HTTP/SSE client for agent communication
- `useAgentState.ts` - React hook for accessing agent state

**Agent Server**: `agent-server/server.ts` (runs on port 3001)

### 2.3 Data Flow

#### 2.3.1 Initial Load Flow

\`\`\`
User runs: histtui https://github.com/user/repo
    ↓
CLI parses args → Creates App component
    ↓
App initializes:
  → CacheManager checks if repo cached
  → If not: GitClient.clone(url) → Local cache
  → GitDatabase opens/creates SQLite DB
  → GitIndexer checks if indexed
  → If not: GitIndexer.indexAll()
      - GitClient.getAllCommits() → Commits
      - GitClient.getBranches() → Branches
      - GitClient.getTags() → Tags
      - Insert into GitDatabase
  → PluginManager loads plugins (if any)
    ↓
App renders → ActivityDashboard (default)
    ↓
ActivityDashboard:
  → GitDatabase.getDashboardActivity()
  → Renders repository statistics, top contributors, activity patterns
  → User can press '1' to navigate to Timeline
\`\`\`

#### 2.3.2 Navigation Flow

\`\`\`
User presses 'j' (down)
    ↓
useKeyboard hook catches input
    ↓
Calls moveDown() from useListNavigation
    ↓
Updates selectedIndex state
    ↓
Component re-renders with new selection
\`\`\`

#### 2.3.3 Commit Detail Flow

\`\`\`
User presses Enter on commit
    ↓
TimelineScreen calls setSelectedCommit(commit)
    ↓
TimelineScreen calls setScreen('commit-detail')
    ↓
App renders CommitDetailScreen
    ↓
CommitDetailScreen:
  → GitClient.getCommitDetail(hash)
  → Gets diff and file changes
  → Renders commit info + file list + diff viewer
\`\`\`

#### 2.3.4 AG-UI Streaming Flow

\`\`\`
User action triggers AI request
    ↓
AgentClient.sendMessage(message, context)
    ↓
HTTP POST to agent server
    ↓
Agent server processes request
    ↓
Server-Sent Events (SSE) stream back to client:
  → 'stream' events → Update streamingContent state
  → 'tool_start' → Add to toolsExecuting array
  → 'tool_complete' → Remove from toolsExecuting
  → 'component_render' → Add to generatedComponents
    ↓
GenerativeStatusBar displays streaming content
    ↓
Screens display generatedComponents if applicable
\`\`\`

### 2.4 Error Handling Strategy

#### Git Errors
- Invalid repository URL → Show error, don't crash
- Network failures during clone → Retry logic, user notification
- Missing commits/branches → Graceful degradation

#### Database Errors
- Corrupt database → Offer to rebuild index
- Schema migration → Automatic when possible
- Query failures → Log and show user-friendly message

#### UI Errors
- Empty states for no data
- Loading states during async operations
- Error boundaries for component failures

### 2.5 Performance Optimizations

#### Indexing
- **Batch Processing**: Commits indexed in batches of 100
- **Selective Indexing**: File changes indexed on-demand
- **Progress Reporting**: UI stays responsive during indexing

#### Queries
- **Indexed Columns**: `date`, `author_email`, `file_path`
- **Prepared Statements**: All queries use prepared statements
- **Pagination**: Lists support pagination with offset/limit

#### Memory
- **Stream Processing**: Large diffs aren't loaded entirely into memory
- **Limited Results**: Default limit of 1000 commits per query
- **Database WAL Mode**: Write-Ahead Logging for better concurrency

---

## 3. Tech Stack

### 3.1 Core Technologies

| Technology | Version | Purpose | Why This Choice? |
|------------|---------|---------|------------------|
| **Bun** | ≥1.3.5 | JavaScript runtime | Native SQLite, faster builds, modern tooling |
| **TypeScript** | 5.9.3 | Type safety | Catch errors early, better IDE support |
| **React** | 19.2.3 | UI framework | Component-based architecture |
| **Ink** | 6.6.0 | Terminal UI | React for CLIs, declarative TUI rendering |
| **@inkjs/ui** | 2.0.0 | UI components | Pre-built terminal components, theming |
| **simple-git** | 3.30.0 | Git operations | Reliable git interface, promise-based |
| **better-sqlite3** | (via Bun) | Database | Fast, embedded SQLite with FTS |

### 3.2 UI & Interaction

| Package | Version | Purpose |
|---------|---------|---------|
| `ink` | 6.6.0 | Terminal rendering (React for CLI) |
| `@inkjs/ui` | 2.0.0 | Pre-built components (TextInput, Spinner, Badge, Alert, etc.) |
| `ink-gradient` | 3.0.0 | Gradient text effects |
| `ink-link` | 5.0.0 | Clickable links in terminal |
| `ink-markdown` | 1.0.4 | Markdown rendering |
| `ink-select-input` | 6.2.0 | Selection menus |
| `ink-spinner` | 5.0.0 | Loading spinners |
| `ink-table` | 3.1.0 | Table components |
| `ink-text-input` | 6.0.0 | Text input fields |
| `boxen` | 8.0.1 | Bordered boxes |
| `chalk` | 5.6.2 | Terminal colors |
| `ora` | 9.0.0 | Elegant terminal spinners |

### 3.3 Git & Repository

| Package | Version | Purpose |
|---------|---------|---------|
| `simple-git` | 3.30.0 | Git operations |
| `parse-diff` | 0.11.1 | Diff parsing |
| `minimatch` | 10.1.1 | File pattern matching |

### 3.4 AI & Generative UI

| Package | Version | Purpose |
|---------|---------|---------|
| `@ag-ui/client` | 0.0.42 | AG-UI protocol client |
| `@ag-ui/core` | 0.0.42 | AG-UI core types |
| `@ai-sdk/anthropic` | 3.0.12 | Anthropic AI integration |
| `@ai-sdk/openai` | 3.0.9 | OpenAI integration |
| `@anthropic-ai/sdk` | 0.71.2 | Anthropic SDK |
| `openai` | 6.16.0 | OpenAI SDK |
| `ai` | 6.0.30 | Vercel AI SDK (streaming) |
| `zod` | 4.3.5 | Schema validation |
| `zod-to-json-schema` | 3.25.1 | JSON schema generation |

### 3.5 CLI & Utilities

| Package | Version | Purpose |
|---------|---------|---------|
| `commander` | 14.0.2 | CLI argument parsing |
| `execa` | 9.6.1 | Process execution |
| `nanoid` | 5.1.6 | Unique ID generation |
| `date-fns` | 4.1.0 | Date utilities |
| `fuse.js` | 7.1.0 | Fuzzy search |
| `marked` | 9.1.6 | Markdown parsing |
| `patch-console` | 2.0.0 | Console patching for Ink |

### 3.6 Theme & Design

| Package | Version | Purpose |
|---------|---------|---------|
| `@material/material-color-utilities` | 0.3.0 | Material Design 3 colors |

### 3.7 Development

| Package | Version | Purpose |
|---------|---------|---------|
| `typescript` | 5.9.3 | TypeScript compiler |
| `tsx` | 4.21.0 | TypeScript execution |
| `@types/bun` | latest | Bun type definitions |
| `@types/node` | 25.0.6 | Node.js types |
| `@types/react` | 19.2.8 | React types |
| `@types/marked` | 5.0.2 | Marked types |
| `react-devtools-core` | 6.1.5 | React DevTools for debugging |

### 3.8 Runtime Requirements

\`\`\`json
{
  "engines": {
    "bun": ">=1.3.5"
  }
}
\`\`\`

**Why Bun?**
- Native SQLite support (no native dependencies)
- 3x faster than Node.js for builds
- Built-in TypeScript support
- Better performance for terminal UIs

---

## 4. File Organization

### 4.1 Project Structure

\`\`\`
HistTUI/
├── src/                          # Source code
│   ├── cli.ts                   # CLI entry point
│   ├── components/              # UI components
│   │   ├── App.tsx             # Main app component
│   │   ├── AppContext.tsx      # Global state
│   │   ├── InkUIShowcase.tsx   # Component showcase
│   │   ├── common/             # Reusable components
│   │   │   ├── UI.tsx          # BoxBorder, StatusBar, etc.
│   │   │   ├── hooks.ts        # Custom hooks
│   │   │   ├── RepoInputScreen.tsx
│   │   │   ├── SetupWizard.tsx
│   │   │   └── GenerativeStatusBar.tsx
│   │   ├── screens/            # Main screens
│   │   │   ├── TimelineScreen.tsx
│   │   │   ├── CommitDetailScreen.tsx
│   │   │   ├── BranchesScreen.tsx
│   │   │   ├── FileTreeScreen.tsx
│   │   │   ├── CodePlannerScreen.tsx
│   │   │   ├── RepoManagerScreen.tsx
│   │   │   ├── FuzzySearchScreen.tsx
│   │   │   └── ChangelogViewerScreen.tsx
│   │   ├── dashboards/         # Dashboard screens
│   │   │   └── ActivityDashboard.tsx
│   │   └── examples/
│   │       └── InkUIExamples.tsx
│   ├── config/                 # Configuration
│   │   ├── index.ts           # ConfigManager
│   │   └── inkui-theme.ts     # Theme definitions
│   ├── core/                   # Core business logic
│   │   ├── cache/             # Repository caching
│   │   │   └── index.ts       # CacheManager
│   │   ├── git/               # Git operations
│   │   │   └── index.ts       # GitClient
│   │   ├── database/          # SQLite database
│   │   │   └── index.ts       # GitDatabase
│   │   ├── indexer/           # Git indexing
│   │   │   └── index.ts       # GitIndexer
│   │   ├── ag-ui/             # AG-UI integration
│   │   │   ├── AGUIProvider.tsx
│   │   │   ├── AgentClient.ts
│   │   │   ├── useAgentState.ts
│   │   │   └── index.ts
│   │   ├── code-planner/      # Code planning system
│   │   │   ├── ProjectContextManager.ts
│   │   │   ├── SpecStorage.ts
│   │   │   ├── templates.ts
│   │   │   └── index.ts
│   │   ├── time-tracking/     # Time tracking
│   │   │   ├── TimeTracker.ts
│   │   │   ├── TimeDatabase.ts
│   │   │   ├── ActivityDetector.ts
│   │   │   └── StatisticsCalculator.ts
│   │   ├── routines/          # Daily routines (standup, retrospective)
│   │   │   └── RoutineManager.ts
│   │   ├── pomodoro/          # Pomodoro timer
│   │   │   └── PomodoroTimer.ts
│   │   └── gamification/      # Achievement system
│   │       ├── ChallengeMode.ts
│   │       ├── PowerUpStore.ts
│   │       └── Leaderboards.ts
│   ├── plugins/               # Plugin system
│   │   └── (no built-in plugins currently)
│   ├── types/                 # TypeScript types
│   │   ├── index.ts          # Core types
│   │   └── code-planner.ts   # Code Planner types
│   └── utils/                 # Utilities
│       └── changelog.ts      # Changelog parsing
├── agent-server/             # AG-UI agent backend
│   ├── server.ts            # Agent server (port 3001)
│   └── README.md
├── docs/                     # Additional documentation
│   └── PATTERNS.md
├── dist/                     # Compiled output
├── .github/                  # GitHub configuration
│   └── agents/              # GitHub Copilot agent specs
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── tsconfig.bun.json        # Bun-specific TS config
├── bunfig.toml              # Bun configuration
├── config.example.json      # Example configuration
├── launch-with-agent.ts     # Launch script with AG-UI
├── README.md                # Main documentation
├── ARCHITECTURE.md          # Architecture guide
├── CONFIGURATION.md         # Configuration reference
├── PLUGIN_GUIDE.md          # Plugin development
├── CODE_PLANNER.md          # Code Planner guide
├── AGUI_INTEGRATION.md      # AG-UI integration
├── MATERIAL_DESIGN_3.md     # MD3 theme guide
├── ACCESSIBILITY.md         # Accessibility features
├── MULTI_REPO.md            # Multi-repo support
├── CONTRIBUTING.md          # Contribution guide
├── SETUP_WIZARD.md          # Setup wizard guide
├── TROUBLESHOOTING.md       # Troubleshooting
├── COMPONENTS.md            # Component catalog
├── NEURODIVERSE_FEATURES.md # Neurodiversity features
├── INKUI_INTEGRATION.md     # @inkjs/ui integration
├── LAUNCHER.md              # Launcher guide
├── LAUNCH_GUIDE.md          # Launch guide
├── PROJECT_CONTEXT.md       # Project context
├── AGENT_BACKEND.md         # Agent backend docs
└── THIRD_PARTY_LICENSES.md  # License attributions
\`\`\`

### 4.2 File Count Summary

| Category | Count | Description |
|----------|-------|-------------|
| TypeScript Files | 67 | All .ts and .tsx files |
| React Components | ~18 | UI components and screens |
| Core Modules | ~20 | Business logic modules |
| Documentation | 22+ | Markdown documentation files |
| Configuration | 4 | Config files (tsconfig, package.json, etc.) |

### 4.3 Key Files

#### Entry Points
- `src/cli.ts` - CLI entry point
- `src/components/App.tsx` - Main React app
- `launch-with-agent.ts` - Launch with AG-UI server
- `agent-server/server.ts` - AG-UI agent backend

#### Configuration
- `package.json` - Project metadata and dependencies
- `tsconfig.json` - TypeScript configuration
- `config.example.json` - Example user configuration
- `bunfig.toml` - Bun-specific configuration

#### Build Outputs
- `dist/cli.js` - Built CLI executable
- `dist/index.js` - Built main module
- `dist/**/*.d.ts` - TypeScript declarations

### 4.4 Special Directories

#### ~/.histtui/ (User Data)

\`\`\`
~/.histtui/
├── cache/                    # Cloned repositories
│   └── <repo-hash>/
│       ├── .git/            # Git repository
│       ├── histtui.db       # SQLite database
│       └── cache-info.json  # Metadata
├── projects/                # Code Planner data
│   └── <repo-hash>/
│       ├── context.json     # Project context
│       └── specs/           # Code specifications
├── config.json              # User configuration
└── time-tracking.db         # Time tracking database
\`\`\`

---


## 5. Configuration System

### 5.1 Overview

HistTUI uses a hierarchical configuration system:

1. **Built-in defaults** (`src/config/index.ts`)
2. **User configuration file** (`~/.histtui/config.json`)
3. **Environment variables** (`HISTTUI_*`)
4. **Command-line arguments** (`--flag`)

Later sources override earlier ones.

### 5.2 Configuration File Location

**Path**: `~/.histtui/config.json`  
**Format**: JSON  
**Permissions**: 600 (owner read/write only)  
**Encoding**: UTF-8

### 5.3 Complete Configuration Schema

\`\`\`typescript
interface HistTUIConfig {
  // Core settings
  cacheDir: string;                    // Default: ~/.histtui/cache
  maxCommits: number;                  // Default: 10000
  defaultBranch: string;               // Default: main

  // LLM configuration
  llm?: {
    provider: 'openai' | 'anthropic' | 'openrouter' | 'ollama';
    apiKey?: string;                   // API key for provider
    model?: string;                    // Model identifier
    baseUrl?: string;                  // Custom API base URL
  };

  // AG-UI configuration
  agui?: {
    enabled: boolean;                  // Default: false
    endpoint: string;                  // Default: http://localhost:3001/api/agent
  };

  // Key bindings
  keyBindings: {
    quit: string[];                    // Default: ['q', 'ctrl+c']
    help: string[];                    // Default: ['?', 'h']
    search: string[];                  // Default: ['/', 'ctrl+f']
    navigate: {
      up: string[];
      down: string[];
      left: string[];
      right: string[];
      pageUp: string[];
      pageDown: string[];
      home: string[];
      end: string[];
    };
    tabs: {
      next: string[];
      prev: string[];
      timeline: string[];
      branches: string[];
      files: string[];
      dashboards: string[];
      repoManager: string[];
      codePlanner: string[];
    };
  };

  // Theme configuration
  theme: {
    name: string;                      // Default: Default
    colors: {
      primary: string;
      secondary: string;
      success: string;
      warning: string;
      error: string;
      info: string;
      background: string;
      foreground: string;
      muted: string;
      border: string;
      focusBorder: string;
    };
    accessibility: {
      highContrast: boolean;
      reducedMotion: boolean;
      colorblindSafe: boolean;
    };
  };

  // Accessibility settings
  accessibility: {
    reducedMotion: boolean;
    highContrast: boolean;
    focusIndicatorStyle: 'default' | 'bold-border' | 'highlight';
    screenReaderMode: boolean;
    largeText: boolean;
  };

  // Time tracking
  timeTracking: {
    enabled: boolean;
    idleTimeout: number;               // Seconds
    sessionGap: number;                // Seconds
    trackFiles: boolean;
    trackLanguages: boolean;
  };

  // UI settings
  ui: {
    theme: string;
    showBreadcrumbs: boolean;
    showHelpHints: boolean;
    progressiveDisclosure: boolean;
    animations: 'full' | 'reduced' | 'none';
  };
}
\`\`\`

### 5.4 Default Configuration

See `config.example.json`:

\`\`\`json
{
  "cacheDir": "~/.histtui/cache",
  "maxCommits": 10000,
  "keyBindings": {
    "quit": ["q", "ctrl+c"],
    "help": ["?", "h"],
    "search": ["/", "ctrl+f"],
    "navigate": {
      "up": ["k", "up"],
      "down": ["j", "down"],
      "left": ["h", "left"],
      "right": ["l", "right"],
      "pageUp": ["ctrl+u", "pageup"],
      "pageDown": ["ctrl+d", "pagedown"],
      "home": ["g", "home"],
      "end": ["G", "end"]
    },
    "tabs": {
      "next": ["tab", "ctrl+n"],
      "prev": ["shift+tab", "ctrl+p"],
      "timeline": ["1"],
      "branches": ["2"],
      "files": ["3"],
      "dashboards": ["4"]
    }
  },
  "theme": {
    "colors": {
      "primary": "#61afef",
      "secondary": "#56b6c2",
      "success": "#98c379",
      "warning": "#e5c07b",
      "error": "#e06c75",
      "info": "#c678dd"
    }
  }
}
\`\`\`

### 5.5 Environment Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `HISTTUI_CACHE_DIR` | string | `~/.histtui/cache` | Cache directory |
| `HISTTUI_CONFIG_PATH` | string | `~/.histtui/config.json` | Config file path |
| `PORT` | number | `3001` | Agent server port |
| `NODE_ENV` | string | `development` | Environment mode |
| `OPENAI_API_KEY` | string | - | OpenAI API key |
| `ANTHROPIC_API_KEY` | string | - | Anthropic API key |
| `OPENROUTER_API_KEY` | string | - | OpenRouter API key |

### 5.6 Command-Line Arguments

\`\`\`bash
histtui [repository-url] [options]

Options:
  --max-commits <number>    Maximum commits to index (default: 10000)
  --branch <name>           Branch to checkout (default: main)
  --cache-dir <path>        Cache directory (default: ~/.histtui/cache)
  --no-cache                Skip cache, clone fresh
  --verbose                 Verbose logging
  --help                    Display help
  --version                 Display version
\`\`\`

### 5.7 LLM Provider Configuration

#### OpenAI

\`\`\`json
{
  "llm": {
    "provider": "openai",
    "apiKey": "sk-...",
    "model": "gpt-4-turbo"
  }
}
\`\`\`

**Models**: `gpt-4-turbo`, `gpt-4`, `gpt-3.5-turbo`

#### Anthropic

\`\`\`json
{
  "llm": {
    "provider": "anthropic",
    "apiKey": "sk-ant-...",
    "model": "claude-3-5-sonnet-20241022"
  }
}
\`\`\`

**Models**: `claude-3-5-sonnet-20241022`, `claude-3-opus-20240229`, `claude-3-haiku-20240307`

#### OpenRouter

\`\`\`json
{
  "llm": {
    "provider": "openrouter",
    "apiKey": "sk-or-...",
    "model": "anthropic/claude-3.5-sonnet",
    "baseUrl": "https://openrouter.ai/api/v1"
  }
}
\`\`\`

**Popular Models**: 100+ available including GPT-4, Claude, Gemini, Llama

#### Ollama (Local)

\`\`\`json
{
  "llm": {
    "provider": "ollama",
    "model": "llama3.1",
    "baseUrl": "http://localhost:11434"
  }
}
\`\`\`

**Note**: No API key required for Ollama

---

## 6. Cache System

### 6.1 Overview

HistTUI caches cloned repositories to enable instant access and offline browsing.

**Cache Location**: `~/.histtui/cache/`

### 6.2 Cache Structure

\`\`\`
~/.histtui/cache/
└── <repo-hash>/
    ├── .git/                 # Cloned git repository
    ├── <files>               # Working tree files
    ├── histtui.db            # SQLite index database
    └── cache-info.json       # Cache metadata
\`\`\`

### 6.3 Repository Hashing

Repositories are identified by a hash of their URL:

\`\`\`typescript
function getRepoHash(url: string): string {
  // Normalize URL
  const normalized = url
    .toLowerCase()
    .replace(/\.git$/, '')
    .replace(/\/$/, '');
  
  // Create hash (first 12 chars of SHA-256)
  return createHash('sha256')
    .update(normalized)
    .digest('hex')
    .substring(0, 12);
}
\`\`\`

**Example**:
- URL: `https://github.com/user/repo`
- Hash: `df6f60522ef7`
- Cache Path: `~/.histtui/cache/df6f60522ef7/`

### 6.4 Cache Metadata

**File**: `cache-info.json`

\`\`\`json
{
  "url": "https://github.com/user/repo",
  "name": "repo",
  "clonedAt": 1705334400000,
  "lastUpdated": 1705420800000,
  "lastIndexed": 1705420800000,
  "commitCount": 1543,
  "size": 45678912,
  "defaultBranch": "main"
}
\`\`\`

### 6.5 CacheManager API

**Location**: `src/core/cache/index.ts`

\`\`\`typescript
class CacheManager {
  // Get repository path in cache
  getRepoPath(repoUrl: string): string;
  
  // Get database path
  getDbPath(repoUrl: string): string;
  
  // Check if repository is cached
  isCached(repoUrl: string): boolean;
  
  // Check if repository is indexed
  isIndexed(repoUrl: string): boolean;
  
  // Get cache metadata
  getCacheInfo(repoUrl: string): CacheInfo | null;
  
  // Save cache metadata
  saveCacheInfo(repoUrl: string, info: CacheInfo): void;
  
  // List all cached repositories
  listCached(): CacheInfo[];
  
  // Clear specific repository cache
  clearCache(repoUrl: string): void;
  
  // Clear all caches
  clearAllCaches(): void;
  
  // Get total cache size
  getCacheSize(): number;
}
\`\`\`

### 6.6 Cache Lifecycle

\`\`\`
User opens repository
    ↓
CacheManager.isCached(url) ?
    ├─ Yes → Load from cache
    │         ↓
    │     Check if indexed
    │         ├─ Yes → Show UI immediately
    │         └─ No → Index in background
    │
    └─ No → Clone repository
              ↓
          Save to cache
              ↓
          Index repository
              ↓
          Show UI
\`\`\`

### 6.7 Cache Management Commands

\`\`\`bash
# List cached repositories
histtui cache --list

# Output:
# Repository: user/repo
# URL: https://github.com/user/repo
# Size: 45.6 MB
# Commits: 1,543
# Last Updated: 2026-01-14 10:30:00
# ---

# Clear specific cache
histtui cache --clear https://github.com/user/repo

# Clear all caches
histtui cache --clear-all

# Show cache statistics
histtui cache --stats
\`\`\`

### 6.8 Update Strategy

HistTUI doesn't automatically update cached repositories. Updates happen:

1. **User request**: Press `u` in RepoManagerScreen
2. **Command line**: `histtui <url> --update`
3. **Staleness check**: If `lastUpdated` > 7 days ago, prompt user

---

