# HistTUI Agent Context - READ THIS FIRST

> **For AI Agents:** This file contains critical context you MUST follow when working on HistTUI. Read completely before making any changes.

## 🎯 Product Goals

### Primary Goal
Build the most intuitive, AI-powered Git history TUI that developers love to use daily.

### Success Metrics
1. **Performance:** <100ms UI response time for cached repos
2. **Usability:** New users productive within 5 minutes
3. **Beauty:** Material Design 3 throughout, neurodiversity-friendly
4. **Intelligence:** AI insights that genuinely help developers

### Non-Goals
- We do NOT modify Git repositories (read-only always)
- We do NOT implement Git commands (use native Git tools)
- We do NOT create web UIs (terminal-only)
- We do NOT require network access (offline-first)

---

## 🛠 Tech Stack - MANDATORY

### Core Technologies (NEVER CHANGE)
```json
{
  "ui": "Ink 4.x + @inkjs/ui 2.0.0",
  "language": "TypeScript 5.x (strict mode)",
  "runtime": "Bun or Node.js 18+",
  "database": "better-sqlite3 (local)",
  "git": "simple-git (read-only)",
  "ai": "AG-UI protocol + OpenRouter",
  "design": "Material Design 3",
  "colors": "@material/material-color-utilities"
}
```

### File Organization (FOLLOW STRICTLY)
```
src/
├── cli.ts              # Entry point
├── components/
│   ├── App.tsx         # Root component
│   ├── common/         # Shared UI components
│   ├── screens/        # Full-screen views
│   └── dashboards/     # Complex multi-section views
├── core/
│   ├── git/            # Git operations (read-only)
│   ├── db/             # SQLite operations
│   ├── indexer/        # Git → Database sync
│   ├── ag-ui/          # Generative UI protocol
│   └── code-planner/   # Agent development system
├── config/
│   ├── index.ts        # Config loading/saving
│   ├── themes.ts       # Theme definitions
│   ├── color-engine.ts # MD3 color generation
│   └── inkui-theme.ts  # @inkjs/ui integration
├── plugins/            # Plugin system
├── types/              # TypeScript types
└── utils/              # Helper functions
```

---

## 📐 Style Guides - ENFORCE THESE

### TypeScript Rules
```typescript
// ✅ DO
export interface CommitData {
  hash: string;
  message: string;
  author: string;
  timestamp: number;
}

export const formatCommitDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toISOString();
};

// ❌ DON'T
export const data: any = {}; // Never use 'any'
function foo() { // Always use arrow functions for consistency
  return;
}
```

### React/Ink Patterns
```tsx
// ✅ DO - Functional components with hooks
import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';

export const MyScreen: React.FC = () => {
  const [data, setData] = useState<string[]>([]);
  
  useEffect(() => {
    // Load data
  }, []);
  
  return (
    <Box flexDirection="column">
      <Text>Content</Text>
    </Box>
  );
};

// ❌ DON'T - Class components
class MyScreen extends React.Component { }
```

### Material Design 3 Colors
```typescript
// ✅ DO - Use MD3 color tokens
import { getMaterialTheme } from '../config/color-engine';

const theme = getMaterialTheme('light', 'expressive');
<Text color={theme.primary}>Important</Text>
<Text color={theme.onSurface}>Normal text</Text>

// ❌ DON'T - Hardcoded colors
<Text color="#FF0000">Error</Text>
<Text color="red">Error</Text>
```

### Keyboard Navigation
```typescript
// ✅ DO - Support multiple bindings
useInput((input, key) => {
  if (input === 'q' || key.escape) {
    goBack();
  }
  if (input === 'j' || key.downArrow) {
    moveDown();
  }
  if (input === 'k' || key.upArrow) {
    moveUp();
  }
});

// ❌ DON'T - Single binding only
useInput((input) => {
  if (input === 'q') goBack();
});
```

### Error Handling
```typescript
// ✅ DO - Try/catch with user-friendly messages
try {
  const result = await fetchData();
  return result;
} catch (error) {
  const message = error instanceof Error 
    ? error.message 
    : 'Unknown error occurred';
  setError(`Failed to fetch data: ${message}`);
  return null;
}

// ❌ DON'T - Let errors crash the app
const result = await fetchData(); // No error handling
```

---

## 📝 Documentation Standards

### Dual-Audience Format
Every document must serve BOTH humans and AI agents:

```markdown
# Feature Name

## Overview
[Human-friendly description with benefits]

## Quick Start
[Simple steps for humans]

## Usage
[Detailed guide for humans]

<details>
<summary>🤖 AI Agent: Automation Instructions</summary>

### Automated Setup
\`\`\`bash
# Step-by-step commands
npm install package-name
\`\`\`

### Integration Points
- File: `src/path/to/file.ts`
- Function: `functionName()`
- Purpose: [Exact purpose]

</details>
```

### Required Documentation
When you add a feature:
1. ✅ Update `README.md` with feature section (if major)
2. ✅ Create dedicated guide if >500 lines code added
3. ✅ Update `ARCHITECTURE.md` if layers change
4. ✅ Add keyboard shortcuts to relevant sections
5. ✅ Include troubleshooting section
6. ✅ Add AI automation instructions in `<details>` tags

---

## 🔄 Safe Iteration Workflow - MANDATORY PROCESS

### Before Writing ANY Code:

1. **Create Specification**
   - Use `.github/agents/SPEC_TEMPLATE.md`
   - Fill out ALL sections completely
   - Identify all affected files
   - Document breaking changes

2. **Submit for Review**
   - Create spec as `.github/agents/specs/FEATURE_NAME.md`
   - Tag reviewer: @shelbeely
   - Wait for approval
   - Address feedback

3. **Get Explicit Approval**
   - Status must be "Approved" in spec file
   - All questions resolved
   - No "Changes Requested" status

### During Implementation:

1. **Follow the Approved Plan**
   - Implement exactly as specified
   - No scope creep or "improvements"
   - Report deviations immediately

2. **Incremental Commits**
   - Small, focused commits
   - Clear commit messages with emoji
   - Test after each commit

3. **Documentation Alongside Code**
   - Update docs in same commit as code
   - Keep docs synchronized
   - No "I'll document it later"

### After Implementation:

1. **Self-Review Checklist**
   - [ ] All spec requirements met
   - [ ] Style guides followed
   - [ ] Tests passing
   - [ ] Documentation updated
   - [ ] No breaking changes (or migration provided)

2. **Request Code Review**
   - Push changes
   - Create detailed PR description
   - Link to original spec
   - Highlight any deviations

---

## 🚫 Breaking Changes - AVOID OR GET APPROVAL

### What Counts as Breaking:
- Changing public API signatures
- Removing features users depend on
- Changing config file format
- Modifying keyboard shortcuts
- Altering database schema

### If Breaking Change Needed:
1. Document in spec with "BREAKING CHANGE:" prefix
2. Provide migration guide
3. Add deprecation warnings first
4. Get explicit approval from @shelbeely
5. Update CHANGELOG.md

---

## 🎨 Material Design 3 Guidelines

### Source Color: #6750A4
All colors derived from this primary color using `@material/material-color-utilities`.

### Color Usage:
- **primary**: Important actions, selected items
- **secondary**: Supporting actions
- **tertiary**: Accents and highlights
- **error**: Errors and warnings
- **surface**: Backgrounds
- **onSurface**: Default text
- **outline**: Borders and dividers

### Scheme Types (User Selectable):
- expressive (default)
- content
- fidelity
- monochrome
- neutral
- vibrant

### Implementation:
```typescript
import { getMaterialTheme } from '../config/color-engine';
const theme = getMaterialTheme('dark', 'expressive');
// Use theme.primary, theme.secondary, etc.
```

---

## 🔌 Plugin System Rules

### Plugin Hook Points:
```typescript
interface PluginHooks {
  onInit?: () => void | Promise<void>;
  onCommitView?: (commit: CommitData) => void;
  onScreenChange?: (screen: Screen) => void;
  renderExtraInfo?: () => React.ReactElement;
}
```

### Plugin Structure:
```
src/plugins/
└── my-plugin/
    ├── index.ts       # Plugin entry point
    ├── config.ts      # Plugin configuration
    ├── screens/       # Custom screens (optional)
    └── README.md      # Plugin documentation
```

---

## 🤝 Team Collaboration (Multi-Agent)

### When Multiple Agents Work Together:

1. **Read `.github/agents/CONTEXT.md`** (this file) FIRST
2. **Check `.github/agents/specs/`** for approved specs
3. **Review `PROJECT_CONTEXT.md`** for architecture
4. **Scan `docs/PATTERNS.md`** for reusable patterns
5. **Coordinate in spec files** via comments

### Claim Your Work:
```markdown
## Implementation Assignment
- Agent: @copilot-agent-name
- Started: 2024-01-15
- Status: In Progress
- ETA: 2024-01-16
```

---

## ✅ Pre-Flight Checklist (Before Every Session)

Run through this EVERY time you start work:

- [ ] Read `.github/agents/CONTEXT.md` (this file)
- [ ] Check for approved specs in `.github/agents/specs/`
- [ ] Review recent commits for context
- [ ] Understand affected files/modules
- [ ] Verify no breaking changes (or get approval)
- [ ] Plan incremental commits
- [ ] Identify documentation needs

---

## 🆘 When Stuck

1. **Check existing patterns** in `docs/PATTERNS.md`
2. **Review similar features** in the codebase
3. **Read component documentation** in `COMPONENTS.md`
4. **Ask for clarification** - don't guess
5. **Propose solution in spec** before implementing

---

## 📊 Success Metrics for Agents

You're doing well if:
- ✅ Every feature has approved spec before coding
- ✅ Zero breaking changes without approval
- ✅ Documentation updated with code
- ✅ All style guides followed
- ✅ Tests passing
- ✅ Users don't notice the "seams" (feels cohesive)

---

## 🔒 Security Rules

- **Never commit secrets** (API keys, tokens)
- **Never expose user data** in logs
- **Validate all user input** (repo URLs, file paths)
- **Sanitize shell commands** (prevent injection)
- **Use read-only Git operations** (never write)

---

**Last Updated:** 2024-01-14
**Maintained By:** @shelbeely
**Version:** 1.0.0
