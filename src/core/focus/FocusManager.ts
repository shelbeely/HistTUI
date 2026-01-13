/**
 * Focus Mode Manager
 * Eliminates distractions for deep work - perfect for ADHD developers
 */

export interface FocusModeConfig {
  hideStatusBar: boolean;
  hideBreadcrumbs: boolean;
  hideHelpHints: boolean;
  dimInactive: boolean;
  notificationsOff: boolean;
  zenMode: boolean; // Absolute minimal UI
}

export interface FocusSession {
  startTime: number;
  endTime?: number;
  screenFocused: string;
  interruptionCount: number;
  deepWorkMinutes: number;
}

export class FocusManager {
  private config: FocusModeConfig;
  private isActive: boolean = false;
  private currentSession: FocusSession | null = null;
  private interruptionTimer: NodeJS.Timeout | null = null;

  constructor(config: FocusModeConfig) {
    this.config = config;
  }

  activate(screenName: string): FocusSession {
    this.isActive = true;
    this.currentSession = {
      startTime: Date.now(),
      screenFocused: screenName,
      interruptionCount: 0,
      deepWorkMinutes: 0,
    };

    // Start tracking deep work time
    this.startDeepWorkTracking();

    return this.currentSession;
  }

  deactivate(): FocusSession | null {
    if (!this.currentSession) return null;

    this.isActive = false;
    this.currentSession.endTime = Date.now();
    
    if (this.interruptionTimer) {
      clearInterval(this.interruptionTimer);
      this.interruptionTimer = null;
    }

    const session = this.currentSession;
    this.currentSession = null;
    
    return session;
  }

  recordInterruption(): void {
    if (this.currentSession) {
      this.currentSession.interruptionCount++;
    }
  }

  isInFocusMode(): boolean {
    return this.isActive;
  }

  getCurrentSession(): FocusSession | null {
    return this.currentSession;
  }

  getConfig(): FocusModeConfig {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<FocusModeConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  shouldHideElement(element: 'statusBar' | 'breadcrumbs' | 'helpHints'): boolean {
    if (!this.isActive) return false;

    switch (element) {
      case 'statusBar':
        return this.config.hideStatusBar || this.config.zenMode;
      case 'breadcrumbs':
        return this.config.hideBreadcrumbs || this.config.zenMode;
      case 'helpHints':
        return this.config.hideHelpHints || this.config.zenMode;
      default:
        return false;
    }
  }

  shouldDimInactive(): boolean {
    return this.isActive && this.config.dimInactive;
  }

  shouldBlockNotifications(): boolean {
    return this.isActive && this.config.notificationsOff;
  }

  isZenMode(): boolean {
    return this.isActive && this.config.zenMode;
  }

  private startDeepWorkTracking(): void {
    // Track deep work time every minute
    this.interruptionTimer = setInterval(() => {
      if (this.currentSession) {
        this.currentSession.deepWorkMinutes++;
      }
    }, 60000); // 1 minute
  }

  getFocusScore(): number {
    if (!this.currentSession) return 0;

    const duration = (Date.now() - this.currentSession.startTime) / 60000; // minutes
    const interruptions = this.currentSession.interruptionCount;
    
    // Score: 100 - (interruptions * 10), minimum 0
    const score = Math.max(0, 100 - (interruptions * 10));
    
    return score;
  }

  getSessionSummary(): string {
    if (!this.currentSession) return 'No active focus session';

    const duration = Math.floor((Date.now() - this.currentSession.startTime) / 60000);
    const score = this.getFocusScore();

    return `Focus: ${duration} min | Score: ${score} | Interruptions: ${this.currentSession.interruptionCount}`;
  }
}
