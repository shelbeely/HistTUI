/**
 * StatisticsCalculator - Calculate productivity insights
 */

import type { TimeDatabase } from './TimeDatabase.js';

export class StatisticsCalculator {
  private database: TimeDatabase;

  constructor(database: TimeDatabase) {
    this.database = database;
  }

  calculateStats(repoPath?: string) {
    return {
      totalSeconds: this.database.getTotalTime(repoPath),
      todaySeconds: this.database.getTodayTime(repoPath),
      weekSeconds: this.getWeekTime(repoPath),
      topLanguages: this.database.getTopLanguages(10, repoPath),
      topFiles: this.database.getTopFiles(10, repoPath),
      streak: this.calculateStreak(repoPath),
    };
  }

  private getWeekTime(repoPath?: string): number {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const summaries = this.database.getDailySummaries(
      weekAgo.toISOString().split('T')[0],
      today.toISOString().split('T')[0],
      repoPath
    );
    return summaries.reduce((sum, s) => sum + s.totalSeconds, 0);
  }

  private calculateStreak(repoPath?: string): number {
    let streak = 0;
    let checkDate = new Date();
    for (let i = 0; i < 365; i++) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const summaries = this.database.getDailySummaries(dateStr, dateStr, repoPath);
      if (summaries.length === 0 || summaries[0].totalSeconds < 60) break;
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
    return streak;
  }

  static formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  }
}
