/**
 * Repository Manager Screen
 * View and manage multiple cached repositories within the TUI
 */

import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { Select } from '@inkjs/ui';
import { BoxBorder, StatusMessage, Badge } from '../common/UI';
import { CacheManager, CacheInfo } from '../../core/cache';
import { config } from '../../config';
import chalk from 'chalk';

interface RepoManagerScreenProps {
  onSelectRepo: (repoUrl: string) => void;
  onBack: () => void;
  currentRepoUrl?: string;
}

export function RepoManagerScreen({ onSelectRepo, onBack, currentRepoUrl }: RepoManagerScreenProps) {
  const [cachedRepos, setCachedRepos] = useState<CacheInfo[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    loadCachedRepos();
  }, []);

  const loadCachedRepos = () => {
    const cacheManager = new CacheManager(config.getCacheDir());
    const repos = cacheManager.listCached();
    
    // Sort by last updated (most recent first)
    repos.sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime());
    
    setCachedRepos(repos);
    
    // Set current repo as selected if it exists
    if (currentRepoUrl) {
      const currentIndex = repos.findIndex(r => r.repoUrl === currentRepoUrl);
      if (currentIndex >= 0) {
        setSelectedIndex(currentIndex);
      }
    }
  };

  const handleClearCache = (repoUrl: string) => {
    const cacheManager = new CacheManager(config.getCacheDir());
    cacheManager.clearCache(repoUrl);
    loadCachedRepos();
  };

  useInput((input, key) => {
    if (key.escape || input === 'q') {
      if (showActions) {
        setShowActions(false);
      } else {
        onBack();
      }
    } else if (key.return) {
      if (showActions) {
        // Handle action selection
        setShowActions(false);
      } else if (cachedRepos[selectedIndex]) {
        onSelectRepo(cachedRepos[selectedIndex].repoUrl);
      }
    } else if (key.upArrow || input === 'k') {
      setSelectedIndex(Math.max(0, selectedIndex - 1));
    } else if (key.downArrow || input === 'j') {
      setSelectedIndex(Math.min(cachedRepos.length - 1, selectedIndex + 1));
    } else if (input === 'd' && cachedRepos[selectedIndex]) {
      handleClearCache(cachedRepos[selectedIndex].repoUrl);
    } else if (input === 'a') {
      setShowActions(!showActions);
    }
  });

  if (cachedRepos.length === 0) {
    return (
      <Box flexDirection="column" padding={2}>
        <Box marginBottom={1}>
          <Text bold color="cyan">📚 Repository Manager</Text>
        </Box>

        <BoxBorder title="No Cached Repositories" borderColor="yellow" width="100%">
          <Box flexDirection="column" gap={1}>
            <Text>No repositories have been cached yet.</Text>
            <Box marginTop={1}>
              <StatusMessage variant="info">
                Launch HistTUI with a repository URL to get started
              </StatusMessage>
            </Box>
            <Box marginTop={1} flexDirection="column">
              <Text dimColor>Example:</Text>
              <Text color="cyan">  histtui https://github.com/user/repo</Text>
            </Box>
          </Box>
        </BoxBorder>

        <Box marginTop={1}>
          <Text dimColor>Press Esc or q to go back</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" padding={2}>
      <Box marginBottom={1}>
        <Text bold color="cyan">
          📚 Repository Manager ({cachedRepos.length} {cachedRepos.length === 1 ? 'repo' : 'repos'})
        </Text>
      </Box>

      <BoxBorder title="Cached Repositories" borderColor="blue" width="100%">
        <Box flexDirection="column">
          {cachedRepos.map((repo, index) => {
            const isSelected = index === selectedIndex;
            const isCurrent = repo.repoUrl === currentRepoUrl;
            
            return (
              <Box
                key={repo.repoUrl}
                flexDirection="column"
                marginBottom={index < cachedRepos.length - 1 ? 1 : 0}
                paddingX={1}
                paddingY={1}
                borderStyle={isSelected ? 'round' : undefined}
                borderColor={isSelected ? 'cyan' : undefined}
              >
                {/* Repository Name and Status */}
                <Box>
                  <Text bold color={isSelected ? 'cyan' : 'white'}>
                    {isSelected ? '▶ ' : '  '}
                    {repo.repoName}
                  </Text>
                  {isCurrent && (
                    <Box marginLeft={1}>
                      <Badge variant="success">CURRENT</Badge>
                    </Box>
                  )}
                </Box>

                {/* Repository URL */}
                <Box marginTop={0} marginLeft={3}>
                  <Text dimColor>{repo.repoUrl}</Text>
                </Box>

                {/* Repository Stats */}
                <Box marginTop={0} marginLeft={3} gap={2}>
                  <Text color="magenta">{repo.commitCount.toLocaleString()} commits</Text>
                  <Text dimColor>•</Text>
                  <Text color="cyan">
                    Updated: {formatDate(repo.lastUpdated)}
                  </Text>
                </Box>

                {/* Local Path */}
                <Box marginTop={0} marginLeft={3}>
                  <Text dimColor>Path: {repo.localPath}</Text>
                </Box>
              </Box>
            );
          })}
        </Box>
      </BoxBorder>

      {/* Actions Panel */}
      <Box marginTop={1}>
        <BoxBorder title="Actions" borderColor="green" width="100%">
          <Box flexDirection="column" gap={0}>
            <Text>
              <Text bold color="green">Enter</Text> - Switch to selected repository
            </Text>
            <Text>
              <Text bold color="red">d</Text> - Delete selected repository cache
            </Text>
            <Text>
              <Text bold color="yellow">↑/↓ or k/j</Text> - Navigate
            </Text>
            <Text>
              <Text bold color="cyan">Esc or q</Text> - Go back
            </Text>
          </Box>
        </BoxBorder>
      </Box>

      {/* Status Message */}
      <Box marginTop={1}>
        {cachedRepos[selectedIndex] && (
          <StatusMessage variant="info">
            {cachedRepos[selectedIndex] === cachedRepos.find(r => r.repoUrl === currentRepoUrl)
              ? 'This is the currently active repository'
              : 'Press Enter to switch to this repository'}
          </StatusMessage>
        )}
      </Box>
    </Box>
  );
}

function formatDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return 'just now';
  } else if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return date.toLocaleDateString();
  }
}
