# Contributing to HistTUI

Thank you for your interest in contributing to HistTUI! 🎉

## 📋 Before You Start

**📖 Read the Technical Specification**: Before making changes, review **[SPECIFICATION.md](./SPECIFICATION.md)** to understand the complete architecture, design patterns, and coding conventions.

**Key Documents**:
- **[SPECIFICATION.md](./SPECIFICATION.md)** - Complete technical reference (START HERE)
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Architecture patterns and data flow
- **[PLUGIN_GUIDE.md](./PLUGIN_GUIDE.md)** - Plugin development guide
- **[COMPONENTS.md](./COMPONENTS.md)** - UI component reference

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

### For Humans

```bash
# Run with tsx for instant feedback
npm run dev -- https://github.com/user/repo

# Build and run
npm run build
node dist/cli.js https://github.com/user/repo

# Type checking only
npm run typecheck
```

<details>
<summary><strong>For AI Agents / LLMs - Development Setup</strong></summary>

**Step 0:** Verify prerequisites
```bash
# Check Node.js version (must be 18+)
node --version
# Expected: v18.0.0 or higher

# Check npm
npm --version

# Check git
git --version
```

**Step 1:** Clone and install
```bash
# Fork on GitHub first, then:
git clone https://github.com/YOUR_USERNAME/HistTUI.git
cd HistTUI

# Install dependencies
npm install

# Verify installation
npm run build
# Should complete with zero errors
```

**Step 2:** Run in development mode
```bash
# Option 1: Use tsx (faster, no build step)
npx tsx src/cli.ts https://github.com/sindresorhus/emoj

# Option 2: Build then run
npm run build
node dist/cli.js https://github.com/sindresorhus/emoj

# Option 3: Use npm script
npm run dev -- https://github.com/sindresorhus/emoj
```

**Step 3:** Verify changes compile
```bash
# Type check only (fast)
npx tsc --noEmit

# Full build
npm run build

# Check for errors
echo $?
# Should return 0 (success)
```

**Step 4:** Test with real repositories
```bash
# Small repo (fast test)
npm run dev -- https://github.com/sindresorhus/emoj

# Medium repo
npm run dev -- https://github.com/jdeniau/changelog-view

# Your changes (use local path)
npm run dev -- /path/to/local/repo

# Check cache was created
ls ~/.histtui/cache/
```

</details>

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
- 📚 `docs` - Documentation changes
- ♻️ `refactor` - Code refactoring
- 🧪 `test` - Tests
- ⚡ `perf` - Performance
- 🎨 `style` - Code style
- 🔒 `security` - Security fix

<details>
<summary><strong>For AI Agents / LLMs - Commit Message Format</strong></summary>

**Step 0:** Determine change type
```bash
# Analyze what changed
git status
git diff --stat

# Categorize:
# - New files/features → ✨ feat
# - Fixed bugs → 🐛 fix
# - Documentation only → 📚 docs
# - No functionality change → ♻️ refactor
# - Test files → 🧪 test
```

**Step 1:** Write commit message
```bash
# Format: <emoji> <type>: <description>
# 
# Rules:
# - Present tense ("Add" not "Added")
# - Max 72 characters for subject
# - Capitalize after colon
# - No period at end

# Examples:
git commit -m "✨ feat: Add fuzzy search screen"
git commit -m "🐛 fix: Handle empty commit list gracefully"
git commit -m "📚 docs: Update ARCHITECTURE with AI agent sections"
git commit -m "♻️ refactor: Extract keyboard handler to hook"
```

**Step 2:** Verify commit message format
```bash
# Check last commit message
git log -1 --pretty=%B

# Should match pattern:
# <emoji> <type>: <description>

# Verify it has emoji
git log -1 --pretty=%B | grep -E "^[✨🐛📚♻️🧪⚡🎨🔒]"
echo $?
# Should return 0 (found emoji)
```

**Step 3:** Example commit workflow
```bash
# Make changes
echo "export const newFeature = () => {};" >> src/utils/index.ts

# Stage changes
git add src/utils/index.ts

# Commit with proper format
git commit -m "✨ feat: Add newFeature utility function"

# Verify
git log -1 --oneline
# Should show: "✨ feat: Add newFeature utility function"
```

**Common Mistakes to Avoid:**
```bash
# ❌ WRONG: No emoji
git commit -m "feat: Add feature"

# ❌ WRONG: Past tense
git commit -m "✨ feat: Added feature"

# ❌ WRONG: Period at end
git commit -m "✨ feat: Add feature."

# ❌ WRONG: Not capitalized
git commit -m "✨ feat: add feature"

# ✅ CORRECT
git commit -m "✨ feat: Add feature"
```

</details>

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

<details>
<parameter name="summary"><strong>For AI Agents / LLMs - Testing Procedures</strong></summary>

**Step 0:** Automated testing checklist
```bash
# Build without errors
npm run build
test $? -eq 0 || echo "Build failed!"

# Type check
npx tsc --noEmit
test $? -eq 0 || echo "Type errors found!"

# Check for common issues
grep -r "console.log" src/ && echo "Warning: console.log found"
grep -r "any" src/types/ && echo "Warning: 'any' type in types/"
```

**Step 1:** Test with small repository
```bash
# Clear cache first
rm -rf ~/.histtui/cache/*

# Test with emoj (small, fast)
timeout 60 npm run dev -- https://github.com/sindresorhus/emoj

# Verify cache created
test -d ~/.histtui/cache/* && echo "✅ Cache created" || echo "❌ No cache"

# Verify database
test -f ~/.histtui/cache/*/histtui.db && echo "✅ DB created" || echo "❌ No DB"

# Check database has data
sqlite3 ~/.histtui/cache/*/histtui.db "SELECT COUNT(*) FROM commits;"
# Should return number > 0
```

**Step 2:** Test with medium repository
```bash
# Test lazygit (more commits)
timeout 120 npm run dev -- https://github.com/jesseduffield/lazygit

# Check performance
time npm run dev -- https://github.com/jesseduffield/lazygit --skip-update
# Second run should be much faster (cached)
```

**Step 3:** Test error handling
```bash
# Invalid URL
npm run dev -- https://github.com/invalid/repo-does-not-exist
# Should show error, not crash

# Local path that doesn't exist
npm run dev -- /tmp/nonexistent
# Should show error

# Permission denied
mkdir /tmp/test-repo && chmod 000 /tmp/test-repo
npm run dev -- /tmp/test-repo
# Should handle gracefully
```

**Step 4:** Integration testing
```bash
# Test all commands
node dist/cli.js --help
node dist/cli.js config
node dist/cli.js cache --list
node dist/cli.js cache --clear

# Test with various options
node dist/cli.js https://github.com/sindresorhus/emoj --skip-update
node dist/cli.js https://github.com/sindresorhus/emoj --debug
node dist/cli.js https://github.com/sindresorhus/emoj --max-commits 100
```

</details>

## 📝 Adding Features

### New Screen
1. Create component in `src/components/screens/MyScreen.tsx`
2. Add screen type to `src/types/index.ts`
3. Register in `src/components/App.tsx`
4. Add keyboard shortcut in `src/components/common/hooks.ts`
5. Update README.md

<details>
<parameter name="summary"><strong>For AI Agents / LLMs - Adding a New Screen</strong></summary>

**Step 0:** Create the screen component
```bash
# Create file
cat > src/components/screens/MyScreen.tsx << 'EOF'
/**
 * My Screen
 * Description of what this screen does
 */

import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { useApp } from '../AppContext';
import { useKeyboard } from '../common/hooks';
import { Header, StatusBar } from '../common/UI';

export function MyScreen() {
  const { setScreen } = useApp();

  useKeyboard({
    onChar: (char) => {
      if (char === 'b') setScreen('timeline');
    },
  });

  return (
    <Box flexDirection="column" height="100%">
      <Header title="My Screen" subtitle="Press 'b' to go back" />
      <Box flexGrow={1}>
        <Text>Content here</Text>
      </Box>
      <StatusBar left="Info" right="b Back • q Quit" />
    </Box>
  );
}
EOF
```

**Step 1:** Add screen type
```bash
# Edit src/types/index.ts
# Find: export type Screen = 
# Add your screen to the union:
sed -i "/export type Screen =/a\  | 'my-screen'" src/types/index.ts
```

**Step 2:** Register in App component
```bash
# Edit src/components/App.tsx
# Add import at top
sed -i "/import.*Screen.*from/a import { MyScreen } from './screens/MyScreen';" src/components/App.tsx

# Add case in switch statement
# Find the switch and add:
#   case 'my-screen':
#     return <MyScreen />;
```

**Step 3:** Add keyboard shortcut
```bash
# Edit src/components/dashboards/ActivityDashboard.tsx (default first screen)
# Or edit src/components/screens/TimelineScreen.tsx (accessible via '1' key)
# In useKeyboard, add number shortcut:
#   else if (num === 5) setScreen('my-screen');
```

**Step 4:** Verify it works
```bash
# Rebuild
npm run build

# Test
npm run dev -- https://github.com/sindresorhus/emoj
# Press 5 (or your assigned number) to navigate to new screen
```

</details>

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
