# HistTUI Agent Development System

This directory contains the complete context and workflow for AI agents working on HistTUI.

## 📁 Directory Structure

```
.github/agents/
├── README.md              # This file
├── CONTEXT.md             # Complete project context (READ FIRST)
├── SPEC_TEMPLATE.md       # Template for feature specifications
├── REVIEW_PROCESS.md      # How to submit work for review
└── specs/                 # Approved feature specifications
    ├── README.md
    └── [feature specs...]
```

---

## 🎯 Quick Start for AI Agents

### First Time Setup

1. **Read CONTEXT.md** - Complete project context
   - Tech stack
   - Style guides
   - Architecture
   - Product goals

2. **Review REVIEW_PROCESS.md** - Workflow guidelines
   - How to create specs
   - How to get approval
   - How to submit PRs

3. **Check specs/** - See what's already approved or in progress

### Before Every Session

Run this checklist:

```bash
# 1. Read context
cat .github/agents/CONTEXT.md

# 2. Check approved specs
ls .github/agents/specs/

# 3. Review recent changes
git log --oneline -10

# 4. Understand current state
git status
```

---

## 📝 Development Workflow

### The Safe Iteration Process

```
1. CREATE SPEC
   └─> Use SPEC_TEMPLATE.md
   └─> Save to specs/FEATURE_NAME.md
   └─> Fill out ALL sections

2. SUBMIT FOR REVIEW
   └─> Tag @shelbeely
   └─> Answer questions
   └─> Update spec based on feedback

3. GET APPROVAL
   └─> Status: "Approved" in spec
   └─> All concerns addressed
   └─> Implementation plan clear

4. IMPLEMENT
   └─> Follow spec exactly
   └─> Incremental commits
   └─> Update docs with code

5. CODE REVIEW
   └─> Create PR with spec link
   └─> Address feedback
   └─> Merge when approved
```

---

## 🛠 Creating a Specification

### Step 1: Copy Template

```bash
cp .github/agents/SPEC_TEMPLATE.md \
   .github/agents/specs/my-feature-draft.md
```

### Step 2: Fill Out Completely

Required sections:
- ✅ Feature Overview (What, Why, Who)
- ✅ Technical Context (Current state, changes, dependencies)
- ✅ Design Decisions (Architecture, storage, UI, API)
- ✅ Implementation Plan (Step-by-step with file lists)
- ✅ Style Guide Compliance (Checklist)
- ✅ Testing Strategy
- ✅ Documentation Requirements
- ✅ Review Checklist

### Step 3: Submit for Review

Comment or create discussion:

```markdown
## 📋 Spec Ready for Review

**Feature:** My Amazing Feature
**Location:** `.github/agents/specs/my-feature-draft.md`
**Complexity:** Medium

### Summary
[2-3 sentences]

### Key Decisions
1. Using SQLite for persistence
2. New keyboard shortcut: '7'
3. Adds 3 new screens

@shelbeely
```

---

## ✅ Quality Standards

### Code Must:
- Use TypeScript strict mode (no `any`)
- Follow Ink/React patterns (functional components)
- Use Material Design 3 colors
- Support keyboard-first navigation
- Handle errors gracefully
- Include comprehensive tests

### Documentation Must:
- Use dual-audience format (humans + AI)
- Include quick start section
- Provide usage examples
- Document keyboard shortcuts
- Add troubleshooting section
- Include AI automation in `<details>` tags

### Process Must:
- Create spec before coding
- Get approval before implementing
- Make incremental commits
- Update docs with code
- Pass self-review checklist

---

## 🚫 What NOT to Do

### ❌ DON'T:
- Start coding without approved spec
- Add "improvements" beyond scope
- Skip documentation
- Use hardcoded colors
- Modify Git repos (read-only always)
- Commit secrets or API keys
- Make breaking changes without approval
- Use class components (functional only)
- Ignore keyboard accessibility

---

## 📚 Key Documents

### Must Read (in order):
1. **CONTEXT.md** - Complete project context
2. **SPEC_TEMPLATE.md** - How to write specs
3. **REVIEW_PROCESS.md** - How to submit work
4. **../PROJECT_CONTEXT.md** - High-level architecture
5. **../../docs/PATTERNS.md** - Reusable code patterns

### Reference:
- **README.md** - Project overview
- **ARCHITECTURE.md** - System architecture
- **COMPONENTS.md** - Component library reference
- **MATERIAL_DESIGN_3.md** - Color system guide

---

## 🤝 Multi-Agent Collaboration

### When Multiple Agents Work Together:

1. **Read shared context** (CONTEXT.md)
2. **Check specs/** for claimed work
3. **Coordinate in spec files** via assignment section
4. **Avoid conflicts** - pick non-overlapping files
5. **Communicate** - report progress

### Claim Your Work:

Add to spec file:

```markdown
## Implementation Assignment
- Agent: @agent-name
- Started: 2024-01-14
- Status: In Progress
- ETA: 2024-01-15
- Files: src/components/screens/MyScreen.tsx
```

---

## 🆘 Getting Help

### When Stuck:

1. Check `docs/PATTERNS.md` for similar patterns
2. Review existing code for examples
3. Read component documentation
4. Ask for clarification (don't guess!)
5. Propose solution in spec update

### Request Guidance:

```markdown
## 🛑 Request for Guidance

**Working On:** Feature X
**Issue:** Can't decide between approach A or B

**Option A:** [Description] - Pros/Cons
**Option B:** [Description] - Pros/Cons

**Recommendation:** Option A because...

**Awaiting decision.**

@shelbeely
```

---

## 📊 Success Metrics

You're succeeding if:

- ✅ Every feature has approved spec
- ✅ No breaking changes without approval
- ✅ Documentation stays synchronized
- ✅ All style guides followed
- ✅ Tests passing consistently
- ✅ Users love the experience

---

## 🔄 Continuous Improvement

### After Each Feature:

1. **Reflect**
   - What went well?
   - What was difficult?
   - What patterns emerged?

2. **Update**
   - Add patterns to `docs/PATTERNS.md`
   - Improve templates if needed
   - Update CONTEXT.md if architecture changed

3. **Share**
   - Document learnings
   - Help future agents
   - Improve the system

---

## 📞 Contact

**Maintainer:** @shelbeely
**Last Updated:** 2024-01-14
**Version:** 1.0.0

---

**Remember:** Plan → Review → Approve → Implement → Review → Merge

**Never skip the middle steps!**
