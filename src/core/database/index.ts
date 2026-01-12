/**
 * SQLite database for indexing git history
 */

import Database from 'better-sqlite3';
import { Commit, Branch, Tag, FileChange, DashboardData, OwnershipData } from '../../types';
import { logger } from '../../utils/logger';
import { format } from 'date-fns';

export class GitDatabase {
  private db: Database.Database;

  constructor(dbPath: string) {
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('synchronous = NORMAL');
    this.initSchema();
  }

  /**
   * Initialize database schema
   */
  private initSchema(): void {
    // Commits table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS commits (
        hash TEXT PRIMARY KEY,
        short_hash TEXT NOT NULL,
        author TEXT NOT NULL,
        author_email TEXT NOT NULL,
        date INTEGER NOT NULL,
        subject TEXT NOT NULL,
        body TEXT,
        parents TEXT,
        refs TEXT,
        files_changed INTEGER DEFAULT 0,
        insertions INTEGER DEFAULT 0,
        deletions INTEGER DEFAULT 0
      );
      CREATE INDEX IF NOT EXISTS idx_commits_date ON commits(date);
      CREATE INDEX IF NOT EXISTS idx_commits_author ON commits(author_email);
    `);

    // Branches table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS branches (
        name TEXT PRIMARY KEY,
        commit TEXT NOT NULL,
        current INTEGER DEFAULT 0,
        remote INTEGER DEFAULT 0
      );
    `);

    // Tags table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS tags (
        name TEXT PRIMARY KEY,
        commit TEXT NOT NULL,
        message TEXT,
        date INTEGER
      );
    `);

    // File changes table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS file_changes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        commit_hash TEXT NOT NULL,
        file_path TEXT NOT NULL,
        old_path TEXT,
        status TEXT NOT NULL,
        additions INTEGER DEFAULT 0,
        deletions INTEGER DEFAULT 0,
        binary INTEGER DEFAULT 0,
        FOREIGN KEY (commit_hash) REFERENCES commits(hash)
      );
      CREATE INDEX IF NOT EXISTS idx_file_changes_commit ON file_changes(commit_hash);
      CREATE INDEX IF NOT EXISTS idx_file_changes_path ON file_changes(file_path);
    `);

    // Metadata table for tracking indexing status
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS metadata (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at INTEGER NOT NULL
      );
    `);

    // Plugin tables registry
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS plugin_tables (
        plugin_id TEXT NOT NULL,
        table_name TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        PRIMARY KEY (plugin_id, table_name)
      );
    `);

    logger.info('Database schema initialized');
  }

  /**
   * Insert or update commits
   */
  insertCommits(commits: Commit[]): void {
    const insert = this.db.prepare(`
      INSERT OR REPLACE INTO commits (
        hash, short_hash, author, author_email, date, subject, body,
        parents, refs, files_changed, insertions, deletions
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const transaction = this.db.transaction((commits: Commit[]) => {
      for (const commit of commits) {
        insert.run(
          commit.hash,
          commit.shortHash,
          commit.author,
          commit.authorEmail,
          commit.date.getTime(),
          commit.subject,
          commit.body,
          commit.parents.join(','),
          commit.refs.join(','),
          commit.filesChanged,
          commit.insertions,
          commit.deletions
        );
      }
    });

    transaction(commits);
    logger.info('Inserted/updated', commits.length, 'commits');
  }

  /**
   * Insert file changes for a commit
   */
  insertFileChanges(commitHash: string, files: FileChange[]): void {
    const insert = this.db.prepare(`
      INSERT INTO file_changes (
        commit_hash, file_path, old_path, status, additions, deletions, binary
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const transaction = this.db.transaction((files: FileChange[]) => {
      for (const file of files) {
        insert.run(
          commitHash,
          file.path,
          file.oldPath || null,
          file.status,
          file.additions,
          file.deletions,
          file.binary ? 1 : 0
        );
      }
    });

    transaction(files);
  }

  /**
   * Insert or update branches
   */
  insertBranches(branches: Branch[]): void {
    const insert = this.db.prepare(`
      INSERT OR REPLACE INTO branches (name, commit, current, remote)
      VALUES (?, ?, ?, ?)
    `);

    const transaction = this.db.transaction((branches: Branch[]) => {
      for (const branch of branches) {
        insert.run(branch.name, branch.commit, branch.current ? 1 : 0, branch.remote ? 1 : 0);
      }
    });

    transaction(branches);
    logger.info('Inserted/updated', branches.length, 'branches');
  }

  /**
   * Insert or update tags
   */
  insertTags(tags: Tag[]): void {
    const insert = this.db.prepare(`
      INSERT OR REPLACE INTO tags (name, commit, message, date)
      VALUES (?, ?, ?, ?)
    `);

    const transaction = this.db.transaction((tags: Tag[]) => {
      for (const tag of tags) {
        insert.run(tag.name, tag.commit, tag.message || null, tag.date?.getTime() || null);
      }
    });

    transaction(tags);
    logger.info('Inserted/updated', tags.length, 'tags');
  }

  /**
   * Get all commits with optional filters
   */
  getCommits(filter?: {
    author?: string;
    dateFrom?: Date;
    dateTo?: Date;
    path?: string;
    message?: string;
    limit?: number;
    offset?: number;
  }): Commit[] {
    let sql = 'SELECT * FROM commits WHERE 1=1';
    const params: any[] = [];

    if (filter?.author) {
      sql += ' AND (author LIKE ? OR author_email LIKE ?)';
      params.push(`%${filter.author}%`, `%${filter.author}%`);
    }

    if (filter?.dateFrom) {
      sql += ' AND date >= ?';
      params.push(filter.dateFrom.getTime());
    }

    if (filter?.dateTo) {
      sql += ' AND date <= ?';
      params.push(filter.dateTo.getTime());
    }

    if (filter?.message) {
      sql += ' AND (subject LIKE ? OR body LIKE ?)';
      params.push(`%${filter.message}%`, `%${filter.message}%`);
    }

    if (filter?.path) {
      sql += ` AND hash IN (
        SELECT commit_hash FROM file_changes WHERE file_path LIKE ?
      )`;
      params.push(`%${filter.path}%`);
    }

    sql += ' ORDER BY date DESC';

    if (filter?.limit) {
      sql += ' LIMIT ?';
      params.push(filter.limit);
    }

    if (filter?.offset) {
      sql += ' OFFSET ?';
      params.push(filter.offset);
    }

    const rows = this.db.prepare(sql).all(...params) as any[];
    return rows.map(this.rowToCommit);
  }

  /**
   * Get commit by hash
   */
  getCommit(hash: string): Commit | null {
    const row = this.db
      .prepare('SELECT * FROM commits WHERE hash = ? OR short_hash = ?')
      .get(hash, hash) as any;

    return row ? this.rowToCommit(row) : null;
  }

  /**
   * Get file changes for a commit
   */
  getFileChanges(commitHash: string): FileChange[] {
    const rows = this.db
      .prepare('SELECT * FROM file_changes WHERE commit_hash = ?')
      .all(commitHash) as any[];

    return rows.map(row => ({
      path: row.file_path,
      oldPath: row.old_path || undefined,
      status: row.status,
      additions: row.additions,
      deletions: row.deletions,
      binary: row.binary === 1,
    }));
  }

  /**
   * Get all branches
   */
  getBranches(): Branch[] {
    const rows = this.db.prepare('SELECT * FROM branches ORDER BY name').all() as any[];

    return rows.map(row => ({
      name: row.name,
      commit: row.commit,
      current: row.current === 1,
      remote: row.remote === 1,
    }));
  }

  /**
   * Get all tags
   */
  getTags(): Tag[] {
    const rows = this.db.prepare('SELECT * FROM tags ORDER BY date DESC').all() as any[];

    return rows.map(row => ({
      name: row.name,
      commit: row.commit,
      message: row.message || undefined,
      date: row.date ? new Date(row.date) : undefined,
    }));
  }

  /**
   * Get activity dashboard data
   */
  getDashboardActivity(): DashboardData {
    // Activity by day (last 90 days)
    const activityByDay = this.db
      .prepare(`
        SELECT 
          DATE(date / 1000, 'unixepoch') as date,
          COUNT(*) as commits
        FROM commits
        WHERE date >= ?
        GROUP BY date
        ORDER BY date
      `)
      .all(Date.now() - 90 * 24 * 60 * 60 * 1000) as any[];

    // Activity by hour
    const activityByHour = this.db
      .prepare(`
        SELECT 
          CAST(strftime('%H', date / 1000, 'unixepoch') AS INTEGER) as hour,
          COUNT(*) as commits
        FROM commits
        GROUP BY hour
        ORDER BY hour
      `)
      .all() as any[];

    // Top authors
    const topAuthors = this.db
      .prepare(`
        SELECT 
          author,
          COUNT(*) as commits,
          SUM(insertions) as insertions,
          SUM(deletions) as deletions
        FROM commits
        GROUP BY author_email
        ORDER BY commits DESC
        LIMIT 10
      `)
      .all() as any[];

    // Recent activity
    const recentActivity = this.db
      .prepare(`
        SELECT 
          DATE(date / 1000, 'unixepoch') as date,
          COUNT(*) as commits,
          GROUP_CONCAT(DISTINCT author) as authors
        FROM commits
        WHERE date >= ?
        GROUP BY date
        ORDER BY date DESC
        LIMIT 30
      `)
      .all(Date.now() - 30 * 24 * 60 * 60 * 1000) as any[];

    return {
      activityByDay,
      activityByHour,
      topAuthors,
      fileHotspots: [], // Will be populated by getFileHotspots
      recentActivity: recentActivity.map(r => ({
        ...r,
        authors: r.authors ? r.authors.split(',') : [],
      })),
    };
  }

  /**
   * Get file hotspots (most changed files)
   */
  getFileHotspots(limit: number = 50): Array<{ path: string; changes: number; authors: number }> {
    return this.db
      .prepare(`
        SELECT 
          file_path as path,
          COUNT(*) as changes,
          COUNT(DISTINCT c.author_email) as authors
        FROM file_changes fc
        JOIN commits c ON fc.commit_hash = c.hash
        GROUP BY file_path
        ORDER BY changes DESC
        LIMIT ?
      `)
      .all(limit) as any[];
  }

  /**
   * Get file ownership data
   */
  getFileOwnership(filePath: string): OwnershipData | null {
    const owners = this.db
      .prepare(`
        SELECT 
          c.author,
          SUM(fc.additions) as lines
        FROM file_changes fc
        JOIN commits c ON fc.commit_hash = c.hash
        WHERE fc.file_path = ?
        GROUP BY c.author_email
        ORDER BY lines DESC
      `)
      .all(filePath) as any[];

    if (owners.length === 0) return null;

    const total = owners.reduce((sum: number, o: any) => sum + o.lines, 0);

    const ownersWithPercentage = owners.map(o => ({
      author: o.author,
      lines: o.lines,
      percentage: Math.round((o.lines / total) * 100),
    }));

    // Calculate bus factor
    let accumulated = 0;
    let busFactor = 0;
    for (const owner of ownersWithPercentage) {
      accumulated += owner.lines;
      busFactor++;
      if (accumulated >= total * 0.5) break;
    }

    return {
      path: filePath,
      owners: ownersWithPercentage,
      busFactor,
    };
  }

  /**
   * Search commits
   */
  searchCommits(query: string, limit: number = 100): Commit[] {
    const rows = this.db
      .prepare(`
        SELECT * FROM commits
        WHERE subject LIKE ? OR body LIKE ? OR author LIKE ?
        ORDER BY date DESC
        LIMIT ?
      `)
      .all(`%${query}%`, `%${query}%`, `%${query}%`, limit) as any[];

    return rows.map(this.rowToCommit);
  }

  /**
   * Get commit count
   */
  getCommitCount(): number {
    const result = this.db.prepare('SELECT COUNT(*) as count FROM commits').get() as any;
    return result.count;
  }

  /**
   * Set metadata
   */
  setMetadata(key: string, value: string): void {
    this.db
      .prepare('INSERT OR REPLACE INTO metadata (key, value, updated_at) VALUES (?, ?, ?)')
      .run(key, value, Date.now());
  }

  /**
   * Get metadata
   */
  getMetadata(key: string): string | null {
    const row = this.db.prepare('SELECT value FROM metadata WHERE key = ?').get(key) as any;
    return row ? row.value : null;
  }

  /**
   * Register plugin table
   */
  registerPluginTable(pluginId: string, tableName: string): void {
    this.db
      .prepare('INSERT OR IGNORE INTO plugin_tables (plugin_id, table_name, created_at) VALUES (?, ?, ?)')
      .run(pluginId, tableName, Date.now());
  }

  /**
   * Get database instance for plugins
   */
  getDatabase(): Database.Database {
    return this.db;
  }

  /**
   * Close database
   */
  close(): void {
    this.db.close();
    logger.info('Database closed');
  }

  /**
   * Convert database row to Commit object
   */
  private rowToCommit(row: any): Commit {
    return {
      hash: row.hash,
      shortHash: row.short_hash,
      author: row.author,
      authorEmail: row.author_email,
      date: new Date(row.date),
      message: row.subject + (row.body ? '\n' + row.body : ''),
      subject: row.subject,
      body: row.body || '',
      parents: row.parents ? row.parents.split(',').filter((p: string) => p) : [],
      refs: row.refs ? row.refs.split(',').filter((r: string) => r) : [],
      filesChanged: row.files_changed,
      insertions: row.insertions,
      deletions: row.deletions,
    };
  }
}
