/**
 * Quest System for Daily Challenges
 * Provides fresh goals every day for ADHD motivation
 */

export interface Quest {
  id: string;
  title: string;
  description: string;
  icon: string;
  xp: number;
  progress: number;
  target: number;
  type: QuestType;
  completed: boolean;
  completedAt?: number;
}

export type QuestType =
  | 'commits'
  | 'focus'
  | 'review'
  | 'explore'
  | 'time'
  | 'streak'
  | 'early'
  | 'late'
  | 'zen'
  | 'branch';

export interface DailyQuestSet {
  date: string;
  quests: Quest[];
  allCompleted: boolean;
  bonusAwarded: boolean;
}

export class QuestSystem {
  private currentQuests: Quest[] = [];
  private questDate: string;
  private questTemplates: Map<QuestType, Omit<Quest, 'id' | 'progress' | 'completed'>>;

  constructor() {
    this.questDate = this.getToday();
    this.initializeQuestTemplates();
    this.generateDailyQuests();
  }

  /**
   * Get today's active quests
   */
  getCurrentQuests(): Quest[] {
    this.checkDateRollover();
    return [...this.currentQuests];
  }

  /**
   * Update quest progress
   */
  updateProgress(type: QuestType, amount: number = 1): Quest | null {
    this.checkDateRollover();

    const quest = this.currentQuests.find(q => q.type === type && !q.completed);
    if (!quest) return null;

    quest.progress = Math.min(quest.progress + amount, quest.target);

    if (quest.progress >= quest.target && !quest.completed) {
      quest.completed = true;
      quest.completedAt = Date.now();
      return quest;
    }

    return null;
  }

  /**
   * Check if all quests are complete
   */
  areAllQuestsComplete(): boolean {
    return this.currentQuests.every(q => q.completed);
  }

  /**
   * Get total XP available today
   */
  getTotalXPAvailable(): number {
    return this.currentQuests.reduce((sum, q) => sum + q.xp, 0);
  }

  /**
   * Get earned XP so far
   */
  getEarnedXP(): number {
    return this.currentQuests
      .filter(q => q.completed)
      .reduce((sum, q) => sum + q.xp, 0);
  }

  /**
   * Get completion percentage
   */
  getCompletionPercentage(): number {
    const completed = this.currentQuests.filter(q => q.completed).length;
    return (completed / this.currentQuests.length) * 100;
  }

  /**
   * Generate 3 random daily quests
   */
  private generateDailyQuests(): void {
    const types: QuestType[] = [
      'commits',
      'focus',
      'review',
      'explore',
      'time',
      'streak',
      'early',
      'late',
      'zen',
      'branch',
    ];

    // Shuffle and pick 3
    const shuffled = types.sort(() => Math.random() - 0.5);
    const selectedTypes = shuffled.slice(0, 3);

    this.currentQuests = selectedTypes.map((type, index) => {
      const template = this.questTemplates.get(type)!;
      return {
        id: `${this.questDate}-quest-${index}`,
        ...template,
        type,
        progress: 0,
        completed: false,
      };
    });
  }

  /**
   * Check if date has changed and regenerate quests
   */
  private checkDateRollover(): void {
    const today = this.getToday();
    if (today !== this.questDate) {
      this.questDate = today;
      this.generateDailyQuests();
    }
  }

  /**
   * Get today's date as YYYY-MM-DD
   */
  private getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Initialize all quest templates
   */
  private initializeQuestTemplates(): void {
    this.questTemplates = new Map([
      [
        'commits',
        {
          title: 'Code Sprint',
          description: 'Make 5 commits today',
          icon: '🚀',
          xp: 50,
          target: 5,
        },
      ],
      [
        'focus',
        {
          title: 'Focus Hero',
          description: 'Complete 3 Pomodoro sessions',
          icon: '🍅',
          xp: 75,
          target: 3,
        },
      ],
      [
        'review',
        {
          title: 'Diff Master',
          description: 'Review 10 commits',
          icon: '🔍',
          xp: 60,
          target: 10,
        },
      ],
      [
        'explore',
        {
          title: 'Explorer',
          description: 'View 5 different files',
          icon: '🗺️',
          xp: 40,
          target: 5,
        },
      ],
      [
        'time',
        {
          title: 'Time Tracker',
          description: 'Code for 2 hours',
          icon: '⏱️',
          xp: 80,
          target: 120, // minutes
        },
      ],
      [
        'streak',
        {
          title: 'Streak Saver',
          description: "Don't break your streak!",
          icon: '🔥',
          xp: 100,
          target: 1,
        },
      ],
      [
        'early',
        {
          title: 'Early Start',
          description: 'Code before 9am',
          icon: '🌅',
          xp: 60,
          target: 1,
        },
      ],
      [
        'late',
        {
          title: 'Night Session',
          description: 'Code after 9pm',
          icon: '🌙',
          xp: 60,
          target: 1,
        },
      ],
      [
        'zen',
        {
          title: 'Zen Mode',
          description: 'Use focus mode for 1 hour',
          icon: '🧘',
          xp: 70,
          target: 60, // minutes
        },
      ],
      [
        'branch',
        {
          title: 'Branch Hopper',
          description: 'Switch between 3 branches',
          icon: '🌿',
          xp: 50,
          target: 3,
        },
      ],
    ]);
  }

  /**
   * Get quest by type
   */
  getQuestByType(type: QuestType): Quest | undefined {
    return this.currentQuests.find(q => q.type === type);
  }

  /**
   * Check if quest is active
   */
  isQuestActive(type: QuestType): boolean {
    return this.currentQuests.some(q => q.type === type && !q.completed);
  }

  /**
   * Get remaining quests
   */
  getRemainingQuests(): Quest[] {
    return this.currentQuests.filter(q => !q.completed);
  }

  /**
   * Get completed quests
   */
  getCompletedQuests(): Quest[] {
    return this.currentQuests.filter(q => q.completed);
  }
}
