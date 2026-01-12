/**
 * Task Manager - Kanban-style task management integrated with AI
 * Inspired by vibe-kanban's task orchestration
 */

import { nanoid } from 'nanoid';
import type { Task } from '../types/index.js';
import { logger } from '../../../utils/logger.js';

export class TaskManager {
  private database: any;
  private tasks: Map<string, Task> = new Map();

  constructor(database: any) {
    this.database = database;
    this.initializeDatabase();
    this.loadTasks();
  }

  /**
   * Initialize database tables for tasks
   */
  private initializeDatabase(): void {
    this.database.exec(`
      CREATE TABLE IF NOT EXISTS ai_tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        status TEXT NOT NULL,
        priority TEXT NOT NULL,
        worktree TEXT,
        branch TEXT,
        commits TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        completed_at INTEGER,
        assignee TEXT,
        tags TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_ai_tasks_status ON ai_tasks(status);
      CREATE INDEX IF NOT EXISTS idx_ai_tasks_priority ON ai_tasks(priority);
      CREATE INDEX IF NOT EXISTS idx_ai_tasks_created ON ai_tasks(created_at);
    `);
  }

  /**
   * Load tasks from database
   */
  private loadTasks(): void {
    const stmt = this.database.prepare('SELECT * FROM ai_tasks');
    const rows = stmt.all();

    for (const row of rows) {
      const task: Task = {
        id: row.id,
        title: row.title,
        description: row.description,
        status: row.status,
        priority: row.priority,
        worktree: row.worktree,
        branch: row.branch,
        commits: row.commits ? JSON.parse(row.commits) : undefined,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
        completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
        assignee: row.assignee,
        tags: row.tags ? JSON.parse(row.tags) : undefined,
      };

      this.tasks.set(task.id, task);
    }

    logger.info(`Loaded ${this.tasks.size} tasks from database`);
  }

  /**
   * Create a new task
   */
  async createTask(params: {
    title: string;
    description: string;
    priority?: Task['priority'];
    assignee?: string;
    tags?: string[];
  }): Promise<Task> {
    const task: Task = {
      id: nanoid(),
      title: params.title,
      description: params.description,
      status: 'todo',
      priority: params.priority || 'medium',
      createdAt: new Date(),
      updatedAt: new Date(),
      assignee: params.assignee,
      tags: params.tags,
    };

    // Save to database
    const stmt = this.database.prepare(`
      INSERT INTO ai_tasks (
        id, title, description, status, priority,
        created_at, updated_at, assignee, tags
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      task.id,
      task.title,
      task.description,
      task.status,
      task.priority,
      task.createdAt.getTime(),
      task.updatedAt.getTime(),
      task.assignee || null,
      task.tags ? JSON.stringify(task.tags) : null
    );

    this.tasks.set(task.id, task);
    logger.info(`Created task: ${task.title} (${task.id})`);

    return task;
  }

  /**
   * Update a task
   */
  async updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
    const task = this.tasks.get(id);
    if (!task) {
      logger.warn(`Task not found: ${id}`);
      return null;
    }

    const updatedTask: Task = {
      ...task,
      ...updates,
      updatedAt: new Date(),
    };

    // If status changed to done, set completed_at
    if (updates.status === 'done' && task.status !== 'done') {
      updatedTask.completedAt = new Date();
    }

    // Save to database
    const stmt = this.database.prepare(`
      UPDATE ai_tasks SET
        title = ?, description = ?, status = ?, priority = ?,
        worktree = ?, branch = ?, commits = ?,
        updated_at = ?, completed_at = ?, assignee = ?, tags = ?
      WHERE id = ?
    `);

    stmt.run(
      updatedTask.title,
      updatedTask.description,
      updatedTask.status,
      updatedTask.priority,
      updatedTask.worktree || null,
      updatedTask.branch || null,
      updatedTask.commits ? JSON.stringify(updatedTask.commits) : null,
      updatedTask.updatedAt.getTime(),
      updatedTask.completedAt?.getTime() || null,
      updatedTask.assignee || null,
      updatedTask.tags ? JSON.stringify(updatedTask.tags) : null,
      id
    );

    this.tasks.set(id, updatedTask);
    logger.info(`Updated task: ${updatedTask.title} (${id})`);

    return updatedTask;
  }

  /**
   * Delete a task
   */
  async deleteTask(id: string): Promise<boolean> {
    const task = this.tasks.get(id);
    if (!task) {
      logger.warn(`Task not found: ${id}`);
      return false;
    }

    const stmt = this.database.prepare('DELETE FROM ai_tasks WHERE id = ?');
    stmt.run(id);

    this.tasks.delete(id);
    logger.info(`Deleted task: ${id}`);

    return true;
  }

  /**
   * Get a task by ID
   */
  getTask(id: string): Task | undefined {
    return this.tasks.get(id);
  }

  /**
   * Get all tasks
   */
  getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  /**
   * Get tasks by status
   */
  getTasksByStatus(status: Task['status']): Task[] {
    return Array.from(this.tasks.values()).filter(task => task.status === status);
  }

  /**
   * Get tasks by priority
   */
  getTasksByPriority(priority: Task['priority']): Task[] {
    return Array.from(this.tasks.values()).filter(task => task.priority === priority);
  }

  /**
   * Get tasks by assignee
   */
  getTasksByAssignee(assignee: string): Task[] {
    return Array.from(this.tasks.values()).filter(task => task.assignee === assignee);
  }

  /**
   * Search tasks by title or description
   */
  searchTasks(query: string): Task[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.tasks.values()).filter(
      task =>
        task.title.toLowerCase().includes(lowerQuery) ||
        task.description.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get task statistics
   */
  getStatistics(): {
    total: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
    completed: number;
  } {
    const stats = {
      total: this.tasks.size,
      byStatus: { todo: 0, 'in-progress': 0, review: 0, done: 0, blocked: 0 },
      byPriority: { low: 0, medium: 0, high: 0, critical: 0 },
      completed: 0,
    };

    for (const task of this.tasks.values()) {
      stats.byStatus[task.status]++;
      stats.byPriority[task.priority]++;
      if (task.status === 'done') {
        stats.completed++;
      }
    }

    return stats;
  }

  /**
   * Assign worktree to task
   */
  async assignWorktree(taskId: string, worktreePath: string, branch: string): Promise<void> {
    await this.updateTask(taskId, {
      worktree: worktreePath,
      branch,
      status: 'in-progress',
    });
  }

  /**
   * Add commit to task
   */
  async addCommit(taskId: string, commitHash: string): Promise<void> {
    const task = this.tasks.get(taskId);
    if (!task) return;

    const commits = task.commits || [];
    if (!commits.includes(commitHash)) {
      commits.push(commitHash);
      await this.updateTask(taskId, { commits });
    }
  }
}
