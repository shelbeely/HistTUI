/**
 * Spec Storage Manager
 * Manages code specifications for projects
 */

import * as fs from 'fs';
import * as path from 'path';
import { CodeSpec } from '../../types/code-planner';
import { getRepoHash, normalizeRepoUrl } from '../../utils';
import { logger } from '../../utils/logger';

export class SpecStorage {
  private contextDir: string;

  constructor(cacheDir: string) {
    // Store specs in ~/.histtui/projects/
    this.contextDir = path.join(path.dirname(cacheDir), 'projects');
  }

  /**
   * Get specs directory for a repository
   */
  private getSpecsDir(repoUrl: string): string {
    const normalized = normalizeRepoUrl(repoUrl);
    const hash = getRepoHash(normalized);
    return path.join(this.contextDir, hash, 'specs');
  }

  /**
   * Get spec file path
   */
  private getSpecPath(repoUrl: string, specId: string): string {
    const specsDir = this.getSpecsDir(repoUrl);
    return path.join(specsDir, `${specId}.json`);
  }

  /**
   * Load all specs for a repository
   */
  public loadSpecs(repoUrl: string): CodeSpec[] {
    const specsDir = this.getSpecsDir(repoUrl);
    
    if (!fs.existsSync(specsDir)) {
      return [];
    }

    const specs: CodeSpec[] = [];
    const files = fs.readdirSync(specsDir);

    for (const file of files) {
      if (file.endsWith('.json')) {
        try {
          const data = fs.readFileSync(path.join(specsDir, file), 'utf-8');
          const spec = JSON.parse(data) as CodeSpec;
          specs.push(spec);
        } catch (error) {
          logger.error(`Failed to load spec ${file}:`, error);
        }
      }
    }

    // Sort by updated time (newest first)
    specs.sort((a, b) => b.updatedAt - a.updatedAt);

    return specs;
  }

  /**
   * Load a single spec
   */
  public loadSpec(repoUrl: string, specId: string): CodeSpec | null {
    const specPath = this.getSpecPath(repoUrl, specId);
    
    if (!fs.existsSync(specPath)) {
      return null;
    }

    try {
      const data = fs.readFileSync(specPath, 'utf-8');
      return JSON.parse(data) as CodeSpec;
    } catch (error) {
      logger.error('Failed to load spec:', error);
      return null;
    }
  }

  /**
   * Save a spec
   */
  public saveSpec(repoUrl: string, spec: CodeSpec): void {
    const specsDir = this.getSpecsDir(repoUrl);
    
    // Ensure specs directory exists
    if (!fs.existsSync(specsDir)) {
      fs.mkdirSync(specsDir, { recursive: true });
    }

    const specPath = this.getSpecPath(repoUrl, spec.id);
    
    try {
      // Update timestamp
      spec.updatedAt = Date.now();
      
      // Write to file
      fs.writeFileSync(specPath, JSON.stringify(spec, null, 2), 'utf-8');
      logger.info('Saved spec:', spec.title);
    } catch (error) {
      logger.error('Failed to save spec:', error);
      throw error;
    }
  }

  /**
   * Delete a spec
   */
  public deleteSpec(repoUrl: string, specId: string): void {
    const specPath = this.getSpecPath(repoUrl, specId);
    
    if (fs.existsSync(specPath)) {
      fs.unlinkSync(specPath);
      logger.info('Deleted spec:', specId);
    }
  }

  /**
   * Create a new spec
   */
  public createSpec(title: string, templateId?: string): CodeSpec {
    const now = Date.now();
    
    return {
      id: `spec-${now}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      description: '',
      status: 'draft',
      priority: 'medium',
      createdAt: now,
      updatedAt: now,
      tags: [],
      context: {
        problem: '',
        requirements: [],
        constraints: [],
        acceptanceCriteria: [],
      },
      templateId,
    };
  }

  /**
   * Update spec status
   */
  public updateSpecStatus(repoUrl: string, specId: string, status: CodeSpec['status']): void {
    const spec = this.loadSpec(repoUrl, specId);
    
    if (spec) {
      spec.status = status;
      this.saveSpec(repoUrl, spec);
    }
  }

  /**
   * Get specs by status
   */
  public getSpecsByStatus(repoUrl: string, status: CodeSpec['status']): CodeSpec[] {
    const specs = this.loadSpecs(repoUrl);
    return specs.filter(spec => spec.status === status);
  }

  /**
   * Get specs by tag
   */
  public getSpecsByTag(repoUrl: string, tag: string): CodeSpec[] {
    const specs = this.loadSpecs(repoUrl);
    return specs.filter(spec => spec.tags.includes(tag));
  }

  /**
   * Search specs
   */
  public searchSpecs(repoUrl: string, query: string): CodeSpec[] {
    const specs = this.loadSpecs(repoUrl);
    const lowerQuery = query.toLowerCase();
    
    return specs.filter(spec => 
      spec.title.toLowerCase().includes(lowerQuery) ||
      spec.description.toLowerCase().includes(lowerQuery) ||
      spec.context.problem.toLowerCase().includes(lowerQuery)
    );
  }
}
