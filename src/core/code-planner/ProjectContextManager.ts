/**
 * Project Context Manager
 * Stores and manages project-specific context for agent-driven development
 */

import * as fs from 'fs';
import * as path from 'path';
import { ProjectContext } from '../../types/code-planner';
import { getRepoHash, normalizeRepoUrl, getRepoName } from '../../utils';
import { logger } from '../../utils/logger';

export class ProjectContextManager {
  private contextDir: string;

  constructor(cacheDir: string) {
    // Store contexts in ~/.histtui/projects/
    this.contextDir = path.join(path.dirname(cacheDir), 'projects');
    this.ensureContextDir();
  }

  private ensureContextDir(): void {
    if (!fs.existsSync(this.contextDir)) {
      fs.mkdirSync(this.contextDir, { recursive: true });
      logger.info('Created projects context directory:', this.contextDir);
    }
  }

  /**
   * Get project directory for a repository
   */
  private getProjectDir(repoUrl: string): string {
    const normalized = normalizeRepoUrl(repoUrl);
    const hash = getRepoHash(normalized);
    return path.join(this.contextDir, hash);
  }

  /**
   * Get context file path for a repository
   */
  private getContextPath(repoUrl: string): string {
    const projectDir = this.getProjectDir(repoUrl);
    return path.join(projectDir, 'context.json');
  }

  /**
   * Load project context for a repository
   */
  public loadContext(repoUrl: string): ProjectContext | null {
    const contextPath = this.getContextPath(repoUrl);
    
    if (!fs.existsSync(contextPath)) {
      logger.debug('No context found for repository:', repoUrl);
      return null;
    }

    try {
      const data = fs.readFileSync(contextPath, 'utf-8');
      const context = JSON.parse(data) as ProjectContext;
      logger.info('Loaded project context for:', context.repoName);
      return context;
    } catch (error) {
      logger.error('Failed to load project context:', error);
      return null;
    }
  }

  /**
   * Save project context for a repository
   */
  public saveContext(context: ProjectContext): void {
    const projectDir = this.getProjectDir(context.repoUrl);
    
    // Ensure project directory exists
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true });
    }

    const contextPath = this.getContextPath(context.repoUrl);
    
    try {
      // Update metadata
      context.metadata.updatedAt = Date.now();
      
      // Write to file
      fs.writeFileSync(contextPath, JSON.stringify(context, null, 2), 'utf-8');
      logger.info('Saved project context for:', context.repoName);
    } catch (error) {
      logger.error('Failed to save project context:', error);
      throw error;
    }
  }

  /**
   * Create new project context
   */
  public createContext(repoUrl: string): ProjectContext {
    const normalized = normalizeRepoUrl(repoUrl);
    const hash = getRepoHash(normalized);
    const name = getRepoName(repoUrl);

    const context: ProjectContext = {
      repoHash: hash,
      repoUrl: normalized,
      repoName: name,
      techStack: {
        languages: [],
        frameworks: [],
        tools: [],
      },
      styleGuide: {},
      productGoals: {
        vision: '',
        objectives: [],
      },
      architecture: {
        patterns: [],
        layers: [],
      },
      team: {
        roles: [],
      },
      metadata: {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        version: '1.0.0',
      },
    };

    return context;
  }

  /**
   * Check if context exists for a repository
   */
  public hasContext(repoUrl: string): boolean {
    const contextPath = this.getContextPath(repoUrl);
    return fs.existsSync(contextPath);
  }

  /**
   * Delete project context
   */
  public deleteContext(repoUrl: string): void {
    const projectDir = this.getProjectDir(repoUrl);
    
    if (fs.existsSync(projectDir)) {
      fs.rmSync(projectDir, { recursive: true, force: true });
      logger.info('Deleted project context for:', repoUrl);
    }
  }

  /**
   * List all projects with context
   */
  public listProjects(): ProjectContext[] {
    const projects: ProjectContext[] = [];

    if (!fs.existsSync(this.contextDir)) {
      return projects;
    }

    const dirs = fs.readdirSync(this.contextDir);
    
    for (const dir of dirs) {
      const contextPath = path.join(this.contextDir, dir, 'context.json');
      
      if (fs.existsSync(contextPath)) {
        try {
          const data = fs.readFileSync(contextPath, 'utf-8');
          const context = JSON.parse(data) as ProjectContext;
          projects.push(context);
        } catch (error) {
          logger.error(`Failed to load context for ${dir}:`, error);
        }
      }
    }

    return projects;
  }
}
