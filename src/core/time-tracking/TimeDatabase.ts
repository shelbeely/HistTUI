/**
 * TimeDatabase - SQLite database for time tracking
 */

import Database from 'better-sqlite3';
import type { CodingSession, DailySummary, FileActivity } from '../../types/index.js';

export class TimeDatabase {
  private db: Database.Database;

  constructor(dbPath: string) {
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.initializeSchema();
  }

  private initializeSchema(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS coding_sessions (
        id TEXT PRIMARY KEY,
        repo_path TEXT NOT NULL,
        start_time INTEGER NOT NULL,
        end_time INTEGER,
        duration INTEGER DEFAULT 0,
        file_path TEXT,
        language TEXT,
        lines_added INTEGER DEFAULT 0,
        lines_deleted INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS daily_summaries (
        date TEXT PRIMARY KEY,
        repo_path TEXT NOT NULL,
        total_seconds INTEGER DEFAULT 0,
        active_files INTEGER DEFAULT 0,
        languages TEXT,
        commits INTEGER DEFAULT 0,
        productivity_score REAL DEFAULT 0.0
      );

      CREATE TABLE IF NOT EXISTS file_activity (
        file_path TEXT PRIMARY KEY,
        repo_path TEXT NOT NULL,
        language TEXT,
        total_seconds INTEGER DEFAULT 0,
        edit_count INTEGER DEFAULT 0,
        last_active INTEGER NOT NULL
      );
    `);
  }

  startSession(session: CodingSession): void {
    this.db.prepare(`INSERT INTO coding_sessions VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(session.id, session.repoPath, session.startTime, session.endTime, session.duration,
           session.filePath, session.language, session.linesAdded, session.linesDeleted);
  }

  updateSession(session: CodingSession): void {
    this.db.prepare(`UPDATE coding_sessions SET file_path=?, language=?, lines_added=?, lines_deleted=? WHERE id=?`)
      .run(session.filePath, session.language, session.linesAdded, session.linesDeleted, session.id);
  }

  endSession(session: CodingSession): void {
    this.db.prepare(`UPDATE coding_sessions SET end_time=?, duration=? WHERE id=?`)
      .run(session.endTime, session.duration, session.id);
  }

  updateDailySummary(session: CodingSession): void {
    const date = new Date(session.startTime).toISOString().split('T')[0];
    const existing = this.db.prepare(`SELECT * FROM daily_summaries WHERE date=? AND repo_path=?`)
      .get(date, session.repoPath) as DailySummary | undefined;

    if (existing) {
      const languages = JSON.parse(existing.languages);
      if (session.language) languages[session.language] = (languages[session.language] || 0) + session.duration;
      this.db.prepare(`UPDATE daily_summaries SET total_seconds=total_seconds+?, languages=? WHERE date=? AND repo_path=?`)
        .run(session.duration, JSON.stringify(languages), date, session.repoPath);
    } else {
      const languages = session.language ? { [session.language]: session.duration } : {};
      this.db.prepare(`INSERT INTO daily_summaries (date, repo_path, total_seconds, active_files, languages) VALUES (?, ?, ?, 1, ?)`)
        .run(date, session.repoPath, session.duration, JSON.stringify(languages));
    }
  }

  updateFileActivity(activity: { filePath: string; language: string; duration: number }): void {
    const existing = this.db.prepare(`SELECT * FROM file_activity WHERE file_path=?`).get(activity.filePath);
    if (existing) {
      this.db.prepare(`UPDATE file_activity SET total_seconds=total_seconds+?, edit_count=edit_count+1, last_active=? WHERE file_path=?`)
        .run(activity.duration, Date.now(), activity.filePath);
    } else {
      this.db.prepare(`INSERT INTO file_activity VALUES (?, '', ?, ?, 1, ?)`)
        .run(activity.filePath, activity.language, activity.duration, Date.now());
    }
  }

  getTotalTime(repoPath?: string): number {
    const result = repoPath 
      ? this.db.prepare('SELECT SUM(duration) as total FROM coding_sessions WHERE repo_path=?').get(repoPath)
      : this.db.prepare('SELECT SUM(duration) as total FROM coding_sessions').get();
    return (result as any)?.total || 0;
  }

  getTodayTime(repoPath?: string): number {
    const today = new Date().toISOString().split('T')[0];
    const result = repoPath
      ? this.db.prepare('SELECT total_seconds FROM daily_summaries WHERE date=? AND repo_path=?').get(today, repoPath)
      : this.db.prepare('SELECT SUM(total_seconds) as total FROM daily_summaries WHERE date=?').get(today);
    return (result as any)?.total_seconds || (result as any)?.total || 0;
  }

  getTopLanguages(limit: number, repoPath?: string): Array<{ language: string; seconds: number }> {
    const query = repoPath
      ? 'SELECT language, SUM(duration) as seconds FROM coding_sessions WHERE language IS NOT NULL AND repo_path=? GROUP BY language ORDER BY seconds DESC LIMIT ?'
      : 'SELECT language, SUM(duration) as seconds FROM coding_sessions WHERE language IS NOT NULL GROUP BY language ORDER BY seconds DESC LIMIT ?';
    return (repoPath ? this.db.prepare(query).all(repoPath, limit) : this.db.prepare(query).all(limit)) as Array<{ language: string; seconds: number }>;
  }

  getTopFiles(limit: number, repoPath?: string): FileActivity[] {
    const query = repoPath ? 'SELECT * FROM file_activity WHERE repo_path=? ORDER BY total_seconds DESC LIMIT ?' : 'SELECT * FROM file_activity ORDER BY total_seconds DESC LIMIT ?';
    return (repoPath ? this.db.prepare(query).all(repoPath, limit) : this.db.prepare(query).all(limit)) as FileActivity[];
  }

  getDailySummaries(startDate: string, endDate: string, repoPath?: string): DailySummary[] {
    const query = repoPath
      ? 'SELECT * FROM daily_summaries WHERE date BETWEEN ? AND ? AND repo_path=? ORDER BY date DESC'
      : 'SELECT * FROM daily_summaries WHERE date BETWEEN ? AND ? ORDER BY date DESC';
    return (repoPath ? this.db.prepare(query).all(startDate, endDate, repoPath) : this.db.prepare(query).all(startDate, endDate)) as DailySummary[];
  }

  clearAll(): void {
    this.db.exec('DELETE FROM coding_sessions; DELETE FROM daily_summaries; DELETE FROM file_activity;');
  }

  exportData(): { sessions: CodingSession[]; summaries: DailySummary[]; files: FileActivity[] } {
    return {
      sessions: this.db.prepare('SELECT * FROM coding_sessions ORDER BY start_time DESC').all() as CodingSession[],
      summaries: this.db.prepare('SELECT * FROM daily_summaries ORDER BY date DESC').all() as DailySummary[],
      files: this.db.prepare('SELECT * FROM file_activity ORDER BY total_seconds DESC').all() as FileActivity[],
    };
  }

  close(): void {
    this.db.close();
  }
}
