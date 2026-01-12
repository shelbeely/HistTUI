/**
 * Pomodoro Timer for Focus Management
 * Designed for ADHD developers - helps maintain focus with structured work/break cycles
 */

import { EventEmitter } from 'events';

export interface PomodoroConfig {
  workDuration: number; // minutes
  breakDuration: number; // minutes
  longBreakDuration: number; // minutes
  sessionsBeforeLongBreak: number;
  autoStart: boolean;
  soundEnabled: boolean;
  soundVolume: number; // 0.0 - 1.0
}

export interface PomodoroState {
  phase: 'work' | 'break' | 'long-break' | 'idle';
  remainingSeconds: number;
  totalSeconds: number;
  sessionsCompleted: number;
  isRunning: boolean;
  isPaused: boolean;
}

export class PomodoroTimer extends EventEmitter {
  private config: PomodoroConfig;
  private state: PomodoroState;
  private intervalId: NodeJS.Timeout | null = null;
  private startTime: number = 0;

  constructor(config: PomodoroConfig) {
    super();
    this.config = config;
    this.state = {
      phase: 'idle',
      remainingSeconds: config.workDuration * 60,
      totalSeconds: config.workDuration * 60,
      sessionsCompleted: 0,
      isRunning: false,
      isPaused: false,
    };
  }

  start(): void {
    if (this.state.isRunning) return;

    this.state.isRunning = true;
    this.state.isPaused = false;
    this.startTime = Date.now();

    if (this.state.phase === 'idle') {
      this.startWorkSession();
    }

    this.intervalId = setInterval(() => this.tick(), 1000);
    this.emit('start', this.state);
  }

  pause(): void {
    if (!this.state.isRunning || this.state.isPaused) return;

    this.state.isPaused = true;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.emit('pause', this.state);
  }

  resume(): void {
    if (!this.state.isPaused) return;

    this.state.isPaused = false;
    this.intervalId = setInterval(() => this.tick(), 1000);
    this.emit('resume', this.state);
  }

  stop(): void {
    this.state.isRunning = false;
    this.state.isPaused = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.emit('stop', this.state);
  }

  reset(): void {
    this.stop();
    this.state = {
      phase: 'idle',
      remainingSeconds: this.config.workDuration * 60,
      totalSeconds: this.config.workDuration * 60,
      sessionsCompleted: 0,
      isRunning: false,
      isPaused: false,
    };
    this.emit('reset', this.state);
  }

  skip(): void {
    // Skip to next phase
    this.handlePhaseComplete();
  }

  private tick(): void {
    if (this.state.isPaused) return;

    this.state.remainingSeconds--;

    if (this.state.remainingSeconds <= 0) {
      this.handlePhaseComplete();
    } else {
      this.emit('tick', this.state);
    }

    // Emit warnings at 5 min, 1 min, 30 sec
    if ([300, 60, 30].includes(this.state.remainingSeconds)) {
      this.emit('warning', {
        phase: this.state.phase,
        remaining: this.state.remainingSeconds,
      });
    }
  }

  private handlePhaseComplete(): void {
    this.playSound('complete');

    if (this.state.phase === 'work') {
      this.state.sessionsCompleted++;
      this.emit('work-complete', {
        sessions: this.state.sessionsCompleted,
        duration: this.config.workDuration,
      });

      // Determine if long break
      const isLongBreak = this.state.sessionsCompleted % this.config.sessionsBeforeLongBreak === 0;
      this.startBreak(isLongBreak);
    } else {
      // Break complete
      this.emit('break-complete', {
        type: this.state.phase,
      });

      if (this.config.autoStart) {
        this.startWorkSession();
      } else {
        this.state.phase = 'idle';
        this.state.isRunning = false;
        if (this.intervalId) {
          clearInterval(this.intervalId);
          this.intervalId = null;
        }
      }
    }
  }

  private startWorkSession(): void {
    this.state.phase = 'work';
    this.state.remainingSeconds = this.config.workDuration * 60;
    this.state.totalSeconds = this.config.workDuration * 60;
    this.playSound('work-start');
    this.emit('phase-change', this.state);
  }

  private startBreak(isLong: boolean): void {
    this.state.phase = isLong ? 'long-break' : 'break';
    const duration = isLong ? this.config.longBreakDuration : this.config.breakDuration;
    this.state.remainingSeconds = duration * 60;
    this.state.totalSeconds = duration * 60;
    this.playSound('break-start');
    this.emit('phase-change', this.state);

    if (!this.config.autoStart) {
      this.pause();
    }
  }

  private playSound(type: 'work-start' | 'break-start' | 'complete'): void {
    if (!this.config.soundEnabled) return;

    // In a real implementation, this would play actual sounds
    // For now, it emits events that the UI can handle
    this.emit('sound', { type, volume: this.config.soundVolume });
  }

  getState(): PomodoroState {
    return { ...this.state };
  }

  updateConfig(newConfig: Partial<PomodoroConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.emit('config-update', this.config);
  }

  getFormattedTime(): string {
    const minutes = Math.floor(this.state.remainingSeconds / 60);
    const seconds = this.state.remainingSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  getProgress(): number {
    return ((this.state.totalSeconds - this.state.remainingSeconds) / this.state.totalSeconds) * 100;
  }
}
