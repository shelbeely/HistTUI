/**
 * Application context for HistTUI
 * Manages global state and provides it to all components
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AppState, Screen, Commit, SearchFilter } from '../types';

interface AppContextValue extends AppState {
  setScreen: (screen: Screen) => void;
  setSelectedCommit: (commit: Commit | undefined) => void;
  setSelectedBranch: (branch: string | undefined) => void;
  setSelectedFile: (file: string | undefined) => void;
  setFilter: (filter: SearchFilter) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | undefined) => void;
  updateFilter: (updates: Partial<SearchFilter>) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children, repoPath }: { children: ReactNode; repoPath: string }) {
  const [screen, setScreen] = useState<Screen>('dashboard-activity');
  const [selectedCommit, setSelectedCommit] = useState<Commit | undefined>();
  const [selectedBranch, setSelectedBranch] = useState<string | undefined>();
  const [selectedFile, setSelectedFile] = useState<string | undefined>();
  const [filter, setFilter] = useState<SearchFilter>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const updateFilter = useCallback((updates: Partial<SearchFilter>) => {
    setFilter(prev => ({ ...prev, ...updates }));
  }, []);

  const value: AppContextValue = {
    screen,
    repoPath,
    selectedCommit,
    selectedBranch,
    selectedFile,
    filter,
    loading,
    error,
    setScreen,
    setSelectedCommit,
    setSelectedBranch,
    setSelectedFile,
    setFilter,
    setLoading,
    setError,
    updateFilter,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
