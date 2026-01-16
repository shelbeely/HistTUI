/**
 * Configuration management for HistTUI
 */

import { AppConfig } from '../types';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';

const DEFAULT_CONFIG: AppConfig = {
  cacheDir: path.join(os.homedir(), '.histtui', 'cache'),
  maxCommits: 10000,
  keyBindings: {
    quit: ['q', 'ctrl+c'],
    help: ['?', 'h'],
    search: ['/', 'ctrl+f'],
    navigate: {
      up: ['k', 'up'],
      down: ['j', 'down'],
      left: ['h', 'left'],
      right: ['l', 'right'],
      pageUp: ['ctrl+u', 'pageup'],
      pageDown: ['ctrl+d', 'pagedown'],
      home: ['g', 'home'],
      end: ['G', 'end'],
    },
    tabs: {
      next: ['tab', 'ctrl+n'],
      prev: ['shift+tab', 'ctrl+p'],
      timeline: ['1'],
      branches: ['2'],
      files: ['3'],
      dashboards: ['4'],
    },
  },
  theme: {
    name: 'Default',
    colors: {
      primary: '#61afef',
      secondary: '#56b6c2',
      success: '#98c379',
      warning: '#e5c07b',
      error: '#e06c75',
      info: '#c678dd',
      background: '#282c34',
      foreground: '#abb2bf',
      muted: '#5c6370',
      border: '#3e4451',
      focusBorder: '#61afef',
    },
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      colorblindSafe: false,
    },
  },
  accessibility: {
    reducedMotion: false,
    highContrast: false,
    focusIndicatorStyle: 'default' as const,
    screenReaderMode: false,
    largeText: false,
  },
  timeTracking: {
    enabled: true,
    idleTimeout: 300,
    sessionGap: 900,
    trackFiles: true,
    trackLanguages: true,
  },
  ui: {
    theme: 'default',
    showBreadcrumbs: true,
    showHelpHints: true,
    progressiveDisclosure: false,
    animations: 'full' as const,
  },
};

export class ConfigManager {
  private config: AppConfig;
  private configPath: string;

  constructor() {
    this.configPath = path.join(os.homedir(), '.histtui', 'config.json');
    this.config = this.loadConfig();
  }

  private loadConfig(): AppConfig {
    try {
      if (fs.existsSync(this.configPath)) {
        const fileContent = fs.readFileSync(this.configPath, 'utf-8');
        const userConfig = JSON.parse(fileContent);
        return { ...DEFAULT_CONFIG, ...userConfig };
      }
    } catch (error) {
      // If config file is invalid, use defaults
    }
    return DEFAULT_CONFIG;
  }

  public saveConfig(): void {
    try {
      const configDir = path.dirname(this.configPath);
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
      }
      fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
    } catch (error) {
      // Fail silently for now
    }
  }

  public get(): AppConfig {
    return this.config;
  }

  public set(updates: Partial<AppConfig>): void {
    this.config = { ...this.config, ...updates };
    this.saveConfig();
  }

  public getCacheDir(): string {
    return this.config.cacheDir;
  }

  public ensureCacheDir(): void {
    if (!fs.existsSync(this.config.cacheDir)) {
      fs.mkdirSync(this.config.cacheDir, { recursive: true });
    }
  }

  public isFirstLaunch(): boolean {
    // Check if config file exists and has LLM configuration
    return !fs.existsSync(this.configPath) || !this.config.llm;
  }

  public updateLLMConfig(llmConfig: {
    provider: 'openai' | 'anthropic' | 'openrouter' | 'ollama' | 'copilot-sdk' | 'none';
    apiKey?: string;
    model?: string;
    baseUrl?: string;
  }): void {
    this.config = {
      ...this.config,
      llm: llmConfig,
    };
    this.saveConfig();
  }

  public updateAGUIConfig(aguiConfig: { enabled: boolean; endpoint?: string }): void {
    this.config = {
      ...this.config,
      agui: aguiConfig,
    };
    this.saveConfig();
  }
}

export const config = new ConfigManager();
