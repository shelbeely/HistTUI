/**
 * Memory System for HistTUI
 * 
 * Learns from user behavior to provide personalized suggestions and reduce cognitive load.
 * Perfect for ADHD developers who benefit from contextual assistance.
 */

import Database from 'better-sqlite3';
import { EventEmitter } from 'events';

export interface Memory {
  id: string;
  type: MemoryType;
  category: MemoryCategory;
  content: string;
  metadata: Record<string, any>;
  importance: number; // 0-100
  accessCount: number;
  lastAccessed: number;
  createdAt: number;
  expiresAt?: number;
}

export type MemoryType = 'short-term' | 'long-term' | 'pattern' | 'preference' | 'reminder';

export type MemoryCategory = 
  | 'workflow' 
  | 'preference' 
  | 'pattern' 
  | 'command' 
  | 'file' 
  | 'theme' 
  | 'productivity'
  | 'habit';

export interface MemoryContext {
  timeOfDay: string;
  dayOfWeek: string;
  recentActivity: string[];
  currentRepo?: string;
  currentBranch?: string;
  focusMode: boolean;
  pomodoroActive: boolean;
}

export interface MemorySuggestion {
  id: string;
  type: 'reminder' | 'pattern' | 'optimization' | 'tip';
  message: string;
  action?: string;
  priority: number;
  relevanceScore: number;
}

export class MemorySystem extends EventEmitter {
  private db: Database.Database;
  private learningEnabled: boolean = true;
  private shortTermMemory: Map<string, Memory> = new Map();

  constructor(dbPath: string) {
    super();
    this.db = new Database(dbPath);
    this.initializeDatabase();
  }

  private initializeDatabase(): void {
    // Memories table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS memories (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        category TEXT NOT NULL,
        content TEXT NOT NULL,
        metadata TEXT NOT NULL,
        importance INTEGER DEFAULT 50,
        access_count INTEGER DEFAULT 0,
        last_accessed INTEGER,
        created_at INTEGER NOT NULL,
        expires_at INTEGER
      );

      CREATE INDEX IF NOT EXISTS idx_memories_type ON memories(type);
      CREATE INDEX IF NOT EXISTS idx_memories_category ON memories(category);
      CREATE INDEX IF NOT EXISTS idx_memories_importance ON memories(importance);
      CREATE INDEX IF NOT EXISTS idx_memories_expires ON memories(expires_at);

      -- User patterns
      CREATE TABLE IF NOT EXISTS user_patterns (
        id TEXT PRIMARY KEY,
        pattern_type TEXT NOT NULL,
        data TEXT NOT NULL,
        confidence REAL DEFAULT 0.5,
        sample_size INTEGER DEFAULT 0,
        last_updated INTEGER NOT NULL
      );

      -- Contextual suggestions
      CREATE TABLE IF NOT EXISTS suggestions_history (
        id TEXT PRIMARY KEY,
        suggestion_type TEXT NOT NULL,
        message TEXT NOT NULL,
        action TEXT,
        shown_at INTEGER NOT NULL,
        accepted INTEGER DEFAULT 0,
        dismissed INTEGER DEFAULT 0
      );

      -- Learning metrics
      CREATE TABLE IF NOT EXISTS learning_metrics (
        metric_name TEXT PRIMARY KEY,
        value REAL NOT NULL,
        updated_at INTEGER NOT NULL
      );
    `);
  }

  /**
   * Store a new memory
   */
  storeMemory(memory: Omit<Memory, 'id' | 'accessCount' | 'createdAt'>): string {
    const id = `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();

    const fullMemory: Memory = {
      id,
      accessCount: 0,
      createdAt: now,
      ...memory,
    };

    if (memory.type === 'short-term') {
      // Store in memory for quick access
      this.shortTermMemory.set(id, fullMemory);
      
      // Clean up expired short-term memories
      this.cleanupShortTermMemories();
    } else {
      // Store in database
      this.db.prepare(`
        INSERT INTO memories (id, type, category, content, metadata, importance, access_count, last_accessed, created_at, expires_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        fullMemory.type,
        fullMemory.category,
        fullMemory.content,
        JSON.stringify(fullMemory.metadata),
        fullMemory.importance,
        fullMemory.accessCount,
        fullMemory.lastAccessed,
        fullMemory.createdAt,
        fullMemory.expiresAt
      );
    }

    this.emit('memory:stored', fullMemory);
    return id;
  }

  /**
   * Recall memories by category and context
   */
  recallMemories(category?: MemoryCategory, context?: MemoryContext): Memory[] {
    const memories: Memory[] = [];

    // Get from short-term memory
    for (const memory of this.shortTermMemory.values()) {
      if (!category || memory.category === category) {
        memories.push(memory);
      }
    }

    // Get from long-term storage
    let query = 'SELECT * FROM memories WHERE 1=1';
    const params: any[] = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    // Filter by relevance to context
    if (context) {
      query += ' AND (expires_at IS NULL OR expires_at > ?)';
      params.push(Date.now());
    }

    query += ' ORDER BY importance DESC, access_count DESC LIMIT 50';

    const rows = this.db.prepare(query).all(...params) as any[];
    
    for (const row of rows) {
      memories.push({
        id: row.id,
        type: row.type as MemoryType,
        category: row.category as MemoryCategory,
        content: row.content,
        metadata: JSON.parse(row.metadata),
        importance: row.importance,
        accessCount: row.access_count,
        lastAccessed: row.last_accessed,
        createdAt: row.created_at,
        expiresAt: row.expires_at,
      });
    }

    // Update access counts
    memories.forEach(mem => {
      this.updateAccessCount(mem.id);
    });

    return memories;
  }

  /**
   * Learn patterns from user behavior
   */
  learnPattern(patternType: string, data: any): void {
    if (!this.learningEnabled) return;

    const id = `pattern_${patternType}`;
    const existing = this.db.prepare('SELECT * FROM user_patterns WHERE id = ?').get(id) as any;

    if (existing) {
      // Update existing pattern
      const existingData = JSON.parse(existing.data);
      const mergedData = this.mergePatternData(existingData, data);
      const newConfidence = Math.min(1.0, existing.confidence + 0.05);
      const newSampleSize = existing.sample_size + 1;

      this.db.prepare(`
        UPDATE user_patterns 
        SET data = ?, confidence = ?, sample_size = ?, last_updated = ?
        WHERE id = ?
      `).run(
        JSON.stringify(mergedData),
        newConfidence,
        newSampleSize,
        Date.now(),
        id
      );
    } else {
      // Create new pattern
      this.db.prepare(`
        INSERT INTO user_patterns (id, pattern_type, data, confidence, sample_size, last_updated)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        id,
        patternType,
        JSON.stringify(data),
        0.5,
        1,
        Date.now()
      );
    }

    this.emit('pattern:learned', { patternType, data });
  }

  /**
   * Get contextual suggestions based on current context
   */
  getSuggestions(context: MemoryContext): MemorySuggestion[] {
    const suggestions: MemorySuggestion[] = [];

    // Productivity pattern suggestions
    const productivityPatterns = this.getPattern('productivity_times');
    if (productivityPatterns && productivityPatterns.confidence > 0.7) {
      const bestTime = this.getBestProductivityTime(productivityPatterns.data);
      const currentHour = new Date().getHours();
      
      if (Math.abs(currentHour - bestTime) <= 1) {
        suggestions.push({
          id: 'sug_productivity',
          type: 'tip',
          message: `You're usually most productive around this time! Great time for focused work.`,
          priority: 80,
          relevanceScore: 0.9,
        });
      }
    }

    // Theme suggestions based on time
    const themePattern = this.getPattern('theme_preferences');
    if (themePattern && context.timeOfDay) {
      const suggestedTheme = this.getSuggestedTheme(themePattern.data, context.timeOfDay);
      if (suggestedTheme) {
        suggestions.push({
          id: 'sug_theme',
          type: 'optimization',
          message: `Consider switching to ${suggestedTheme} theme for this time of day`,
          action: `theme:${suggestedTheme}`,
          priority: 50,
          relevanceScore: 0.7,
        });
      }
    }

    // Break reminder based on work patterns
    const workPattern = this.getPattern('work_sessions');
    if (workPattern && this.shouldSuggestBreak(workPattern.data)) {
      suggestions.push({
        id: 'sug_break',
        type: 'reminder',
        message: 'You\'ve been working for a while. Time for a break?',
        action: 'pomodoro:start-break',
        priority: 90,
        relevanceScore: 0.95,
      });
    }

    // Streak reminder
    const streakMemories = this.recallMemories('habit', context);
    const lastCommitMemory = streakMemories.find(m => m.metadata.type === 'last_commit');
    if (lastCommitMemory && this.shouldRemindAboutStreak(lastCommitMemory)) {
      suggestions.push({
        id: 'sug_streak',
        type: 'reminder',
        message: 'Keep your streak going! Make a commit today.',
        priority: 95,
        relevanceScore: 1.0,
      });
    }

    // Sort by priority and relevance
    return suggestions.sort((a, b) => {
      const scoreA = a.priority * a.relevanceScore;
      const scoreB = b.priority * b.relevanceScore;
      return scoreB - scoreA;
    });
  }

  /**
   * Get a learned pattern
   */
  getPattern(patternType: string): { data: any; confidence: number } | null {
    const id = `pattern_${patternType}`;
    const row = this.db.prepare('SELECT * FROM user_patterns WHERE id = ?').get(id) as any;
    
    if (row) {
      return {
        data: JSON.parse(row.data),
        confidence: row.confidence,
      };
    }
    
    return null;
  }

  /**
   * Clear all memories (useful for privacy or starting fresh)
   */
  clearMemories(type?: MemoryType): void {
    if (type) {
      this.db.prepare('DELETE FROM memories WHERE type = ?').run(type);
      
      if (type === 'short-term') {
        this.shortTermMemory.clear();
      }
    } else {
      this.db.prepare('DELETE FROM memories').run();
      this.shortTermMemory.clear();
    }

    this.emit('memory:cleared', { type });
  }

  /**
   * Export memories for backup or analysis
   */
  exportMemories(): any {
    const memories = this.db.prepare('SELECT * FROM memories').all();
    const patterns = this.db.prepare('SELECT * FROM user_patterns').all();
    const metrics = this.db.prepare('SELECT * FROM learning_metrics').all();

    return {
      memories: memories.map((m: any) => ({
        ...m,
        metadata: JSON.parse(m.metadata),
      })),
      patterns: patterns.map((p: any) => ({
        ...p,
        data: JSON.parse(p.data),
      })),
      metrics,
      exportedAt: Date.now(),
    };
  }

  /**
   * Toggle learning mode
   */
  setLearningEnabled(enabled: boolean): void {
    this.learningEnabled = enabled;
    this.emit('learning:toggled', { enabled });
  }

  // Private helper methods

  private updateAccessCount(memoryId: string): void {
    const now = Date.now();
    
    if (this.shortTermMemory.has(memoryId)) {
      const memory = this.shortTermMemory.get(memoryId)!;
      memory.accessCount++;
      memory.lastAccessed = now;
    } else {
      this.db.prepare(`
        UPDATE memories 
        SET access_count = access_count + 1, last_accessed = ?
        WHERE id = ?
      `).run(now, memoryId);
    }
  }

  private cleanupShortTermMemories(): void {
    const now = Date.now();
    
    for (const [id, memory] of this.shortTermMemory.entries()) {
      if (memory.expiresAt && memory.expiresAt < now) {
        this.shortTermMemory.delete(id);
      }
    }

    // Limit to 100 short-term memories
    if (this.shortTermMemory.size > 100) {
      const sorted = Array.from(this.shortTermMemory.entries())
        .sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);
      
      for (let i = 0; i < sorted.length - 100; i++) {
        this.shortTermMemory.delete(sorted[i][0]);
      }
    }
  }

  private mergePatternData(existing: any, newData: any): any {
    // Simple averaging for numeric values
    const merged: any = { ...existing };
    
    for (const key in newData) {
      if (typeof newData[key] === 'number' && typeof existing[key] === 'number') {
        merged[key] = (existing[key] + newData[key]) / 2;
      } else if (Array.isArray(newData[key]) && Array.isArray(existing[key])) {
        merged[key] = [...existing[key], ...newData[key]].slice(-50); // Keep last 50
      } else {
        merged[key] = newData[key];
      }
    }
    
    return merged;
  }

  private getBestProductivityTime(data: any): number {
    if (!data.hourlyProductivity) return 10; // Default to 10am
    
    let bestHour = 0;
    let maxProductivity = 0;
    
    for (const [hour, value] of Object.entries(data.hourlyProductivity)) {
      if (typeof value === 'number' && value > maxProductivity) {
        maxProductivity = value;
        bestHour = parseInt(hour);
      }
    }
    
    return bestHour;
  }

  private getSuggestedTheme(data: any, timeOfDay: string): string | null {
    if (!data.themeByTime) return null;
    return data.themeByTime[timeOfDay] || null;
  }

  private shouldSuggestBreak(data: any): boolean {
    if (!data.lastBreak) return true;
    
    const timeSinceBreak = Date.now() - data.lastBreak;
    const hoursSinceBreak = timeSinceBreak / (1000 * 60 * 60);
    
    return hoursSinceBreak >= 2; // Suggest break every 2 hours
  }

  private shouldRemindAboutStreak(memory: Memory): boolean {
    const lastCommit = memory.metadata.timestamp;
    const hoursSinceCommit = (Date.now() - lastCommit) / (1000 * 60 * 60);
    
    return hoursSinceCommit >= 20 && hoursSinceCommit < 24; // Remind in last 4 hours of day
  }

  close(): void {
    this.db.close();
  }
}
