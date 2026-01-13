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
import { GitClient } from '../core/git';
import { GitDatabase } from '../core/database';
import { GitIndexer, IndexProgress } from '../core/indexer';
import { CacheManager } from '../core/cache';
import { PluginManager } from '../plugins';
import { config } from '../config';
import { getRepoName, normalizeRepoUrl } from '../utils';
import { logger } from '../utils/logger';
import { createInkUITheme } from '../config/inkui-theme';

interface AppProps {
  repoUrl: string;
  skipUpdate?: boolean;
}

function AppContent({
  gitClient,
  database,
  pluginManager,
}: {
  gitClient: GitClient;
  database: GitDatabase;
  pluginManager: PluginManager;
}) {
  const { screen, error, setError } = useApp();

  if (error) {
    return (
      <Box flexDirection="column" padding={1}>
        <ErrorDisplay error={error} onDismiss={() => setError(undefined)} />
      </Box>
    );
  }

  switch (screen) {
    case 'timeline':
      return <TimelineScreen database={database} />;
    case 'commit-detail':
      return <CommitDetailScreen gitClient={gitClient} />;
    case 'branches':
      return <BranchesScreen database={database} />;
    case 'files':
      return <FileTreeScreen gitClient={gitClient} />;
    case 'search':
      return <FuzzySearchScreen database={database} />;
    case 'dashboard-activity':
      return <ActivityDashboard database={database} />;
    default:
      return <ActivityDashboard database={database} />;
  }
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

export function App({ repoUrl, skipUpdate = false }: AppProps) {
  const [indexProgress, setIndexProgress] = useState<IndexProgress | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gitClient, setGitClient] = useState<GitClient | null>(null);
  const [database, setDatabase] = useState<GitDatabase | null>(null);
  const [pluginManager, setPluginManager] = useState<PluginManager | null>(null);

  useEffect(() => {
    initializeApp();
  }, []);

  async function initializeApp() {
    try {
      const normalizedUrl = normalizeRepoUrl(repoUrl);
      const repoName = getRepoName(normalizedUrl);

      logger.info('Initializing HistTUI for:', repoName);

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
          repoName,
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
          repoName,
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
    const themeName = typeof config.get().ui.theme === 'string' ? config.get().ui.theme : 'default';
    return (
      <ThemeProvider theme={createInkUITheme(themeName)}>
        <LoadingScreen progress={indexProgress || { phase: 'cloning', message: 'Initializing...' }} />
      </ThemeProvider>
    );
  }

  const themeName = typeof config.get().ui.theme === 'string' ? config.get().ui.theme : 'default';
  return (
    <ThemeProvider theme={createInkUITheme(themeName)}>
      <AppProvider repoPath={repoUrl}>
        <AppContent gitClient={gitClient} database={database} pluginManager={pluginManager} />
      </AppProvider>
    </ThemeProvider>
  );
}
