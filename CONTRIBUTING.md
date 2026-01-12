# Contributing to HistTUI

Thank you for your interest in contributing to HistTUI! 🎉

## 📋 Code of Conduct

Be respectful, inclusive, and constructive. We're all here to build great software.

## 🚀 Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/HistTUI.git
   cd HistTUI
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Create a branch**
   ```bash
   git checkout -b feat/your-feature-name
   ```

## 💻 Development Workflow

### Running in Development
```bash
# Run with tsx for instant feedback
npm run dev -- https://github.com/user/repo

# Build and run
npm run build
node dist/cli.js https://github.com/user/repo

# Type checking only
npm run typecheck
```

### Project Structure
- `src/cli.ts` - CLI entry point
- `src/components/` - UI components (Ink/React)
- `src/core/` - Core functionality (git, database, cache, indexer)
- `src/plugins/` - Plugin system
- `src/utils/` - Utility functions
- `src/types/` - TypeScript type definitions

## ✨ Commit Message Format

We use emoji-prefixed conventional commits:

```
<emoji> <type>: <description>

Examples:
✨ feat: Add file tree navigator
🐛 fix: Handle large repositories without freezing
📚 docs: Update README with new features
♻️ refactor: Extract search logic into hook
🧪 test: Add tests for GitDatabase
```

**Emoji Reference:**
- ✨ `feat` - New feature
- 🐛 `fix` - Bug fix
- 📚 `docs` - Documentation
- ♻️ `refactor` - Code refactoring
- 🧪 `test` - Tests
- ⚡ `perf` - Performance
- 🎨 `style` - Code style
- 🔒 `security` - Security fix

## 🎨 Code Style

- **TypeScript** with ESM modules
- **React/Ink** patterns for UI
- **Async/await** for async operations
- **Functional components** with hooks
- **No default exports** (except for React components)

### Example Component
```typescript
import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { useApp } from '../AppContext';

interface MyScreenProps {
  data: string;
}

export function MyScreen({ data }: MyScreenProps) {
  const { setScreen } = useApp();
  const [state, setState] = useState('');

  useEffect(() => {
    // Side effects here
  }, []);

  return (
    <Box flexDirection="column">
      <Text>{data}</Text>
    </Box>
  );
}
```

## 🧪 Testing

Currently, testing is manual. Run the app with various repositories:

```bash
# Small repo
npm run dev -- https://github.com/sindresorhus/emoj

# Medium repo
npm run dev -- https://github.com/jesseduffield/lazygit

# Large repo (be patient!)
npm run dev -- https://github.com/microsoft/vscode
```

## 📝 Adding Features

### New Screen
1. Create component in `src/components/screens/MyScreen.tsx`
2. Add screen type to `src/types/index.ts`
3. Register in `src/components/App.tsx`
4. Add keyboard shortcut in `src/components/common/hooks.ts`
5. Update README.md

### New Dashboard
1. Create component in `src/components/dashboards/MyDashboard.tsx`
2. Add query method to `src/core/database/index.ts`
3. Register in `src/components/App.tsx`
4. Update README.md

### New Plugin Hook
1. Update `src/types/index.ts` with new plugin interfaces
2. Implement in `src/plugins/index.ts`
3. Document in PLUGIN_GUIDE.md

## 📚 Documentation

All user-facing documentation should follow the **dual-audience format**:

### For Humans
- Conversational, friendly tone
- Emoji section headers
- Benefits-first descriptions
- Real examples

### For AI Agents
- Wrap in `<details>` tags
- Step-by-step instructions
- Copy-paste bash commands
- Verification procedures

**Example:**
```markdown
## 🚀 Feature Name

Friendly description for humans...

<details>
<summary><strong>For AI Agents / LLMs</strong></summary>

**Step 0:** Prerequisites
```bash
command to check
```

**Step 1:** Do the thing
```bash
actual command
```

</details>
```

## 🔍 Pull Request Process

1. **Update documentation** - README.md, type definitions, comments
2. **Follow commit format** - Use emoji prefixes
3. **Test thoroughly** - Test with small and large repos
4. **Keep PRs focused** - One feature/fix per PR
5. **Describe changes** - Clear PR description

### PR Template
```markdown
## What
Brief description of changes

## Why
Why this change is needed

## How
How the change works

## Testing
How you tested it

## Screenshots
If UI changes
```

## 🐛 Reporting Bugs

Open an issue with:
- **Description** - What happened?
- **Expected** - What should happen?
- **Steps to reproduce** - How to trigger the bug?
- **Environment** - OS, Node version, repo size
- **Logs** - Run with `--debug` and include `~/.histtui/debug.log`

## 💡 Feature Requests

Open an issue with:
- **Feature description** - What do you want?
- **Use case** - Why is it useful?
- **Proposed solution** - How might it work?
- **Alternatives** - Other approaches considered?

## 🙋 Questions?

- Open a discussion
- Check existing issues
- Read the documentation

## 📜 License

By contributing, you agree that your contributions will be licensed under the ISC License.

---

Thank you for contributing to HistTUI! 🚀
