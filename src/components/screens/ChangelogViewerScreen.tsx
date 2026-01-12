/**
 * Changelog Viewer Screen
 * Parse and display CHANGELOG.md with version filtering
 * 
 * Changelog parsing inspired by changelog-view by jdeniau (MIT License)
 * https://github.com/jdeniau/changelog-view
 */

import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { useApp } from '../AppContext';
import { useKeyboard, useListNavigation } from '../common/hooks';
import { Header, StatusBar, ListItem, Loading } from '../common/UI';
import { GitClient } from '../../core/git';
import { parseChangelog, formatChangelogEntry, ChangelogVersion } from '../../utils/changelog';

interface ChangelogViewerScreenProps {
  gitClient: GitClient;
  filePath?: string;
}

export function ChangelogViewerScreen({ gitClient, filePath = 'CHANGELOG.md' }: ChangelogViewerScreenProps) {
  const { setScreen } = useApp();
  const [versions, setVersions] = useState<ChangelogVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState<ChangelogVersion | null>(null);
  const [error, setError] = useState<string | null>(null);

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
  } = useListNavigation(versions, 15);

  useEffect(() => {
    loadChangelog();
  }, [gitClient, filePath]);

  async function loadChangelog() {
    try {
      setLoading(true);
      setError(null);
      const content = await gitClient.getFileContent(filePath, 'HEAD');
      const parsed = parseChangelog(content);
      setVersions(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load changelog');
    } finally {
      setLoading(false);
    }
  }

  useKeyboard({
    onUp: moveUp,
    onDown: moveDown,
    onPageUp: pageUp,
    onPageDown: pageDown,
    onHome: goHome,
    onEnd: goEnd,
    onEnter: () => {
      if (selectedItem) {
        setSelectedVersion(selectedItem);
      }
    },
    onChar: (char) => {
      if (char === 'b') {
        if (selectedVersion) {
          setSelectedVersion(null);
        } else {
          setScreen('files');
        }
      }
    },
    onNumber: (num) => {
      if (num === 1) setScreen('timeline');
      else if (num === 2) setScreen('branches');
      else if (num === 3) setScreen('files');
      else if (num === 4) setScreen('dashboard-activity');
    },
  });

  if (loading) {
    return <Loading message="Loading changelog..." />;
  }

  if (error) {
    return (
      <Box flexDirection="column" padding={2}>
        <Text color="red" bold>
          ⚠ Error
        </Text>
        <Text>{error}</Text>
        <Box marginTop={1}>
          <Text dimColor>Press 'b' to go back</Text>
        </Box>
      </Box>
    );
  }

  if (selectedVersion) {
    const formatted = formatChangelogEntry(selectedVersion, 40);

    return (
      <Box flexDirection="column" height="100%">
        <Header
          title={`📋 Changelog - Version ${selectedVersion.version}`}
          subtitle="Press 'b' to go back to version list"
        />

        <Box flexDirection="column" padding={1} borderStyle="single" borderColor="green" flexGrow={1} overflow="hidden">
          {formatted.map((line, index) => (
            <Text key={index}>{line}</Text>
          ))}
        </Box>

        <StatusBar left={`Version ${selectedVersion.version}`} right="b Back • q Quit" />
      </Box>
    );
  }

  return (
    <Box flexDirection="column" height="100%">
      <Header
        title={`📋 Changelog Viewer - ${filePath}`}
        subtitle={`${versions.length} versions • Use ↑↓ or j/k to navigate • Enter to view`}
      />

      {versions.length === 0 ? (
        <Box flexDirection="column" justifyContent="center" alignItems="center" flexGrow={1}>
          <Text dimColor>No versions found in changelog</Text>
          <Box marginTop={1}>
            <Text dimColor>Press 'b' to go back</Text>
          </Box>
        </Box>
      ) : (
        <>
          <Box flexDirection="column" flexGrow={1} overflow="hidden">
            {visibleItems.map((version, index) => {
              const isSelected = selectedIndex === index + versions.indexOf(visibleItems[0]);
              const lineCount = version.content.split('\n').length;

              return (
                <Box key={version.version}>
                  <ListItem selected={isSelected}>
                    <Box width="100%">
                      <Box width="20%">
                        <Text color="green" bold>
                          v{version.version}
                        </Text>
                      </Box>
                      <Box width="80%">
                        <Text dimColor>{lineCount} lines</Text>
                      </Box>
                    </Box>
                  </ListItem>
                </Box>
              );
            })}
          </Box>

          <StatusBar
            left={`Version ${selectedIndex + 1}/${versions.length}`}
            right="Enter View • b Back • q Quit"
          />
        </>
      )}
    </Box>
  );
}
