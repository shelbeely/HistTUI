/**
 * File Operations - Safe file reading/writing with controls
 * Provides controlled file access for AI operations
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import type { FileOperation } from '../types/index.js';
import { logger } from '../../../utils/logger.js';

export class FileOperations {
  private gitClient: any;
  private allowedPatterns: RegExp[] = [
    /\.(ts|tsx|js|jsx|json|md|txt|yaml|yml|toml)$/i, // Common text files
  ];
  private deniedPatterns: RegExp[] = [
    /node_modules/,
    /\.git\//,
    /dist\//,
    /build\//,
    /\.env/,
  ];

  constructor(gitClient: any) {
    this.gitClient = gitClient;
  }

  /**
   * Read a file
   */
  async readFile(filePath: string, basePath?: string): Promise<FileOperation> {
    try {
      const fullPath = basePath ? path.join(basePath, filePath) : filePath;

      // Security check
      if (!this.isAllowedPath(filePath)) {
        return {
          type: 'read',
          path: filePath,
          success: false,
          error: 'File path not allowed',
        };
      }

      const content = await fs.readFile(fullPath, 'utf-8');

      logger.debug(`Read file: ${filePath}`);

      return {
        type: 'read',
        path: filePath,
        content,
        success: true,
      };
    } catch (error: any) {
      logger.error(`Failed to read file ${filePath}:`, error);
      return {
        type: 'read',
        path: filePath,
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Write a file
   */
  async writeFile(filePath: string, content: string, basePath?: string): Promise<FileOperation> {
    try {
      const fullPath = basePath ? path.join(basePath, filePath) : filePath;

      // Security check
      if (!this.isAllowedPath(filePath)) {
        return {
          type: 'write',
          path: filePath,
          success: false,
          error: 'File path not allowed',
        };
      }

      // Ensure directory exists
      const dir = path.dirname(fullPath);
      await fs.mkdir(dir, { recursive: true });

      await fs.writeFile(fullPath, content, 'utf-8');

      logger.info(`Wrote file: ${filePath}`);

      return {
        type: 'write',
        path: filePath,
        content,
        success: true,
      };
    } catch (error: any) {
      logger.error(`Failed to write file ${filePath}:`, error);
      return {
        type: 'write',
        path: filePath,
        content,
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Delete a file
   */
  async deleteFile(filePath: string, basePath?: string): Promise<FileOperation> {
    try {
      const fullPath = basePath ? path.join(basePath, filePath) : filePath;

      // Security check
      if (!this.isAllowedPath(filePath)) {
        return {
          type: 'delete',
          path: filePath,
          success: false,
          error: 'File path not allowed',
        };
      }

      await fs.unlink(fullPath);

      logger.info(`Deleted file: ${filePath}`);

      return {
        type: 'delete',
        path: filePath,
        success: true,
      };
    } catch (error: any) {
      logger.error(`Failed to delete file ${filePath}:`, error);
      return {
        type: 'delete',
        path: filePath,
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Move/rename a file
   */
  async moveFile(filePath: string, newPath: string, basePath?: string): Promise<FileOperation> {
    try {
      const fullPath = basePath ? path.join(basePath, filePath) : filePath;
      const fullNewPath = basePath ? path.join(basePath, newPath) : newPath;

      // Security check
      if (!this.isAllowedPath(filePath) || !this.isAllowedPath(newPath)) {
        return {
          type: 'move',
          path: filePath,
          newPath,
          success: false,
          error: 'File path not allowed',
        };
      }

      // Ensure target directory exists
      const dir = path.dirname(fullNewPath);
      await fs.mkdir(dir, { recursive: true });

      await fs.rename(fullPath, fullNewPath);

      logger.info(`Moved file: ${filePath} -> ${newPath}`);

      return {
        type: 'move',
        path: filePath,
        newPath,
        success: true,
      };
    } catch (error: any) {
      logger.error(`Failed to move file ${filePath} to ${newPath}:`, error);
      return {
        type: 'move',
        path: filePath,
        newPath,
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * List files in a directory
   */
  async listFiles(dirPath: string, basePath?: string): Promise<string[]> {
    try {
      const fullPath = basePath ? path.join(basePath, dirPath) : dirPath;
      const entries = await fs.readdir(fullPath, { withFileTypes: true });

      const files: string[] = [];

      for (const entry of entries) {
        const entryPath = path.join(dirPath, entry.name);
        
        if (this.isAllowedPath(entryPath)) {
          if (entry.isDirectory()) {
            // Recursively list subdirectory
            const subFiles = await this.listFiles(entryPath, basePath);
            files.push(...subFiles);
          } else {
            files.push(entryPath);
          }
        }
      }

      return files;
    } catch (error: any) {
      logger.error(`Failed to list files in ${dirPath}:`, error);
      return [];
    }
  }

  /**
   * Check if a file path is allowed
   */
  private isAllowedPath(filePath: string): boolean {
    // Check denied patterns first
    for (const pattern of this.deniedPatterns) {
      if (pattern.test(filePath)) {
        logger.warn(`File path denied: ${filePath}`);
        return false;
      }
    }

    // Check allowed patterns
    for (const pattern of this.allowedPatterns) {
      if (pattern.test(filePath)) {
        return true;
      }
    }

    // If no pattern matched, deny by default
    logger.warn(`File path not in allowed patterns: ${filePath}`);
    return false;
  }

  /**
   * Add an allowed file pattern
   */
  addAllowedPattern(pattern: RegExp): void {
    this.allowedPatterns.push(pattern);
    logger.info('Added allowed pattern:', pattern);
  }

  /**
   * Add a denied file pattern
   */
  addDeniedPattern(pattern: RegExp): void {
    this.deniedPatterns.push(pattern);
    logger.info('Added denied pattern:', pattern);
  }

  /**
   * Get file stats
   */
  async getFileStats(filePath: string, basePath?: string): Promise<any> {
    try {
      const fullPath = basePath ? path.join(basePath, filePath) : filePath;
      const stats = await fs.stat(fullPath);

      return {
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        isDirectory: stats.isDirectory(),
        isFile: stats.isFile(),
      };
    } catch (error: any) {
      logger.error(`Failed to get stats for ${filePath}:`, error);
      return null;
    }
  }
}
