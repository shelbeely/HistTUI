/**
 * Changelog Parser Utility
 * Parses CHANGELOG.md files and extracts version information
 * 
 * Inspired by changelog-view by jdeniau (MIT License)
 * https://github.com/jdeniau/changelog-view
 */

import { marked } from 'marked';

export interface ChangelogVersion {
  version: string;
  content: string;
  tokens: any[];
}

/**
 * Extract semantic version from a heading text
 */
function extractVersion(text: string): string | null {
  // Handle x.x.x patterns
  const normalized = text
    .replace(/(\d+\.\d+)\.x/g, '$1.99999')
    .replace(/(\d+)\.x/g, '$1.99999.99999');

  // Match semantic version patterns
  const versionMatch = normalized.match(/\d+\.\d+\.\d+/);
  return versionMatch ? versionMatch[0] : null;
}

/**
 * Parse markdown changelog and group by versions
 */
export function parseChangelog(markdown: string): ChangelogVersion[] {
  const tokens = marked.lexer(markdown);
  const versions: Map<string, any[]> = new Map();
  let currentVersion: string | null = null;

  for (const token of tokens) {
    if (token.type === 'heading') {
      const version = extractVersion(token.text);
      if (version) {
        currentVersion = version;
        if (!versions.has(currentVersion)) {
          versions.set(currentVersion, []);
        }
      }
    }

    if (currentVersion) {
      versions.get(currentVersion)?.push(token);
    }
  }

  return Array.from(versions.entries()).map(([version, tokens]) => ({
    version,
    content: marked.parser(tokens as any),
    tokens,
  }));
}

/**
 * Compare two semantic versions
 */
export function compareVersions(a: string, b: string): number {
  const aParts = a.split('.').map(Number);
  const bParts = b.split('.').map(Number);

  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    const aPart = aParts[i] || 0;
    const bPart = bParts[i] || 0;

    if (aPart > bPart) return 1;
    if (aPart < bPart) return -1;
  }

  return 0;
}

/**
 * Filter changelog versions newer than a given version
 */
export function getVersionsSince(
  versions: ChangelogVersion[],
  sinceVersion: string
): ChangelogVersion[] {
  return versions
    .filter(v => compareVersions(v.version, sinceVersion) > 0)
    .sort((a, b) => compareVersions(b.version, a.version));
}

/**
 * Format changelog entry for terminal display
 */
export function formatChangelogEntry(entry: ChangelogVersion, maxLines: number = 20): string[] {
  const lines = entry.content.split('\n');
  const formatted: string[] = [];

  formatted.push(`## Version ${entry.version}`);
  formatted.push('');

  const contentLines = lines.slice(0, maxLines);
  formatted.push(...contentLines);

  if (lines.length > maxLines) {
    formatted.push('');
    formatted.push(`... (${lines.length - maxLines} more lines)`);
  }

  return formatted;
}
