/**
 * Git operations for HistTUI
 * Handles cloning, updating, and reading git repository data
 */

import simpleGit, { SimpleGit, LogResult, DefaultLogFields } from 'simple-git';
import * as fs from 'fs';
import * as path from 'path';
import { Commit, Branch, Tag, FileChange } from '../../types';
import { logger } from '../../utils/logger';
import parseDiff from 'parse-diff';

export class GitClient {
  private git: SimpleGit;
  private repoPath: string;

  constructor(repoPath: string) {
    this.repoPath = repoPath;
    this.git = simpleGit(repoPath);
  }

  /**
   * Clone a repository to the specified path
   */
  static async clone(
    repoUrl: string,
    targetPath: string,
    onProgress?: (message: string) => void
  ): Promise<GitClient> {
    logger.info('Cloning repository:', repoUrl, 'to', targetPath);

    const git = simpleGit();

    // Clone with progress
    await git.clone(repoUrl, targetPath, [
      '--progress',
    ]);

    logger.info('Repository cloned successfully');
    onProgress?.('Clone completed');

    return new GitClient(targetPath);
  }

  /**
   * Update repository (fetch and pull)
   */
  async update(onProgress?: (message: string) => void): Promise<void> {
    logger.info('Updating repository');
    onProgress?.('Fetching updates...');

    try {
      await this.git.fetch(['--all', '--tags']);
      onProgress?.('Fetch completed');
    } catch (error) {
      logger.error('Failed to update repository:', error);
      throw error;
    }
  }

  /**
   * Get all commits from the repository
   */
  async getAllCommits(maxCount?: number): Promise<Commit[]> {
    logger.info('Fetching all commits');

    const options: any = {
      '--all': null,
      '--date-order': null,
      '--format': '%H%n%h%n%an%n%ae%n%aI%n%s%n%b%n%P%n%D%n---END---',
    };

    if (maxCount) {
      options['--max-count'] = maxCount;
    }

    const result = await this.git.raw(['log', ...this.formatOptions(options)]);
    return this.parseCommits(result);
  }

  /**
   * Get commits for a specific branch
   */
  async getCommitsByBranch(branch: string, maxCount?: number): Promise<Commit[]> {
    logger.info('Fetching commits for branch:', branch);

    const options: any = {
      '--date-order': null,
      '--format': '%H%n%h%n%an%n%ae%n%aI%n%s%n%b%n%P%n%D%n---END---',
    };

    if (maxCount) {
      options['--max-count'] = maxCount;
    }

    const result = await this.git.raw(['log', branch, ...this.formatOptions(options)]);
    return this.parseCommits(result);
  }

  /**
   * Get commit details including diff
   */
  async getCommitDetail(hash: string): Promise<{ commit: Commit; diff: string; files: FileChange[] }> {
    logger.info('Fetching commit detail:', hash);

    // Get commit info
    const commitInfo = await this.git.show([
      hash,
      '--format=%H%n%h%n%an%n%ae%n%aI%n%s%n%b%n%P%n%D',
      '--no-patch',
    ]);
    const commits = this.parseCommits(commitInfo + '\n---END---');
    const commit = commits[0];

    // Get diff
    const diff = await this.git.show([hash, '--format=', '--patch']);

    // Get file stats
    const stats = await this.git.show([hash, '--format=', '--numstat']);
    const files = this.parseFileStats(stats);

    return { commit, diff, files };
  }

  /**
   * Get all branches
   */
  async getBranches(): Promise<Branch[]> {
    logger.info('Fetching branches');

    const result = await this.git.branch(['-a', '-v']);
    const branches: Branch[] = [];

    for (const [name, info] of Object.entries(result.branches)) {
      branches.push({
        name: name.replace('remotes/', ''),
        commit: info.commit,
        current: info.current,
        remote: name.startsWith('remotes/'),
      });
    }

    return branches;
  }

  /**
   * Get all tags
   */
  async getTags(): Promise<Tag[]> {
    logger.info('Fetching tags');

    const result = await this.git.tags(['--format=%(refname:short)|%(objectname)|%(subject)|%(creatordate:iso)']);
    const tags: Tag[] = [];

    const lines = result.all as unknown as string[];
    for (const line of lines) {
      if (typeof line === 'string' && line.includes('|')) {
        const [name, commit, message, dateStr] = line.split('|');
        tags.push({
          name,
          commit,
          message: message || undefined,
          date: dateStr ? new Date(dateStr) : undefined,
        });
      }
    }

    return tags;
  }

  /**
   * Get file tree at a specific commit
   */
  async getFileTree(commitHash: string = 'HEAD'): Promise<string[]> {
    logger.info('Fetching file tree for commit:', commitHash);

    const result = await this.git.raw(['ls-tree', '-r', '--name-only', commitHash]);
    return result.split('\n').filter(line => line.trim() !== '');
  }

  /**
   * Get file content at a specific commit
   */
  async getFileContent(filePath: string, commitHash: string = 'HEAD'): Promise<string> {
    logger.info('Fetching file content:', filePath, 'at', commitHash);

    try {
      const content = await this.git.show([`${commitHash}:${filePath}`]);
      return content;
    } catch (error) {
      logger.error('Failed to get file content:', error);
      throw new Error(`File not found: ${filePath}`);
    }
  }

  /**
   * Get commits that modified a specific file
   */
  async getFileHistory(filePath: string, maxCount?: number): Promise<Commit[]> {
    logger.info('Fetching file history:', filePath);

    const options: any = {
      '--format': '%H%n%h%n%an%n%ae%n%aI%n%s%n%b%n%P%n%D%n---END---',
      '--follow': null, // Follow file renames
    };

    if (maxCount) {
      options['--max-count'] = maxCount;
    }

    const result = await this.git.raw(['log', ...this.formatOptions(options), '--', filePath]);
    return this.parseCommits(result);
  }

  /**
   * Parse commits from git log output
   */
  private parseCommits(output: string): Commit[] {
    const commits: Commit[] = [];
    const entries = output.split('---END---').filter(e => e.trim());

    for (const entry of entries) {
      const lines = entry.trim().split('\n');
      if (lines.length < 9) continue;

      const [hash, shortHash, author, authorEmail, dateStr, subject, ...rest] = lines;
      
      // Extract body (everything between subject and parents)
      const bodyEndIndex = rest.length - 2;
      const body = rest.slice(0, bodyEndIndex).join('\n').trim();
      
      const parents = rest[bodyEndIndex]?.split(' ').filter(p => p.trim()) || [];
      const refs = rest[bodyEndIndex + 1]?.split(',').map(r => r.trim()).filter(r => r) || [];

      commits.push({
        hash: hash.trim(),
        shortHash: shortHash.trim(),
        author: author.trim(),
        authorEmail: authorEmail.trim(),
        date: new Date(dateStr.trim()),
        message: (subject + '\n' + body).trim(),
        subject: subject.trim(),
        body: body,
        parents,
        refs,
        filesChanged: 0,
        insertions: 0,
        deletions: 0,
      });
    }

    return commits;
  }

  /**
   * Parse file stats from git show --numstat
   */
  private parseFileStats(output: string): FileChange[] {
    const files: FileChange[] = [];
    const lines = output.trim().split('\n');

    for (const line of lines) {
      if (!line.trim()) continue;
      
      const parts = line.split('\t');
      if (parts.length < 3) continue;

      const [addStr, delStr, ...pathParts] = parts;
      const path = pathParts.join('\t'); // Handle tabs in filename

      const additions = addStr === '-' ? 0 : parseInt(addStr, 10);
      const deletions = delStr === '-' ? 0 : parseInt(delStr, 10);
      const binary = addStr === '-' && delStr === '-';

      let status: FileChange['status'] = 'modified';
      let oldPath: string | undefined;

      if (path.includes('=>')) {
        status = 'renamed';
        const match = path.match(/(.+)\{(.+) => (.+)\}(.+)/);
        if (match) {
          oldPath = match[1] + match[2] + match[4];
        }
      }

      files.push({
        path,
        oldPath,
        status,
        additions,
        deletions,
        binary,
      });
    }

    return files;
  }

  /**
   * Format options object for git commands
   */
  private formatOptions(options: Record<string, any>): string[] {
    const args: string[] = [];
    for (const [key, value] of Object.entries(options)) {
      if (value !== null) {
        // For --format option, combine with = to avoid ambiguity
        if (key === '--format') {
          args.push(`${key}=${value}`);
        } else {
          args.push(key);
          args.push(String(value));
        }
      } else {
        args.push(key);
      }
    }
    return args;
  }

  /**
   * Get repository statistics
   */
  async getStats(): Promise<{
    totalCommits: number;
    branches: number;
    tags: number;
    contributors: number;
  }> {
    const [commits, branches, tags] = await Promise.all([
      this.getAllCommits(),
      this.getBranches(),
      this.getTags(),
    ]);

    const contributors = new Set(commits.map(c => c.authorEmail)).size;

    return {
      totalCommits: commits.length,
      branches: branches.length,
      tags: tags.length,
      contributors,
    };
  }
}
