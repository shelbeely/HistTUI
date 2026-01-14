# HistTUI Plugin Development Guide

> **📋 For complete API reference and architecture details**, see **[SPECIFICATION.md](./SPECIFICATION.md)** - Section 15: Plugin System & Section 20: API Reference.

This guide explains how to create plugins for HistTUI, including how the built-in AI Assistant plugin was created.

## Plugin Architecture

Plugins extend HistTUI's functionality by adding:
- **Custom Screens** - New UI views
- **Custom Dashboards** - Data visualizations
- **Custom Indexers** - Additional data extraction from git history

## Creating a Plugin

### Basic Structure

```typescript
// src/plugins/my-plugin/index.ts
import type { Plugin, PluginAPI } from '../../types/index.js';

export class MyPlugin implements Plugin {
  name = 'my-plugin';
  version = '1.0.0';
  description = 'Description of what your plugin does';

  async init(api: PluginAPI): Promise<void> {
    // Register your screens, dashboards, or indexers
    api.registerScreen({
      id: 'my-screen',
      name: 'My Screen',
      shortcut: 'm',
      render: (props) => <MyScreenComponent {...props} />,
    });
  }

  async cleanup(): Promise<void> {
    // Optional: cleanup resources
  }
}

export default new MyPlugin();
```

### Plugin API

The `PluginAPI` provides these methods:

```typescript
interface PluginAPI {
  // Register a custom screen
  registerScreen(screen: CustomScreen): void;
  
  // Register a custom dashboard
  registerDashboard(dashboard: CustomDashboard): void;
  
  // Register a custom indexer
  registerIndexer(indexer: CustomIndexer): void;
  
  // Access the database
  getDatabase(): Database;
  
  // Access the git client
  getGitClient(): GitClient;
  
  // Logger
  logger: Logger;
}
```

## Example: AI Assistant Plugin

The AI Assistant plugin demonstrates all major plugin capabilities.

### File Structure

```
src/plugins/ai-assistant/
├── index.ts                          # Plugin entry point
├── types/
│   └── index.ts                      # Type definitions
├── services/
│   ├── AIService.ts                  # Multi-provider AI integration
│   ├── WorktreeManager.ts            # Git worktree isolation
│   ├── FileOperations.ts             # Safe file operations
│   ├── CommandExecutor.ts            # Command execution with safety
│   └── TaskManager.ts                # Kanban task management
└── screens/
    └── AIAssistantScreen.tsx         # Main UI component
```

### Key Components

#### 1. AIService - Multi-Provider AI

```typescript
export class AIService {
  private config: AIConfig;
  private provider: any;

  constructor(config?: Partial<AIConfig>) {
    this.config = {
      provider: 'openrouter',
      model: 'anthropic/claude-3.5-sonnet',
      ...config,
    };
    this.initializeProvider();
  }

  async sendMessage(message: string, context?: ConversationContext): Promise<string> {
    // Generate AI response with repository context
  }
}
```

**Patterns from nanocoder:**
- Multi-provider support (OpenAI, Anthropic, OpenRouter, Ollama)
- Streaming text generation
- Tool-calling architecture
- Repository context awareness

#### 2. WorktreeManager - Isolated Development

```typescript
export class WorktreeManager {
  async createWorktree(taskId: string, branchName: string): Promise<WorktreeInfo> {
    // Create isolated git worktree for task
    await execa('git', ['worktree', 'add', '-b', branchName, worktreePath, baseBranch]);
  }

  async executeInWorktree(taskId: string, command: string): Promise<CommandResult> {
    // Run commands in isolated worktree
  }
}
```

**Patterns from vibe-kanban:**
- Git worktree per task for parallel development
- Safe isolation from main repository
- Automatic cleanup on task completion

#### 3. TaskManager - Kanban Board

```typescript
export class TaskManager {
  async createTask(params: { title: string; description: string }): Promise<Task> {
    // Create task in SQLite database
  }

  getTasksByStatus(status: 'todo' | 'in-progress' | 'review' | 'done'): Task[] {
    // Query tasks by kanban column
  }
}
```

**Patterns from vibe-kanban:**
- Kanban-style status tracking
- Task-to-worktree mapping
- Priority and tagging system

### Custom Indexer Example

```typescript
api.registerIndexer({
  id: 'ai-context',
  name: 'AI Context Indexer',
  
  // Initialize custom tables
  init: (db: Database) => {
    db.exec(`
      CREATE TABLE IF NOT EXISTS ai_conversations (
        id TEXT PRIMARY KEY,
        task_id TEXT,
        timestamp INTEGER,
        role TEXT,
        content TEXT
      );
    `);
  },
  
  // Index commits for AI context
  index: async (db: Database, commits: Commit[]) => {
    // Extract AI-relevant information from commits
  },
});
```

## Plugin Best Practices

### 1. TypeScript Types

Define clear interfaces for your plugin's API:

```typescript
// types/index.ts
export interface MyPluginConfig {
  apiKey?: string;
  enabled: boolean;
}

export interface MyPluginData {
  id: string;
  timestamp: Date;
  content: string;
}
```

### 2. Service Layer Separation

Organize complex functionality into services:

```typescript
// services/MyService.ts
export class MyService {
  private config: MyPluginConfig;
  
  constructor(config: MyPluginConfig) {
    this.config = config;
  }
  
  async doSomething(): Promise<Result> {
    // Implementation
  }
}
```

### 3. UI Components

Use Ink components for consistent UI:

```typescript
import { Box, Text } from 'ink';
import { BoxBorder, StatusBar, Loading } from '../../../components/common/UI.js';

export function MyScreen() {
  return (
    <Box flexDirection="column">
      <BoxBorder title="My Plugin" borderColor="cyan">
        <Text>Plugin content here</Text>
      </BoxBorder>
      <StatusBar left="Status" center="Help: ?" right="q: Quit" />
    </Box>
  );
}
```

### 4. Error Handling

Always handle errors gracefully:

```typescript
try {
  const result = await somethingAsync();
} catch (error: any) {
  logger.error('Operation failed:', error);
  // Show user-friendly error
}
```

### 5. Resource Cleanup

Implement cleanup for long-running resources:

```typescript
async cleanup(): Promise<void> {
  // Close connections
  await this.connection?.close();
  
  // Remove temporary files
  await fs.rm(this.tempDir, { recursive: true });
  
  // Cancel timers
  clearInterval(this.interval);
}
```

## Security Considerations

### File Operations

Always validate file paths:

```typescript
private isAllowedPath(filePath: string): boolean {
  // Check against denied patterns
  for (const pattern of this.deniedPatterns) {
    if (pattern.test(filePath)) return false;
  }
  
  // Check against allowed patterns
  for (const pattern of this.allowedPatterns) {
    if (pattern.test(filePath)) return true;
  }
  
  return false; // Deny by default
}
```

### Command Execution

Whitelist safe commands:

```typescript
private allowedCommands = new Set([
  'npm', 'node', 'git', 'test'
]);

private isAllowedCommand(command: string): boolean {
  return this.allowedCommands.has(command);
}
```

### Database Queries

Use prepared statements:

```typescript
// ✅ Good: Prepared statement
const stmt = db.prepare('SELECT * FROM tasks WHERE id = ?');
const task = stmt.get(taskId);

// ❌ Bad: SQL injection risk
const task = db.prepare(`SELECT * FROM tasks WHERE id = '${taskId}'`).get();
```

## Loading Plugins

Plugins are loaded from `~/.histtui/plugins/`:

```bash
~/.histtui/
├── cache/
├── plugins/
│   ├── ai-assistant/         # Built-in plugin
│   └── my-plugin/            # Your custom plugin
│       ├── index.js          # Compiled plugin
│       └── package.json
└── config.json
```

To install a plugin:

```bash
# Copy compiled plugin to plugins directory
cp -r dist/my-plugin ~/.histtui/plugins/

# Or symlink during development
ln -s $(pwd)/dist/my-plugin ~/.histtui/plugins/my-plugin
```

## Testing Plugins

Create a simple test harness:

```typescript
// test/plugin.test.ts
import { MyPlugin } from '../src/plugins/my-plugin';

const mockAPI = {
  registerScreen: jest.fn(),
  registerDashboard: jest.fn(),
  registerIndexer: jest.fn(),
  getDatabase: () => mockDB,
  getGitClient: () => mockGit,
  logger: mockLogger,
};

describe('MyPlugin', () => {
  it('should initialize successfully', async () => {
    const plugin = new MyPlugin();
    await plugin.init(mockAPI);
    
    expect(mockAPI.registerScreen).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'my-screen' })
    );
  });
});
```

## Attribution Requirements

If your plugin is inspired by or uses patterns from other projects:

**1. Add header comments:**
```typescript
/**
 * My Plugin
 * 
 * Inspired by [project-name] by [author] ([license])
 * https://github.com/[org]/[repo]
 */
```

**2. Update THIRD_PARTY_LICENSES.md**

**3. Update README attribution section**

## Publishing Plugins

To share your plugin:

1. **Package it:**
```json
{
  "name": "histtui-plugin-my-plugin",
  "version": "1.0.0",
  "main": "dist/index.js",
  "peerDependencies": {
    "histtui": "^1.0.0"
  }
}
```

2. **Document it:**
```markdown
# histtui-plugin-my-plugin

My awesome HistTUI plugin that does X, Y, Z.

## Installation
\`\`\`bash
npm install -g histtui-plugin-my-plugin
\`\`\`

## Usage
Press 'm' in HistTUI to open My Plugin screen.
```

3. **Publish:**
```bash
npm publish
```

## Example Plugins

### Plugin Ideas

- **📊 Code Metrics** - Analyze code complexity, test coverage from git history
- **🔍 Advanced Search** - Semantic code search with embeddings
- **📝 Commit Templates** - Enforce commit message standards
- **🌐 Remote Integration** - GitHub/GitLab issues, PRs in TUI
- **📈 Contributor Insights** - Team productivity analytics
- **🎨 Visualization** - D3-style git graph rendering
- **🔔 Notifications** - Desktop notifications for repository events
- **💾 Export** - Export git data to various formats

## Need Help?

- **Documentation:** See [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Examples:** Study `src/plugins/ai-assistant/`
- **Issues:** https://github.com/shelbeely/HistTUI/issues

---

<details>
<summary><strong>For AI Agents / LLMs - Plugin Development Steps</strong></summary>

## Step-by-Step Plugin Creation

**Step 0: Setup**
```bash
# Create plugin directory
mkdir -p src/plugins/my-plugin/{types,services,screens}

# Create index file
touch src/plugins/my-plugin/index.ts
```

**Step 1: Define Types**
```bash
# Create types file
cat > src/plugins/my-plugin/types/index.ts << 'EOF'
export interface MyConfig {
  enabled: boolean;
}
EOF
```

**Step 2: Create Plugin Class**
```bash
# Implement Plugin interface
# Must have: name, version, description, init()
```

**Step 3: Register Components**
```bash
# In init(), call:
api.registerScreen({ id, name, shortcut, render });
api.registerDashboard({ id, name, query, render });
api.registerIndexer({ id, name, init, index });
```

**Step 4: Build & Test**
```bash
# Build plugin
npm run build

# Test in HistTUI
npm run dev -- https://github.com/user/repo

# Plugin should appear in UI
```

**Step 5: Attribution (if inspired by other projects)**
```bash
# Add header comment to main file
# Update THIRD_PARTY_LICENSES.md
# Update README.md attribution section
```

**Verification:**
```bash
# Check plugin loaded
grep "Loaded plugin" ~/.histtui/logs/histtui.log

# Check screen registered
# Press plugin shortcut key in TUI
```

</details>
