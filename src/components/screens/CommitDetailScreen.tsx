/**
 * Commit Detail Screen
 * Shows detailed information about a commit including diff
 */

import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { useApp } from '../AppContext';
import { useKeyboard } from '../common/hooks';
import { Header, StatusBar, Loading, BoxBorder } from '../common/UI';
import { FileChange } from '../../types';
import { GitClient } from '../../core/git';
import { formatDate, truncate } from '../../utils';

interface CommitDetailScreenProps {
  gitClient: GitClient;
}

export function CommitDetailScreen({ gitClient }: CommitDetailScreenProps) {
  const { selectedCommit, setScreen } = useApp();
  const [files, setFiles] = useState<FileChange[]>([]);
  const [diff, setDiff] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showDiff, setShowDiff] = useState(false);

  useEffect(() => {
    if (!selectedCommit) return;

    setLoading(true);
    gitClient
      .getCommitDetail(selectedCommit.hash)
      .then(({ files, diff }) => {
        setFiles(files);
        setDiff(diff);
      })
      .finally(() => setLoading(false));
  }, [selectedCommit, gitClient]);

  useKeyboard({
    onLeft: () => setScreen('timeline'),
    onChar: (char) => {
      if (char === 'd') setShowDiff(!showDiff);
    },
  });

  if (!selectedCommit) {
    setScreen('timeline');
    return null;
  }

  if (loading) {
    return <Loading message="Loading commit details..." />;
  }

  const totalAdditions = files.reduce((sum, f) => sum + f.additions, 0);
  const totalDeletions = files.reduce((sum, f) => sum + f.deletions, 0);

  return (
    <Box flexDirection="column" height="100%">
      <Header
        title={`💬 Commit ${selectedCommit.shortHash}`}
        subtitle="Press ← to go back • d to toggle diff view"
      />

      <Box flexDirection="column" padding={1} borderStyle="single" borderColor="cyan">
        <Box>
          <Text bold>Author: </Text>
          <Text color="cyan">{selectedCommit.author}</Text>
          <Text dimColor> ({selectedCommit.authorEmail})</Text>
        </Box>
        <Box>
          <Text bold>Date: </Text>
          <Text>{formatDate(selectedCommit.date)}</Text>
        </Box>
        <Box>
          <Text bold>Hash: </Text>
          <Text color="yellow">{selectedCommit.hash}</Text>
        </Box>
        {selectedCommit.refs.length > 0 && (
          <Box>
            <Text bold>Refs: </Text>
            <Text color="magenta">{selectedCommit.refs.join(', ')}</Text>
          </Box>
        )}
      </Box>

      <Box marginTop={1} padding={1} borderStyle="single" borderColor="blue">
        <Box flexDirection="column">
          <Text bold color="blue">
            {selectedCommit.subject}
          </Text>
          {selectedCommit.body && (
            <Box marginTop={1}>
              <Text>{selectedCommit.body}</Text>
            </Box>
          )}
        </Box>
      </Box>

      <Box marginTop={1} flexDirection="column">
        <Text bold>
          Files Changed: {files.length} • <Text color="green">+{totalAdditions}</Text> •{' '}
          <Text color="red">-{totalDeletions}</Text>
        </Text>

        <Box marginTop={1} flexDirection="column" overflow="hidden" height={10}>
          {files.map((file, index) => (
            <Box key={index}>
              <Text>
                {file.status === 'added' && <Text color="green">+ </Text>}
                {file.status === 'modified' && <Text color="yellow">M </Text>}
                {file.status === 'deleted' && <Text color="red">- </Text>}
                {file.status === 'renamed' && <Text color="cyan">R </Text>}
                {file.path}
                {file.status === 'renamed' && file.oldPath && <Text dimColor> (from {file.oldPath})</Text>}
                <Text dimColor>
                  {' '}
                  (+{file.additions} -{file.deletions})
                </Text>
              </Text>
            </Box>
          ))}
        </Box>
      </Box>

      {showDiff && (
        <BoxBorder title="Diff" borderColor="yellow" height={20}>
          <Box flexDirection="column" overflow="hidden">
            {diff.split('\n').slice(0, 50).map((line, index) => (
              <Text key={index} color={line.startsWith('+') ? 'green' : line.startsWith('-') ? 'red' : undefined}>
                {truncate(line, 120)}
              </Text>
            ))}
            {diff.split('\n').length > 50 && <Text dimColor>... (truncated)</Text>}
          </Box>
        </BoxBorder>
      )}

      <StatusBar left="← Back" right="d Toggle Diff • ? Help • q Quit" />
    </Box>
  );
}
