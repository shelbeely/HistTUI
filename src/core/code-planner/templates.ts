/**
 * Predefined spec templates for common development tasks
 */

import { SpecTemplate } from '../../types/code-planner';

export const SPEC_TEMPLATES: SpecTemplate[] = [
  {
    id: 'feature-new',
    name: 'New Feature',
    description: 'Add a new feature to the application',
    category: 'feature',
    icon: '✨',
    fields: {
      title: 'Feature: [Feature Name]',
      description: 'Describe the feature and its benefits to users',
      context: {
        problem: 'What problem does this feature solve?',
        requirements: [
          'Functional requirement 1',
          'Functional requirement 2',
          'Non-functional requirement (performance, security, etc.)',
        ],
        constraints: [
          'Technical constraints (API limits, dependencies, etc.)',
          'Business constraints (budget, timeline, etc.)',
        ],
        acceptanceCriteria: [
          'User can...',
          'System should...',
          'Performance meets...',
        ],
      },
    },
  },
  {
    id: 'bugfix',
    name: 'Bug Fix',
    description: 'Fix a bug or defect in the code',
    category: 'bugfix',
    icon: '🐛',
    fields: {
      title: 'Fix: [Bug Description]',
      description: 'Describe the bug and its impact',
      context: {
        problem: 'What is the bug? How does it manifest? Steps to reproduce?',
        requirements: [
          'Bug should be fixed without breaking existing functionality',
          'Root cause should be identified and addressed',
          'Tests should prevent regression',
        ],
        constraints: [
          'Must maintain backward compatibility',
          'Should not introduce new dependencies',
        ],
        acceptanceCriteria: [
          'Bug no longer occurs when following reproduction steps',
          'Existing tests pass',
          'New test covers the bug scenario',
        ],
      },
    },
  },
  {
    id: 'refactor',
    name: 'Code Refactoring',
    description: 'Improve code structure without changing behavior',
    category: 'refactor',
    icon: '♻️',
    fields: {
      title: 'Refactor: [Component/Module Name]',
      description: 'Describe what needs to be refactored and why',
      context: {
        problem: 'What code smells or technical debt exist? Why refactor now?',
        requirements: [
          'Improve code readability and maintainability',
          'Reduce complexity',
          'Follow established patterns and conventions',
        ],
        constraints: [
          'Must not change external behavior',
          'All existing tests must pass',
          'No new dependencies unless justified',
        ],
        acceptanceCriteria: [
          'Code complexity metrics improve',
          'Code follows project style guide',
          'All tests pass without modification',
        ],
      },
    },
  },
  {
    id: 'docs',
    name: 'Documentation',
    description: 'Add or improve documentation',
    category: 'docs',
    icon: '📚',
    fields: {
      title: 'Docs: [Documentation Topic]',
      description: 'Describe what documentation is needed',
      context: {
        problem: 'What is missing or unclear in current documentation?',
        requirements: [
          'Clear and concise explanations',
          'Code examples where applicable',
          'Both human-friendly and AI-agent sections',
        ],
        constraints: [
          'Follow existing documentation style',
          'Use markdown format',
          'Include collapsible sections for AI agents',
        ],
        acceptanceCriteria: [
          'Documentation is complete and accurate',
          'Examples work as described',
          'Links are valid and relevant',
        ],
      },
    },
  },
  {
    id: 'test',
    name: 'Add Tests',
    description: 'Improve test coverage',
    category: 'test',
    icon: '🧪',
    fields: {
      title: 'Test: [Component/Feature Name]',
      description: 'Describe what needs test coverage',
      context: {
        problem: 'What code lacks adequate test coverage? What scenarios are untested?',
        requirements: [
          'Unit tests for core logic',
          'Integration tests for workflows',
          'Edge cases and error scenarios covered',
        ],
        constraints: [
          'Use existing test framework',
          'Follow project testing conventions',
          'Tests should be fast and reliable',
        ],
        acceptanceCriteria: [
          'Code coverage increases to target %',
          'All tests pass consistently',
          'Tests are maintainable and clear',
        ],
      },
    },
  },
  {
    id: 'architecture',
    name: 'Architecture Change',
    description: 'Make significant architectural changes',
    category: 'architecture',
    icon: '🏗️',
    fields: {
      title: 'Architecture: [Change Description]',
      description: 'Describe the architectural change and its rationale',
      context: {
        problem: 'What architectural issues exist? Why is this change needed?',
        requirements: [
          'Improve scalability/maintainability/performance',
          'Clear migration path from current architecture',
          'Documentation of new architecture',
        ],
        constraints: [
          'Backward compatibility or clear migration strategy',
          'Team buy-in and understanding',
          'Manageable implementation scope',
        ],
        acceptanceCriteria: [
          'Architecture diagrams updated',
          'Implementation guide created',
          'Migration plan documented',
          'Proof of concept validates approach',
        ],
      },
    },
  },
];

export function getTemplateById(id: string): SpecTemplate | undefined {
  return SPEC_TEMPLATES.find(t => t.id === id);
}

export function getTemplatesByCategory(category: SpecTemplate['category']): SpecTemplate[] {
  return SPEC_TEMPLATES.filter(t => t.category === category);
}
