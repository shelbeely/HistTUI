/**
 * Git history indexer
 * Coordinates between GitClient and GitDatabase to index repository history
 */

import { GitClient } from '../git';
import { GitDatabase } from '../database';
import { Commit } from '../../types';
import { logger } from '../../utils/logger';
import { chunk } from '../../utils';

export interface IndexProgress {
  phase: 'cloning' | 'fetching-commits' | 'indexing-commits' | 'indexing-branches' | 'indexing-tags' | 'complete';
  message: string;
  progress?: number; // 0-100
  total?: number;
  current?: number;
}

export class GitIndexer {
  private gitClient: GitClient;
  private database: GitDatabase;
  private onProgress?: (progress: IndexProgress) => void;

  constructor(gitClient: GitClient, database: GitDatabase, onProgress?: (progress: IndexProgress) => void) {
    this.gitClient = gitClient;
    this.database = database;
    this.onProgress = onProgress;
  }

  /**
   * Index the entire repository
   */
  async indexAll(maxCommits?: number): Promise<void> {
    logger.info('Starting full repository index');

    try {
      // Check if already indexed
      const lastIndexed = this.database.getMetadata('last_indexed');
      if (lastIndexed) {
        logger.info('Repository already indexed. Updating...');
        await this.update();
        return;
      }

      // Index commits
      await this.indexCommits(maxCommits);

      // Index branches
      await this.indexBranches();

      // Index tags
      await this.indexTags();

      // Mark as indexed
      this.database.setMetadata('last_indexed', new Date().toISOString());
      this.database.setMetadata('commit_count', String(this.database.getCommitCount()));

      this.reportProgress({
        phase: 'complete',
        message: 'Indexing complete',
        progress: 100,
      });

      logger.info('Repository indexing complete');
    } catch (error) {
      logger.error('Failed to index repository:', error);
      throw error;
    }
  }

  /**
   * Update existing index
   */
  async update(): Promise<void> {
    logger.info('Updating repository index');

    try {
      // Update repository
      await this.gitClient.update(message => {
        this.reportProgress({
          phase: 'cloning',
          message,
        });
      });

      // Re-index commits (incremental)
      await this.indexCommits();

      // Update branches and tags
      await this.indexBranches();
      await this.indexTags();

      // Update metadata
      this.database.setMetadata('last_indexed', new Date().toISOString());
      this.database.setMetadata('commit_count', String(this.database.getCommitCount()));

      this.reportProgress({
        phase: 'complete',
        message: 'Update complete',
        progress: 100,
      });

      logger.info('Repository update complete');
    } catch (error) {
      logger.error('Failed to update repository:', error);
      throw error;
    }
  }

  /**
   * Index all commits
   */
  private async indexCommits(maxCommits?: number): Promise<void> {
    this.reportProgress({
      phase: 'fetching-commits',
      message: 'Fetching commits from repository...',
    });

    const commits = await this.gitClient.getAllCommits(maxCommits);
    
    logger.info(`Found ${commits.length} commits to index`);

    this.reportProgress({
      phase: 'indexing-commits',
      message: 'Indexing commits...',
      total: commits.length,
      current: 0,
      progress: 0,
    });

    // Index commits in batches for better performance
    const batchSize = 100;
    const batches = chunk(commits, batchSize);

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      
      // Insert commits
      this.database.insertCommits(batch);

      // Index file changes for each commit (this is expensive, so we do it selectively)
      // For now, we'll skip detailed file indexing during initial load to improve performance
      // File changes will be fetched on-demand when viewing commit details

      const progress = ((i + 1) / batches.length) * 100;
      this.reportProgress({
        phase: 'indexing-commits',
        message: `Indexed ${Math.min((i + 1) * batchSize, commits.length)} / ${commits.length} commits`,
        total: commits.length,
        current: Math.min((i + 1) * batchSize, commits.length),
        progress,
      });
    }

    logger.info('Commits indexed successfully');
  }

  /**
   * Index file changes for a specific commit (on-demand)
   */
  async indexCommitFiles(commitHash: string): Promise<void> {
    try {
      const { files } = await this.gitClient.getCommitDetail(commitHash);
      this.database.insertFileChanges(commitHash, files);

      // Update commit stats
      const commit = this.database.getCommit(commitHash);
      if (commit) {
        const filesChanged = files.length;
        const insertions = files.reduce((sum, f) => sum + f.additions, 0);
        const deletions = files.reduce((sum, f) => sum + f.deletions, 0);

        commit.filesChanged = filesChanged;
        commit.insertions = insertions;
        commit.deletions = deletions;

        this.database.insertCommits([commit]);
      }

      logger.debug('Indexed files for commit:', commitHash);
    } catch (error) {
      logger.error('Failed to index commit files:', error);
    }
  }

  /**
   * Index all branches
   */
  private async indexBranches(): Promise<void> {
    this.reportProgress({
      phase: 'indexing-branches',
      message: 'Indexing branches...',
    });

    const branches = await this.gitClient.getBranches();
    this.database.insertBranches(branches);

    logger.info('Branches indexed successfully');
  }

  /**
   * Index all tags
   */
  private async indexTags(): Promise<void> {
    this.reportProgress({
      phase: 'indexing-tags',
      message: 'Indexing tags...',
    });

    const tags = await this.gitClient.getTags();
    this.database.insertTags(tags);

    logger.info('Tags indexed successfully');
  }

  /**
   * Report progress
   */
  private reportProgress(progress: IndexProgress): void {
    this.onProgress?.(progress);
  }

  /**
   * Get indexing stats
   */
  getStats(): {
    commitCount: number;
    lastIndexed: string | null;
  } {
    return {
      commitCount: this.database.getCommitCount(),
      lastIndexed: this.database.getMetadata('last_indexed'),
    };
  }
}
