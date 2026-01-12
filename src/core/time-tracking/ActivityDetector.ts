/**
 * ActivityDetector - Detects user activity and idle time
 */

export class ActivityDetector {
  private lastActivity: number = Date.now();
  private idleTimeout: number;
  private timer: NodeJS.Timeout | null = null;
  private onIdleCallback: (() => void) | null = null;

  constructor(idleTimeoutSeconds: number = 300) {
    this.idleTimeout = idleTimeoutSeconds * 1000;
  }

  start(onIdle: () => void): void {
    this.onIdleCallback = onIdle;
    this.lastActivity = Date.now();
    this.startTimer();
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  recordActivity(): void {
    this.lastActivity = Date.now();
  }

  isIdle(): boolean {
    return Date.now() - this.lastActivity > this.idleTimeout;
  }

  private startTimer(): void {
    this.timer = setInterval(() => {
      if (this.isIdle() && this.onIdleCallback) {
        this.onIdleCallback();
      }
    }, 10000);
  }
}
