/**
 * Common UI components for HistTUI
 */

import React from 'react';
import { Box, Text } from 'ink';

interface BoxBorderProps {
  children: React.ReactNode;
  title?: string;
  borderColor?: string;
  width?: number | string;
  height?: number | string;
  flexDirection?: 'row' | 'column';
}

export function BoxBorder({ children, title, borderColor = 'blue', width, height, flexDirection = 'column' }: BoxBorderProps) {
  return (
    <Box flexDirection="column" width={width} height={height}>
      {title && (
        <Box borderStyle="round" borderColor={borderColor} paddingX={1}>
          <Text bold color={borderColor}>
            {title}
          </Text>
        </Box>
      )}
      <Box borderStyle="round" borderColor={borderColor} padding={1} flexDirection={flexDirection} flexGrow={1}>
        {children}
      </Box>
    </Box>
  );
}

interface StatusBarProps {
  left?: string;
  center?: string;
  right?: string;
}

export function StatusBar({ left, center, right }: StatusBarProps) {
  return (
    <Box borderStyle="single" borderTop={true} paddingX={1}>
      <Box flexGrow={1}>
        <Text dimColor>{left}</Text>
      </Box>
      {center && (
        <Box>
          <Text dimColor>{center}</Text>
        </Box>
      )}
      <Box flexGrow={1} justifyContent="flex-end">
        <Text dimColor>{right}</Text>
      </Box>
    </Box>
  );
}

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text bold color="cyan">
        {title}
      </Text>
      {subtitle && <Text dimColor>{subtitle}</Text>}
    </Box>
  );
}

interface EmptyStateProps {
  icon?: string;
  message: string;
  hint?: string;
}

export function EmptyState({ icon = '📭', message, hint }: EmptyStateProps) {
  return (
    <Box flexDirection="column" alignItems="center" justifyContent="center" flexGrow={1}>
      <Text>{icon}</Text>
      <Text dimColor>{message}</Text>
      {hint && (
        <Box marginTop={1}>
          <Text dimColor italic>
            {hint}
          </Text>
        </Box>
      )}
    </Box>
  );
}

interface LoadingProps {
  message?: string;
}

export function Loading({ message = 'Loading...' }: LoadingProps) {
  return (
    <Box flexDirection="column" alignItems="center" justifyContent="center" flexGrow={1}>
      <Text color="cyan">{message}</Text>
    </Box>
  );
}

interface ErrorDisplayProps {
  error: string;
  onDismiss?: () => void;
}

export function ErrorDisplay({ error, onDismiss }: ErrorDisplayProps) {
  return (
    <Box borderStyle="round" borderColor="red" padding={1}>
      <Text color="red">⚠ {error}</Text>
      {onDismiss && (
        <Box marginLeft={2}>
          <Text dimColor>(Press any key to dismiss)</Text>
        </Box>
      )}
    </Box>
  );
}

interface KeyHintProps {
  keys: Array<{ key: string; description: string }>;
}

export function KeyHint({ keys }: KeyHintProps) {
  return (
    <Box flexDirection="row" gap={2}>
      {keys.map(({ key, description }, index) => (
        <Box key={index}>
          <Text bold color="cyan">
            {key}
          </Text>
          <Text dimColor> {description}</Text>
        </Box>
      ))}
    </Box>
  );
}

interface TabBarProps {
  tabs: Array<{ key: string; label: string; shortcut?: string }>;
  activeTab: string;
}

export function TabBar({ tabs, activeTab }: TabBarProps) {
  return (
    <Box borderStyle="single" borderBottom={true} paddingX={1} gap={2}>
      {tabs.map(tab => (
        <Box key={tab.key}>
          <Text bold={tab.key === activeTab} color={tab.key === activeTab ? 'cyan' : 'gray'}>
            {tab.shortcut && `[${tab.shortcut}] `}
            {tab.label}
          </Text>
        </Box>
      ))}
    </Box>
  );
}

interface ListItemProps {
  selected: boolean;
  children: React.ReactNode;
}

export function ListItem({ selected, children }: ListItemProps) {
  return (
    <Box backgroundColor={selected ? 'blue' : undefined}>
      <Text color={selected ? 'cyan' : undefined}>
        {selected ? '▶ ' : '  '}
      </Text>
      {children}
    </Box>
  );
}

interface SplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  splitRatio?: number; // 0-100
}

export function SplitPane({ left, right, splitRatio = 50 }: SplitPaneProps) {
  return (
    <Box flexGrow={1}>
      <Box width={`${splitRatio}%`} borderStyle="single" borderRight={true} paddingRight={1}>
        {left}
      </Box>
      <Box width={`${100 - splitRatio}%`} paddingLeft={1}>
        {right}
      </Box>
    </Box>
  );
}
