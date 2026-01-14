# HistTUI Architecture Guide

> **💡 Looking for the complete technical reference?** See **[SPECIFICATION.md](./SPECIFICATION.md)** for comprehensive documentation of all systems, APIs, data models, and integration points.

## Overview

HistTUI is a production-grade Terminal User Interface for exploring Git repository history. Built with Ink (React for terminals) and TypeScript, it provides a fast, keyboard-driven interface inspired by tools like lazygit, k9s, and tig.

**This document focuses on architectural patterns and layer interactions. For complete API reference, database schemas, and component specifications, see [SPECIFICATION.md](./SPECIFICATION.md).**

## Design Principles

1. **Read-Only Operations** - Never modifies the repository. All git operations are safe reads.
2. **Async-First** - Non-blocking operations with progress indicators for large repositories.
3. **Keyboard-First UX** - Vim-style navigation with discoverable shortcuts.
4. **Plugin Extensibility** - Clean APIs for custom screens, dashboards, and data indexers.
5. **Performance** - SQLite indexing enables instant searches even in massive repos.
6. **Clear Layer Separation** - Independent layers communicate through well-defined interfaces.

<details>
<summary><strong>For AI Agents / LLMs - Architecture Deep Dive</strong></summary>

## Understanding the Codebase

**Step 0:** Explore the repository structure
```bash
cd /path/to/HistTUI

# View project structure
tree -L 2 src/
# Expected output:
# src/
# ├── cli.ts
# ├── components/
# │   ├── App.tsx
# │   ├── AppContext.tsx
# │   ├── common/
# │   ├── dashboards/
# │   └── screens/
# ├── config/
# ├── core/
# │   ├── cache/
# │   ├── database/
# │   ├── git/
# │   └── indexer/
# ├── plugins/
# ├── types/
# └── utils/
```

**Step 1:** Understand the data flow
```bash
# Entry point
cat src/cli.ts | grep -A 5 "program.parse"

# Main app orchestration
cat src/components/App.tsx | grep -A 10 "function App"

# State management
cat src/components/AppContext.tsx | grep -A 5 "createContext"
```

**Step 2:** Test the architecture
```bash
# Build to verify architecture is sound
npm run build

# Check for circular dependencies
npm install -g madge
madge --circular --extensions ts,tsx src/

# Verify layer separation
# Core should not import from components
grep -r "from.*components" src/core/
# Should return empty (no imports from components layer)
```

</details>

## Architecture Layers

### 1. CLI Layer (`src/cli.ts`)

**Purpose:** Entry point for the application

**Responsibilities:**
- Parse command-line arguments with Commander.js
- Initialize configuration
- Launch Ink-based TUI
- Provide cache and config management commands

**Key APIs:**
```bash
# Main command
histtui <repo-url> [options]

# Subcommands
histtui config         # View configuration
histtui cache --list   # List cached repos
histtui cache --clear  # Clear cache
```

<details>
<summary><strong>For AI Agents / LLMs - CLI Layer</strong></summary>

**Step 0:** Understand CLI structure
```bash
# View CLI implementation
cat src/cli.ts

# Check available commands
node dist/cli.js --help

# Test each command
node dist/cli.js config
node dist/cli.js cache --list
```

**Step 1:** Add a new CLI command
```bash
# 1. Edit src/cli.ts
# 2. Add command definition:
program
  .command('new-command')
  .description('Description')
  .action(() => {
    // Implementation
  });

# 3. Rebuild
npm run build

# 4. Test
node dist/cli.js new-command
```

**Step 2:** Verify command works
```bash
# Check command is registered
node dist/cli.js --help | grep "new-command"

# Test with various inputs
node dist/cli.js new-command --option value
```

</details>

### 2. Configuration Layer (`src/config/`)

**Purpose:** Manage application settings

**Components:**
- `ConfigManager` - Loads/saves config from `~/.histtui/config.json`
- Default configuration with sensible defaults
- Keyboard binding customization
- Theme customization

**Configuration Schema:**
```json
{
  "cacheDir": "~/.histtui/cache",
  "maxCommits": 10000,
  "keyBindings": { ... },
  "theme": { ... }
}
```

<details>
<summary><strong>For AI Agents / LLMs - Configuration Layer</strong></summary>

**Step 0:** Locate and read config
```bash
# Check if config exists
test -f ~/.histtui/config.json && echo "Config exists" || echo "Using defaults"

# View current config
cat ~/.histtui/config.json 2>/dev/null || echo "No custom config"

# View default config
cat config.example.json
```

**Step 1:** Modify configuration
```bash
# Create config directory
mkdir -p ~/.histtui

# Copy example config
cp config.example.json ~/.histtui/config.json

# Edit specific values
# Use jq for JSON manipulation
jq '.maxCommits = 5000' ~/.histtui/config.json > tmp.json && mv tmp.json ~/.histtui/config.json
```

**Step 2:** Verify config is loaded
```bash
# Run with debug to see config loading
node dist/cli.js https://github.com/user/repo --debug

# Check debug log
grep "config" ~/.histtui/debug.log
```

</details>

### 3. Cache Layer (`src/core/cache/`)

**Purpose:** Manage cloned repositories

**Components:**
- `CacheManager` - Handles repository caching

**Key Methods:**
```typescript
getRepoPath(repoUrl): string
getDbPath(repoUrl): string
isCached(repoUrl): boolean
isIndexed(repoUrl): boolean
getCacheInfo(repoUrl): CacheInfo | null
saveCacheInfo(repoUrl, info): void
listCached(): CacheInfo[]
clearCache(repoUrl): void
```

**Cache Structure:**
```
~/.histtui/
├── cache/
│   ├── <repo-hash-1>/
│   │   ├── .git/              # Cloned repository
│   │   ├── histtui.db         # SQLite database
│   │   └── cache-info.json    # Metadata
│   └── <repo-hash-2>/
│       └── ...
├── config.json
└── debug.log
```

<details>
<summary><strong>For AI Agents / LLMs - Cache Layer</strong></summary>

**Step 0:** Inspect cache
```bash
# List cached repositories
ls -la ~/.histtui/cache/

# Check cache info for a repo
cat ~/.histtui/cache/*/cache-info.json | jq '.'

# See cache sizes
du -sh ~/.histtui/cache/*
```

**Step 1:** Manually clear cache
```bash
# Clear specific repo cache
rm -rf ~/.histtui/cache/df6f60522ef7

# Clear all caches
rm -rf ~/.histtui/cache/*

# Or use CLI command
node dist/cli.js cache --clear
```

**Step 2:** Debug cache issues
```bash
# Check if repo is cached
REPO_URL="https://github.com/user/repo"
node -e "
const { CacheManager } = require('./dist/core/cache/index.js');
const cache = new CacheManager();
console.log('Cached:', cache.isCached('$REPO_URL'));
console.log('Indexed:', cache.isIndexed('$REPO_URL'));
"

# Verify database exists
test -f ~/.histtui/cache/*/histtui.db && echo "DB exists" || echo "No DB"
```

</details>

### 4. Git Layer (`src/core/git/`)

**Purpose:** Interface with git repositories

**Components:**
- `GitClient` - Wraps simple-git library

**Key Methods:**
```typescript
// Static
static clone(url, path, onProgress): Promise<GitClient>

// Instance
update(onProgress): Promise<void>
getAllCommits(maxCount?): Promise<Commit[]>
getCommitsByBranch(branch, maxCount?): Promise<Commit[]>
getCommitDetail(hash): Promise<{commit, diff, files}>
getBranches(): Promise<Branch[]>
getTags(): Promise<Tag[]>
getFileTree(commitHash): Promise<string[]>
getFileContent(path, commitHash): Promise<string>
getFileHistory(path, maxCount?): Promise<Commit[]>
```

**Safety:**
- All operations are read-only
- No `git commit`, `git push`, `git reset`, etc.
- Only safe commands: `log`, `show`, `ls-tree`, `branch`, `tag`

### 5. Database Layer (`src/core/database/`)

**Purpose:** Index and query git history

**Components:**
- `GitDatabase` - SQLite database wrapper

**Schema:**
```sql
-- Commits table (main data)
CREATE TABLE commits (
  hash TEXT PRIMARY KEY,
  short_hash TEXT,
  author TEXT,
  author_email TEXT,
  date INTEGER,
  subject TEXT,
  body TEXT,
  parents TEXT,
  refs TEXT,
  files_changed INTEGER,
  insertions INTEGER,
  deletions INTEGER
);

-- Branches
CREATE TABLE branches (
  name TEXT PRIMARY KEY,
  commit_hash TEXT,
  current INTEGER,
  remote INTEGER
);

-- Tags
CREATE TABLE tags (
  name TEXT PRIMARY KEY,
  commit_hash TEXT,
  message TEXT,
  date INTEGER
);

-- File changes
CREATE TABLE file_changes (
  id INTEGER PRIMARY KEY,
  commit_hash TEXT,
  file_path TEXT,
  old_path TEXT,
  status TEXT,
  additions INTEGER,
  deletions INTEGER,
  binary INTEGER
);

-- Metadata
CREATE TABLE metadata (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at INTEGER
);

-- Plugin tables registry
CREATE TABLE plugin_tables (
  plugin_id TEXT,
  table_name TEXT,
  created_at INTEGER
);
```

**Key Query Methods:**
```typescript
insertCommits(commits): void
insertBranches(branches): void
insertTags(tags): void
getCommits(filter): Commit[]
getCommit(hash): Commit | null
getBranches(): Branch[]
getTags(): Tag[]
getDashboardActivity(): DashboardData
getFileHotspots(limit): HotspotData[]
getFileOwnership(path): OwnershipData | null
searchCommits(query, limit): Commit[]
```

### 6. Indexer Layer (`src/core/indexer/`)

**Purpose:** Coordinate Git → Database indexing

**Components:**
- `GitIndexer` - Orchestrates indexing process

**Workflow:**
```
1. Check if already indexed
2. Fetch commits from git (GitClient)
3. Batch process commits (100 at a time)
4. Insert into database (GitDatabase)
5. Index branches and tags
6. Save metadata
7. Report progress
```

**Progress Phases:**
- `cloning` - Cloning repository
- `fetching-commits` - Reading git log
- `indexing-commits` - Writing to database
- `indexing-branches` - Indexing branches
- `indexing-tags` - Indexing tags
- `complete` - Done

### 7. UI Layer (`src/components/`)

**Purpose:** User interface with Ink/React

**Structure:**
```
components/
├── App.tsx              # Main app orchestration
├── AppContext.tsx       # Global state management
├── common/              # Reusable components
│   ├── UI.tsx          # BoxBorder, StatusBar, Header, etc.
│   └── hooks.ts        # useKeyboard, useListNavigation, etc.
├── screens/            # Main screens
│   ├── TimelineScreen.tsx
│   ├── CommitDetailScreen.tsx
│   ├── BranchesScreen.tsx
│   └── ... (future screens)
└── dashboards/         # Dashboard screens
    ├── ActivityDashboard.tsx (default first screen)
    └── ... (future dashboards)
```

**State Management:**
- `AppContext` provides global state
- Screens use `useApp()` hook
- Local state with `useState` for screen-specific data

**Common Hooks:**
```typescript
// Keyboard handling
useKeyboard({ onUp, onDown, onEnter, onSearch, ... })

// List navigation
const { selectedIndex, selectedItem, visibleItems, moveUp, moveDown, ... } 
  = useListNavigation(items, pageSize)

// Search
const { searchMode, searchQuery, startSearch, handleSearchInput } 
  = useSearch(onSearch)
```

### 8. Plugin System (`src/plugins/`)

**Purpose:** Extensibility without core modifications

**Components:**
- `PluginManager` - Loads and manages plugins
- `PluginAPI` - Interface exposed to plugins

**Plugin Interface:**
```typescript
interface Plugin {
  name: string;
  version: string;
  description: string;
  init: (api: PluginAPI) => Promise<void>;
  cleanup?: () => Promise<void>;
}

interface PluginAPI {
  registerScreen(screen: CustomScreen): void;
  registerDashboard(dashboard: CustomDashboard): void;
  registerIndexer(indexer: CustomIndexer): void;
  getDatabase(): Database;
  getGitClient(): GitClient;
  logger: Logger;
}
```

**Example Plugin:**
```typescript
// my-plugin.js
export default {
  name: 'my-plugin',
  version: '1.0.0',
  description: 'Custom dashboard',
  async init(api) {
    // Register custom dashboard
    api.registerDashboard({
      id: 'custom-dashboard',
      name: 'My Dashboard',
      async query(db) {
        return db.prepare('SELECT * FROM commits LIMIT 10').all();
      },
      render(data) {
        return <Box>{/* UI */}</Box>;
      },
    });

    // Register custom indexer
    api.registerIndexer({
      id: 'custom-indexer',
      name: 'Custom Indexer',
      init(db) {
        db.exec('CREATE TABLE IF NOT EXISTS my_data (...)');
      },
      async index(db, commits) {
        // Process commits
      },
    });
  },
};
```

### 9. Code Planner Layer (`src/core/code-planner/`)

**Purpose:** Agent-driven development system for planning and executing code changes

**Structure:**
```
core/code-planner/
├── index.ts                    # Module exports
├── ProjectContextManager.ts    # Manages project context
├── SpecStorage.ts              # Manages code specifications
└── templates.ts                # Predefined spec templates
```

**Components:**

**ProjectContextManager**
- Stores project-specific context (tech stack, style guide, goals, architecture)
- Storage: `~/.histtui/projects/<repo-hash>/context.json`
- Methods:
  ```typescript
  loadContext(repoUrl: string): ProjectContext | null
  saveContext(context: ProjectContext): void
  createContext(repoUrl: string): ProjectContext
  hasContext(repoUrl: string): boolean
  deleteContext(repoUrl: string): void
  listProjects(): ProjectContext[]
  ```

**SpecStorage**
- Manages code specifications (features, bugs, refactors, etc.)
- Storage: `~/.histtui/projects/<repo-hash>/specs/<spec-id>.json`
- Methods:
  ```typescript
  loadSpecs(repoUrl: string): CodeSpec[]
  loadSpec(repoUrl: string, specId: string): CodeSpec | null
  saveSpec(repoUrl: string, spec: CodeSpec): void
  deleteSpec(repoUrl: string, specId: string): void
  createSpec(title: string, templateId?: string): CodeSpec
  updateSpecStatus(repoUrl: string, specId: string, status: SpecStatus): void
  getSpecsByStatus(repoUrl: string, status: SpecStatus): CodeSpec[]
  searchSpecs(repoUrl: string, query: string): CodeSpec[]
  ```

**Templates**
- Predefined spec templates for common tasks
- Categories: feature, bugfix, refactor, docs, test, architecture
- Templates include: title format, problem statement, requirements, constraints, acceptance criteria

**UI Screens:**
```
components/screens/
├── CodePlannerScreen.tsx       # Main entry point (keyboard shortcut '6')
├── SpecEditorScreen.tsx        # Create/edit specs (future)
├── ContextManagerScreen.tsx    # Manage project context (future)
├── PlanReviewScreen.tsx        # Review AI-generated plans (future)
└── TemplateLibraryScreen.tsx   # Browse templates (future)
```

**Data Flow:**
```
User presses '6'
  → CodePlannerScreen loads
  → ProjectContextManager loads context.json
  → SpecStorage loads all specs from specs/
  → User creates/edits specs
  → Changes saved to ~/.histtui/projects/<repo-hash>/
  → AG-UI integration sends spec + context to agent backend
  → Agent generates plan
  → User reviews plan before execution
```

**AG-UI Integration:**
```typescript
interface AGUIRequest {
  type: 'generate-plan' | 'review-spec' | 'suggest-improvements';
  spec: CodeSpec;              // What to build
  context: ProjectContext;     // How to build it
  options?: {
    includeTests?: boolean;
    includeDocs?: boolean;
    safetyChecks?: boolean;
  };
}
```

**Key Principles:**
- **Local-First**: All data stored locally, no cloud dependency
- **Per-Repository**: Each repo has isolated context and specs
- **Safe Iteration**: Review AI plans before execution
- **Context-Aware**: AI receives full project context for better suggestions

<details>
<summary><strong>For AI Agents / LLMs - Code Planner Layer</strong></summary>

**Step 0:** Verify Code Planner is available
```bash
# Check if code-planner module exists
ls -la src/core/code-planner/

# Verify screen exists
cat src/components/screens/CodePlannerScreen.tsx | head -20
```

**Step 1:** Access Code Planner storage
```bash
# Navigate to projects directory
cd ~/.histtui/projects/

# List all projects with context
ls -la

# View a specific project's context
cat <repo-hash>/context.json | jq .

# List specs for a project
ls -la <repo-hash>/specs/
```

**Step 2:** Create or modify specs programmatically
```typescript
import { SpecStorage } from './src/core/code-planner';

// Initialize storage
const storage = new SpecStorage('/path/to/cache');

// Create a new spec
const spec = storage.createSpec('Add new dashboard', 'feature-new');
spec.description = 'Dashboard showing code ownership';
spec.context.problem = 'Hard to identify file ownership';
spec.context.requirements = [
  'Show top contributors per file',
  'Calculate bus factor',
];
spec.priority = 'high';
spec.tags = ['feature', 'dashboard'];

// Save spec
storage.saveSpec(repoUrl, spec);
```

**Step 3:** Work with project context
```typescript
import { ProjectContextManager } from './src/core/code-planner';

// Initialize manager
const contextMgr = new ProjectContextManager('/path/to/cache');

// Load or create context
let context = contextMgr.loadContext(repoUrl);
if (!context) {
  context = contextMgr.createContext(repoUrl);
}

// Update context
context.techStack.languages = ['TypeScript', 'JavaScript'];
context.techStack.frameworks = ['React', 'Ink'];
context.styleGuide.codeStyle = 'TypeScript strict mode';
context.productGoals.vision = 'Beautiful Git history explorer';

// Save context
contextMgr.saveContext(context);
```

**Step 4:** Integrate with AG-UI
```typescript
import { useAgentState } from '../core/ag-ui';

// In a component
const agentState = useAgentState();

// Send request to agent
const request: AGUIRequest = {
  type: 'generate-plan',
  spec: selectedSpec,
  context: projectContext,
  options: {
    includeTests: true,
    includeDocs: true,
    safetyChecks: true,
  },
};

// Agent receives full context and generates plan
// User reviews plan before execution
```

**Step 5:** Verify storage structure
```bash
# Check directory structure
tree ~/.histtui/projects/<repo-hash>/

# Expected output:
# <repo-hash>/
# ├── context.json
# └── specs/
#     ├── spec-1.json
#     ├── spec-2.json
#     └── ...

# Verify context format
cat ~/.histtui/projects/<repo-hash>/context.json | jq '.techStack'

# Verify spec format
cat ~/.histtui/projects/<repo-hash>/specs/spec-*.json | jq '.context'
```

</details>

## Data Flow

### Initial Load
```
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
  → PluginManager loads plugins
    ↓
App renders → ActivityDashboard (default)
    ↓
ActivityDashboard:
  → GitDatabase.getDashboardActivity()
  → Renders repository statistics, top contributors, activity patterns
  → User can press '1' to navigate to Timeline
    ↓
TimelineScreen (accessible via '1' key):
  → GitDatabase.getCommits(filter)
  → Renders list with useListNavigation
  → Handles keyboard with useKeyboard
```

### Navigation Flow
```
User presses 'j' (down)
    ↓
useKeyboard hook catches input
    ↓
Calls moveDown() from useListNavigation
    ↓
Updates selectedIndex state
    ↓
Component re-renders with new selection
```

### View Commit Detail
```
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
  → Renders commit info + file list
```

## Performance Considerations

### Indexing
- **Batch Processing:** Commits indexed in batches of 100
- **Selective Indexing:** File changes indexed on-demand
- **Progress Reporting:** UI stays responsive during indexing

### Queries
- **Indexed Columns:** `date`, `author_email`, `file_path`
- **Prepared Statements:** All queries use prepared statements
- **Pagination:** Lists support pagination with offset/limit

### Memory
- **Stream Processing:** Large diffs aren't loaded entirely into memory
- **Limited Results:** Default limit of 1000 commits per query
- **Database WAL Mode:** Write-Ahead Logging for better concurrency

## Error Handling

### Git Errors
- Invalid repository URL → Show error, don't crash
- Network failures during clone → Retry logic, user notification
- Missing commits/branches → Graceful degradation

### Database Errors
- Corrupt database → Offer to rebuild index
- Schema migration → Automatic when possible
- Query failures → Log and show user-friendly message

### UI Errors
- Empty states for no data
- Loading states during async operations
- Error boundaries for component failures

## Testing Strategy

### Manual Testing
```bash
# Small repo (fast)
npm run dev -- https://github.com/sindresorhus/emoj

# Medium repo
npm run dev -- https://github.com/jesseduffield/lazygit

# Large repo (stress test)
npm run dev -- https://github.com/microsoft/vscode
```

### Test Scenarios
1. First-time clone and index
2. Cached repository (instant load)
3. Navigate all screens
4. Search and filter
5. View commit details
6. Large repository handling
7. Network failures
8. Invalid inputs

## Extension Points

### Adding a New Screen
1. Create component in `src/components/screens/`
2. Add screen type to `Screen` union in `types/index.ts`
3. Add case in `App.tsx` switch statement
4. Add keyboard shortcut in `hooks.ts`

### Adding a Dashboard
1. Create component in `src/components/dashboards/`
2. Add query method in `GitDatabase`
3. Add case in `App.tsx`
4. Register in navigation

### Adding Database Queries
1. Add method to `GitDatabase` class
2. Use prepared statements
3. Handle edge cases (no results, etc.)
4. Add appropriate indexes if needed

## Security Considerations

1. **No Code Execution:** Never executes code from repositories
2. **Read-Only Git:** Only safe git commands allowed
3. **SQL Injection:** All queries use prepared statements
4. **Path Traversal:** Validate all file paths
5. **Resource Limits:** Max commits, timeouts on operations

## Future Architecture Plans

1. **Streaming Indexer:** Index while displaying partial results
2. **Incremental Updates:** Only fetch new commits
3. **Remote Mode:** Work with remote repos without cloning
4. **Multi-Repo:** Compare multiple repositories
5. **Export API:** Generate reports, charts, PDFs

---

## 📚 Related Documentation

For comprehensive technical details, see:

- **[📋 SPECIFICATION.md](./SPECIFICATION.md)** - ⭐ Complete technical specification (authoritative reference)
  - All systems architecture
  - Complete API reference  
  - Database schemas
  - Component catalog
  - Integration points
  - Security & performance
- **[README.md](./README.md)** - User documentation and quick start
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contribution guidelines
- **[PLUGIN_GUIDE.md](./PLUGIN_GUIDE.md)** - Plugin development
- **[CONFIGURATION.md](./CONFIGURATION.md)** - Configuration options
- **[CODE_PLANNER.md](./CODE_PLANNER.md)** - Code planning system
- **[AGUI_INTEGRATION.md](./AGUI_INTEGRATION.md)** - AG-UI protocol integration
- **[MATERIAL_DESIGN_3.md](./MATERIAL_DESIGN_3.md)** - Material Design 3 theming
