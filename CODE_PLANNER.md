# 🎯 Code Planner Guide

**Agent-Driven Development System for HistTUI**

The Code Planner is an in-app feature that helps you plan, design, and execute code changes with AI assistance. It provides a structured workflow for creating specifications, maintaining project context, and safely iterating with AI agents.

---

## 📑 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Features](#features)
- [User Guide](#user-guide)
- [Project Context](#project-context)
- [Spec Templates](#spec-templates)
- [AI Integration](#ai-integration)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [File Storage](#file-storage)
- [Best Practices](#best-practices)

---

## Overview

The Code Planner helps you:

- **📝 Create Code Specs** - Write structured specifications for features, bugs, refactors, and more
- **🎯 Maintain Context** - Store tech stack, style guides, and product goals for your projects
- **👀 Safe Iteration** - Review AI-generated plans before code is written
- **🤝 Work as Team** - Share context between AI agents working on the same project

This is both:
1. **A feature for your repositories** - Use it to plan changes to any project you're working on
2. **Used for HistTUI's development** - We use it to develop HistTUI itself

---

## 🚀 Quick Start

### Access Code Planner

Press `6` from any screen to open the Code Planner.

### Create Your First Spec

1. Press `6` to open Code Planner
2. Press `n` to create a new spec
3. Or press `t` to browse templates and start from one

### Set Up Project Context

1. Press `6` to open Code Planner
2. Press `c` to open Context Manager
3. Fill in your tech stack, style guide, and product goals
4. Context is saved automatically

<details>
<summary><strong>For AI Agents / LLMs</strong></summary>

**Step 0: Verify access**
```bash
# Code Planner is accessible via keyboard shortcut '6'
# Storage location: ~/.histtui/projects/<repo-hash>/
```

**Step 1: Open Code Planner**
- Navigation: Press '6' from any screen in HistTUI
- Returns to: Code Planner screen with spec list

**Step 2: Create a spec**
```typescript
// Press 'n' to create new spec
// Or press 't' to browse templates
// Specs are saved to: ~/.histtui/projects/<repo-hash>/specs/<spec-id>.json
```

**Step 3: Set up context**
```typescript
// Press 'c' to open Context Manager
// Fill in ProjectContext fields:
interface ProjectContext {
  techStack: { languages, frameworks, tools, buildSystem }
  styleGuide: { codeStyle, namingConventions, fileStructure, documentation, testing }
  productGoals: { vision, objectives, targetUsers, keyFeatures }
  architecture: { patterns, layers, boundaries }
  team: { roles, workflow, reviewProcess }
}
// Saved to: ~/.histtui/projects/<repo-hash>/context.json
```

**Step 4: Verify storage**
```bash
ls -la ~/.histtui/projects/<repo-hash>/
# Should show: context.json, specs/
```

</details>

---

## ✨ Features

### 📋 Spec Management

- **Create Specs** - Structured specifications with problem, requirements, constraints, and acceptance criteria
- **Status Tracking** - Track specs through draft, ready, in-progress, review, completed, and archived
- **Priority Levels** - Mark specs as low, medium, high, or critical priority
- **Tags & Search** - Organize specs with tags and search by title, description, or content
- **Templates** - Start from predefined templates for common tasks (features, bugs, refactors, docs, tests, architecture)

### 🎯 Project Context

Store comprehensive project information:

- **Tech Stack** - Languages, frameworks, tools, build system
- **Style Guide** - Code style, naming conventions, file structure, documentation standards, testing practices
- **Product Goals** - Vision, objectives, target users, key features
- **Architecture** - Patterns, layers, boundaries
- **Team** - Roles, workflow, review process

This context is sent to AI agents so they understand your project and make appropriate suggestions.

### 🤖 AI Integration

- **Generate Plans** - AI analyzes your spec and context to generate implementation plans
- **Review Plans** - Review AI suggestions before any code is written
- **Safe Iteration** - You stay in control; nothing happens without your approval
- **Context-Aware** - AI uses your project context to make relevant suggestions

### 💾 Persistent Storage

All data is stored locally:

- **Project Context**: `~/.histtui/projects/<repo-hash>/context.json`
- **Specs**: `~/.histtui/projects/<repo-hash>/specs/<spec-id>.json`
- **Per-Repository**: Each repository gets its own isolated storage

---

## 📖 User Guide

### Creating a Spec

1. **Press `6`** to open Code Planner
2. **Press `n`** to create a new spec
3. **Fill in fields**:
   - **Title**: Short, descriptive name
   - **Description**: What you're trying to accomplish
   - **Problem**: What problem are you solving?
   - **Requirements**: List of functional and non-functional requirements
   - **Constraints**: Technical, business, or timeline constraints
   - **Acceptance Criteria**: How you'll know it's done
4. **Set priority**: low, medium, high, or critical
5. **Add tags**: For organization and filtering
6. **Save**: Spec is saved automatically

### Using Templates

Templates provide pre-filled structures for common tasks:

1. **Press `6`** to open Code Planner
2. **Press `t`** to browse templates
3. **Select a template**:
   - ✨ **New Feature** - Add a new capability
   - 🐛 **Bug Fix** - Fix a defect
   - ♻️ **Code Refactoring** - Improve code structure
   - 📚 **Documentation** - Add or improve docs
   - 🧪 **Add Tests** - Improve test coverage
   - 🏗️ **Architecture Change** - Make architectural changes
4. **Customize** the template for your specific need

### Managing Specs

**Filter by Status**:
- Press `f` to cycle through filters: all, draft, ready, in-progress, review, completed

**Search Specs**:
- Type to search by title, description, or problem statement

**Edit Spec**:
- Select a spec and press `Enter` to edit

**Delete Spec**:
- Select a spec and press `d` to delete

### Managing Project Context

1. **Press `6`** to open Code Planner
2. **Press `c`** to open Context Manager
3. **Fill in sections**:
   - **Tech Stack**: What languages, frameworks, tools you use
   - **Style Guide**: Coding standards and conventions
   - **Product Goals**: What you're building and why
   - **Architecture**: How the code is organized
   - **Team**: Who's involved and how you work
4. **Save**: Context is saved automatically and used by AI agents

---

## 🎯 Project Context

Project context helps AI agents understand your codebase and make appropriate suggestions.

### Tech Stack

```json
{
  "languages": ["TypeScript", "JavaScript"],
  "frameworks": ["React", "Ink"],
  "tools": ["Bun", "SQLite"],
  "buildSystem": "Bun"
}
```

### Style Guide

```json
{
  "codeStyle": "TypeScript strict mode, ESLint rules",
  "namingConventions": "camelCase for variables, PascalCase for components",
  "fileStructure": "Feature-based organization, screens in components/screens/",
  "documentation": "JSDoc comments for public APIs, dual-audience docs",
  "testing": "Jest for unit tests, integration tests for critical paths"
}
```

### Product Goals

```json
{
  "vision": "Beautiful, keyboard-first Git history explorer",
  "objectives": [
    "Blazing fast navigation of large repositories",
    "Accessible to developers with ADHD and visual needs",
    "AI-powered insights and recommendations"
  ],
  "targetUsers": ["Developers", "DevOps engineers", "Code reviewers"],
  "keyFeatures": ["Timeline view", "File tree", "Activity dashboards", "Code Planner"]
}
```

### Architecture

```json
{
  "patterns": ["Component-driven UI", "Service layer", "Repository pattern"],
  "layers": ["CLI", "Core (git, database, indexer)", "UI Components", "Plugins"],
  "boundaries": "Read-only git operations, no write commands"
}
```

### Team

```json
{
  "roles": ["Developer", "Designer", "Technical writer"],
  "workflow": "Feature branches, PR reviews, CI/CD",
  "reviewProcess": "Code review required, documentation updates required"
}
```

---

## 📋 Spec Templates

### ✨ New Feature

For adding new functionality:

```typescript
{
  title: "Feature: [Feature Name]",
  description: "Describe the feature and its benefits to users",
  context: {
    problem: "What problem does this feature solve?",
    requirements: [
      "Functional requirement 1",
      "Functional requirement 2",
      "Non-functional requirement (performance, security, etc.)"
    ],
    constraints: [
      "Technical constraints (API limits, dependencies, etc.)",
      "Business constraints (budget, timeline, etc.)"
    ],
    acceptanceCriteria: [
      "User can...",
      "System should...",
      "Performance meets..."
    ]
  }
}
```

### 🐛 Bug Fix

For fixing defects:

```typescript
{
  title: "Fix: [Bug Description]",
  description: "Describe the bug and its impact",
  context: {
    problem: "What is the bug? How does it manifest? Steps to reproduce?",
    requirements: [
      "Bug should be fixed without breaking existing functionality",
      "Root cause should be identified and addressed",
      "Tests should prevent regression"
    ],
    constraints: [
      "Must maintain backward compatibility",
      "Should not introduce new dependencies"
    ],
    acceptanceCriteria: [
      "Bug no longer occurs when following reproduction steps",
      "Existing tests pass",
      "New test covers the bug scenario"
    ]
  }
}
```

### ♻️ Code Refactoring

For improving code structure:

```typescript
{
  title: "Refactor: [Component/Module Name]",
  description: "Describe what needs to be refactored and why",
  context: {
    problem: "What code smells or technical debt exist? Why refactor now?",
    requirements: [
      "Improve code readability and maintainability",
      "Reduce complexity",
      "Follow established patterns and conventions"
    ],
    constraints: [
      "Must not change external behavior",
      "All existing tests must pass",
      "No new dependencies unless justified"
    ],
    acceptanceCriteria: [
      "Code complexity metrics improve",
      "Code follows project style guide",
      "All tests pass without modification"
    ]
  }
}
```

### 📚 Documentation

For improving documentation:

```typescript
{
  title: "Docs: [Documentation Topic]",
  description: "Describe what documentation is needed",
  context: {
    problem: "What is missing or unclear in current documentation?",
    requirements: [
      "Clear and concise explanations",
      "Code examples where applicable",
      "Both human-friendly and AI-agent sections"
    ],
    constraints: [
      "Follow existing documentation style",
      "Use markdown format",
      "Include collapsible sections for AI agents"
    ],
    acceptanceCriteria: [
      "Documentation is complete and accurate",
      "Examples work as described",
      "Links are valid and relevant"
    ]
  }
}
```

### 🧪 Add Tests

For improving test coverage:

```typescript
{
  title: "Test: [Component/Feature Name]",
  description: "Describe what needs test coverage",
  context: {
    problem: "What code lacks adequate test coverage? What scenarios are untested?",
    requirements: [
      "Unit tests for core logic",
      "Integration tests for workflows",
      "Edge cases and error scenarios covered"
    ],
    constraints: [
      "Use existing test framework",
      "Follow project testing conventions",
      "Tests should be fast and reliable"
    ],
    acceptanceCriteria: [
      "Code coverage increases to target %",
      "All tests pass consistently",
      "Tests are maintainable and clear"
    ]
  }
}
```

### 🏗️ Architecture Change

For significant architectural changes:

```typescript
{
  title: "Architecture: [Change Description]",
  description: "Describe the architectural change and its rationale",
  context: {
    problem: "What architectural issues exist? Why is this change needed?",
    requirements: [
      "Improve scalability/maintainability/performance",
      "Clear migration path from current architecture",
      "Documentation of new architecture"
    ],
    constraints: [
      "Backward compatibility or clear migration strategy",
      "Team buy-in and understanding",
      "Manageable implementation scope"
    ],
    acceptanceCriteria: [
      "Architecture diagrams updated",
      "Implementation guide created",
      "Migration plan documented",
      "Proof of concept validates approach"
    ]
  }
}
```

---

## 🤖 AI Integration

### Generating Plans

1. Create a spec with clear requirements
2. Ensure project context is set up
3. Request plan generation (press `r` on spec)
4. AI analyzes spec + context and generates:
   - Step-by-step implementation plan
   - Estimated effort
   - Potential risks
   - Files to create/modify/delete

### Reviewing Plans

Before any code is written:

1. Review the generated plan
2. Check that it aligns with your requirements
3. Verify it follows your style guide
4. Approve or request modifications

### AG-UI Integration

Code Planner integrates with AG-UI agent backend:

```typescript
interface AGUIRequest {
  type: 'generate-plan' | 'review-spec' | 'suggest-improvements';
  spec: CodeSpec;
  context: ProjectContext;
  options?: {
    includeTests?: boolean;
    includeDocs?: boolean;
    safetyChecks?: boolean;
  };
}
```

The agent receives:
- Your spec (problem, requirements, constraints)
- Project context (tech stack, style guide, goals)
- Optional flags (tests, docs, safety checks)

And returns:
- Implementation plan with steps
- Estimated effort
- Risk assessment
- File changes needed

---

## ⌨️ Keyboard Shortcuts

### Global Navigation

- `6` - Open Code Planner from any screen
- `Esc` - Return to previous view/screen
- `?` - Toggle help overlay

### Code Planner Screen

- `n` - Create new spec
- `c` - Open Context Manager
- `t` - Browse templates
- `d` - Delete selected spec
- `f` - Filter by status (cycle through: all, draft, ready, in-progress, review, completed)
- `Enter` - Edit selected spec
- `↑/↓` - Navigate spec list

### Spec Editor (Future)

- `Tab` - Move to next field
- `Shift+Tab` - Move to previous field
- `Ctrl+S` - Save spec
- `Esc` - Cancel and return

### Context Manager

- `Tab` - Move to next section
- `Shift+Tab` - Move to previous section
- `Ctrl+S` - Save context
- `Esc` - Return to Code Planner

---

## 💾 File Storage

### Directory Structure

```
~/.histtui/
├── cache/                    # Repository cache (existing)
│   └── <repo-hash>/
│       ├── .git/
│       └── histtui.db
└── projects/                 # Code Planner storage (new)
    └── <repo-hash>/
        ├── context.json      # Project context
        └── specs/            # Code specifications
            ├── spec-1.json
            ├── spec-2.json
            └── ...
```

### Context File Format

`~/.histtui/projects/<repo-hash>/context.json`:

```json
{
  "repoHash": "abc123...",
  "repoUrl": "https://github.com/user/repo",
  "repoName": "repo",
  "techStack": {
    "languages": ["TypeScript"],
    "frameworks": ["React", "Ink"],
    "tools": ["Bun"],
    "buildSystem": "Bun"
  },
  "styleGuide": {
    "codeStyle": "TypeScript strict mode",
    "namingConventions": "camelCase for variables",
    "fileStructure": "Feature-based organization",
    "documentation": "JSDoc for public APIs",
    "testing": "Jest for unit tests"
  },
  "productGoals": {
    "vision": "Beautiful Git history explorer",
    "objectives": ["Fast navigation", "Accessible UI"],
    "targetUsers": ["Developers"],
    "keyFeatures": ["Timeline", "File tree"]
  },
  "architecture": {
    "patterns": ["Component-driven UI"],
    "layers": ["CLI", "Core", "UI", "Plugins"],
    "boundaries": "Read-only git operations"
  },
  "team": {
    "roles": ["Developer"],
    "workflow": "Feature branches, PR reviews",
    "reviewProcess": "Code review required"
  },
  "metadata": {
    "createdAt": 1705234567890,
    "updatedAt": 1705234567890,
    "version": "1.0.0"
  }
}
```

### Spec File Format

`~/.histtui/projects/<repo-hash>/specs/<spec-id>.json`:

```json
{
  "id": "spec-1705234567890-abc123",
  "title": "Feature: Add code ownership view",
  "description": "Display file ownership and bus factor metrics",
  "status": "draft",
  "priority": "medium",
  "createdAt": 1705234567890,
  "updatedAt": 1705234567890,
  "tags": ["feature", "dashboard"],
  "context": {
    "problem": "Hard to identify code ownership and bus factor risks",
    "requirements": [
      "Show top contributors per file",
      "Calculate bus factor metric",
      "Highlight high-risk files"
    ],
    "constraints": [
      "Must work with existing database schema",
      "Performance: < 100ms to generate view"
    ],
    "acceptanceCriteria": [
      "User can see ownership breakdown per file",
      "Bus factor is clearly displayed",
      "High-risk files are highlighted"
    ],
    "technicalNotes": "Use git blame data from database"
  },
  "plan": {
    "steps": [
      "Create OwnershipDashboard component",
      "Add database query for ownership data",
      "Implement bus factor calculation",
      "Add keyboard shortcut to navigate to view"
    ],
    "estimatedEffort": "4-6 hours",
    "risks": ["Performance with large files"],
    "generatedAt": 1705234567890
  },
  "templateId": "feature-new"
}
```

---

## 💡 Best Practices

### Writing Good Specs

1. **Be Specific** - Clear problem statement and requirements
2. **Include Context** - Why is this needed? What's the user benefit?
3. **Define Success** - Clear acceptance criteria
4. **List Constraints** - Technical, business, or timeline limitations
5. **Use Templates** - Start from a template and customize

### Maintaining Context

1. **Keep Updated** - Review and update context as your project evolves
2. **Be Thorough** - More context = better AI suggestions
3. **Document Patterns** - Include architectural patterns and conventions
4. **Share Knowledge** - Use context to onboard new team members or AI agents

### Working with AI

1. **Review Plans** - Always review before executing
2. **Iterate** - Request improvements if needed
3. **Stay in Control** - You approve all changes
4. **Provide Feedback** - Help AI learn your preferences

### Organization

1. **Use Tags** - Tag specs by feature area, sprint, or priority
2. **Archive Completed** - Mark done specs as completed or archived
3. **Regular Reviews** - Periodically review and clean up old specs
4. **Link Specs** - Reference related specs in technical notes

---

## 🚀 Use Cases

### For Your Own Projects

- Plan new features with structured specs
- Maintain project documentation and context
- Get AI help with implementation plans
- Share context across team members

### For HistTUI Development

We use Code Planner to develop HistTUI itself:

- All new features start as specs
- Project context documents our tech stack and patterns
- AI helps generate implementation plans
- Review process ensures quality

### Example Workflow

1. **Identify Need** - User requests a new dashboard
2. **Create Spec** - Use "New Feature" template
3. **Fill Context** - Ensure project context is current
4. **Generate Plan** - Request AI to generate implementation plan
5. **Review Plan** - Check steps, effort, and risks
6. **Execute** - Follow plan to implement feature
7. **Update Spec** - Mark as completed when done

---

## 🔒 Privacy & Security

- **Local Storage** - All data stored locally in `~/.histtui/projects/`
- **No Cloud Sync** - Data never leaves your machine unless you use AG-UI
- **Optional AI** - AI integration is optional; specs work without it
- **Isolated Storage** - Each repository has isolated storage

---

## 🐛 Troubleshooting

### Spec Not Saving

**Problem**: Spec doesn't persist after creation

**Solution**:
```bash
# Check permissions on projects directory
ls -la ~/.histtui/projects/
# Ensure write permissions
chmod -R u+w ~/.histtui/projects/
```

### Context Not Loading

**Problem**: Context not appearing in Context Manager

**Solution**:
```bash
# Check if context.json exists
cat ~/.histtui/projects/<repo-hash>/context.json
# If missing, create new context by pressing 'c' in Code Planner
```

### Can't Access Code Planner

**Problem**: Pressing '6' doesn't open Code Planner

**Solution**:
- Ensure you're on a supported screen (Timeline, Branches, Files, or Dashboard)
- Check keyboard shortcuts haven't been remapped in config

---

## 📚 Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - HistTUI architecture overview
- [AGUI_INTEGRATION.md](./AGUI_INTEGRATION.md) - AG-UI integration details
- [MATERIAL_DESIGN_3.md](./MATERIAL_DESIGN_3.md) - Material Design 3 styling
- [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md) - Project context format reference

---

## 🎯 Future Enhancements

Planned improvements:

- **Spec Editor** - Full-screen editor for creating/editing specs
- **Plan Execution** - Execute approved plans directly
- **Collaboration** - Share specs with team members
- **Templates Library** - Import/export custom templates
- **Analytics** - Track spec completion and velocity
- **Git Integration** - Link specs to commits and PRs

---

**Ready to start planning?** Press `6` to open Code Planner! 🚀
