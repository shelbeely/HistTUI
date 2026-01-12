/**
 * Reward System
 * Visual celebrations and feedback
 */

export interface Celebration {
  type: CelebrationType;
  message: string;
  icon: string;
  animation: AnimationType;
  duration: number; // ms
  sound?: string;
}

export type CelebrationType =
  | 'level-up'
  | 'achievement'
  | 'quest-complete'
  | 'streak-milestone'
  | 'power-up'
  | 'personal-best'
  | 'challenge-complete';

export type AnimationType = 'confetti' | 'explosion' | 'fire' | 'bounce' | 'glow' | 'shine' | 'pulse';

export class RewardSystem {
  private celebrationQueue: Celebration[] = [];
  private enabled: boolean = true;
  private soundEnabled: boolean = true;

  /**
   * Trigger a celebration
   */
  celebrate(type: CelebrationType, details: { message: string; value?: number }): void {
    if (!this.enabled) return;

    const celebration = this.createCelebration(type, details);
    this.celebrationQueue.push(celebration);
  }

  /**
   * Get next celebration in queue
   */
  getNextCelebration(): Celebration | null {
    return this.celebrationQueue.shift() || null;
  }

  /**
   * Check if celebrations are queued
   */
  hasCelebrations(): boolean {
    return this.celebrationQueue.length > 0;
  }

  /**
   * Clear all celebrations
   */
  clearCelebrations(): void {
    this.celebrationQueue = [];
  }

  /**
   * Enable/disable celebrations
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Enable/disable sounds
   */
  setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
  }

  /**
   * Create celebration based on type
   */
  private createCelebration(
    type: CelebrationType,
    details: { message: string; value?: number }
  ): Celebration {
    const celebrations: Record<CelebrationType, Omit<Celebration, 'message'>> = {
      'level-up': {
        type: 'level-up',
        icon: '🎉',
        animation: 'confetti',
        duration: 3000,
        sound: 'levelup.wav',
      },
      achievement: {
        type: 'achievement',
        icon: '🏆',
        animation: 'explosion',
        duration: 2500,
        sound: 'achievement.wav',
      },
      'quest-complete': {
        type: 'quest-complete',
        icon: '✅',
        animation: 'bounce',
        duration: 2000,
        sound: 'quest.wav',
      },
      'streak-milestone': {
        type: 'streak-milestone',
        icon: '🔥',
        animation: 'fire',
        duration: 2500,
        sound: 'streak.wav',
      },
      'power-up': {
        type: 'power-up',
        icon: '⚡',
        animation: 'glow',
        duration: 2000,
        sound: 'powerup.wav',
      },
      'personal-best': {
        type: 'personal-best',
        icon: '🏅',
        animation: 'shine',
        duration: 2500,
        sound: 'record.wav',
      },
      'challenge-complete': {
        type: 'challenge-complete',
        icon: '🎯',
        animation: 'pulse',
        duration: 3000,
        sound: 'challenge.wav',
      },
    };

    const template = celebrations[type];

    return {
      ...template,
      message: details.message,
      sound: this.soundEnabled ? template.sound : undefined,
    };
  }

  /**
   * Get animation instructions for UI
   */
  getAnimationCSS(animation: AnimationType): string {
    const animations: Record<AnimationType, string> = {
      confetti: 'animate-confetti',
      explosion: 'animate-explosion',
      fire: 'animate-fire',
      bounce: 'animate-bounce',
      glow: 'animate-glow',
      shine: 'animate-shine',
      pulse: 'animate-pulse',
    };

    return animations[animation];
  }

  /**
   * Get celebration message with formatting
   */
  formatMessage(celebration: Celebration): string {
    return `${celebration.icon} ${celebration.message}`;
  }
}
