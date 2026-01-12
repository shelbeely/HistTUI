/**
 * Utility functions for HistTUI
 */

import * as crypto from 'crypto';
import { format, formatDistance } from 'date-fns';

/**
 * Generate a hash for a repository URL to use as cache key
 */
export function getRepoHash(repoUrl: string): string {
  return crypto.createHash('md5').update(repoUrl).digest('hex').substring(0, 12);
}

/**
 * Normalize repository URL
 */
export function normalizeRepoUrl(url: string): string {
  // Remove trailing slashes and .git extensions
  return url.replace(/\.git$/, '').replace(/\/$/, '');
}

/**
 * Extract repository name from URL
 */
export function getRepoName(url: string): string {
  const normalized = normalizeRepoUrl(url);
  const parts = normalized.split('/');
  return parts[parts.length - 1] || 'unknown';
}

/**
 * Format date for display
 */
export function formatDate(date: Date, short: boolean = false): string {
  if (short) {
    return format(date, 'yyyy-MM-dd');
  }
  return format(date, 'yyyy-MM-dd HH:mm:ss');
}

/**
 * Format date as relative time
 */
export function formatRelativeTime(date: Date): string {
  return formatDistance(date, new Date(), { addSuffix: true });
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Format number with thousands separator
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * Parse git show output to extract file changes
 */
export function parseGitDiff(diff: string): Array<{ file: string; additions: number; deletions: number }> {
  const files: Array<{ file: string; additions: number; deletions: number }> = [];
  const lines = diff.split('\n');
  
  let currentFile = '';
  let additions = 0;
  let deletions = 0;

  for (const line of lines) {
    if (line.startsWith('diff --git')) {
      if (currentFile) {
        files.push({ file: currentFile, additions, deletions });
      }
      const match = line.match(/b\/(.+)$/);
      currentFile = match ? match[1] : '';
      additions = 0;
      deletions = 0;
    } else if (line.startsWith('+') && !line.startsWith('+++')) {
      additions++;
    } else if (line.startsWith('-') && !line.startsWith('---')) {
      deletions++;
    }
  }

  if (currentFile) {
    files.push({ file: currentFile, additions, deletions });
  }

  return files;
}

/**
 * Check if a key matches any of the key bindings
 */
export function matchesKey(input: string, bindings: string[]): boolean {
  return bindings.some(binding => {
    if (binding.includes('+')) {
      // Handle modifier keys like ctrl+c
      return input === binding;
    }
    return input === binding || input.toLowerCase() === binding.toLowerCase();
  });
}

/**
 * Calculate percentage
 */
export function percentage(part: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
}

/**
 * Calculate bus factor (minimum number of people who own 50% of the code)
 */
export function calculateBusFactor(owners: Array<{ author: string; lines: number }>): number {
  const total = owners.reduce((sum, o) => sum + o.lines, 0);
  const target = total * 0.5;
  
  let accumulated = 0;
  let count = 0;
  
  const sorted = [...owners].sort((a, b) => b.lines - a.lines);
  
  for (const owner of sorted) {
    accumulated += owner.lines;
    count++;
    if (accumulated >= target) break;
  }
  
  return count;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Chunk array into smaller arrays
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Group array by key function
 */
export function groupBy<T>(array: T[], keyFn: (item: T) => string): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const key = keyFn(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}
