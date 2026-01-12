/**
 * Memory System Integration
 * 
 * Integrates memory system with other HistTUI components to learn from user behavior
 * and provide contextual assistance.
 */

import { MemorySystem, MemoryContext } from './MemorySystem';
import { EventEmitter } from 'events';

export class MemoryIntegration extends EventEmitter {
  private memory: MemorySystem;
  private sessionStartTime: number;
  private activityLog: string[] = [];

  constructor(memory: MemorySystem) {
    super();
    this.memory = memory;
    this.sessionStartTime = Date.now();
    this.setupAutoLearning();
  }

  /**
   * Setup automatic learning from various events
   */
  private setupAutoLearning(): void {
    // Listen to memory system events
    this.memory.on('memory:stored', (memory) => {
      this.logActivity(`Stored ${memory.type} memory: ${memory.category}`);
    });

    this.memory.on('pattern:learned', ({ patternType }) => {
      this.logActivity(`Learned pattern: ${patternType}`);
    });
  }

  /**
   * Learn from commit activity
   */
  learnFromCommit(commitData: any): void {
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.getDay();

    // Learn productivity patterns
    this.memory.learnPattern('productivity_times', {
      hour,
      dayOfWeek,
      commitCount: 1,
      hourlyProductivity: { [hour]: 1 },
    });

    // Store short-term memory of last commit
    this.memory.storeMemory({
      type: 'short-term',
      category: 'habit',
      content: 'Last commit made',
      metadata: {
        type: 'last_commit',
        timestamp: Date.now(),
        message: commitData.message,
      },
      importance: 90,
      lastAccessed: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    // Learn commit message patterns
    if (commitData.message) {
      this.memory.learnPattern('commit_style', {
        length: commitData.message.length,
        hasEmoji: /[\u{1F300}-\u{1F9FF}]/u.test(commitData.message),
        conventional: /^(feat|fix|docs|style|refactor|test|chore):/.test(commitData.message),
      });
    }
  }

  /**
   * Learn from file access patterns
   */
  learnFromFileAccess(filePath: string, action: 'view' | 'edit'): void {
    // Learn file preferences
    this.memory.learnPattern('file_preferences', {
      path: filePath,
      action,
      timestamp: Date.now(),
    });

    // Store frequently accessed files
    this.memory.storeMemory({
      type: 'long-term',
      category: 'file',
      content: filePath,
      metadata: {
        lastAccess: Date.now(),
        action,
      },
      importance: 70,
      lastAccessed: Date.now(),
    });
  }

  /**
   * Learn from theme changes
   */
  learnFromThemeChange(theme: string): void {
    const hour = new Date().getHours();
    const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';

    this.memory.learnPattern('theme_preferences', {
      theme,
      timeOfDay,
      hour,
      themeByTime: { [timeOfDay]: theme },
    });

    // Store preference
    this.memory.storeMemory({
      type: 'preference',
      category: 'theme',
      content: `Preferred theme: ${theme}`,
      metadata: {
        theme,
        timeOfDay,
        timestamp: Date.now(),
      },
      importance: 60,
      lastAccessed: Date.now(),
    });
  }

  /**
   * Learn from Pomodoro sessions
   */
  learnFromPomodoroSession(duration: number, completed: boolean): void {
    this.memory.learnPattern('work_sessions', {
      duration,
      completed,
      timestamp: Date.now(),
      lastBreak: completed ? Date.now() : undefined,
    });

    if (completed) {
      this.memory.storeMemory({
        type: 'short-term',
        category: 'productivity',
        content: 'Completed Pomodoro session',
        metadata: {
          duration,
          timestamp: Date.now(),
        },
        importance: 80,
        lastAccessed: Date.now(),
        expiresAt: Date.now() + 4 * 60 * 60 * 1000, // 4 hours
      });
    }
  }

  /**
   * Learn from focus mode usage
   */
  learnFromFocusMode(enabled: boolean, duration?: number): void {
    if (!enabled && duration) {
      this.memory.learnPattern('focus_patterns', {
        duration,
        timestamp: Date.now(),
        hour: new Date().getHours(),
      });
    }

    this.memory.storeMemory({
      type: 'short-term',
      category: 'workflow',
      content: enabled ? 'Focus mode enabled' : 'Focus mode disabled',
      metadata: {
        enabled,
        duration,
        timestamp: Date.now(),
      },
      importance: 75,
      lastAccessed: Date.now(),
      expiresAt: Date.now() + 2 * 60 * 60 * 1000, // 2 hours
    });
  }

  /**
   * Learn from command usage
   */
  learnFromCommandUsage(command: string, args?: string[]): void {
    this.memory.learnPattern('command_usage', {
      command,
      args,
      timestamp: Date.now(),
      hour: new Date().getHours(),
    });

    // Store frequently used commands
    const existingMemories = this.memory.recallMemories('command');
    const commandMemory = existingMemories.find(m => m.metadata.command === command);

    if (commandMemory) {
      // Command already tracked, importance increases with use
      this.memory.storeMemory({
        ...commandMemory,
        importance: Math.min(100, commandMemory.importance + 5),
        lastAccessed: Date.now(),
      });
    } else {
      this.memory.storeMemory({
        type: 'long-term',
        category: 'command',
        content: `Command: ${command}`,
        metadata: {
          command,
          args,
          firstUsed: Date.now(),
        },
        importance: 50,
        lastAccessed: Date.now(),
      });
    }
  }

  /**
   * Get current context for memory suggestions
   */
  getCurrentContext(additionalContext?: Partial<MemoryContext>): MemoryContext {
    const now = new Date();
    const hour = now.getHours();
    const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
    const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()];

    return {
      timeOfDay,
      dayOfWeek,
      recentActivity: this.activityLog.slice(-10),
      focusMode: false,
      pomodoroActive: false,
      ...additionalContext,
    };
  }

  /**
   * Get personalized suggestions for current context
   */
  getSuggestionsForContext(additionalContext?: Partial<MemoryContext>) {
    const context = this.getCurrentContext(additionalContext);
    return this.memory.getSuggestions(context);
  }

  /**
   * Remember user preference
   */
  rememberPreference(category: string, key: string, value: any): void {
    this.memory.storeMemory({
      type: 'preference',
      category: 'preference',
      content: `${category}.${key}`,
      metadata: {
        category,
        key,
        value,
        timestamp: Date.now(),
      },
      importance: 70,
      lastAccessed: Date.now(),
    });
  }

  /**
   * Recall user preferences
   */
  recallPreference(category: string, key: string): any {
    const memories = this.memory.recallMemories('preference');
    const prefMemory = memories.find(m => 
      m.metadata.category === category && m.metadata.key === key
    );
    
    return prefMemory?.metadata.value;
  }

  /**
   * Get productivity insights from learned patterns
   */
  getProductivityInsights(): any {
    const productivityPattern = this.memory.getPattern('productivity_times');
    const focusPattern = this.memory.getPattern('focus_patterns');
    const workPattern = this.memory.getPattern('work_sessions');

    return {
      bestProductivityTimes: productivityPattern?.data.hourlyProductivity || {},
      confidence: productivityPattern?.confidence || 0,
      averageFocusDuration: focusPattern?.data.averageDuration || 0,
      breakCompliance: workPattern?.data.breakCompliance || 0,
      patterns: {
        productivity: productivityPattern,
        focus: focusPattern,
        work: workPattern,
      },
    };
  }

  /**
   * Log activity for context
   */
  private logActivity(activity: string): void {
    this.activityLog.push(activity);
    
    // Keep only last 100 activities
    if (this.activityLog.length > 100) {
      this.activityLog = this.activityLog.slice(-100);
    }
  }

  /**
   * Get session summary
   */
  getSessionSummary(): any {
    const duration = Date.now() - this.sessionStartTime;
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));

    return {
      duration: {
        hours,
        minutes,
        total: duration,
      },
      activities: this.activityLog.length,
      recentActivities: this.activityLog.slice(-5),
    };
  }
}
