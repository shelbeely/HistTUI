/**
 * Gamification System
 * Achievement badges and XP system for ADHD motivation
 */

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'streak' | 'milestone' | 'mastery' | 'discovery';
  xp: number;
  unlocked: boolean;
  unlockedAt?: number;
  progress?: number; // 0-100
  requirement: number;
}

export interface UserProgress {
  level: number;
  xp: number;
  xpForNextLevel: number;
  totalXP: number;
  achievements: Achievement[];
  streak: number;
  longestStreak: number;
  lastActiveDate: string;
}

export class AchievementSystem {
  private achievements: Map<string, Achievement> = new Map();
  private userProgress: UserProgress;

  constructor() {
    this.initializeAchievements();
    this.userProgress = {
      level: 1,
      xp: 0,
      xpForNextLevel: 100,
      totalXP: 0,
      achievements: [],
      streak: 0,
      longestStreak: 0,
      lastActiveDate: new Date().toISOString().split('T')[0],
    };
  }

  awardXP(amount: number, reason: string): boolean {
    this.userProgress.xp += amount;
    this.userProgress.totalXP += amount;

    let leveledUp = false;
    while (this.userProgress.xp >= this.userProgress.xpForNextLevel) {
      this.userProgress.xp -= this.userProgress.xpForNextLevel;
      this.userProgress.level++;
      this.userProgress.xpForNextLevel = this.calculateXPForLevel(this.userProgress.level + 1);
      leveledUp = true;
    }

    return leveledUp;
  }

  unlockAchievement(achievementId: string): boolean {
    const achievement = this.achievements.get(achievementId);
    if (!achievement || achievement.unlocked) return false;

    achievement.unlocked = true;
    achievement.unlockedAt = Date.now();
    this.userProgress.achievements.push(achievement);
    this.awardXP(achievement.xp, `Achievement: ${achievement.name}`);

    return true;
  }

  checkAchievements(stats: any): string[] {
    const unlocked: string[] = [];

    // Check streak achievements
    if (stats.streak >= 7 && !this.isUnlocked('streak-7')) {
      this.unlockAchievement('streak-7');
      unlocked.push('streak-7');
    }
    if (stats.streak >= 30 && !this.isUnlocked('streak-30')) {
      this.unlockAchievement('streak-30');
      unlocked.push('streak-30');
    }

    // Check commit milestones
    if (stats.totalCommits >= 100 && !this.isUnlocked('commits-100')) {
      this.unlockAchievement('commits-100');
      unlocked.push('commits-100');
    }
    if (stats.totalCommits >= 1000 && !this.isUnlocked('commits-1000')) {
      this.unlockAchievement('commits-1000');
      unlocked.push('commits-1000');
    }

    // Check time tracking
    if (stats.totalHours >= 100 && !this.isUnlocked('hours-100')) {
      this.unlockAchievement('hours-100');
      unlocked.push('hours-100');
    }

    // Check focus sessions
    if (stats.focusSessions >= 50 && !this.isUnlocked('focus-50')) {
      this.unlockAchievement('focus-50');
      unlocked.push('focus-50');
    }

    return unlocked;
  }

  updateStreak(): void {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (this.userProgress.lastActiveDate === yesterday) {
      // Continued streak
      this.userProgress.streak++;
      if (this.userProgress.streak > this.userProgress.longestStreak) {
        this.userProgress.longestStreak = this.userProgress.streak;
      }
    } else if (this.userProgress.lastActiveDate !== today) {
      // Streak broken
      this.userProgress.streak = 1;
    }

    this.userProgress.lastActiveDate = today;
  }

  getProgress(): UserProgress {
    return { ...this.userProgress };
  }

  getAchievements(): Achievement[] {
    return Array.from(this.achievements.values());
  }

  getUnlockedAchievements(): Achievement[] {
    return this.userProgress.achievements;
  }

  getProgressToNextLevel(): number {
    return (this.userProgress.xp / this.userProgress.xpForNextLevel) * 100;
  }

  private isUnlocked(id: string): boolean {
    return this.userProgress.achievements.some(a => a.id === id);
  }

  private calculateXPForLevel(level: number): number {
    return Math.floor(100 * Math.pow(1.5, level - 1));
  }

  private initializeAchievements(): void {
    const achievementList: Achievement[] = [
      // Streak achievements (6)
      {
        id: 'streak-3',
        name: 'Lightning Strike',
        description: 'Code for 3 days in a row',
        icon: '⚡',
        category: 'streak',
        xp: 50,
        unlocked: false,
        requirement: 3,
      },
      {
        id: 'streak-7',
        name: 'Week Warrior',
        description: 'Code for 7 days in a row',
        icon: '🔥',
        category: 'streak',
        xp: 100,
        unlocked: false,
        requirement: 7,
      },
      {
        id: 'streak-30',
        name: 'Month Master',
        description: 'Code for 30 days in a row',
        icon: '🏆',
        category: 'streak',
        xp: 500,
        unlocked: false,
        requirement: 30,
      },
      {
        id: 'streak-90',
        name: 'Quarter Champion',
        description: 'Code for 90 days in a row',
        icon: '💎',
        category: 'streak',
        xp: 2000,
        unlocked: false,
        requirement: 90,
      },
      {
        id: 'streak-100',
        name: 'Unstoppable',
        description: 'Code for 100 days in a row',
        icon: '🌊',
        category: 'streak',
        xp: 5000,
        unlocked: false,
        requirement: 100,
      },
      {
        id: 'streak-365',
        name: 'Year King',
        description: 'Code for 365 days in a row',
        icon: '👑',
        category: 'streak',
        xp: 10000,
        unlocked: false,
        requirement: 365,
      },
      // Commit milestones (7)
      {
        id: 'commits-1',
        name: 'First Commit',
        description: 'Make your first commit',
        icon: '🎖️',
        category: 'milestone',
        xp: 25,
        unlocked: false,
        requirement: 1,
      },
      {
        id: 'commits-10',
        name: 'Rookie',
        description: 'Make 10 commits',
        icon: '🚀',
        category: 'milestone',
        xp: 50,
        unlocked: false,
        requirement: 10,
      },
      {
        id: 'commits-100',
        name: 'Century',
        description: 'Make 100 commits',
        icon: '💯',
        category: 'milestone',
        xp: 200,
        unlocked: false,
        requirement: 100,
      },
      {
        id: 'commits-500',
        name: 'Productive',
        description: 'Make 500 commits',
        icon: '📈',
        category: 'milestone',
        xp: 500,
        unlocked: false,
        requirement: 500,
      },
      {
        id: 'commits-1000',
        name: 'Millennium',
        description: 'Make 1000 commits',
        icon: '🌟',
        category: 'milestone',
        xp: 1000,
        unlocked: false,
        requirement: 1000,
      },
      {
        id: 'commits-5000',
        name: 'Legendary',
        description: 'Make 5000 commits',
        icon: '💪',
        category: 'milestone',
        xp: 5000,
        unlocked: false,
        requirement: 5000,
      },
      {
        id: 'commits-10000',
        name: 'Epic Coder',
        description: 'Make 10000 commits',
        icon: '🦸',
        category: 'milestone',
        xp: 15000,
        unlocked: false,
        requirement: 10000,
      },
      // Time tracking (5)
      {
        id: 'hours-100',
        name: 'Centurion',
        description: 'Code for 100 hours',
        icon: '⏱️',
        category: 'milestone',
        xp: 300,
        unlocked: false,
        requirement: 100,
      },
      {
        id: 'hours-500',
        name: 'Time Lord',
        description: 'Code for 500 hours',
        icon: '⌚',
        category: 'milestone',
        xp: 2000,
        unlocked: false,
        requirement: 500,
      },
      {
        id: 'hours-1000',
        name: 'Marathon',
        description: 'Code for 1000 hours',
        icon: '🕐',
        category: 'milestone',
        xp: 5000,
        unlocked: false,
        requirement: 1000,
      },
      {
        id: 'early-bird',
        name: 'Early Bird',
        description: 'Code before 8am',
        icon: '⏰',
        category: 'milestone',
        xp: 100,
        unlocked: false,
        requirement: 1,
      },
      {
        id: 'night-owl',
        name: 'Night Owl',
        description: 'Code after midnight',
        icon: '🌙',
        category: 'milestone',
        xp: 100,
        unlocked: false,
        requirement: 1,
      },
      // Mastery & Focus (6)
      {
        id: 'focus-50',
        name: 'Focus Master',
        description: 'Complete 50 focus sessions',
        icon: '🎯',
        category: 'mastery',
        xp: 250,
        unlocked: false,
        requirement: 50,
      },
      {
        id: 'pomodoro-100',
        name: 'Tomato King',
        description: 'Complete 100 Pomodoro sessions',
        icon: '🍅',
        category: 'mastery',
        xp: 300,
        unlocked: false,
        requirement: 100,
      },
      {
        id: 'zen-20',
        name: 'Zen Master',
        description: 'Complete 20 zen mode sessions',
        icon: '🧘',
        category: 'mastery',
        xp: 200,
        unlocked: false,
        requirement: 20,
      },
      {
        id: 'deep-work-10',
        name: 'Deep Worker',
        description: '10 hours of deep work',
        icon: '💡',
        category: 'mastery',
        xp: 300,
        unlocked: false,
        requirement: 10,
      },
      {
        id: 'flow-state',
        name: 'Flow State',
        description: 'Code for 5 hours straight',
        icon: '🔮',
        category: 'mastery',
        xp: 250,
        unlocked: false,
        requirement: 5,
      },
      {
        id: 'no-context-switch',
        name: 'Multi-tasker Avoided',
        description: 'No context switches for a day',
        icon: '🎪',
        category: 'mastery',
        xp: 150,
        unlocked: false,
        requirement: 1,
      },
      // Discovery (4)
      {
        id: 'first-repo',
        name: 'Explorer',
        description: 'Explore your first repository',
        icon: '🗺️',
        category: 'discovery',
        xp: 50,
        unlocked: false,
        requirement: 1,
      },
      {
        id: 'repos-10',
        name: 'World Traveler',
        description: 'Explore 10 repositories',
        icon: '🌍',
        category: 'discovery',
        xp: 200,
        unlocked: false,
        requirement: 10,
      },
      {
        id: 'team-player',
        name: 'Team Player',
        description: 'Collaborate on a PR',
        icon: '🤝',
        category: 'discovery',
        xp: 150,
        unlocked: false,
        requirement: 1,
      },
      {
        id: 'learner',
        name: 'Learner',
        description: 'Read 50 documentation files',
        icon: '📚',
        category: 'discovery',
        xp: 100,
        unlocked: false,
        requirement: 50,
      },
    ];

    achievementList.forEach(achievement => {
      this.achievements.set(achievement.id, achievement);
    });
  }
}
