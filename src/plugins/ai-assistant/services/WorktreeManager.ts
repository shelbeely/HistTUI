/**
 * Worktree Manager - Isolated git worktree operations
 * Inspired by vibe-kanban's worktree isolation for safe AI-assisted changes
 * 
 * Each task gets its own git worktree, allowing parallel work without conflicts
 */

import { execa } from 'execa';
import * as path from 'path';
import * as fs from 'fs';
import type { WorktreeInfo } from '../types/index.js';
import { logger } from '../../../utils/logger.js';

export class WorktreeManager {
  private gitClient: any;
  private worktrees: Map<string, WorktreeInfo> = new Map();
  private baseWorktreeDir: string;

  constructor(gitClient: any) {
    this.gitClient = gitClient;
    // Store worktrees in .histtui/worktrees/
    this.baseWorktreeDir = path.join(process.env.HOME || '~', '.histtui', 'worktrees');
    this.ensureWorktreeDir();
  }

  private ensureWorktreeDir(): void {
    if (!fs.existsSync(this.baseWorktreeDir)) {
      fs.mkdirSync(this.baseWorktreeDir, { recursive: true });
    }
  }

  /**
   * Create a new worktree for a task
   */
  async createWorktree(taskId: string, branchName: string, baseBranch = 'main'): Promise<WorktreeInfo> {
    try {
      const worktreePath = path.join(this.baseWorktreeDir, taskId);

      // Remove existing worktree if it exists
      if (fs.existsSync(worktreePath)) {
        await this.removeWorktree(taskId);
      }

      // Get repository root
      const repoRoot = await this.gitClient.revparse(['--show-toplevel']);

      // Create new worktree
      await execa('git', ['worktree', 'add', '-b', branchName, worktreePath, baseBranch], {
        cwd: repoRoot,
      });

      // Get current commit
      const { stdout: commit } = await execa('git', ['rev-parse', 'HEAD'], {
        cwd: worktreePath,
      });

      const worktreeInfo: WorktreeInfo = {
        id: taskId,
        path: worktreePath,
        branch: branchName,
        commit: commit.trim(),
        taskId,
        createdAt: new Date(),
      };

      this.worktrees.set(taskId, worktreeInfo);
      logger.info(`Created worktree for task ${taskId} at ${worktreePath}`);

      return worktreeInfo;
    } catch (error) {
      logger.error(`Failed to create worktree for task ${taskId}:`, error);
      throw error;
    }
  }

  /**
   * Get worktree info for a task
   */
  getWorktree(taskId: string): WorktreeInfo | undefined {
    return this.worktrees.get(taskId);
  }

  /**
   * List all worktrees
   */
  async listWorktrees(): Promise<WorktreeInfo[]> {
    try {
      const repoRoot = await this.gitClient.revparse(['--show-toplevel']);
      const { stdout } = await execa('git', ['worktree', 'list', '--porcelain'], {
        cwd: repoRoot,
      });

      // Parse worktree list
      const lines = stdout.split('\n');
      const worktrees: WorktreeInfo[] = [];
      let current: Partial<WorktreeInfo> = {};

      for (const line of lines) {
        if (line.startsWith('worktree ')) {
          const worktreePath = line.substring(9);
          current.path = worktreePath;
        } else if (line.startsWith('branch ')) {
          current.branch = line.substring(7);
        } else if (line.startsWith('HEAD ')) {
          current.commit = line.substring(5);
        } else if (line === '') {
          if (current.path) {
            const taskId = path.basename(current.path!);
            worktrees.push({
              id: taskId,
              path: current.path!,
              branch: current.branch || 'detached',
              commit: current.commit || '',
              taskId,
              createdAt: new Date(),
            });
          }
          current = {};
        }
      }

      return worktrees;
    } catch (error) {
      logger.error('Failed to list worktrees:', error);
      return [];
    }
  }

  /**
   * Remove a worktree
   */
  async removeWorktree(taskId: string): Promise<void> {
    try {
      const worktree = this.worktrees.get(taskId);
      if (!worktree) {
        logger.warn(`Worktree for task ${taskId} not found`);
        return;
      }

      const repoRoot = await this.gitClient.revparse(['--show-toplevel']);

      // Remove worktree
      await execa('git', ['worktree', 'remove', worktree.path, '--force'], {
        cwd: repoRoot,
      });

      this.worktrees.delete(taskId);
      logger.info(`Removed worktree for task ${taskId}`);
    } catch (error) {
      logger.error(`Failed to remove worktree for task ${taskId}:`, error);
      throw error;
    }
  }

  /**
   * Execute a command in a worktree
   */
  async executeInWorktree(taskId: string, command: string, args: string[] = []): Promise<any> {
    const worktree = this.worktrees.get(taskId);
    if (!worktree) {
      throw new Error(`Worktree for task ${taskId} not found`);
    }

    try {
      const result = await execa(command, args, {
        cwd: worktree.path,
      });

      return {
        stdout: result.stdout,
        stderr: result.stderr,
        exitCode: result.exitCode || 0,
      };
    } catch (error: any) {
      return {
        stdout: error.stdout || '',
        stderr: error.stderr || error.message,
        exitCode: error.exitCode || 1,
      };
    }
  }

  /**
   * Cleanup all worktrees
   */
  async cleanup(): Promise<void> {
    logger.info('Cleaning up all worktrees');
    
    for (const taskId of this.worktrees.keys()) {
      try {
        await this.removeWorktree(taskId);
      } catch (error) {
        logger.error(`Failed to cleanup worktree ${taskId}:`, error);
      }
    }

    this.worktrees.clear();
  }

  /**
   * Get worktree path for a task
   */
  getWorktreePath(taskId: string): string | undefined {
    return this.worktrees.get(taskId)?.path;
  }

  /**
   * Check if worktree exists for a task
   */
  hasWorktree(taskId: string): boolean {
    return this.worktrees.has(taskId);
  }
}
