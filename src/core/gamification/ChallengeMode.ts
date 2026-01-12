/**
 * Challenge Mode System
 * Weekly and monthly challenges for goals
 */

export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  xp: number;
  type: 'weekly' | 'monthly';
  target: number;
  progress: number;
  startDate: string;
  endDate: string;
  completed: boolean;
  completedAt?: number;
}

export type ChallengeType =
  | 'commits-week'
  | 'focus-week'
  | 'streak-week'
  | 'explore-week'
  | 'commits-month'
  | 'time-month'
  | 'achievements-month';

export class ChallengeMode {
  private activeChallenges: Map<string, Challenge> = new Map();
  private completedChallenges: Challenge[] = [];

  constructor() {
    this.generateWeeklyChallenges();
    this.generateMonthlyChallenges();
  }

  /**
   * Get all active challenges
   */
  getActiveChallenges(): Challenge[] {
    this.updateChallenges();
    return Array.from(this.activeChallenges.values());
  }

  /**
   * Get challenges by type
   */
  getChallengesByType(type: 'weekly' | 'monthly'): Challenge[] {
    return this.getActiveChallenges().filter(c => c.type === type);
  }

  /**
   * Update challenge progress
   */
  updateProgress(challengeId: string, amount: number): Challenge | null {
    const challenge = this.activeChallenges.get(challengeId);
    if (!challenge || challenge.completed) return null;

    challenge.progress = Math.min(challenge.progress + amount, challenge.target);

    if (challenge.progress >= challenge.target && !challenge.completed) {
      challenge.completed = true;
      challenge.completedAt = Date.now();
      this.completedChallenges.push(challenge);
      return challenge;
    }

    return null;
  }

  /**
   * Get completed challenges
   */
  getCompletedChallenges(): Challenge[] {
    return [...this.completedChallenges];
  }

  /**
   * Get total XP available from challenges
   */
  getTotalXPAvailable(): number {
    return this.getActiveChallenges().reduce((sum, c) => sum + c.xp, 0);
  }

  /**
   * Get earned XP from challenges
   */
  getEarnedXP(): number {
    return this.completedChallenges
      .filter(c => this.isCurrentPeriod(c))
      .reduce((sum, c) => sum + c.xp, 0);
  }

  /**
   * Check if challenges need refresh
   */
  private updateChallenges(): void {
    const now = new Date();
    
    // Remove expired challenges
    for (const [id, challenge] of this.activeChallenges.entries()) {
      if (new Date(challenge.endDate) < now) {
        this.activeChallenges.delete(id);
      }
    }

    // Regenerate if empty
    if (this.getChallengesByType('weekly').length === 0) {
      this.generateWeeklyChallenges();
    }
    if (this.getChallengesByType('monthly').length === 0) {
      this.generateMonthlyChallenges();
    }
  }

  /**
   * Generate weekly challenges
   */
  private generateWeeklyChallenges(): void {
    const now = new Date();
    const weekStart = this.getWeekStart(now);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const weeklyChallenges: Omit<Challenge, 'id' | 'progress' | 'completed' | 'startDate' | 'endDate'>[] = [
      {
        title: 'Commit Storm',
        description: 'Make 50 commits this week',
        icon: '⛈️',
        xp: 500,
        type: 'weekly',
        target: 50,
      },
      {
        title: 'Focus Marathon',
        description: 'Complete 20 hours of focused work',
        icon: '🏃',
        xp: 1000,
        type: 'weekly',
        target: 1200, // minutes
      },
      {
        title: 'Streak Guardian',
        description: 'Maintain a perfect 7-day streak',
        icon: '🛡️',
        xp: 300,
        type: 'weekly',
        target: 7,
      },
      {
        title: 'Code Explorer',
        description: 'Visit 20 different repositories',
        icon: '🗺️',
        xp: 400,
        type: 'weekly',
        target: 20,
      },
    ];

    // Pick 2 random weekly challenges
    const shuffled = weeklyChallenges.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 2);

    selected.forEach((challenge, index) => {
      const id = `weekly-${weekStart.toISOString().split('T')[0]}-${index}`;
      this.activeChallenges.set(id, {
        id,
        ...challenge,
        progress: 0,
        completed: false,
        startDate: weekStart.toISOString().split('T')[0],
        endDate: weekEnd.toISOString().split('T')[0],
      });
    });
  }

  /**
   * Generate monthly challenges
   */
  private generateMonthlyChallenges(): void {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const monthlyChallenges: Omit<Challenge, 'id' | 'progress' | 'completed' | 'startDate' | 'endDate'>[] = [
      {
        title: 'Epic Month',
        description: 'Make 200 commits this month',
        icon: '🎯',
        xp: 2000,
        type: 'monthly',
        target: 200,
      },
      {
        title: 'Time Master',
        description: 'Code for 100 hours this month',
        icon: '⌚',
        xp: 1500,
        type: 'monthly',
        target: 6000, // minutes
      },
      {
        title: 'Achievement Hunter',
        description: 'Unlock 5 achievements this month',
        icon: '🏆',
        xp: 800,
        type: 'monthly',
        target: 5,
      },
    ];

    // Pick 2 random monthly challenges
    const shuffled = monthlyChallenges.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 2);

    selected.forEach((challenge, index) => {
      const id = `monthly-${monthStart.toISOString().split('T')[0]}-${index}`;
      this.activeChallenges.set(id, {
        id,
        ...challenge,
        progress: 0,
        completed: false,
        startDate: monthStart.toISOString().split('T')[0],
        endDate: monthEnd.toISOString().split('T')[0],
      });
    });
  }

  /**
   * Get start of week (Monday)
   */
  private getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  /**
   * Check if challenge is in current period
   */
  private isCurrentPeriod(challenge: Challenge): boolean {
    const now = new Date();
    const start = new Date(challenge.startDate);
    const end = new Date(challenge.endDate);
    return now >= start && now <= end;
  }

  /**
   * Get days remaining for challenge
   */
  getDaysRemaining(challenge: Challenge): number {
    const now = new Date();
    const end = new Date(challenge.endDate);
    const diff = end.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  /**
   * Get completion percentage
   */
  getCompletionPercentage(challenge: Challenge): number {
    return (challenge.progress / challenge.target) * 100;
  }
}
