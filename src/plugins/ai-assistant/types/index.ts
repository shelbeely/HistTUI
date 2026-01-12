/**
 * Type definitions for AI Assistant Plugin
 */

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  model?: string;
  tokens?: number;
}

export interface AIProvider {
  name: string;
  baseURL?: string;
  apiKey?: string;
  models: string[];
}

export interface AIConfig {
  provider: 'openai' | 'anthropic' | 'openrouter' | 'ollama';
  model: string;
  apiKey?: string;
  baseURL?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  worktree?: string;
  branch?: string;
  commits?: string[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  assignee?: string;
  tags?: string[];
}

export interface WorktreeInfo {
  id: string;
  path: string;
  branch: string;
  commit: string;
  taskId?: string;
  createdAt: Date;
}

export interface FileOperation {
  type: 'read' | 'write' | 'delete' | 'move' | 'copy';
  path: string;
  content?: string;
  newPath?: string;
  success: boolean;
  error?: string;
}

export interface CommandResult {
  command: string;
  stdout: string;
  stderr: string;
  exitCode: number;
  duration: number;
  timestamp: Date;
}

export interface AITool {
  name: string;
  description: string;
  parameters: Record<string, any>;
  execute: (params: any) => Promise<any>;
}

export interface ConversationContext {
  repoPath: string;
  currentBranch: string;
  recentCommits: any[];
  modifiedFiles: string[];
  taskContext?: Task;
}
