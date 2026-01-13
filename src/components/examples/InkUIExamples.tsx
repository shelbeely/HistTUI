/**
 * Example UI Components using @inkjs/ui
 * Demonstrates best practices for using @inkjs/ui components in HistTUI
 */

import React from 'react';
import { Box, Text } from 'ink';
import { Select, MultiSelect, ConfirmInput } from '@inkjs/ui';
import { Badge, StatusMessage, Alert } from '../common/UI';

/**
 * Example: Interactive Selection Menu
 * Shows how to use Select component for single choice
 */
export function ExampleSelectMenu() {
  const [selectedBranch, setSelectedBranch] = React.useState<string>('');

  const branchOptions = [
    { label: 'main', value: 'main' },
    { label: 'develop', value: 'develop' },
    { label: 'feature/new-ui', value: 'feature/new-ui' },
    { label: 'hotfix/critical-bug', value: 'hotfix/critical-bug' },
  ];

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold>Select a branch to checkout:</Text>
      <Select
        options={branchOptions}
        onChange={(value) => {
          setSelectedBranch(value);
          // Handle branch selection
        }}
      />
      {selectedBranch && (
        <Box marginTop={1}>
          <StatusMessage variant="success">
            Switched to branch: {selectedBranch}
          </StatusMessage>
        </Box>
      )}
    </Box>
  );
}

/**
 * Example: Multi-Select for Tags
 * Shows how to use MultiSelect for multiple choices
 */
export function ExampleMultiSelect() {
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);

  const tagOptions = [
    { label: 'v1.0.0', value: 'v1.0.0' },
    { label: 'v1.1.0', value: 'v1.1.0' },
    { label: 'v2.0.0-beta', value: 'v2.0.0-beta' },
    { label: 'latest', value: 'latest' },
  ];

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold>Select tags to compare:</Text>
      <MultiSelect
        options={tagOptions}
        onChange={(values) => {
          setSelectedTags(values);
        }}
      />
      {selectedTags.length > 0 && (
        <Box marginTop={1}>
          <Text>Selected: {selectedTags.join(', ')}</Text>
        </Box>
      )}
    </Box>
  );
}

/**
 * Example: Confirmation Dialog
 * Shows how to use ConfirmInput for user confirmations
 */
export function ExampleConfirmDialog() {
  const [showConfirm, setShowConfirm] = React.useState(true);

  if (!showConfirm) {
    return (
      <Box>
        <StatusMessage variant="info">Operation cancelled</StatusMessage>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Alert variant="warning">
        Are you sure you want to delete this branch?
      </Alert>
      <Box marginTop={1}>
        <ConfirmInput
          onConfirm={() => {
            // Handle confirmation
            setShowConfirm(false);
          }}
          onCancel={() => {
            setShowConfirm(false);
          }}
        />
      </Box>
    </Box>
  );
}

/**
 * Example: Status Badges
 * Shows different badge variants for various statuses
 */
export function ExampleBadges() {
  return (
    <Box flexDirection="column" padding={1}>
      <Text bold>Build Status Dashboard:</Text>
      <Box marginTop={1} gap={2}>
        <Box flexDirection="column">
          <Text dimColor>Tests:</Text>
          <Badge variant="success">Passing</Badge>
        </Box>
        <Box flexDirection="column">
          <Text dimColor>Build:</Text>
          <Badge variant="success">Success</Badge>
        </Box>
        <Box flexDirection="column">
          <Text dimColor>Coverage:</Text>
          <Badge variant="warning">85%</Badge>
        </Box>
        <Box flexDirection="column">
          <Text dimColor>Security:</Text>
          <Badge variant="error">2 Issues</Badge>
        </Box>
      </Box>
    </Box>
  );
}

/**
 * Example: Status Messages
 * Shows different status message variants
 */
export function ExampleStatusMessages() {
  return (
    <Box flexDirection="column" padding={1} gap={1}>
      <StatusMessage variant="success">
        Repository cloned successfully
      </StatusMessage>
      
      <StatusMessage variant="info">
        Indexing 1,234 commits...
      </StatusMessage>
      
      <StatusMessage variant="warning">
        Branch is 3 commits behind origin/main
      </StatusMessage>
      
      <StatusMessage variant="error">
        Failed to fetch remote changes
      </StatusMessage>
    </Box>
  );
}

/**
 * Example: Combined Alert + Action
 * Shows how to combine Alert with other components
 */
export function ExampleAlertWithAction() {
  const [dismissed, setDismissed] = React.useState(false);

  if (dismissed) return null;

  return (
    <Box flexDirection="column" padding={1}>
      <Alert variant="info">
        A new version of HistTUI is available! Update now to get the latest features.
      </Alert>
      <Box marginTop={1}>
        <ConfirmInput
          onConfirm={() => {
            // Handle update
            setDismissed(true);
          }}
          onCancel={() => {
            setDismissed(true);
          }}
        />
      </Box>
    </Box>
  );
}

/**
 * Example: Complete Form
 * Shows how to combine multiple @inkjs/ui components
 */
export function ExampleCompleteForm() {
  return (
    <Box flexDirection="column" padding={1}>
      <Text bold color="cyan">Create New Branch</Text>
      
      <Box marginTop={1}>
        <StatusMessage variant="info">
          Choose a base branch and enter a name for your new branch
        </StatusMessage>
      </Box>
      
      <Box marginTop={1} flexDirection="column" gap={1}>
        <Text>Base branch:</Text>
        <Select
          options={[
            { label: 'main', value: 'main' },
            { label: 'develop', value: 'develop' },
          ]}
          onChange={(value) => {
            // Handle selection
          }}
        />
      </Box>
      
      <Box marginTop={2}>
        <Text>Branch name: feature/</Text>
        {/* TextInput would go here */}
      </Box>
      
      <Box marginTop={2} gap={2}>
        <Badge variant="success">Ready</Badge>
        <Text dimColor>Press Enter to create</Text>
      </Box>
    </Box>
  );
}
