/**
 * Example showcase of @inkjs/ui components
 * This file demonstrates the new UI components available in HistTUI
 */

import React from 'react';
import { Box, Text, render } from 'ink';
import {
  TextInput,
  Select,
  Spinner,
  Badge,
  StatusMessage,
  Alert,
  ProgressBar,
  ConfirmInput,
  UnorderedList,
  OrderedList,
  ThemeProvider,
} from '@inkjs/ui';
import { createInkUITheme } from '../config/inkui-theme.js';

function ShowcaseComponent() {
  const [selectedDemo, setSelectedDemo] = React.useState('overview');
  
  if (selectedDemo === 'overview') {
    return (
      <Box flexDirection="column" padding={1}>
        <Box marginBottom={1}>
          <Text bold color="cyan">🎨 HistTUI - @inkjs/ui Integration Showcase</Text>
        </Box>
        
        <Box flexDirection="column" gap={1}>
          <Box>
            <Text>This is a showcase of the new @inkjs/ui components integrated into HistTUI.</Text>
          </Box>
          
          <Box flexDirection="column" marginTop={1}>
            <Text bold>✨ Available Components:</Text>
            <UnorderedList>
              <UnorderedList.Item>
                <Text>TextInput - Enhanced text input with autocomplete support</Text>
              </UnorderedList.Item>
              <UnorderedList.Item>
                <Text>Spinner - Beautiful loading indicators</Text>
              </UnorderedList.Item>
              <UnorderedList.Item>
                <Text>ProgressBar - Visual progress tracking</Text>
              </UnorderedList.Item>
              <UnorderedList.Item>
                <Text>Badge - Status badges for labels</Text>
              </UnorderedList.Item>
              <UnorderedList.Item>
                <Text>StatusMessage - Informative status messages</Text>
              </UnorderedList.Item>
              <UnorderedList.Item>
                <Text>Alert - Attention-grabbing alerts</Text>
              </UnorderedList.Item>
              <UnorderedList.Item>
                <Text>Select - Interactive selection menus</Text>
              </UnorderedList.Item>
            </UnorderedList>
          </Box>
          
          <Box flexDirection="column" marginTop={1} gap={1}>
            <Text bold>🎨 Examples:</Text>
            
            <Box flexDirection="column">
              <Text dimColor>Badges:</Text>
              <Box gap={1}>
                <Badge color="green">Success</Badge>
                <Badge color="red">Error</Badge>
                <Badge color="yellow">Warning</Badge>
                <Badge color="blue">Info</Badge>
              </Box>
            </Box>
            
            <Box flexDirection="column" marginTop={1}>
              <Text dimColor>Status Messages:</Text>
              <StatusMessage variant="success">Operation completed successfully!</StatusMessage>
            </Box>
            
            <Box flexDirection="column" marginTop={1}>
              <Text dimColor>Alerts:</Text>
              <Alert variant="info">This is an informational alert message</Alert>
            </Box>
            
            <Box flexDirection="column" marginTop={1}>
              <Text dimColor>Spinner:</Text>
              <Spinner label="Loading data..." />
            </Box>
            
            <Box flexDirection="column" marginTop={1}>
              <Text dimColor>Progress Bar:</Text>
              <ProgressBar value={65} />
            </Box>
          </Box>
          
          <Box marginTop={1}>
            <Text dimColor>Press Ctrl+C to exit</Text>
          </Box>
        </Box>
      </Box>
    );
  }
  
  return null;
}

export function ShowcaseApp() {
  const theme = createInkUITheme('default');
  
  return (
    <ThemeProvider theme={theme}>
      <ShowcaseComponent />
    </ThemeProvider>
  );
}

// If run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  render(<ShowcaseApp />);
}
