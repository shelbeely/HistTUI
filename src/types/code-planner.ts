/**
 * Type definitions for Code Planner feature
 * Agent-driven development system for HistTUI
 */

export type SpecStatus = 'draft' | 'ready' | 'in-progress' | 'review' | 'completed' | 'archived';

export type SpecPriority = 'low' | 'medium' | 'high' | 'critical';

export interface CodeSpec {
  id: string;
  title: string;
  description: string;
  status: SpecStatus;
  priority: SpecPriority;
  createdAt: number;
  updatedAt: number;
  tags: string[];
  context: {
    problem: string;
    requirements: string[];
    constraints: string[];
    acceptanceCriteria: string[];
    technicalNotes?: string;
  };
  plan?: {
    steps: string[];
    estimatedEffort?: string;
    risks?: string[];
    generatedAt?: number;
    reviewedBy?: string;
  };
  templateId?: string;
}

export interface ProjectContext {
  repoHash: string;
  repoUrl: string;
  repoName: string;
  techStack: {
    languages: string[];
    frameworks: string[];
    tools: string[];
    buildSystem?: string;
  };
  styleGuide: {
    codeStyle?: string;
    namingConventions?: string;
    fileStructure?: string;
    documentation?: string;
    testing?: string;
  };
  productGoals: {
    vision: string;
    objectives: string[];
    targetUsers?: string[];
    keyFeatures?: string[];
  };
  architecture: {
    patterns: string[];
    layers: string[];
    boundaries?: string;
  };
  team: {
    roles: string[];
    workflow?: string;
    reviewProcess?: string;
  };
  metadata: {
    createdAt: number;
    updatedAt: number;
    version: string;
  };
}

export interface SpecTemplate {
  id: string;
  name: string;
  description: string;
  category: 'feature' | 'bugfix' | 'refactor' | 'docs' | 'test' | 'architecture';
  icon: string;
  fields: {
    title: string;
    description: string;
    context: {
      problem: string;
      requirements: string[];
      constraints: string[];
      acceptanceCriteria: string[];
    };
  };
}

export interface CodePlannerState {
  mode: 'list' | 'create' | 'edit' | 'review' | 'context' | 'templates';
  selectedSpec?: CodeSpec;
  specs: CodeSpec[];
  context?: ProjectContext;
  templates: SpecTemplate[];
  filter: {
    status?: SpecStatus;
    priority?: SpecPriority;
    tag?: string;
    search?: string;
  };
}

export interface AGUIRequest {
  type: 'generate-plan' | 'review-spec' | 'suggest-improvements';
  spec: CodeSpec;
  context: ProjectContext;
  options?: {
    includeTests?: boolean;
    includeDocs?: boolean;
    safetyChecks?: boolean;
  };
}

export interface AGUIResponse {
  type: 'plan' | 'review' | 'suggestions';
  spec: CodeSpec;
  plan?: {
    steps: string[];
    estimatedEffort: string;
    risks: string[];
    files: {
      path: string;
      action: 'create' | 'modify' | 'delete';
      description: string;
    }[];
  };
  review?: {
    score: number;
    feedback: string[];
    improvements: string[];
  };
  suggestions?: string[];
}
