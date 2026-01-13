/**
 * Generative Status Bar
 * AG-UI powered status bar that shows real-time agent activity
 * Dynamically updates based on agent actions across all screens
 */

import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { Spinner, Badge } from '@inkjs/ui';
import { useAgentState } from '../../core/ag-ui/useAgentState';

interface GenerativeStatusBarProps {
  repoName?: string;
  currentScreen?: string;
}

export function GenerativeStatusBar({ repoName, currentScreen }: GenerativeStatusBarProps) {
  const { 
    isAgentActive, 
    currentMessage, 
    agentStatus, 
    toolsExecuting,
    streamingContent 
  } = useAgentState();

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'thinking': return 'blue';
      case 'executing': return 'yellow';
      case 'success': return 'green';
      case 'error': return 'red';
      default: return 'gray';
    }
  };

  return (
    <Box 
      borderStyle="single" 
      borderBottom={true} 
      paddingX={1} 
      paddingY={0}
      flexDirection="column"
    >
      {/* Main status line */}
      <Box justifyContent="space-between" width="100%">
        {/* Left: Repository and Screen */}
        <Box gap={2}>
          <Text bold color="cyan">
            {repoName || 'HistTUI'}
          </Text>
          {currentScreen && (
            <>
              <Text dimColor>→</Text>
              <Text color="white">{currentScreen}</Text>
            </>
          )}
        </Box>

        {/* Center: Agent Status */}
        <Box gap={1} flexGrow={1} justifyContent="center">
          {isAgentActive && (
            <>
              <Spinner />
              <Text color={getStatusColor(agentStatus)}>
                {currentMessage || 'Agent active'}
              </Text>
            </>
          )}
          {toolsExecuting.length > 0 && (
            <Badge color="yellow">
              {toolsExecuting.length} tool{toolsExecuting.length > 1 ? 's' : ''} running
            </Badge>
          )}
        </Box>

        {/* Right: Time and Indicators */}
        <Box gap={2}>
          {streamingContent && (
            <Badge color="blue">Streaming</Badge>
          )}
          <Text dimColor>{formatTime(time)}</Text>
        </Box>
      </Box>

      {/* Streaming content line (if active) */}
      {streamingContent && (
        <Box marginTop={0}>
          <Text color="cyan" dimColor>
            ▸ {streamingContent}
          </Text>
        </Box>
      )}
    </Box>
  );
}
