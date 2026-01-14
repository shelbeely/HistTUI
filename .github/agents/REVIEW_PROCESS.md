# Agent Review Process

## Purpose
This document defines how AI agents submit work for human review, ensuring quality and alignment with project goals.

---

## 1. Before Starting Work

### Check Prerequisites
```bash
# 1. Read the context
cat .github/agents/CONTEXT.md

# 2. Check for approved specs
ls .github/agents/specs/

# 3. Review recent commits
git log --oneline -10

# 4. Understand current state
git status
```

### Create Specification
1. Copy template: `.github/agents/SPEC_TEMPLATE.md`
2. Save as: `.github/agents/specs/YOUR_FEATURE_NAME.md`
3. Fill out ALL sections completely
4. Be specific about:
   - Files to create/modify
   - Breaking changes
   - Dependencies
   - Testing approach

---

## 2. Submit for Review

### Spec Review Request

Create a discussion or comment with:

```markdown
## 📋 Specification Ready for Review

**Feature:** [Feature name]
**Spec Location:** `.github/agents/specs/FEATURE_NAME.md`
**Complexity:** Low / Medium / High
**Breaking Changes:** Yes / No

### Summary
[2-3 sentence overview]

### Key Decisions
1. [Decision 1]
2. [Decision 2]
3. [Decision 3]

### Questions for Reviewer
1. [Question 1]
2. [Question 2]

**Ready to implement upon approval.**

@shelbeely
```

---

## 3. During Review

### Respond to Feedback

**Good Response:**
```markdown
> Why are you using SQLite instead of JSON?

SQLite provides:
1. ACID transactions for data integrity
2. Efficient querying with indexes
3. Concurrent read access

Updated spec to document this decision in Section 3.

**Changed:** Line 45-52 in spec
```

**Bad Response:**
```markdown
> Why SQLite?

It's better. Trust me.
```

### Update Specification
- Address ALL feedback
- Document decisions clearly
- Highlight changes made
- Re-request review when ready

---

## 4. Implementation Phase

### After Approval

**Approval looks like:**
```markdown
Status: ✅ Approved
Reviewer: @shelbeely
Date: 2024-01-14
Notes: Proceed with implementation. Watch for performance in step 3.
```

### Implementation Rules

1. **Follow the Spec Exactly**
   - Don't add "improvements"
   - Don't change scope
   - Don't skip steps

2. **Incremental Commits**
   ```bash
   # Good commit sequence
   git commit -m "✨ feat: Add CommitData interface"
   git commit -m "✨ feat: Implement commit fetcher"
   git commit -m "📝 docs: Add commit fetcher guide"
   git commit -m "✅ test: Add commit fetcher tests"
   ```

3. **Documentation Alongside Code**
   - Update docs in same commit
   - No "TODO: add docs later"
   - Keep README.md synchronized

4. **Report Deviations Immediately**
   ```markdown
   ## 🚨 Deviation from Approved Spec
   
   **Original Plan:** Store in JSON files
   **Actual Implementation:** Using SQLite
   **Reason:** Performance testing showed 10x speedup
   **Impact:** Low - Same API, different backend
   
   **Request approval to continue with SQLite.**
   ```

---

## 5. Code Review Submission

### Create Pull Request

**Title Format:**
```
<emoji> <type>: <description>

Examples:
✨ feat: Add code planner screen
🐛 fix: Resolve commit date timezone issue
📝 docs: Add keyboard shortcuts guide
🎨 style: Update to Material Design 3 colors
```

**PR Description Template:**
```markdown
## 📝 Summary
[Brief overview of changes]

## 🎯 Related Spec
`.github/agents/specs/FEATURE_NAME.md`

## ✅ Changes Made
- Added `src/components/screens/NewScreen.tsx`
- Modified `src/types/index.ts` to include new types
- Updated `README.md` with feature section

## 🧪 Testing
- [ ] Manual testing completed
- [ ] All existing tests pass
- [ ] New tests added (if applicable)

## 📚 Documentation
- [ ] README.md updated
- [ ] New guide created (if needed)
- [ ] ARCHITECTURE.md updated (if needed)
- [ ] AI automation sections added

## 🔍 Self-Review Checklist
- [ ] Follows style guides (CONTEXT.md)
- [ ] No breaking changes (or migration provided)
- [ ] Documentation synchronized with code
- [ ] Commit messages follow conventions
- [ ] No secrets committed

## 💬 Notes for Reviewer
[Anything specific to call out]
```

---

## 6. Respond to Code Review

### Address Feedback Promptly

**Good Response:**
```markdown
> This function is hard to read. Can you extract the logic?

Done! Extracted to `parseCommitMessage()` helper.

**Changed in:** abc123d
```

**Bad Response:**
```markdown
> This is hard to read.

It works fine though.
```

### Make Requested Changes

```bash
# 1. Make changes
vim src/file.ts

# 2. Commit with reference
git commit -m "♻️ refactor: Extract parseCommitMessage helper

Addresses review feedback in PR #42"

# 3. Push
git push
```

---

## 7. Iteration Safety Checklist

Before each development session:

```markdown
## Pre-Session Checklist

- [ ] Read `.github/agents/CONTEXT.md`
- [ ] Check approved specs in `.github/agents/specs/`
- [ ] Review recent commits for context
- [ ] Understand what I'm changing and why
- [ ] Verify no breaking changes (or have approval)
- [ ] Plan incremental commits
- [ ] Know what documentation needs updating

## Post-Session Checklist

- [ ] All changes committed
- [ ] Documentation updated
- [ ] Self-review completed
- [ ] Tests passing (if applicable)
- [ ] Ready for human review
```

---

## 8. Emergency Stops

### When to STOP and Ask

Stop immediately and request guidance if:

1. **Scope Creep**: Feature growing beyond spec
2. **Breaking Change**: Will break existing functionality
3. **Stuck**: Can't figure out implementation
4. **Conflict**: Changes conflict with other work
5. **Security**: Potential security concern
6. **Performance**: Significant performance regression

### How to Request Guidance

```markdown
## 🛑 Request for Guidance

**Context:** [What you're working on]
**Issue:** [What problem you've encountered]
**Options Considered:**
1. [Option A] - Pros/Cons
2. [Option B] - Pros/Cons

**Recommendation:** [Your suggestion]

**Need decision before proceeding.**

@shelbeely
```

---

## 9. Quality Standards

Your work will be evaluated on:

### Code Quality
- [ ] TypeScript strict mode, no `any`
- [ ] Error handling implemented
- [ ] Keyboard navigation works
- [ ] Material Design 3 colors used
- [ ] Follows existing patterns

### Documentation Quality
- [ ] Dual-audience format (humans + AI)
- [ ] Clear examples provided
- [ ] Keyboard shortcuts documented
- [ ] Troubleshooting section included
- [ ] AI automation instructions in `<details>`

### Process Quality
- [ ] Spec created before coding
- [ ] Spec approved before implementing
- [ ] Incremental commits
- [ ] Documentation with code
- [ ] Self-review completed

---

## 10. Success Patterns

### Pattern: Small Iterations
```
✅ Good Flow:
Spec → Review → Approval → Commit 1 → Commit 2 → Commit 3 → PR → Review → Merge

❌ Bad Flow:
No spec → 50 files changed → PR → "What does this do?"
```

### Pattern: Clear Communication
```
✅ Good:
"I'm implementing X as specified in SPEC.md. ETA: 2 hours. Will report progress."

❌ Bad:
"Working on stuff."
```

### Pattern: Documentation Discipline
```
✅ Good:
git commit -m "feat: Add feature" (includes code + docs)

❌ Bad:
git commit -m "feat: Add feature" (code only)
git commit -m "docs: TODO later"
```

---

## Summary

**Golden Rule:** Plan → Review → Approve → Implement → Review → Merge

**Never skip the middle steps!**

The review process exists to:
- Keep you aligned with project goals
- Catch issues early
- Maintain code quality
- Ensure documentation
- Preserve architectural integrity

---

**Questions?** Ask @shelbeely before proceeding.
