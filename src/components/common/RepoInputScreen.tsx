/**
 * Repository Input Screen
 * Interactive screen for entering GitHub URL when not provided at launch
 */

import React, { useState } from 'react';
import { Box, Text } from 'ink';
import { TextInput, Alert } from '@inkjs/ui';
import { BoxBorder, StatusMessage } from './UI';

interface RepoInputScreenProps {
  onSubmit: (repoUrl: string) => void;
}

export function RepoInputScreen({ onSubmit }: RepoInputScreenProps) {
  const [repoUrl, setRepoUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (url: string) => {
    const trimmed = url.trim();
    
    if (!trimmed) {
      setError('Please enter a repository URL or path');
      return;
    }

    // Basic validation
    const isGitHubUrl = trimmed.match(/github\.com/);
    const isGitUrl = trimmed.match(/\.git$/);
    const isLocalPath = trimmed.startsWith('/') || trimmed.startsWith('./') || trimmed.startsWith('~');
    
    if (!isGitHubUrl && !isGitUrl && !isLocalPath) {
      setError('Please enter a valid GitHub URL, Git URL, or local path');
      return;
    }

    onSubmit(trimmed);
  };

  return (
    <Box flexDirection="column" padding={2}>
      <Box marginBottom={2}>
        <Text bold color="cyan">
          🚀 Welcome to HistTUI!
        </Text>
      </Box>

      <BoxBorder title="Repository Selection" borderColor="blue" width="100%">
        <Box flexDirection="column" gap={1}>
          <Text>
            Enter a Git repository URL or local path to get started.
          </Text>
          
          <Box marginTop={1} flexDirection="column">
            <Text dimColor>Examples:</Text>
            <Box marginLeft={2} flexDirection="column">
              <Text>• https://github.com/username/repository</Text>
              <Text>• git@github.com:username/repository.git</Text>
              <Text>• /path/to/local/repo</Text>
              <Text>• ~/projects/my-repo</Text>
            </Box>
          </Box>

          <Box marginTop={2}>
            <StatusMessage variant="info">
              You can also provide this as an argument: histtui &lt;repo-url&gt;
            </StatusMessage>
          </Box>

          {error && (
            <Box marginTop={1}>
              <Alert variant="error">
                {error}
              </Alert>
            </Box>
          )}

          <Box marginTop={2} flexDirection="column">
            <Text bold>Repository URL or Path:</Text>
            <Box marginTop={1}>
              <TextInput
                placeholder="https://github.com/username/repository"
                defaultValue={repoUrl}
                onChange={(value) => {
                  setRepoUrl(value);
                  setError('');
                }}
                onSubmit={handleSubmit}
              />
            </Box>
          </Box>
        </Box>
      </BoxBorder>

      <Box marginTop={1}>
        <Text dimColor>Press Enter to continue • Ctrl+C to exit</Text>
      </Box>
    </Box>
  );
}
