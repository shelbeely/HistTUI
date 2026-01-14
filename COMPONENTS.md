# 🧩 Component Reference

**Complete Guide to HistTUI UI Components**

HistTUI uses [@inkjs/ui](https://github.com/vadimdemedes/ink-ui) components combined with custom components to create a beautiful, interactive terminal interface. This guide documents every component used in the application.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [@inkjs/ui Components](#inkjsui-components)
- [Custom Components](#-custom-components)
- [Screen Components](#-screen-components)
- [Layout Components](#-layout-components)
- [Usage Examples](#-usage-examples)
- [Component Hierarchy](#-component-hierarchy)

---

## 🌟 Overview

### Component Libraries

**HistTUI uses three sources for components:**

1. **[@inkjs/ui](https://github.com/vadimdemedes/ink-ui)** - Official Ink UI component library
2. **[Ink Built-ins](https://github.com/vadimdemedes/ink)** - Core Ink components (Box, Text)
3. **Custom Components** - HistTUI-specific components

### Design Philosophy

✅ **Material Design 3** - Consistent color system and motion  
✅ **Accessible** - High contrast, keyboard-first navigation  
✅ **Composable** - Small, reusable components  
✅ **Type-Safe** - Full TypeScript definitions  

---

## @inkjs/ui Components

### Overview

HistTUI uses the following components from [@inkjs/ui](https://github.com/vadimdemedes/ink-ui) v2.0.0:

| Component | Usage Count | Purpose |
|-----------|-------------|---------|
| `TextInput` | High | Text input fields |
| `PasswordInput` | Medium | Secure password/API key input |
| `Select` | High | Single-choice selection lists |
| `MultiSelect` | Low | Multi-choice selection |
| `ConfirmInput` | Medium | Yes/No confirmations |
| `Spinner` | High | Loading indicators |
| `Badge` | High | Status indicators, labels |
| `StatusMessage` | Medium | Info/warning/error messages |
| `Alert` | Medium | Important notifications |
| `ProgressBar` | Low | Progress indicators |
| `ThemeProvider` | Once | Global theme configuration |

---

### TextInput

**Purpose:** Accept text input from users

**Import:**
```typescript
import { TextInput } from '@inkjs/ui';
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `placeholder` | string | No | - | Placeholder text |
| `defaultValue` | string | No | `''` | Initial value |
| `onChange` | function | No | - | Callback when value changes |
| `onSubmit` | function | No | - | Callback when Enter pressed |

**Usage:**

```typescript
import { TextInput } from '@inkjs/ui';

function RepoInput() {
  const [url, setUrl] = useState('');
  
  return (
    <TextInput
      placeholder="Enter repository URL..."
      defaultValue={url}
      onChange={setUrl}
      onSubmit={(value) => console.log('Submitted:', value)}
    />
  );
}
```

**Examples in HistTUI:**
- Repository URL input (RepoInputScreen)
- Model name input (SetupWizard)
- AG-UI endpoint input (SetupWizard)

**Screenshot Placeholder:**
```
┌────────────────────────────────────────┐
│ Enter repository URL:                  │
│ ▸ https://github.com/user/repo_        │
└────────────────────────────────────────┘
```

---

### PasswordInput

**Purpose:** Secure input for passwords and API keys (characters masked)

**Import:**
```typescript
import { PasswordInput } from '@inkjs/ui';
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `placeholder` | string | No | - | Placeholder text |
| `defaultValue` | string | No | `''` | Initial value |
| `onChange` | function | No | - | Callback when value changes |
| `onSubmit` | function | No | - | Callback when Enter pressed |
| `mask` | string | No | `'•'` | Character used for masking |

**Usage:**

```typescript
import { PasswordInput } from '@inkjs/ui';

function APIKeyInput() {
  const [apiKey, setApiKey] = useState('');
  
  return (
    <PasswordInput
      placeholder="sk-..."
      defaultValue={apiKey}
      onChange={setApiKey}
      onSubmit={(key) => saveAPIKey(key)}
    />
  );
}
```

**Examples in HistTUI:**
- API key input (SetupWizard - OpenAI, Anthropic, OpenRouter)

**Screenshot Placeholder:**
```
┌────────────────────────────────────────┐
│ API Key:                               │
│ ▸ ••••••••••••••••••••                 │
└────────────────────────────────────────┘
```

**Security Note:** Values are masked in UI but stored in plain text in config. Use file permissions (600) for security.

---

### Select

**Purpose:** Single-choice selection from a list of options

**Import:**
```typescript
import { Select } from '@inkjs/ui';
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `options` | Option[] | Yes | - | Array of options |
| `onChange` | function | No | - | Callback when selection changes |
| `defaultValue` | string | No | - | Initially selected value |

**Option Interface:**
```typescript
interface Option {
  label: string;  // Display text
  value: string;  // Internal value
}
```

**Usage:**

```typescript
import { Select } from '@inkjs/ui';

function ProviderSelect() {
  const providers = [
    { label: 'OpenAI (GPT-4, GPT-3.5)', value: 'openai' },
    { label: 'Anthropic (Claude)', value: 'anthropic' },
    { label: 'OpenRouter (Multiple Models)', value: 'openrouter' },
    { label: 'Ollama (Local Models)', value: 'ollama' },
  ];
  
  return (
    <Select
      options={providers}
      onChange={(value) => console.log('Selected:', value)}
    />
  );
}
```

**Examples in HistTUI:**
- LLM provider selection (SetupWizard)
- Model selection for OpenRouter (SetupWizard)
- Dashboard selection (ActivityDashboard)

**Screenshot Placeholder:**
```
┌────────────────────────────────────────┐
│ Select LLM Provider:                   │
│  ▶ OpenAI (GPT-4, GPT-3.5)             │
│    Anthropic (Claude)                  │
│    OpenRouter (Multiple Models)        │
│    Ollama (Local Models)               │
└────────────────────────────────────────┘
```

**Keyboard Controls:**
- `↑/↓` or `k/j` - Navigate options
- `Enter` - Select option
- `Esc` - Cancel (if supported)

---

### MultiSelect

**Purpose:** Multi-choice selection (checkboxes)

**Import:**
```typescript
import { MultiSelect } from '@inkjs/ui';
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `options` | Option[] | Yes | - | Array of options |
| `onChange` | function | No | - | Callback with selected values |
| `defaultValue` | string[] | No | `[]` | Initially selected values |

**Usage:**

```typescript
import { MultiSelect } from '@inkjs/ui';

function FeatureSelect() {
  const features = [
    { label: 'Enable AG-UI', value: 'agui' },
    { label: 'Track Time', value: 'time' },
    { label: 'Gamification', value: 'game' },
  ];
  
  return (
    <MultiSelect
      options={features}
      onChange={(selected) => console.log('Selected:', selected)}
    />
  );
}
```

**Examples in HistTUI:**
- Feature selection (potentially in advanced settings)

**Screenshot Placeholder:**
```
┌────────────────────────────────────────┐
│ Select Features:                       │
│  [✓] Enable AG-UI                      │
│  [ ] Track Time                        │
│  [✓] Gamification                      │
└────────────────────────────────────────┘
```

**Keyboard Controls:**
- `↑/↓` - Navigate options
- `Space` - Toggle selection
- `Enter` - Confirm selection

---

### ConfirmInput

**Purpose:** Yes/No confirmation dialogs

**Import:**
```typescript
import { ConfirmInput } from '@inkjs/ui';
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `onConfirm` | function | Yes | - | Callback when confirmed (Y) |
| `onCancel` | function | Yes | - | Callback when canceled (n) |

**Usage:**

```typescript
import { ConfirmInput } from '@inkjs/ui';

function DeleteConfirm() {
  return (
    <Box>
      <Text>Delete repository cache? (Y/n)</Text>
      <ConfirmInput
        onConfirm={() => deleteCache()}
        onCancel={() => goBack()}
      />
    </Box>
  );
}
```

**Examples in HistTUI:**
- Setup wizard confirmation (SetupWizard)
- Repository deletion confirmation (RepoManagerScreen)
- AG-UI enable/disable (SetupWizard)

**Screenshot Placeholder:**
```
┌────────────────────────────────────────┐
│ Delete repository cache? (Y/n)        │
│                                        │
│ Press Y to confirm, n to cancel        │
└────────────────────────────────────────┘
```

**Keyboard Controls:**
- `Y` or `y` - Confirm (yes)
- `N`, `n`, or `Esc` - Cancel (no)

---

### Spinner

**Purpose:** Loading/processing indicator

**Import:**
```typescript
import { Spinner } from '@inkjs/ui';
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `label` | string | No | - | Text label next to spinner |
| `type` | string | No | `'dots'` | Spinner style |

**Spinner Types:**
- `'dots'` - Animated dots (default)
- `'line'` - Rotating line
- `'arc'` - Arc animation
- `'arrow'` - Arrow animation

**Usage:**

```typescript
import { Spinner } from '@inkjs/ui';

function LoadingState() {
  return (
    <Box>
      <Spinner label="Loading repository..." />
    </Box>
  );
}
```

**Examples in HistTUI:**
- Repository cloning (RepoInputScreen)
- Database indexing (App initialization)
- Agent processing (GenerativeStatusBar)

**Screenshot Placeholder:**
```
┌────────────────────────────────────────┐
│ ⠋ Loading repository...               │
└────────────────────────────────────────┘
```

---

### Badge

**Purpose:** Small status labels and tags

**Import:**
```typescript
import { Badge } from '@inkjs/ui';
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | ReactNode | Yes | - | Badge text content |
| `color` | string | No | `'blue'` | Badge color |

**Usage:**

```typescript
import { Badge } from '@inkjs/ui';

function RepoListItem({ isCurrent }) {
  return (
    <Box>
      <Text>awesome-tui</Text>
      {isCurrent && <Badge color="green">CURRENT</Badge>}
    </Box>
  );
}
```

**Examples in HistTUI:**
- Current repository indicator (RepoManagerScreen)
- Tool execution status (GenerativeStatusBar)
- Streaming indicator (GenerativeStatusBar)

**Screenshot Placeholder:**
```
┌────────────────────────────────────────┐
│ awesome-tui [CURRENT]                  │
└────────────────────────────────────────┘
```

---

### StatusMessage

**Purpose:** Contextual information/warning/error messages

**Import:**
```typescript
import { StatusMessage } from '@inkjs/ui';
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | ReactNode | Yes | - | Message text |
| `variant` | string | No | `'info'` | Message type |

**Variants:**
- `'info'` - Blue, informational (default)
- `'success'` - Green, success messages
- `'warning'` - Yellow, warnings
- `'error'` - Red, errors

**Usage:**

```typescript
import { StatusMessage } from '@inkjs/ui';

function InfoPanel() {
  return (
    <Box flexDirection="column" gap={1}>
      <StatusMessage variant="info">
        Press '5' to open Repository Manager
      </StatusMessage>
      <StatusMessage variant="success">
        Configuration saved successfully
      </StatusMessage>
      <StatusMessage variant="warning">
        Large repository may take time to index
      </StatusMessage>
      <StatusMessage variant="error">
        Failed to connect to agent server
      </StatusMessage>
    </Box>
  );
}
```

**Examples in HistTUI:**
- Setup wizard hints (SetupWizard)
- Repository manager instructions (RepoManagerScreen)
- Completion messages (SetupWizard)

**Screenshot Placeholder:**
```
┌────────────────────────────────────────┐
│ ℹ️  Press '5' to open Repository Mgr   │
│ ✅ Configuration saved successfully    │
│ ⚠️  Large repo may take time to index  │
│ ❌ Failed to connect to agent server   │
└────────────────────────────────────────┘
```

---

### Alert

**Purpose:** Important notifications and alerts

**Import:**
```typescript
import { Alert } from '@inkjs/ui';
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | ReactNode | Yes | - | Alert content |
| `variant` | string | No | `'info'` | Alert type |

**Variants:** Same as StatusMessage (`info`, `success`, `warning`, `error`)

**Difference from StatusMessage:**
- Alert has **border and padding** for emphasis
- StatusMessage is **inline** and subtle

**Usage:**

```typescript
import { Alert } from '@inkjs/ui';

function ErrorDisplay({ error }) {
  return (
    <Alert variant="error">
      Error: {error.message}
    </Alert>
  );
}
```

**Examples in HistTUI:**
- Critical errors (App-level error boundary)
- Configuration warnings (SetupWizard)
- Success confirmations (SetupWizard)

**Screenshot Placeholder:**
```
┌────────────────────────────────────────┐
│ ╔════════════════════════════════════╗ │
│ ║ ❌ Error: Repository not found     ║ │
│ ╚════════════════════════════════════╝ │
└────────────────────────────────────────┘
```

---

### ProgressBar

**Purpose:** Visual progress indicator

**Import:**
```typescript
import { ProgressBar } from '@inkjs/ui';
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `value` | number | Yes | - | Progress value (0-100) |
| `color` | string | No | `'cyan'` | Bar color |

**Usage:**

```typescript
import { ProgressBar } from '@inkjs/ui';

function IndexProgress({ progress }) {
  return (
    <Box flexDirection="column">
      <Text>Indexing commits...</Text>
      <ProgressBar value={progress} color="cyan" />
      <Text dimColor>{progress}%</Text>
    </Box>
  );
}
```

**Examples in HistTUI:**
- Repository cloning progress
- Database indexing progress

**Screenshot Placeholder:**
```
┌────────────────────────────────────────┐
│ Indexing commits...                    │
│ ████████████████░░░░░░░░ 67%           │
└────────────────────────────────────────┘
```

---

### ThemeProvider

**Purpose:** Global theme configuration for all @inkjs/ui components

**Import:**
```typescript
import { ThemeProvider } from '@inkjs/ui';
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `theme` | Theme | No | - | Theme object |
| `children` | ReactNode | Yes | - | App components |

**Theme Interface:**
```typescript
interface Theme {
  colors?: {
    primary?: string;
    success?: string;
    warning?: string;
    error?: string;
  };
}
```

**Usage:**

```typescript
import { ThemeProvider } from '@inkjs/ui';
import { md3DarkScheme } from './config/material-design-3';

function App() {
  const theme = {
    colors: {
      primary: md3DarkScheme.primary,
      success: md3DarkScheme.tertiary,
      warning: '#e5c07b',
      error: md3DarkScheme.error,
    },
  };
  
  return (
    <ThemeProvider theme={theme}>
      <MainApp />
    </ThemeProvider>
  );
}
```

**Examples in HistTUI:**
- App.tsx (wraps entire application)
- Material Design 3 color integration

---

## 🎨 Custom Components

### Overview

HistTUI includes custom components in `/src/components/common/UI.tsx`:

| Component | Purpose |
|-----------|---------|
| `BoxBorder` | Bordered container with title |
| `StatusBar` | Bottom status bar (left/center/right) |
| `Header` | Screen header with title/subtitle |
| `EmptyState` | Empty state message with icon |
| `Loading` | Loading state with spinner |
| `ErrorDisplay` | Error message display |
| `KeyHint` | Keyboard shortcut hints |
| `TabBar` | Tab navigation bar |
| `ListItem` | Selectable list item |
| `SplitPane` | Two-column layout |
| `Badge` | Wrapper for @inkjs/ui Badge |
| `StatusMessage` | Wrapper for @inkjs/ui StatusMessage |
| `Alert` | Wrapper for @inkjs/ui Alert |

---

### BoxBorder

**Purpose:** Container with rounded border and optional title

**Location:** `src/components/common/UI.tsx`

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | ReactNode | Yes | - | Content inside box |
| `title` | string | No | - | Title text above box |
| `borderColor` | string | No | `'blue'` | Border color |
| `width` | number/string | No | - | Box width |
| `height` | number/string | No | - | Box height |
| `flexDirection` | string | No | `'column'` | Flex direction |

**Usage:**

```typescript
import { BoxBorder } from './components/common/UI';

function SettingsPanel() {
  return (
    <BoxBorder title="Settings" borderColor="green">
      <Text>Setting 1: Value</Text>
      <Text>Setting 2: Value</Text>
    </BoxBorder>
  );
}
```

**Screenshot:**
```
┌─ Settings ─────────────────────────────┐
│ Setting 1: Value                       │
│ Setting 2: Value                       │
└────────────────────────────────────────┘
```

**Examples in HistTUI:**
- Setup wizard panels (SetupWizard)
- Repository manager (RepoManagerScreen)
- All screen containers

---

### StatusBar

**Purpose:** Bottom status bar with left/center/right sections

**Location:** `src/components/common/UI.tsx`

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `left` | string | No | - | Left section text |
| `center` | string | No | - | Center section text |
| `right` | string | No | - | Right section text |

**Usage:**

```typescript
import { StatusBar } from './components/common/UI';

function AppStatusBar() {
  return (
    <StatusBar
      left="awesome-tui"
      center="Timeline View"
      right="12:34 PM"
    />
  );
}
```

**Screenshot:**
```
─────────────────────────────────────────
awesome-tui    Timeline View    12:34 PM
```

**Examples in HistTUI:**
- Bottom status bar (most screens)
- Quick info display

---

### Header

**Purpose:** Screen header with title and optional subtitle

**Location:** `src/components/common/UI.tsx`

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | string | Yes | - | Main title text |
| `subtitle` | string | No | - | Subtitle text |

**Usage:**

```typescript
import { Header } from './components/common/UI';

function CommitScreen() {
  return (
    <Box flexDirection="column">
      <Header 
        title="Commit Timeline" 
        subtitle="Browse repository commits"
      />
      {/* ... content ... */}
    </Box>
  );
}
```

**Screenshot:**
```
Commit Timeline
Browse repository commits
```

**Examples in HistTUI:**
- All screen headers
- Section titles

---

### EmptyState

**Purpose:** Display when no data is available

**Location:** `src/components/common/UI.tsx`

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `icon` | string | No | `'📭'` | Emoji icon |
| `message` | string | Yes | - | Main message |
| `hint` | string | No | - | Additional hint |

**Usage:**

```typescript
import { EmptyState } from './components/common/UI';

function CommitList({ commits }) {
  if (commits.length === 0) {
    return (
      <EmptyState
        icon="📭"
        message="No commits found"
        hint="Try adjusting your filters"
      />
    );
  }
  
  return <CommitListView commits={commits} />;
}
```

**Screenshot:**
```
        📭
   No commits found
Try adjusting your filters
```

**Examples in HistTUI:**
- Empty repository list (RepoManagerScreen)
- No search results (FuzzySearchScreen)
- No commits in range (TimelineScreen)

---

### Loading

**Purpose:** Loading state with spinner and message

**Location:** `src/components/common/UI.tsx`

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `message` | string | No | `'Loading...'` | Loading message |

**Usage:**

```typescript
import { Loading } from './components/common/UI';

function DataView({ isLoading, data }) {
  if (isLoading) {
    return <Loading message="Fetching commits..." />;
  }
  
  return <DataTable data={data} />;
}
```

**Screenshot:**
```
     ⠋ Fetching commits...
```

**Examples in HistTUI:**
- Initial app loading
- Repository cloning
- Database indexing

---

### ErrorDisplay

**Purpose:** Display error messages with dismiss option

**Location:** `src/components/common/UI.tsx`

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `error` | string | Yes | - | Error message |
| `onDismiss` | function | No | - | Dismiss callback |

**Usage:**

```typescript
import { ErrorDisplay } from './components/common/UI';

function AppError({ error, onClear }) {
  return (
    <ErrorDisplay
      error={error.message}
      onDismiss={onClear}
    />
  );
}
```

**Screenshot:**
```
╔════════════════════════════════════════╗
║ ❌ Failed to connect to repository    ║
╚════════════════════════════════════════╝
  (Press any key to dismiss)
```

**Examples in HistTUI:**
- Git operation errors
- Network errors
- Configuration errors

---

### KeyHint

**Purpose:** Display keyboard shortcut hints

**Location:** `src/components/common/UI.tsx`

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `keys` | KeyHint[] | Yes | - | Array of key hints |

**KeyHint Interface:**
```typescript
interface KeyHint {
  key: string;        // Keyboard key
  description: string; // What it does
}
```

**Usage:**

```typescript
import { KeyHint } from './components/common/UI';

function HelpPanel() {
  const hints = [
    { key: 'j/k', description: 'Navigate' },
    { key: 'Enter', description: 'Select' },
    { key: 'q', description: 'Quit' },
  ];
  
  return <KeyHint keys={hints} />;
}
```

**Screenshot:**
```
j/k Navigate    Enter Select    q Quit
```

**Examples in HistTUI:**
- Bottom of screens
- Help panels
- Action hints

---

### TabBar

**Purpose:** Tab navigation bar with keyboard shortcuts

**Location:** `src/components/common/UI.tsx`

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `tabs` | Tab[] | Yes | - | Array of tabs |
| `activeTab` | string | Yes | - | Currently active tab key |

**Tab Interface:**
```typescript
interface Tab {
  key: string;      // Unique tab key
  label: string;    // Display label
  shortcut?: string; // Keyboard shortcut
}
```

**Usage:**

```typescript
import { TabBar } from './components/common/UI';

function AppTabs({ currentTab }) {
  const tabs = [
    { key: 'timeline', label: 'Timeline', shortcut: '1' },
    { key: 'branches', label: 'Branches', shortcut: '2' },
    { key: 'files', label: 'Files', shortcut: '3' },
  ];
  
  return <TabBar tabs={tabs} activeTab={currentTab} />;
}
```

**Screenshot:**
```
─────────────────────────────────────────
[1] Timeline  [2] Branches  [3] Files
```

**Examples in HistTUI:**
- Main screen tabs (App.tsx)
- Dashboard tabs (ActivityDashboard)

---

### ListItem

**Purpose:** Selectable list item with selection indicator

**Location:** `src/components/common/UI.tsx`

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `selected` | boolean | Yes | - | Is this item selected |
| `children` | ReactNode | Yes | - | Item content |

**Usage:**

```typescript
import { ListItem } from './components/common/UI';

function CommitList({ commits, selectedIndex }) {
  return (
    <Box flexDirection="column">
      {commits.map((commit, index) => (
        <ListItem key={commit.hash} selected={index === selectedIndex}>
          <Text>{commit.message}</Text>
        </ListItem>
      ))}
    </Box>
  );
}
```

**Screenshot:**
```
  Initial commit
▶ Add README
  Fix bug
```

**Examples in HistTUI:**
- Commit lists (TimelineScreen)
- File lists (FileTreeScreen)
- Repository lists (RepoManagerScreen)

---

### SplitPane

**Purpose:** Two-column layout with adjustable split ratio

**Location:** `src/components/common/UI.tsx`

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `left` | ReactNode | Yes | - | Left pane content |
| `right` | ReactNode | Yes | - | Right pane content |
| `splitRatio` | number | No | `50` | Left pane width (0-100%) |

**Usage:**

```typescript
import { SplitPane } from './components/common/UI';

function CommitView({ commit }) {
  return (
    <SplitPane
      left={<CommitList commits={commits} />}
      right={<CommitDetail commit={commit} />}
      splitRatio={40}
    />
  );
}
```

**Screenshot:**
```
┌─────────────────┬──────────────────────┐
│ Commit List     │ Commit Details       │
│   ▶ abc123      │                      │
│     def456      │ Message: Fix bug     │
│     ghi789      │ Author: John Doe     │
│                 │ Date: 2026-01-14     │
└─────────────────┴──────────────────────┘
```

**Examples in HistTUI:**
- Commit detail view (CommitDetailScreen)
- File tree and preview (FileTreeScreen)

---

## 📱 Screen Components

Screen components are full-screen views that users navigate between:

| Component | File | Purpose |
|-----------|------|---------|
| `TimelineScreen` | `screens/TimelineScreen.tsx` | Commit timeline view |
| `BranchesScreen` | `screens/BranchesScreen.tsx` | Branch list and switching |
| `FileTreeScreen` | `screens/FileTreeScreen.tsx` | File browser at commit |
| `CommitDetailScreen` | `screens/CommitDetailScreen.tsx` | Individual commit details |
| `FuzzySearchScreen` | `screens/FuzzySearchScreen.tsx` | Fuzzy search interface |
| `RepoManagerScreen` | `screens/RepoManagerScreen.tsx` | Multi-repo management |
| `ActivityDashboard` | `dashboards/ActivityDashboard.tsx` | Activity statistics |
| `ChangelogViewerScreen` | `screens/ChangelogViewerScreen.tsx` | Changelog viewer |

### Common Screen Props

Most screens share these props:

```typescript
interface ScreenProps {
  onBack?: () => void;           // Navigate back
  onNavigate?: (screen: string) => void; // Navigate to screen
  currentRepoUrl?: string;       // Current repository
}
```

---

## 🌳 Component Hierarchy

```
App (ThemeProvider wraps all)
├── SetupWizard (first launch only)
│   ├── TextInput (API keys, models)
│   ├── PasswordInput (API keys)
│   ├── Select (provider, model)
│   ├── ConfirmInput (confirmations)
│   ├── BoxBorder (containers)
│   ├── StatusMessage (hints)
│   └── Alert (warnings)
│
├── RepoInputScreen (no cached repo)
│   ├── TextInput (repo URL)
│   ├── BoxBorder (container)
│   └── Loading (cloning)
│
├── Main App Interface
│   ├── GenerativeStatusBar
│   │   ├── Spinner (agent active)
│   │   └── Badge (tool status)
│   │
│   ├── TabBar (screen navigation)
│   │
│   ├── Screen (active screen)
│   │   ├── TimelineScreen
│   │   │   ├── Header
│   │   │   ├── ListItem (commits)
│   │   │   └── EmptyState (no commits)
│   │   │
│   │   ├── BranchesScreen
│   │   │   ├── Header
│   │   │   ├── Select (branches)
│   │   │   └── Badge (current branch)
│   │   │
│   │   ├── FileTreeScreen
│   │   │   ├── Header
│   │   │   ├── SplitPane
│   │   │   │   ├── ListItem (files)
│   │   │   │   └── BoxBorder (preview)
│   │   │   └── EmptyState
│   │   │
│   │   ├── CommitDetailScreen
│   │   │   ├── Header
│   │   │   ├── BoxBorder (commit info)
│   │   │   └── BoxBorder (diff view)
│   │   │
│   │   ├── FuzzySearchScreen
│   │   │   ├── TextInput (search)
│   │   │   ├── ListItem (results)
│   │   │   └── EmptyState (no results)
│   │   │
│   │   ├── RepoManagerScreen
│   │   │   ├── Header
│   │   │   ├── BoxBorder (repo list)
│   │   │   ├── ListItem (repos)
│   │   │   ├── Badge (current repo)
│   │   │   └── EmptyState (no repos)
│   │   │
│   │   └── ActivityDashboard
│   │       ├── Header
│   │       ├── TabBar (dashboard tabs)
│   │       ├── ProgressBar (activity)
│   │       └── BoxBorder (stats)
│   │
│   └── StatusBar (bottom bar)
│
└── ErrorDisplay (errors)
    └── Alert (error message)
```

---

## 📘 Usage Examples

### Example 1: Complete Screen with Multiple Components

```typescript
import { Box, Text } from 'ink';
import { Select, Badge, Spinner } from '@inkjs/ui';
import { Header, BoxBorder, StatusBar, EmptyState } from './components/common/UI';

function RepositoryListScreen({ repos, loading, selectedIndex }) {
  if (loading) {
    return (
      <Box flexDirection="column" padding={2}>
        <Header title="Repositories" subtitle="Loading..." />
        <Spinner label="Fetching repositories..." />
      </Box>
    );
  }
  
  if (repos.length === 0) {
    return (
      <Box flexDirection="column" padding={2}>
        <Header title="Repositories" />
        <EmptyState
          icon="📚"
          message="No repositories found"
          hint="Add a repository to get started"
        />
      </Box>
    );
  }
  
  return (
    <Box flexDirection="column" padding={2}>
      <Header 
        title={`Repositories (${repos.length})`}
        subtitle="Select a repository to open"
      />
      
      <BoxBorder title="Available Repositories" borderColor="blue">
        {repos.map((repo, index) => (
          <Box key={repo.id} gap={2}>
            <Text bold={index === selectedIndex}>
              {index === selectedIndex ? '▶' : ' '} {repo.name}
            </Text>
            {repo.isCurrent && <Badge color="green">CURRENT</Badge>}
          </Box>
        ))}
      </BoxBorder>
      
      <StatusBar
        left="↑/↓ Navigate"
        center="Enter to select"
        right={`${repos.length} total`}
      />
    </Box>
  );
}
```

---

### Example 2: Form with Validation

```typescript
import { Box, Text } from 'ink';
import { TextInput, PasswordInput, ConfirmInput } from '@inkjs/ui';
import { BoxBorder, StatusMessage, Alert } from './components/common/UI';

function APIKeyForm({ onSubmit }) {
  const [provider, setProvider] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = () => {
    if (!apiKey.startsWith('sk-')) {
      setError('API key must start with sk-');
      return;
    }
    
    onSubmit({ provider, apiKey });
  };
  
  return (
    <Box flexDirection="column" padding={2}>
      <BoxBorder title="API Configuration" borderColor="cyan">
        <Box flexDirection="column" gap={1}>
          <Text bold>Provider:</Text>
          <TextInput
            placeholder="openai, anthropic..."
            defaultValue={provider}
            onChange={setProvider}
          />
          
          <Text bold marginTop={1}>API Key:</Text>
          <PasswordInput
            placeholder="sk-..."
            defaultValue={apiKey}
            onChange={setApiKey}
          />
          
          {error && (
            <Alert variant="error">{error}</Alert>
          )}
          
          <StatusMessage variant="info">
            Your API key will be stored securely
          </StatusMessage>
          
          <Box marginTop={1}>
            <Text bold>Save configuration? (Y/n)</Text>
            <ConfirmInput
              onConfirm={handleSubmit}
              onCancel={() => setError('')}
            />
          </Box>
        </Box>
      </BoxBorder>
    </Box>
  );
}
```

---

<details>
<summary><h3>For AI Agents / LLMs</h3></summary>

## Component Usage Patterns

**Step 0:** Import components

```typescript
// @inkjs/ui components
import {
  TextInput,
  PasswordInput,
  Select,
  MultiSelect,
  ConfirmInput,
  Spinner,
  Badge,
  StatusMessage,
  Alert,
  ProgressBar,
  ThemeProvider,
} from '@inkjs/ui';

// Ink built-in components
import { Box, Text, useInput, useApp } from 'ink';

// Custom components
import {
  BoxBorder,
  StatusBar,
  Header,
  EmptyState,
  Loading,
  ErrorDisplay,
  KeyHint,
  TabBar,
  ListItem,
  SplitPane,
} from '@/components/common/UI';
```

**Step 1:** Use components in JSX

```typescript
function MyScreen() {
  return (
    <Box flexDirection="column" padding={2}>
      <Header title="My Screen" subtitle="Description" />
      
      <BoxBorder title="Content" borderColor="blue">
        <Text>Content here</Text>
      </BoxBorder>
      
      <StatusBar left="Info" right="Status" />
    </Box>
  );
}
```

**Step 2:** Handle user input

```typescript
function InteractiveScreen() {
  const [value, setValue] = useState('');
  
  useInput((input, key) => {
    if (key.escape || input === 'q') {
      // Go back
    }
  });
  
  return (
    <TextInput
      placeholder="Enter value..."
      defaultValue={value}
      onChange={setValue}
      onSubmit={(val) => console.log('Submitted:', val)}
    />
  );
}
```

**Step 3:** Verify component rendering

```bash
# Run development mode
bun run dev

# Check component imports
grep -r "from '@inkjs/ui'" src/components | wc -l

# Check custom component usage
grep -r "BoxBorder\|StatusBar\|Header" src/components | wc -l
```

## Component Testing

```typescript
// Test component rendering
import { render } from 'ink-testing-library';
import { Header } from './components/common/UI';

test('Header renders title', () => {
  const { lastFrame } = render(<Header title="Test" />);
  expect(lastFrame()).toContain('Test');
});

// Test interactive components
import { TextInput } from '@inkjs/ui';

test('TextInput handles changes', () => {
  let value = '';
  render(
    <TextInput
      onChange={(v) => { value = v; }}
    />
  );
  // Simulate input
  expect(value).toBe('expected');
});
```

</details>

---

**Last Updated:** 2026-01-14  
**HistTUI Version:** 1.1.0  
**@inkjs/ui Version:** 2.0.0  
**Component Count:** 25+ (13 from @inkjs/ui, 12+ custom)
