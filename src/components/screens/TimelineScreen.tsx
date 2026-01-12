/**
 * Commit Timeline Screen
 * Main view for browsing commit history
 */

import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { useApp } from '../AppContext';
import { useKeyboard, useListNavigation } from '../common/hooks';
import { Header, StatusBar, ListItem, EmptyState, Loading } from '../common/UI';
import { Commit } from '../../types';
import { GitDatabase } from '../../core/database';
import { formatRelativeTime, truncate } from '../../utils';

interface TimelineScreenProps {
  database: GitDatabase;
}

export function TimelineScreen({ database }: TimelineScreenProps) {
  const { setScreen, setSelectedCommit, filter, setError } = useApp();
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHelp, setShowHelp] = useState(false);

  const {
    selectedIndex,
    selectedItem,
    visibleItems,
    moveUp,
    moveDown,
    pageUp,
    pageDown,
    goHome,
    goEnd,
  } = useListNavigation(commits, 20);

  // Load commits
  useEffect(() => {
    try {
      setLoading(true);
      const result = database.getCommits({
        author: filter.author,
        dateFrom: filter.dateFrom,
        dateTo: filter.dateTo,
        path: filter.path,
        message: filter.message,
        limit: 1000,
      });
      setCommits(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load commits');
    } finally {
      setLoading(false);
    }
  }, [database, filter]);

  // Keyboard handlers
  useKeyboard({
    onUp: moveUp,
    onDown: moveDown,
    onPageUp: pageUp,
    onPageDown: pageDown,
    onHome: goHome,
    onEnd: goEnd,
    onEnter: () => {
      if (selectedItem) {
        setSelectedCommit(selectedItem);
        setScreen('commit-detail');
      }
    },
    onHelp: () => setShowHelp(!showHelp),
    onNumber: (num) => {
      if (num === 1) setScreen('timeline');
      else if (num === 2) setScreen('branches');
      else if (num === 3) setScreen('files');
      else if (num === 4) setScreen('dashboard-activity');
    },
  });

  if (loading) {
    return <Loading message="Loading commits..." />;
  }

  if (commits.length === 0) {
    return (
      <EmptyState
        icon="📭"
        message="No commits found"
        hint="Try adjusting your filters or check if the repository has been indexed"
      />
    );
  }

  return (
    <Box flexDirection="column" height="100%">
      <Header
        title="📊 Commit Timeline"
        subtitle={`${commits.length} commits • Use ↑↓ or j/k to navigate, Enter to view details`}
      />

      {showHelp && (
        <Box borderStyle="single" borderColor="cyan" padding={1} marginBottom={1}>
          <Box flexDirection="column">
            <Text bold color="cyan">
              Keyboard Shortcuts:
            </Text>
            <Text>
              <Text color="yellow">j/↓</Text> Down • <Text color="yellow">k/↑</Text> Up •{' '}
              <Text color="yellow">Ctrl+d/PgDn</Text> Page Down • <Text color="yellow">Ctrl+u/PgUp</Text> Page Up
            </Text>
            <Text>
              <Text color="yellow">g</Text> First • <Text color="yellow">G</Text> Last •{' '}
              <Text color="yellow">Enter</Text> View Details • <Text color="yellow">/</Text> Search
            </Text>
            <Text>
              <Text color="yellow">1</Text> Timeline • <Text color="yellow">2</Text> Branches •{' '}
              <Text color="yellow">3</Text> Files • <Text color="yellow">4</Text> Dashboards
            </Text>
            <Text>
              <Text color="yellow">?</Text> Toggle Help • <Text color="yellow">q</Text> Quit
            </Text>
          </Box>
        </Box>
      )}

      <Box flexDirection="column" flexGrow={1} overflow="hidden">
        {visibleItems.map((commit, index) => {
          const isSelected = selectedIndex === index + (commits.indexOf(visibleItems[0]));
          return (
            <Box key={commit.hash}>
              <ListItem selected={isSelected}>
                <Box width="100%">
                  <Box width="10%">
                    <Text color="yellow">{commit.shortHash}</Text>
                  </Box>
                  <Box width="50%">
                    <Text>{truncate(commit.subject, 60)}</Text>
                  </Box>
                  <Box width="20%">
                    <Text color="cyan">{truncate(commit.author, 25)}</Text>
                  </Box>
                  <Box width="20%">
                    <Text dimColor>{formatRelativeTime(commit.date)}</Text>
                  </Box>
                </Box>
              </ListItem>
            </Box>
          );
        })}
      </Box>

      <StatusBar
        left={`Commit ${selectedIndex + 1}/${commits.length}`}
        center={filter.author || filter.path ? '🔍 Filtered' : undefined}
        right="? Help"
      />
    </Box>
  );
}
