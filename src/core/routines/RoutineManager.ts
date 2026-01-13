/**
 * Routine Template Manager
 * Reduces decision fatigue for developers with executive function challenges
 */

export interface RoutineStep {
  id: string;
  title: string;
  description: string;
  action?: string; // CLI command or action ID
  estimatedMinutes?: number;
  isOptional: boolean;
}

export interface RoutineTemplate {
  id: string;
  name: string;
  description: string;
  category: 'morning' | 'afternoon' | 'evening' | 'quick' | 'learning' | 'custom';
  steps: RoutineStep[];
  totalEstimatedMinutes: number;
  tags: string[];
  focusModeRecommended: boolean;
  pomodoroRecommended: boolean;
}

export interface RoutineSession {
  templateId: string;
  startTime: number;
  currentStep: number;
  completedSteps: string[];
  skippedSteps: string[];
  isCompleted: boolean;
}

export class RoutineManager {
  private templates: Map<string, RoutineTemplate> = new Map();
  private currentSession: RoutineSession | null = null;
  private history: RoutineSession[] = [];

  constructor() {
    this.loadBuiltInTemplates();
  }

  startRoutine(templateId: string): RoutineSession {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    this.currentSession = {
      templateId,
      startTime: Date.now(),
      currentStep: 0,
      completedSteps: [],
      skippedSteps: [],
      isCompleted: false,
    };

    return this.currentSession;
  }

  completeStep(stepId: string): void {
    if (!this.currentSession) return;

    this.currentSession.completedSteps.push(stepId);
    this.currentSession.currentStep++;

    const template = this.templates.get(this.currentSession.templateId);
    if (template && this.currentSession.currentStep >= template.steps.length) {
      this.completeRoutine();
    }
  }

  skipStep(stepId: string): void {
    if (!this.currentSession) return;

    this.currentSession.skippedSteps.push(stepId);
    this.currentSession.currentStep++;
  }

  completeRoutine(): void {
    if (!this.currentSession) return;

    this.currentSession.isCompleted = true;
    this.history.push(this.currentSession);
    this.currentSession = null;
  }

  getCurrentRoutine(): RoutineSession | null {
    return this.currentSession;
  }

  getCurrentStep(): RoutineStep | null {
    if (!this.currentSession) return null;

    const template = this.templates.get(this.currentSession.templateId);
    if (!template) return null;

    return template.steps[this.currentSession.currentStep] || null;
  }

  getProgress(): number {
    if (!this.currentSession) return 0;

    const template = this.templates.get(this.currentSession.templateId);
    if (!template) return 0;

    return (this.currentSession.completedSteps.length / template.steps.length) * 100;
  }

  suggestRoutine(timeOfDay: number): RoutineTemplate | null {
    // Simple time-based suggestions
    const hour = new Date().getHours();

    if (hour >= 6 && hour < 12) {
      return this.templates.get('morning-deep-work') || null;
    } else if (hour >= 12 && hour < 17) {
      return this.templates.get('quick-bug-fix') || null;
    } else if (hour >= 17 && hour < 22) {
      return this.templates.get('end-of-day') || null;
    }

    return null;
  }

  getAllTemplates(): RoutineTemplate[] {
    return Array.from(this.templates.values());
  }

  getTemplatesByCategory(category: string): RoutineTemplate[] {
    return Array.from(this.templates.values()).filter(t => t.category === category);
  }

  addCustomTemplate(template: RoutineTemplate): void {
    this.templates.set(template.id, template);
  }

  private loadBuiltInTemplates(): void {
    const builtIn: RoutineTemplate[] = [
      {
        id: 'morning-deep-work',
        name: 'Morning Deep Work',
        description: 'Focus mode + Pomodoro for complex tasks',
        category: 'morning',
        steps: [
          {
            id: 'review-goals',
            title: 'Review Today\'s Goals',
            description: 'Check your task list and prioritize',
            estimatedMinutes: 5,
            isOptional: false,
          },
          {
            id: 'enable-focus',
            title: 'Enable Focus Mode',
            description: 'Eliminate distractions',
            action: 'focus:enable',
            isOptional: false,
          },
          {
            id: 'start-pomodoro',
            title: 'Start Pomodoro Timer',
            description: '25 minutes of focused work',
            action: 'pomodoro:start',
            estimatedMinutes: 25,
            isOptional: false,
          },
          {
            id: 'deep-work',
            title: 'Deep Work Session',
            description: 'Work on most important task',
            estimatedMinutes: 90,
            isOptional: false,
          },
        ],
        totalEstimatedMinutes: 120,
        tags: ['focus', 'deep-work', 'morning'],
        focusModeRecommended: true,
        pomodoroRecommended: true,
      },
      {
        id: 'quick-bug-fix',
        name: 'Quick Bug Fix',
        description: 'Simple, direct workflow for small fixes',
        category: 'quick',
        steps: [
          {
            id: 'review-issue',
            title: 'Review Issue',
            description: 'Understand the bug',
            estimatedMinutes: 5,
            isOptional: false,
          },
          {
            id: 'locate-code',
            title: 'Locate Affected Code',
            description: 'Find the bug in the codebase',
            estimatedMinutes: 10,
            isOptional: false,
          },
          {
            id: 'fix-bug',
            title: 'Apply Fix',
            description: 'Make the code change',
            estimatedMinutes: 15,
            isOptional: false,
          },
          {
            id: 'test-fix',
            title: 'Test the Fix',
            description: 'Verify bug is resolved',
            estimatedMinutes: 10,
            isOptional: false,
          },
          {
            id: 'commit',
            title: 'Commit Changes',
            description: 'Write clear commit message',
            estimatedMinutes: 5,
            isOptional: false,
          },
        ],
        totalEstimatedMinutes: 45,
        tags: ['bug-fix', 'quick', 'afternoon'],
        focusModeRecommended: false,
        pomodoroRecommended: true,
      },
      {
        id: 'end-of-day',
        name: 'End of Day Review',
        description: 'Review progress and plan tomorrow',
        category: 'evening',
        steps: [
          {
            id: 'view-stats',
            title: 'View Today\'s Stats',
            description: 'Check time tracking and commits',
            action: 'stats:today',
            estimatedMinutes: 5,
            isOptional: false,
          },
          {
            id: 'review-commits',
            title: 'Review Commits',
            description: 'Look at what you accomplished',
            estimatedMinutes: 10,
            isOptional: false,
          },
          {
            id: 'plan-tomorrow',
            title: 'Plan Tomorrow',
            description: 'Set goals for next day',
            estimatedMinutes: 10,
            isOptional: false,
          },
          {
            id: 'celebrate',
            title: 'Celebrate Wins',
            description: 'Acknowledge your progress',
            estimatedMinutes: 5,
            isOptional: true,
          },
        ],
        totalEstimatedMinutes: 30,
        tags: ['review', 'planning', 'evening'],
        focusModeRecommended: false,
        pomodoroRecommended: false,
      },
    ];

    builtIn.forEach(template => {
      this.templates.set(template.id, template);
    });
  }
}
