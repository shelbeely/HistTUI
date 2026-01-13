/**
 * TimeTracker - Core time tracking logic
 * WakaTime-inspired local-first time tracking for developers
 * 
 * Features:
 * - Automatic session detection
 * - Idle timeout handling
 * - File and language tracking
 * - Privacy-first (all data local)
 */

import { nanoid } from 'nanoid';
import { TimeDatabase } from './TimeDatabase.js';
import { ActivityDetector } from './ActivityDetector.js';
import type { CodingSession, SessionEvent, TimeTrackingConfig } from '../../types/index.js';

export class TimeTracker {
  private database: TimeDatabase;
  private detector: ActivityDetector;
  private currentSession: CodingSession | null = null;
  private config: TimeTrackingConfig;

  constructor(dbPath: string, config: TimeTrackingConfig) {
    this.database = new TimeDatabase(dbPath);
    this.detector = new ActivityDetector(config.idleTimeout || 300);
    this.config = config;
  }

  /**
   * Start tracking a new coding session
   */
  startSession(repoPath: string, filePath?: string): string {
    if (!this.config.enabled) return '';

    // End previous session if exists
    if (this.currentSession) {
      this.endSession();
    }

    const sessionId = nanoid();
    const now = Date.now();

    this.currentSession = {
      id: sessionId,
      repoPath,
      startTime: now,
      endTime: null,
      duration: 0,
      filePath: filePath || null,
      language: filePath ? this.detectLanguage(filePath) : null,
      linesAdded: 0,
      linesDeleted: 0,
    };

    // Save to database
    this.database.startSession(this.currentSession);

    // Start activity detector
    this.detector.start(() => {
      this.handleIdleTimeout();
    });

    return sessionId;
  }

  /**
   * Update current session with activity
   */
  recordActivity(event: SessionEvent): void {
    if (!this.config.enabled || !this.currentSession) return;

    // Reset idle timer
    this.detector.recordActivity();

    // Update session data
    if (event.filePath && event.filePath !== this.currentSession.filePath) {
      this.currentSession.filePath = event.filePath;
      this.currentSession.language = this.detectLanguage(event.filePath);
    }

    if (event.linesAdded) {
      this.currentSession.linesAdded += event.linesAdded;
    }

    if (event.linesDeleted) {
      this.currentSession.linesDeleted += event.linesDeleted;
    }

    // Update in database
    this.database.updateSession(this.currentSession);
  }

  /**
   * End the current session
   */
  endSession(): void {
    if (!this.currentSession) return;

    const now = Date.now();
    this.currentSession.endTime = now;
    this.currentSession.duration = Math.floor(
      (now - this.currentSession.startTime) / 1000
    );

    // Save final session
    this.database.endSession(this.currentSession);

    // Update daily summary
    this.database.updateDailySummary(this.currentSession);

    // Update file activity
    if (this.currentSession.filePath && this.currentSession.language) {
      this.database.updateFileActivity({
        filePath: this.currentSession.filePath,
        language: this.currentSession.language,
        duration: this.currentSession.duration,
      });
    }

    // Cleanup
    this.detector.stop();
    this.currentSession = null;
  }

  /**
   * Handle idle timeout (pause session)
   */
  private handleIdleTimeout(): void {
    if (this.currentSession) {
      // Save current progress
      this.endSession();
    }
  }

  /**
   * Detect programming language from file path
   */
  private detectLanguage(filePath: string): string {
    const ext = filePath.split('.').pop()?.toLowerCase();
    
    const languageMap: Record<string, string> = {
      ts: 'TypeScript',
      tsx: 'TypeScript',
      js: 'JavaScript',
      jsx: 'JavaScript',
      py: 'Python',
      rb: 'Ruby',
      go: 'Go',
      rs: 'Rust',
      java: 'Java',
      c: 'C',
      cpp: 'C++',
      cs: 'C#',
      php: 'PHP',
      swift: 'Swift',
      kt: 'Kotlin',
      sh: 'Shell',
      bash: 'Bash',
      zsh: 'Zsh',
      yaml: 'YAML',
      yml: 'YAML',
      json: 'JSON',
      md: 'Markdown',
      html: 'HTML',
      css: 'CSS',
      scss: 'SCSS',
      sass: 'SASS',
      vue: 'Vue',
      sql: 'SQL',
    };

    return languageMap[ext || ''] || 'Other';
  }

  /**
   * Get current session info
   */
  getCurrentSession(): CodingSession | null {
    return this.currentSession;
  }

  /**
   * Check if tracking is active
   */
  isTracking(): boolean {
    return this.currentSession !== null;
  }

  /**
   * Get database instance for queries
   */
  getDatabase(): TimeDatabase {
    return this.database;
  }

  /**
   * Close and cleanup
   */
  close(): void {
    if (this.currentSession) {
      this.endSession();
    }
    this.database.close();
  }
}
