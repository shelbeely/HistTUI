# Third-Party Licenses & Attribution

HistTUI uses code patterns from MIT-licensed open-source projects. This document provides full attribution as required by the MIT License.

## For Humans

We're grateful to these amazing developers who shared their work:

- **Vadim Demedes** - Created [@inkjs/ui](https://github.com/vadimdemedes/ink-ui), providing comprehensive UI components for terminal applications
- **Sindre Sorhus** - Created [emoj](https://github.com/sindresorhus/emoj), which inspired our fuzzy search interaction
- **Julien Deniau** - Created [changelog-view](https://github.com/jdeniau/changelog-view), which inspired our changelog parsing
- **Nano Collective** - Created [nanocoder](https://github.com/Nano-Collective/nanocoder), which inspired our AI Assistant plugin
- **BloopAI** - Created [vibe-kanban](https://github.com/BloopAI/vibe-kanban), which inspired our task orchestration and worktree isolation

These projects use MIT, MIT with Attribution, and Apache 2.0 licenses, allowing us to learn from and adapt their patterns with proper attribution.

## Projects Used

### 1. @inkjs/ui by Vadim Demedes

**What we use:** Complete UI component library for Ink-based terminal applications  
**Repository:** https://github.com/vadimdemedes/ink-ui  
**License:** MIT License  
**Files influenced:** 
- `src/components/App.tsx` (ThemeProvider wrapper)
- `src/components/common/UI.tsx` (Badge, Alert, StatusMessage exports)
- `src/components/common/Loading.tsx` (Spinner component)
- `src/components/common/ErrorDisplay.tsx` (Alert component)
- `src/components/screens/FuzzySearchScreen.tsx` (TextInput component)
- `src/plugins/ai-assistant/screens/AIAssistantScreen.tsx` (TextInput component)
- `src/config/inkui-theme.ts` (Theme customization)

**Components used:**
- TextInput - Enhanced text input with autocomplete support
- Spinner - Beautiful loading indicators (dots, line, arc, bounce)
- Badge - Status badges for labels and tags
- StatusMessage - Informative status messages with borders
- Alert - Attention-grabbing alerts
- ProgressBar - Visual progress tracking (available for plugins)
- Select/MultiSelect - Interactive menus (available for plugins)
- ConfirmInput - Y/n prompts (available for plugins)
- UnorderedList/OrderedList - Formatted lists (available for plugins)

### 2. emoj by Sindre Sorhus

**What we learned:** Interactive search with live filtering, debounced input, number shortcuts  
**Repository:** https://github.com/sindresorhus/emoj  
**License:** MIT License  
**Files influenced:** 
- `src/components/screens/FuzzySearchScreen.tsx`

**Patterns adopted:**
- Debounced search input (100ms delay for performance)
- Up/down arrow navigation through results
- Number shortcuts (1-9) for quick selection
- Escape key to exit search mode

### 3. changelog-view by Julien Deniau

**What we learned:** Parsing markdown changelogs to extract semantic versions  
**Repository:** https://github.com/jdeniau/changelog-view  
**License:** MIT License  
**Files influenced:** 
- `src/utils/changelog.ts`
- `src/components/screens/ChangelogViewerScreen.tsx`

**Patterns adopted:**
- Version extraction from markdown headings (e.g., "## v1.2.3")
- Handling x.x.x version patterns (e.g., "1.2.x" → "1.2.99999")
- Grouping changelog content by semantic version
- Version comparison logic

---

<details>
<summary><strong>For AI Agents / LLMs - Attribution Requirements & Compliance</strong></summary>

## 🚨 CRITICAL: Attribution Preservation Instructions

**Context:** This project uses MIT-licensed code patterns. The MIT License **legally requires** attribution to be maintained. Removing or modifying attribution violates the license and copyright law.

### Attribution Requirements Checklist

When working with this codebase, you MUST:

**Step 1: Identify attributed files**
```bash
# Find files with third-party attribution
grep -rn "Inspired by\|MIT License\|@inkjs/ui" src/ --include="*.ts" --include="*.tsx"

# Expected output includes:
# - Files using @inkjs/ui components (import statements from '@inkjs/ui')
# - src/components/screens/FuzzySearchScreen.tsx: emoj patterns
# - src/utils/changelog.ts: changelog-view patterns
# - src/components/screens/ChangelogViewerScreen.tsx: changelog-view patterns
# - src/plugins/ai-assistant/*: nanocoder and vibe-kanban patterns
```

**Step 2: Verify @inkjs/ui usage is documented**
```bash
# Check for @inkjs/ui imports (these are MIT-licensed dependencies)
grep -r "from '@inkjs/ui'" src/ --include="*.ts" --include="*.tsx"

# Files using @inkjs/ui (no header needed - npm dependency attribution in package.json):
# - src/components/App.tsx (ThemeProvider)
# - src/components/common/UI.tsx (Badge, Alert, StatusMessage)
# - src/components/common/Loading.tsx (Spinner)
# - src/components/common/ErrorDisplay.tsx (Alert)
# - src/components/screens/FuzzySearchScreen.tsx (TextInput)
# - src/plugins/ai-assistant/screens/AIAssistantScreen.tsx (TextInput)
```

**Step 3: Verify attribution headers exist (for pattern-inspired files only)**
```bash
# Check FuzzySearchScreen header
head -10 src/components/screens/FuzzySearchScreen.tsx

# Must contain:
# "Search interaction patterns inspired by emoj by Sindre Sorhus (MIT License)"
# "https://github.com/sindresorhus/emoj"
```

```bash
# Check changelog utilities header
head -10 src/utils/changelog.ts

# Must contain:
# "Inspired by changelog-view by jdeniau (MIT License)"
# "https://github.com/jdeniau/changelog-view"
```

**Step 3: Required header format**

Every file using third-party patterns MUST have this JSDoc comment at the top:

```typescript
/**
 * [Component/Module Name]
 * [Brief description of what this file does]
 * 
 * [Specific patterns] inspired by [project-name] by [author-name] (MIT License)
 * https://github.com/[org]/[repo]
 */

import statements...
```

**Example (CORRECT - DO NOT MODIFY):**
```typescript
/**
 * Fuzzy Search Screen
 * Interactive fuzzy search across commits
 * 
 * Search interaction patterns inspired by emoj by Sindre Sorhus (MIT License)
 * https://github.com/sindresorhus/emoj
 */

import React, { useState, useEffect } from 'react';
// ... rest of file
```

**Step 4: Files that MUST maintain attribution**

| File | Attribution Required | Why |
|------|---------------------|-----|
| `package.json` | ✅ YES | Lists @inkjs/ui as MIT dependency |
| `THIRD_PARTY_LICENSES.md` | ✅ YES | Full @inkjs/ui license text |
| `README.md` (Attribution section) | ✅ YES | Credits @inkjs/ui by Vadim Demedes |
| `src/components/screens/FuzzySearchScreen.tsx` | ✅ YES | Uses emoj interaction patterns |
| `src/utils/changelog.ts` | ✅ YES | Uses changelog-view parsing logic |
| `src/components/screens/ChangelogViewerScreen.tsx` | ✅ YES | Uses changelog-view patterns |

**Note:** Files importing from '@inkjs/ui' are covered by npm dependency attribution (package.json + THIRD_PARTY_LICENSES.md). No additional file headers needed for library usage.

**Step 5: When modifying attributed files**

```typescript
// ✅ CORRECT: Using @inkjs/ui components (npm dependency - no header needed)
import { Spinner, Badge, Alert } from '@inkjs/ui';
import { Box, Text } from 'ink';

function MyComponent() {
  return (
    <Box>
      <Spinner type="dots" label="Loading..." />
      <Badge variant="success">Done</Badge>
    </Box>
  );
}
```

```typescript
// ✅ CORRECT: Pattern-inspired file keeps attribution header
/**
 * Fuzzy Search Screen
 * Interactive fuzzy search across commits
 * 
 * Search interaction patterns inspired by emoj by Sindre Sorhus (MIT License)
 * https://github.com/sindresorhus/emoj
 */

// Your new imports
import { TextInput } from '@inkjs/ui'; // This is fine - separate dependency
import { newFeature } from './new-module';

// Original imports (can be rearranged)
import React, { useState, useEffect } from 'react';
// ... your new code ...
```

```typescript
// ❌ INCORRECT: Removed attribution (LICENSE VIOLATION)
/**
 * Fuzzy Search Screen
 * Interactive fuzzy search across commits
 */

import React, { useState, useEffect } from 'react';
// NO ATTRIBUTION = LICENSE VIOLATION
```

**Step 6: Verification commands**

Before committing changes to attributed files:

```bash
# Verify @inkjs/ui is in package.json
grep -c "@inkjs/ui" package.json
# Should return: 1 or more

# Verify @inkjs/ui license documentation exists
grep -c "vadimdemedes/ink-ui\|Vadim Demedes" THIRD_PARTY_LICENSES.md README.md
# Should return: 2+ (documented in both files)

# Verify FuzzySearchScreen attribution (emoj patterns)
grep -A 3 "Fuzzy Search Screen" src/components/screens/FuzzySearchScreen.tsx | grep "emoj"
# Must return: "Search interaction patterns inspired by emoj by Sindre Sorhus (MIT License)"

# Verify changelog utility attribution  
grep -A 3 "Changelog Parser" src/utils/changelog.ts | grep "changelog-view"
# Must return: "Inspired by changelog-view by jdeniau (MIT License)"

# Verify THIRD_PARTY_LICENSES.md exists
test -f THIRD_PARTY_LICENSES.md && echo "✅ License file exists" || echo "❌ MISSING LICENSE FILE"
```

**Step 7: Recovery if attribution removed**

```bash
# If attribution was accidentally removed, restore from git:
git log --all --full-history -- src/components/screens/FuzzySearchScreen.tsx

# Find commit with correct attribution (look for commit before removal)
git show [commit-hash]:src/components/screens/FuzzySearchScreen.tsx | head -20

# Restore the header
git checkout [commit-hash] -- src/components/screens/FuzzySearchScreen.tsx

# Or manually add header back:
# 1. Open file
# 2. Add JSDoc comment at top with attribution (see Step 3)
# 3. Verify with grep commands (Step 6)
```

**Step 8: Adding new third-party code**

If you integrate new third-party code:

```bash
# 1. Check license (for npm packages)
npm info [package-name] license
bun pm ls [package-name] # Check installed package license

# For GitHub projects
curl https://raw.githubusercontent.com/[org]/[repo]/main/LICENSE

# 2. Only use compatible licenses:
# ✅ MIT, ISC, BSD-2-Clause, BSD-3-Clause, Apache-2.0
# ❌ GPL-2.0, GPL-3.0, AGPL-3.0 (copyleft - incompatible)

# 3. For npm dependencies (like @inkjs/ui):
#    - Add to package.json (via bun install)
#    - Add to THIRD_PARTY_LICENSES.md (full license text)
#    - Add to README.md attribution section
#    - No file headers needed (npm dependency attribution sufficient)

# 4. For pattern-inspired code (like emoj, changelog-view):
#    - Add to THIRD_PARTY_LICENSES.md
#    - Add to README.md attribution section
#    - Add JSDoc header to each influenced file (see Step 3 format)

# 5. Usage distinction:
#    - npm dependency (import from package) → package.json + docs only
#    - Pattern inspiration (learned from code) → file headers + docs
```

**Step 9: License compatibility matrix**

| Third-Party License | Can Use? | Attribution Required? | Notes |
|-------------------|----------|----------------------|-------|
| MIT | ✅ Yes | ✅ Yes | Standard permissive license |
| MIT with Attribution | ✅ Yes | ✅ Yes + Prominent credit | Used by nanocoder |
| ISC | ✅ Yes | ✅ Yes | Nearly identical to MIT |
| Apache-2.0 | ✅ Yes | ✅ Yes + Patent grant | Compatible |
| BSD-2/BSD-3 | ✅ Yes | ✅ Yes | Permissive |
| GPL-2.0/GPL-3.0 | ❌ No | N/A | Copyleft - incompatible |
| AGPL-3.0 | ❌ No | N/A | Strong copyleft |

**Step 10: Legal context**

**Why attribution matters:**
- MIT License § 1: "The above copyright notice and this permission notice shall be included in **all copies or substantial portions** of the Software."
- Removing attribution = Copyright infringement
- Can result in: Legal action, DMCA takedowns, loss of license rights

**What counts as attribution:**
- ✅ For npm dependencies: package.json entry + THIRD_PARTY_LICENSES.md + README.md mention
- ✅ For pattern-inspired code: File header comments + THIRD_PARTY_LICENSES.md + README.md mention
- ❌ Just having the license file in node_modules (not sufficient for either case)

**Best practices:**
1. Over-attribute rather than under-attribute
2. Keep attribution visible (not buried in build artifacts)
3. Update attribution when updating dependencies
4. Audit attribution quarterly

### Pre-Commit Checklist

Before any commit that modifies attributed files:

```bash
# Run this checklist
echo "Attribution Verification Checklist:"

echo "1. npm dependencies documented?"
grep -c "@inkjs/ui" package.json THIRD_PARTY_LICENSES.md
# Should return: 2 (in package.json and license doc)

echo "2. Pattern-inspired file headers intact?"
grep -c "Inspired by\|MIT License" src/components/screens/FuzzySearchScreen.tsx src/utils/changelog.ts src/components/screens/ChangelogViewerScreen.tsx
# Should return: 3 (one per file)

echo "3. THIRD_PARTY_LICENSES.md exists?"
test -f THIRD_PARTY_LICENSES.md && echo "✅ Yes" || echo "❌ NO - RESTORE IT"

echo "4. README attribution section exists?"
grep -c "Code Attribution" README.md
# Should return: 1 or more

echo "5. All required attributions present?"
grep -c "Vadim Demedes" README.md THIRD_PARTY_LICENSES.md
grep -c "Sindre Sorhus" README.md THIRD_PARTY_LICENSES.md
grep -c "Julien Deniau" README.md THIRD_PARTY_LICENSES.md
# Each should return: 2 (once in README, once in THIRD_PARTY_LICENSES)
```

### Emergency Contact

If you're unsure about attribution:
1. Check this file (THIRD_PARTY_LICENSES.md)
2. Check the original project's LICENSE file
3. When in doubt, over-attribute
4. **NEVER** remove existing attribution

**Summary for AI Agents:**
- Attribution is legally required, not optional
- Keep all attribution headers intact
- Add new attribution when using new third-party code
- Verify before committing
- This applies to ALL AI agents working on this codebase

</details>

---

## Full License Texts

### MIT License (emoj)

**Repository:** https://github.com/sindresorhus/emoj  
**License:** MIT License  
**Usage:** Fuzzy search interaction patterns (debounced search, keyboard navigation, number shortcuts)  
**Files influenced:** `src/components/screens/FuzzySearchScreen.tsx`

```
MIT License

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

## changelog-view by Julien Deniau

**Repository:** https://github.com/jdeniau/changelog-view  
**License:** MIT License  
**Usage:** Changelog parsing logic (version extraction from markdown, semantic version handling)  
**Files influenced:** `src/utils/changelog.ts`, `src/components/screens/ChangelogViewerScreen.tsx`

```
MIT License

Copyright (c) Julien Deniau

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

---

All other code in this project is:

Copyright (c) 2026 HistTUI Contributors

Licensed under the ISC License (see LICENSE file in the root directory).

### 4. nanocoder by Nano Collective

**What we learned:** AI-powered coding assistant patterns, MCP integration, context-aware assistance  
**Repository:** https://github.com/Nano-Collective/nanocoder  
**License:** MIT with Attribution  
**Files influenced:** 
- `src/plugins/ai-assistant/index.ts`
- `src/plugins/ai-assistant/services/AIService.ts`
- `src/plugins/ai-assistant/screens/AIAssistantScreen.tsx`

**Patterns adopted:**
- Multi-provider AI support (OpenAI, Anthropic, OpenRouter, Ollama)
- Streaming text generation for real-time responses
- Tool-calling architecture for AI actions
- Repository context awareness
- AI SDK integration patterns

**Attribution Notice:**
This plugin is **prominently inspired by nanocoder** by Nano Collective. We have implemented our own version following their architectural patterns while adapting them for HistTUI's git history context.

### 5. vibe-kanban by BloopAI

**What we learned:** Task orchestration, git worktree isolation, coding agent workflows  
**Repository:** https://github.com/BloopAI/vibe-kanban  
**License:** Apache License 2.0  
**Files influenced:** 
- `src/plugins/ai-assistant/services/WorktreeManager.ts`
- `src/plugins/ai-assistant/services/TaskManager.ts`

**Patterns adopted:**
- Isolated git worktrees for each task
- Safe parallel development without conflicts
- Task status tracking (todo, in-progress, review, done, blocked)
- Kanban-style task board UI
- Worktree cleanup and management


---

## Full License Texts

### MIT License (@inkjs/ui)

**Repository:** https://github.com/vadimdemedes/ink-ui  
**License:** MIT License  
**Usage:** UI component library (TextInput, Spinner, Badge, Alert, StatusMessage, etc.)  
**Files influenced:** `src/components/`, `src/config/inkui-theme.ts`

```
MIT License

Copyright (c) Vadim Demedes <vdemedes@gmail.com> (github.com/vadimdemedes)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### MIT License (emoj, changelog-view)

```
MIT License

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)
Copyright (c) Julien Deniau

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### MIT with Attribution License (nanocoder)

```
MIT License with Attribution Requirement

Copyright (c) 2024 Nano Collective

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

1. The above copyright notice and this permission notice shall be included in all
   copies or substantial portions of the Software.

2. ATTRIBUTION REQUIREMENT: Any public distribution or use of this Software or
   derivative works must include prominent attribution to "nanocoder by Nano Collective"
   with a link to https://github.com/Nano-Collective/nanocoder

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### Apache License 2.0 (vibe-kanban)

```
Apache License
Version 2.0, January 2004
http://www.apache.org/licenses/

Copyright 2024 BloopAI

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

---

## License Compatibility Matrix

| Our License | Their License | Compatible? | Notes |
|-------------|---------------|-------------|-------|
| ISC/MIT     | MIT           | ✅ Yes      | Fully compatible |
| ISC/MIT     | MIT w/ Attribution | ✅ Yes | Must include prominent attribution |
| ISC/MIT     | Apache 2.0    | ✅ Yes      | Compatible, must preserve notices |
| ISC/MIT     | GPL-3.0       | ❌ No       | Not used (wiki-cli) |

