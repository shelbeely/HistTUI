/**
 * Main App Component for HistTUI
 * Orchestrates all screens and manages app state
 */

import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { Spinner, ThemeProvider, ProgressBar } from '@inkjs/ui';
import { AppProvider, useApp } from './AppContext';
import { TimelineScreen } from './screens/TimelineScreen';
import { CommitDetailScreen } from './screens/CommitDetailScreen';
import { BranchesScreen } from './screens/BranchesScreen';
import { FileTreeScreen } from './screens/FileTreeScreen';
import { FuzzySearchScreen } from './screens/FuzzySearchScreen';
import { ChangelogViewerScreen } from './screens/ChangelogViewerScreen';
import { ActivityDashboard } from './dashboards/ActivityDashboard';
import { ErrorDisplay } from './common/UI';
import { GenerativeStatusBar } from './common/GenerativeStatusBar';
import { SetupWizard, SetupConfig } from './common/SetupWizard';
import { GitClient } from '../core/git';
import { GitDatabase } from '../core/database';
import { GitIndexer, IndexProgress } from '../core/indexer';
import { CacheManager } from '../core/cache';
import { PluginManager } from '../plugins';
import { AGUIProvider } from '../core/ag-ui';
import { config } from '../config';
import { getRepoName, normalizeRepoUrl } from '../utils';
import { logger } from '../utils/logger';
import { createInkUITheme } from '../config/inkui-theme';
import { RepoInputScreen } from './common/RepoInputScreen';

interface AppProps {
  repoUrl?: string;
  skipUpdate?: boolean;
}

function AppContent({
  gitClient,
  database,
  pluginManager,
  repoName,
}: {
  gitClient: GitClient;
  database: GitDatabase;
  pluginManager: PluginManager;
  repoName: string;
}) {
  const { screen, error, setError } = useApp();

  const getScreenName = (screenId: string) => {
    const screenNames: Record<string, string> = {
      'timeline': 'Timeline',
      'commit-detail': 'Commit Details',
      'branches': 'Branches & Tags',
      'files': 'File Tree',
      'search': 'Search',
      'dashboard-activity': 'Activity Dashboard',
    };
    return screenNames[screenId] || 'Dashboard';
  };

  if (error) {
    return (
      <Box flexDirection="column" height="100%">
        <GenerativeStatusBar repoName={repoName} currentScreen="Error" />
        <Box flexDirection="column" padding={1} flexGrow={1}>
          <ErrorDisplay error={error} onDismiss={() => setError(undefined)} />
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" height="100%">
      <GenerativeStatusBar repoName={repoName} currentScreen={getScreenName(screen)} />
      <Box flexGrow={1}>
        {screen === 'timeline' && <TimelineScreen database={database} />}
        {screen === 'commit-detail' && <CommitDetailScreen gitClient={gitClient} />}
        {screen === 'branches' && <BranchesScreen database={database} />}
        {screen === 'files' && <FileTreeScreen gitClient={gitClient} />}
        {screen === 'search' && <FuzzySearchScreen database={database} />}
        {screen === 'dashboard-activity' && <ActivityDashboard database={database} />}
        {!['timeline', 'commit-detail', 'branches', 'files', 'search', 'dashboard-activity'].includes(screen) && (
          <ActivityDashboard database={database} />
        )}
      </Box>
    </Box>
  );
}

function LoadingScreen({ progress }: { progress: IndexProgress }) {
  return (
    <Box flexDirection="column" padding={2} alignItems="center" justifyContent="center">
      <Box marginBottom={1}>
        <Text bold color="cyan">
          HistTUI - Git History Explorer
        </Text>
      </Box>
      <Box gap={1}>
        <Spinner label={progress.message} />
      </Box>
      {progress.progress !== undefined && (
        <Box marginTop={1} flexDirection="column" width={50}>
          <ProgressBar value={progress.progress} />
          {progress.current !== undefined && progress.total !== undefined && (
            <Text dimColor>
              {' '}
              ({progress.current}/{progress.total})
            </Text>
          )}
        </Box>
      )}
    </Box>
  );
}

export function App({ repoUrl: initialRepoUrl, skipUpdate = false }: AppProps) {
  const [showSetup, setShowSetup] = useState(config.isFirstLaunch());
  const [repoUrl, setRepoUrl] = useState<string | undefined>(initialRepoUrl);
  const [showRepoInput, setShowRepoInput] = useState(!initialRepoUrl);
  const [indexProgress, setIndexProgress] = useState<IndexProgress | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gitClient, setGitClient] = useState<GitClient | null>(null);
  const [database, setDatabase] = useState<GitDatabase | null>(null);
  const [pluginManager, setPluginManager] = useState<PluginManager | null>(null);
  const [repoName, setRepoName] = useState<string>('');

  const handleRepoSubmit = (url: string) => {
    setRepoUrl(url);
    setShowRepoInput(false);
  };

  const handleSetupComplete = (setupConfig: SetupConfig) => {
    // Save LLM configuration
    if (setupConfig.llmProvider && setupConfig.llmProvider !== 'none') {
      config.updateLLMConfig({
        provider: setupConfig.llmProvider,
        apiKey: setupConfig.apiKey,
        model: setupConfig.model,
        baseUrl: setupConfig.baseUrl,
      });
    }

    // Save AG-UI configuration
    if (setupConfig.enableAGUI) {
      config.updateAGUIConfig({
        enabled: true,
        endpoint: setupConfig.agentEndpoint,
      });
    }

    // Hide setup wizard and continue to app
    setShowSetup(false);
  };

  const handleSetupSkip = () => {
    // Mark as configured with defaults
    config.updateLLMConfig({ provider: 'none' });
    setShowSetup(false);
  };

  useEffect(() => {
    if (repoUrl && !showSetup) {
      initializeApp();
    }
  }, [repoUrl, showSetup]);

  async function initializeApp() {
    if (!repoUrl) return;
    try {
      const normalizedUrl = normalizeRepoUrl(repoUrl);
      const name = getRepoName(normalizedUrl);
      setRepoName(name);

      logger.info('Initializing HistTUI for:', name);

      // Initialize cache manager
      config.ensureCacheDir();
      const cacheManager = new CacheManager(config.getCacheDir());

      const repoPath = cacheManager.getRepoPath(normalizedUrl);
      const dbPath = cacheManager.getDbPath(normalizedUrl);

      // Clone or update repository
      let client: GitClient;

      if (!cacheManager.isCached(normalizedUrl)) {
        setIndexProgress({
          phase: 'cloning',
          message: `Cloning ${repoName}...`,
        });

        client = await GitClient.clone(normalizedUrl, repoPath, (message) => {
          setIndexProgress({
            phase: 'cloning',
            message,
          });
        });

        // Save cache info
        cacheManager.saveCacheInfo(normalizedUrl, {
          repoUrl: normalizedUrl,
          repoName: name,
          lastUpdated: new Date(),
          commitCount: 0,
        });
      } else {
        client = new GitClient(repoPath);

        if (!skipUpdate) {
          setIndexProgress({
            phase: 'cloning',
            message: 'Updating repository...',
          });

          await client.update((message) => {
            setIndexProgress({
              phase: 'cloning',
              message,
            });
          });
        }
      }

      // Initialize database
      const db = new GitDatabase(dbPath);

      // Initialize indexer
      const indexer = new GitIndexer(client, db, setIndexProgress);

      // Index repository if not already indexed
      if (!cacheManager.isIndexed(normalizedUrl) || !skipUpdate) {
        await indexer.indexAll(config.get().maxCommits);

        // Update cache info
        const stats = await client.getStats();
        cacheManager.saveCacheInfo(normalizedUrl, {
          repoUrl: normalizedUrl,
          repoName: name,
          lastUpdated: new Date(),
          commitCount: stats.totalCommits,
        });
      }

      // Initialize plugin manager
      const pluginMgr = new PluginManager(db, client);
      // Load plugins from config directory if it exists
      // await pluginMgr.loadPlugins(path.join(config.getCacheDir(), 'plugins'));

      setGitClient(client);
      setDatabase(db);
      setPluginManager(pluginMgr);
      setIsReady(true);

      logger.info('HistTUI initialized successfully');
    } catch (err) {
      logger.error('Failed to initialize app:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize application');
    }
  }

  const themeName = typeof config.get().ui.theme === 'string' ? config.get().ui.theme : 'default';

  // Show repository input if no URL provided
  if (showRepoInput) {
    return (
      <ThemeProvider theme={createInkUITheme(themeName)}>
        <RepoInputScreen onSubmit={handleRepoSubmit} />
      </ThemeProvider>
    );
  }

  // Show setup wizard on first launch (after repo input)
  if (showSetup) {
    return (
      <ThemeProvider theme={createInkUITheme(themeName)}>
        <SetupWizard onComplete={handleSetupComplete} onSkip={handleSetupSkip} />
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <Box flexDirection="column" padding={2}>
        <Text color="red" bold>
          ⚠ Error
        </Text>
        <Text>{error}</Text>
        <Box marginTop={1}>
          <Text dimColor>Press Ctrl+C to exit</Text>
        </Box>
      </Box>
    );
  }

  if (!isReady || !gitClient || !database || !pluginManager) {
    return (
      <ThemeProvider theme={createInkUITheme(themeName)}>
        <LoadingScreen progress={indexProgress || { phase: 'cloning', message: 'Initializing...' }} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={createInkUITheme(themeName)}>
      <AGUIProvider database={database} gitClient={gitClient} agentEndpoint={config.get().agui?.endpoint}>
        <AppProvider repoPath={repoUrl}>
          <AppContent 
            gitClient={gitClient} 
            database={database} 
            pluginManager={pluginManager} 
            repoName={repoName}
          />
        </AppProvider>
      </AGUIProvider>
    </ThemeProvider>
  );
}
