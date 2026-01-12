# HistTUI Architecture Guide

## Overview

HistTUI is a production-grade Terminal User Interface for exploring Git repository history. Built with Ink (React for terminals) and TypeScript, it provides a fast, keyboard-driven interface inspired by tools like lazygit, k9s, and tig.

## Design Principles

1. **Read-Only Operations** - Never modifies the repository. All git operations are safe reads.
2. **Async-First** - Non-blocking operations with progress indicators for large repositories.
3. **Keyboard-First UX** - Vim-style navigation with discoverable shortcuts.
4. **Plugin Extensibility** - Clean APIs for custom screens, dashboards, and data indexers.
5. **Performance** - SQLite indexing enables instant searches even in massive repos.
6. **Clear Layer Separation** - Independent layers communicate through well-defined interfaces.

## Architecture Layers

### 1. CLI Layer (`src/cli.ts`)

**Purpose:** Entry point for the application

**Responsibilities:**
- Parse command-line arguments with Commander.js
- Initialize configuration
- Launch Ink-based TUI
- Provide cache and config management commands

**Key APIs:**
```typescript
// Main command
histtui <repo-url> [options]

// Subcommands
histtui config         // View configuration
histtui cache --list   // List cached repos
histtui cache --clear  // Clear cache
```

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
    ├── ActivityDashboard.tsx
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
App renders → TimelineScreen (default)
    ↓
TimelineScreen:
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

For more information, see:
- [README.md](./README.md) - User documentation
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines
- [PLUGIN_GUIDE.md](./PLUGIN_GUIDE.md) - Plugin development (TODO)
