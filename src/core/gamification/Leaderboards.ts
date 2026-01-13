/**
 * Personal Leaderboards System
 * Track personal bests and records
 */

export interface PersonalRecord {
  id: string;
  name: string;
  description: string;
  icon: string;
  value: number;
  unit: string;
  achievedAt: number;
  context?: string; // Additional info
}

export type RecordCategory =
  | 'commits-day'
  | 'coding-session'
  | 'daily-xp'
  | 'focus-score'
  | 'pomodoros-day'
  | 'level-up-speed'
  | 'achievements-week'
  | 'streak';

export class Leaderboards {
  private records: Map<RecordCategory, PersonalRecord> = new Map();

  constructor() {
    this.initializeRecords();
  }

  /**
   * Check and update a record
   */
  checkRecord(
    category: RecordCategory,
    value: number,
    context?: string
  ): { isNewRecord: boolean; previousBest?: number } {
    const currentRecord = this.records.get(category);
    if (!currentRecord) return { isNewRecord: false };

    if (value > currentRecord.value) {
      const previousBest = currentRecord.value;
      currentRecord.value = value;
      currentRecord.achievedAt = Date.now();
      if (context) currentRecord.context = context;

      return { isNewRecord: true, previousBest };
    }

    return { isNewRecord: false };
  }

  /**
   * Get all personal records
   */
  getAllRecords(): PersonalRecord[] {
    return Array.from(this.records.values());
  }

  /**
   * Get specific record
   */
  getRecord(category: RecordCategory): PersonalRecord | undefined {
    return this.records.get(category);
  }

  /**
   * Get records by category group
   */
  getRecordsByGroup(group: 'productivity' | 'focus' | 'social'): PersonalRecord[] {
    const groups = {
      productivity: ['commits-day', 'coding-session', 'daily-xp', 'level-up-speed'],
      focus: ['focus-score', 'pomodoros-day', 'streak'],
      social: ['achievements-week'],
    };

    const categories = groups[group] as RecordCategory[];
    return categories
      .map(cat => this.records.get(cat))
      .filter(r => r !== undefined) as PersonalRecord[];
  }

  /**
   * Get recent records (last 7 days)
   */
  getRecentRecords(days: number = 7): PersonalRecord[] {
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return Array.from(this.records.values()).filter(r => r.achievedAt >= cutoff);
  }

  /**
   * Get total records count
   */
  getTotalRecordsCount(): number {
    return this.records.size;
  }

  /**
   * Export records
   */
  exportRecords(): Record<string, PersonalRecord> {
    const result: Record<string, PersonalRecord> = {};
    for (const [key, value] of this.records.entries()) {
      result[key] = value;
    }
    return result;
  }

  /**
   * Import records
   */
  importRecords(data: Record<string, PersonalRecord>): void {
    for (const [key, value] of Object.entries(data)) {
      this.records.set(key as RecordCategory, value);
    }
  }

  /**
   * Initialize all record categories
   */
  private initializeRecords(): void {
    const recordDefinitions: Array<{
      category: RecordCategory;
      record: Omit<PersonalRecord, 'value' | 'achievedAt'>;
    }> = [
      {
        category: 'commits-day',
        record: {
          id: 'commits-day',
          name: 'Most Commits in a Day',
          description: 'Your most productive day',
          icon: '🚀',
          unit: 'commits',
        },
      },
      {
        category: 'coding-session',
        record: {
          id: 'coding-session',
          name: 'Longest Coding Session',
          description: 'Your longest uninterrupted session',
          icon: '⏱️',
          unit: 'hours',
        },
      },
      {
        category: 'daily-xp',
        record: {
          id: 'daily-xp',
          name: 'Highest Daily XP',
          description: 'Most XP earned in one day',
          icon: '💫',
          unit: 'XP',
        },
      },
      {
        category: 'focus-score',
        record: {
          id: 'focus-score',
          name: 'Perfect Focus Score',
          description: 'Days with 100% focus score',
          icon: '🎯',
          unit: 'days',
        },
      },
      {
        category: 'pomodoros-day',
        record: {
          id: 'pomodoros-day',
          name: 'Most Pomodoros in a Day',
          description: 'Your most focused day',
          icon: '🍅',
          unit: 'sessions',
        },
      },
      {
        category: 'level-up-speed',
        record: {
          id: 'level-up-speed',
          name: 'Fastest Level Up',
          description: 'Shortest time to gain a level',
          icon: '⚡',
          unit: 'hours',
        },
      },
      {
        category: 'achievements-week',
        record: {
          id: 'achievements-week',
          name: 'Most Achievements in a Week',
          description: 'Your most accomplished week',
          icon: '🏆',
          unit: 'achievements',
        },
      },
      {
        category: 'streak',
        record: {
          id: 'streak',
          name: 'Longest Streak',
          description: 'Most consecutive days coding',
          icon: '🔥',
          unit: 'days',
        },
      },
    ];

    recordDefinitions.forEach(({ category, record }) => {
      this.records.set(category, {
        ...record,
        value: 0,
        achievedAt: 0,
      });
    });
  }

  /**
   * Reset all records (for testing or fresh start)
   */
  resetAllRecords(): void {
    this.initializeRecords();
  }

  /**
   * Get records summary for display
   */
  getRecordsSummary(): string {
    const records = this.getAllRecords();
    const achieved = records.filter(r => r.value > 0).length;
    return `${achieved}/${records.length} records set`;
  }
}
