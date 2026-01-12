/**
 * Cache manager for cloned repositories
 */

import * as fs from 'fs';
import * as path from 'path';
import { getRepoHash, normalizeRepoUrl, getRepoName } from '../utils';
import { logger } from '../utils/logger';

export interface CacheInfo {
  repoUrl: string;
  repoName: string;
  localPath: string;
  lastUpdated: Date;
  commitCount: number;
}

export class CacheManager {
  private cacheDir: string;

  constructor(cacheDir: string) {
    this.cacheDir = cacheDir;
    this.ensureCacheDir();
  }

  private ensureCacheDir(): void {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
      logger.info('Created cache directory:', this.cacheDir);
    }
  }

  /**
   * Get local path for a repository
   */
  public getRepoPath(repoUrl: string): string {
    const normalized = normalizeRepoUrl(repoUrl);
    const hash = getRepoHash(normalized);
    return path.join(this.cacheDir, hash);
  }

  /**
   * Get database path for a repository
   */
  public getDbPath(repoUrl: string): string {
    const repoPath = this.getRepoPath(repoUrl);
    return path.join(repoPath, 'histtui.db');
  }

  /**
   * Check if repository is cached
   */
  public isCached(repoUrl: string): boolean {
    const repoPath = this.getRepoPath(repoUrl);
    return fs.existsSync(repoPath) && fs.existsSync(path.join(repoPath, '.git'));
  }

  /**
   * Check if repository is indexed
   */
  public isIndexed(repoUrl: string): boolean {
    const dbPath = this.getDbPath(repoUrl);
    return fs.existsSync(dbPath);
  }

  /**
   * Get cache info for a repository
   */
  public getCacheInfo(repoUrl: string): CacheInfo | null {
    const repoPath = this.getRepoPath(repoUrl);
    const infoPath = path.join(repoPath, 'cache-info.json');

    if (!fs.existsSync(infoPath)) {
      return null;
    }

    try {
      const data = fs.readFileSync(infoPath, 'utf-8');
      const info = JSON.parse(data);
      return {
        ...info,
        lastUpdated: new Date(info.lastUpdated),
      };
    } catch (error) {
      logger.error('Failed to read cache info:', error);
      return null;
    }
  }

  /**
   * Save cache info for a repository
   */
  public saveCacheInfo(repoUrl: string, info: Omit<CacheInfo, 'localPath'>): void {
    const repoPath = this.getRepoPath(repoUrl);
    const infoPath = path.join(repoPath, 'cache-info.json');

    const fullInfo: CacheInfo = {
      ...info,
      localPath: repoPath,
    };

    try {
      fs.writeFileSync(infoPath, JSON.stringify(fullInfo, null, 2));
      logger.info('Saved cache info for', info.repoName);
    } catch (error) {
      logger.error('Failed to save cache info:', error);
    }
  }

  /**
   * List all cached repositories
   */
  public listCached(): CacheInfo[] {
    const cached: CacheInfo[] = [];

    if (!fs.existsSync(this.cacheDir)) {
      return cached;
    }

    const entries = fs.readdirSync(this.cacheDir);

    for (const entry of entries) {
      const repoPath = path.join(this.cacheDir, entry);
      const infoPath = path.join(repoPath, 'cache-info.json');

      if (fs.existsSync(infoPath)) {
        try {
          const data = fs.readFileSync(infoPath, 'utf-8');
          const info = JSON.parse(data);
          cached.push({
            ...info,
            lastUpdated: new Date(info.lastUpdated),
            localPath: repoPath,
          });
        } catch (error) {
          logger.error('Failed to read cache info for', entry, error);
        }
      }
    }

    return cached;
  }

  /**
   * Clear cache for a specific repository
   */
  public clearCache(repoUrl: string): void {
    const repoPath = this.getRepoPath(repoUrl);
    if (fs.existsSync(repoPath)) {
      fs.rmSync(repoPath, { recursive: true, force: true });
      logger.info('Cleared cache for', repoUrl);
    }
  }

  /**
   * Clear all cache
   */
  public clearAllCache(): void {
    if (fs.existsSync(this.cacheDir)) {
      fs.rmSync(this.cacheDir, { recursive: true, force: true });
      this.ensureCacheDir();
      logger.info('Cleared all cache');
    }
  }
}
