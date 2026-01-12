/**
 * Core type definitions for HistTUI
 */

import type React from 'react';

export interface Commit {
  hash: string;
  shortHash: string;
  author: string;
  authorEmail: string;
  date: Date;
  message: string;
  subject: string;
  body: string;
  parents: string[];
  refs: string[];
  filesChanged: number;
  insertions: number;
  deletions: number;
}

export interface CommitDetail extends Commit {
  diff: string;
  files: FileChange[];
}

export interface FileChange {
  path: string;
  oldPath?: string;
  status: 'added' | 'modified' | 'deleted' | 'renamed';
  additions: number;
  deletions: number;
  binary: boolean;
}

export interface Branch {
  name: string;
  commit: string;
  current: boolean;
  remote: boolean;
}

export interface Tag {
  name: string;
  commit: string;
  message?: string;
  date?: Date;
}

export interface FileTreeNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileTreeNode[];
  size?: number;
}

export interface DashboardData {
  activityByDay: { date: string; commits: number }[];
  activityByHour: { hour: number; commits: number }[];
  topAuthors: { author: string; commits: number; insertions: number; deletions: number }[];
  fileHotspots: { path: string; changes: number; authors: number }[];
  recentActivity: { date: string; commits: number; authors: string[] }[];
}

export interface OwnershipData {
  path: string;
  owners: { author: string; lines: number; percentage: number }[];
  busFactor: number;
}

export interface SearchFilter {
  author?: string;
  dateFrom?: Date;
  dateTo?: Date;
  path?: string;
  message?: string;
  branch?: string;
}

export interface AppConfig {
  cacheDir: string;
  maxCommits: number;
  defaultBranch?: string;
  keyBindings: KeyBindings;
  theme: Theme;
}

export interface KeyBindings {
  quit: string[];
  help: string[];
  search: string[];
  navigate: {
    up: string[];
    down: string[];
    left: string[];
    right: string[];
    pageUp: string[];
    pageDown: string[];
    home: string[];
    end: string[];
  };
  tabs: {
    next: string[];
    prev: string[];
    timeline: string[];
    branches: string[];
    files: string[];
    dashboards: string[];
  };
}

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

export type Screen = 
  | 'timeline'
  | 'commit-detail'
  | 'branches'
  | 'files'
  | 'dashboard-activity'
  | 'dashboard-hotspots'
  | 'dashboard-ownership'
  | 'search'
  | 'help';

export interface AppState {
  screen: Screen;
  repoPath: string;
  selectedCommit?: Commit;
  selectedBranch?: string;
  selectedFile?: string;
  filter: SearchFilter;
  loading: boolean;
  error?: string;
}

// Plugin System Types
export interface Plugin {
  name: string;
  version: string;
  description: string;
  init: (api: PluginAPI) => Promise<void>;
  cleanup?: () => Promise<void>;
}

export interface PluginAPI {
  registerScreen: (screen: CustomScreen) => void;
  registerDashboard: (dashboard: CustomDashboard) => void;
  registerIndexer: (indexer: CustomIndexer) => void;
  getDatabase: () => any; // Database instance
  getGitClient: () => any; // Git client instance
  logger: Logger;
}

export interface CustomScreen {
  id: string;
  name: string;
  shortcut?: string;
  render: (props: any) => React.JSX.Element;
}

export interface CustomDashboard {
  id: string;
  name: string;
  query: (db: any) => Promise<any>;
  render: (data: any) => React.JSX.Element;
}

export interface CustomIndexer {
  id: string;
  name: string;
  init: (db: any) => void; // Initialize custom tables
  index: (db: any, commits: Commit[]) => Promise<void>;
}

export interface Logger {
  info: (message: string, ...args: any[]) => void;
  warn: (message: string, ...args: any[]) => void;
  error: (message: string, ...args: any[]) => void;
  debug: (message: string, ...args: any[]) => void;
}
