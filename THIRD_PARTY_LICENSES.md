# Third-Party Licenses & Attribution

HistTUI uses code patterns from MIT-licensed open-source projects. This document provides full attribution as required by the MIT License.

## For Humans

We're grateful to these amazing developers who shared their work:

- **Sindre Sorhus** - Created [emoj](https://github.com/sindresorhus/emoj), which inspired our fuzzy search interaction
- **Julien Deniau** - Created [changelog-view](https://github.com/jdeniau/changelog-view), which inspired our changelog parsing

Both projects are MIT-licensed, allowing us to learn from and adapt their patterns with proper attribution.

## Projects Used

### 1. emoj by Sindre Sorhus

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

### 2. changelog-view by Julien Deniau

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
grep -rn "Inspired by\|MIT License" src/ --include="*.ts" --include="*.tsx"

# Expected output:
# src/components/screens/FuzzySearchScreen.tsx:4: * Search interaction patterns inspired by emoj by Sindre Sorhus (MIT License)
# src/utils/changelog.ts:4: * Inspired by changelog-view by jdeniau (MIT License)
# src/components/screens/ChangelogViewerScreen.tsx:4: * Changelog parsing inspired by changelog-view by jdeniau (MIT License)
```

**Step 2: Verify attribution headers exist**
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
| `src/components/screens/FuzzySearchScreen.tsx` | ✅ YES | Uses emoj interaction patterns |
| `src/utils/changelog.ts` | ✅ YES | Uses changelog-view parsing logic |
| `src/components/screens/ChangelogViewerScreen.tsx` | ✅ YES | Uses changelog-view patterns |
| `THIRD_PARTY_LICENSES.md` | ✅ YES | Legal requirement - full license text |
| `README.md` (Attribution section) | ✅ YES | User-facing attribution |

**Step 5: When modifying attributed files**

```typescript
// ✅ CORRECT: Add your code, keep attribution
/**
 * Fuzzy Search Screen
 * Interactive fuzzy search across commits
 * 
 * Search interaction patterns inspired by emoj by Sindre Sorhus (MIT License)
 * https://github.com/sindresorhus/emoj
 */

// Your new imports
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
# Verify FuzzySearchScreen attribution
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
# 1. Check license
npm info [package-name] license
curl https://raw.githubusercontent.com/[org]/[repo]/main/LICENSE

# 2. Only use compatible licenses:
# ✅ MIT, ISC, BSD-2-Clause, BSD-3-Clause, Apache-2.0
# ❌ GPL-2.0, GPL-3.0, AGPL-3.0 (copyleft - incompatible)

# 3. Add to THIRD_PARTY_LICENSES.md:
# - Project name and author
# - Repository URL
# - License type
# - Full license text
# - Files influenced

# 4. Add header to source files:
# See Step 3 format

# 5. Update README.md attribution section
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
- ✅ File header comments with author name, project link, license type
- ✅ THIRD_PARTY_LICENSES.md with full license text
- ✅ README.md mention of dependencies
- ❌ Just having the license file in node_modules (not sufficient)

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
echo "1. File headers intact?"
grep -c "Inspired by\|MIT License" src/components/screens/FuzzySearchScreen.tsx src/utils/changelog.ts src/components/screens/ChangelogViewerScreen.tsx
# Should return: 3 (one per file)

echo "2. THIRD_PARTY_LICENSES.md exists?"
test -f THIRD_PARTY_LICENSES.md && echo "✅ Yes" || echo "❌ NO - RESTORE IT"

echo "3. README attribution section exists?"
grep -c "Code Attribution" README.md
# Should return: 1 or more

echo "4. All required text present?"
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
