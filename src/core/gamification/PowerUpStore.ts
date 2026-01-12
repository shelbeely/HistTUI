/**
 * Power-Up Store System
 * Temporary boosts for strategic gameplay
 */

export interface PowerUp {
  id: string;
  name: string;
  description: string;
  icon: string;
  cost: number; // XP cost
  duration: number; // minutes
  effect: PowerUpEffect;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export type PowerUpEffect =
  | 'xp-multiplier'
  | 'focus-boost'
  | 'luck-charm'
  | 'streak-shield'
  | 'instant-quest'
  | 'achievement-finder';

export interface ActivePowerUp {
  powerUp: PowerUp;
  activatedAt: number;
  expiresAt: number;
  remainingMinutes: number;
}

export class PowerUpStore {
  private availablePowerUps: Map<string, PowerUp>;
  private activePowerUps: Map<string, ActivePowerUp> = new Map();
  private ownedPowerUps: Map<string, number> = new Map(); // id -> quantity

  constructor() {
    this.availablePowerUps = this.initializePowerUps();
  }

  /**
   * Get all available power-ups
   */
  getAvailablePowerUps(): PowerUp[] {
    return Array.from(this.availablePowerUps.values());
  }

  /**
   * Purchase a power-up with XP
   */
  purchasePowerUp(powerUpId: string, currentXP: number): { success: boolean; newXP: number; message: string } {
    const powerUp = this.availablePowerUps.get(powerUpId);
    if (!powerUp) {
      return { success: false, newXP: currentXP, message: 'Power-up not found' };
    }

    if (currentXP < powerUp.cost) {
      return { success: false, newXP: currentXP, message: `Need ${powerUp.cost - currentXP} more XP` };
    }

    // Add to owned
    const currentCount = this.ownedPowerUps.get(powerUpId) || 0;
    this.ownedPowerUps.set(powerUpId, currentCount + 1);

    return {
      success: true,
      newXP: currentXP - powerUp.cost,
      message: `Purchased ${powerUp.name}!`,
    };
  }

  /**
   * Activate an owned power-up
   */
  activatePowerUp(powerUpId: string): { success: boolean; message: string } {
    const owned = this.ownedPowerUps.get(powerUpId) || 0;
    if (owned <= 0) {
      return { success: false, message: 'You don\'t own this power-up' };
    }

    const powerUp = this.availablePowerUps.get(powerUpId);
    if (!powerUp) {
      return { success: false, message: 'Power-up not found' };
    }

    // Check if already active
    if (this.activePowerUps.has(powerUpId)) {
      return { success: false, message: 'Power-up already active' };
    }

    // Activate
    const now = Date.now();
    const expiresAt = now + powerUp.duration * 60000;
    
    this.activePowerUps.set(powerUpId, {
      powerUp,
      activatedAt: now,
      expiresAt,
      remainingMinutes: powerUp.duration,
    });

    // Decrease owned count
    this.ownedPowerUps.set(powerUpId, owned - 1);

    return { success: true, message: `${powerUp.name} activated!` };
  }

  /**
   * Get all active power-ups
   */
  getActivePowerUps(): ActivePowerUp[] {
    this.updateActivePowerUps();
    return Array.from(this.activePowerUps.values());
  }

  /**
   * Check if specific power-up is active
   */
  isPowerUpActive(effect: PowerUpEffect): boolean {
    this.updateActivePowerUps();
    return Array.from(this.activePowerUps.values()).some(
      ap => ap.powerUp.effect === effect
    );
  }

  /**
   * Get power-up multiplier (for XP boosts)
   */
  getXPMultiplier(): number {
    if (this.isPowerUpActive('xp-multiplier')) {
      return 2.0;
    }
    return 1.0;
  }

  /**
   * Get focus boost value
   */
  getFocusBoost(): number {
    if (this.isPowerUpActive('focus-boost')) {
      return 0.5; // +50%
    }
    return 0;
  }

  /**
   * Check if luck charm is active (double quest rewards)
   */
  hasLuckCharm(): boolean {
    return this.isPowerUpActive('luck-charm');
  }

  /**
   * Check if streak shield is active
   */
  hasStreakShield(): boolean {
    return this.isPowerUpActive('streak-shield');
  }

  /**
   * Get owned power-up count
   */
  getOwnedCount(powerUpId: string): number {
    return this.ownedPowerUps.get(powerUpId) || 0;
  }

  /**
   * Get all owned power-ups
   */
  getOwnedPowerUps(): { powerUp: PowerUp; count: number }[] {
    const result: { powerUp: PowerUp; count: number }[] = [];
    
    for (const [id, count] of this.ownedPowerUps.entries()) {
      const powerUp = this.availablePowerUps.get(id);
      if (powerUp && count > 0) {
        result.push({ powerUp, count });
      }
    }

    return result;
  }

  /**
   * Update active power-ups (remove expired ones)
   */
  private updateActivePowerUps(): void {
    const now = Date.now();
    
    for (const [id, active] of this.activePowerUps.entries()) {
      if (now >= active.expiresAt) {
        this.activePowerUps.delete(id);
      } else {
        // Update remaining time
        active.remainingMinutes = Math.ceil((active.expiresAt - now) / 60000);
      }
    }
  }

  /**
   * Initialize all power-ups
   */
  private initializePowerUps(): Map<string, PowerUp> {
    const powerUps: PowerUp[] = [
      {
        id: 'xp-multiplier',
        name: '🔥 XP Multiplier',
        description: '2x XP for 1 hour',
        icon: '🔥',
        cost: 200,
        duration: 60,
        effect: 'xp-multiplier',
        rarity: 'rare',
      },
      {
        id: 'focus-boost',
        name: '⚡ Focus Boost',
        description: '+50% focus score for 30 minutes',
        icon: '⚡',
        cost: 150,
        duration: 30,
        effect: 'focus-boost',
        rarity: 'common',
      },
      {
        id: 'luck-charm',
        name: '🍀 Luck Charm',
        description: 'Double quest rewards for 2 hours',
        icon: '🍀',
        cost: 100,
        duration: 120,
        effect: 'luck-charm',
        rarity: 'common',
      },
      {
        id: 'streak-shield',
        name: '🎯 Streak Shield',
        description: 'Protect 1-day streak break (24h)',
        icon: '🎯',
        cost: 300,
        duration: 1440,
        effect: 'streak-shield',
        rarity: 'epic',
      },
      {
        id: 'instant-quest',
        name: '🌟 Instant Quest',
        description: 'Complete any active quest instantly',
        icon: '🌟',
        cost: 250,
        duration: 0, // Instant effect
        effect: 'instant-quest',
        rarity: 'rare',
      },
      {
        id: 'achievement-finder',
        name: '💎 Achievement Finder',
        description: 'Reveals 3 closest achievements (1 hour)',
        icon: '💎',
        cost: 500,
        duration: 60,
        effect: 'achievement-finder',
        rarity: 'legendary',
      },
    ];

    const map = new Map<string, PowerUp>();
    powerUps.forEach(pu => map.set(pu.id, pu));
    return map;
  }

  /**
   * Use streak shield to protect streak
   */
  useStreakShield(): boolean {
    if (this.hasStreakShield()) {
      // Remove the active shield (it's been used)
      this.activePowerUps.delete('streak-shield');
      return true;
    }
    return false;
  }
}
