/**
 * File Tree Screen
 * Browse repository file tree with markdown rendering
 */

import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { useApp } from '../AppContext';
import { useKeyboard, useListNavigation } from '../common/hooks';
import { Header, StatusBar, ListItem, Loading } from '../common/UI';
import { GitClient } from '../../core/git';
import { truncate } from '../../utils';

interface FileTreeScreenProps {
  gitClient: GitClient;
}

interface FileNode {
  name: string;
  path: string;
  isDirectory: boolean;
  level: number;
}

export function FileTreeScreen({ gitClient }: FileTreeScreenProps) {
  const { setScreen } = useApp();
  const [files, setFiles] = useState<FileNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [showContent, setShowContent] = useState(false);

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
  } = useListNavigation(files, 20);

  useEffect(() => {
    loadFileTree();
  }, [gitClient]);

  async function loadFileTree() {
    try {
      setLoading(true);
      const filePaths = await gitClient.getFileTree('HEAD');
      
      // Convert flat list to tree structure with levels
      const fileNodes: FileNode[] = filePaths.map(path => {
        const parts = path.split('/');
        const level = parts.length - 1;
        const name = parts[parts.length - 1];
        return {
          name,
          path,
          isDirectory: false,
          level,
        };
      }).sort((a, b) => a.path.localeCompare(b.path));

      setFiles(fileNodes);
    } catch (error) {
      console.error('Failed to load file tree:', error);
    } finally {
      setLoading(false);
    }
  }

  async function viewFile(file: FileNode) {
    if (file.isDirectory) return;

    try {
      const content = await gitClient.getFileContent(file.path, 'HEAD');
      setFileContent(content);
      setShowContent(true);
    } catch (error) {
      setFileContent(`Error loading file: ${error}`);
      setShowContent(true);
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
        viewFile(selectedItem);
      }
    },
    onChar: (char) => {
      if (char === 'b') {
        if (showContent) {
          setShowContent(false);
          setFileContent(null);
        } else {
          setScreen('timeline');
        }
      }
    },
    onNumber: (num) => {
      if (num === 1) setScreen('timeline');
      else if (num === 2) setScreen('branches');
      else if (num === 3) setScreen('files');
      else if (num === 4) setScreen('dashboard-activity');
      else if (num === 6) setScreen('code-planner');
    },
  });

  if (loading) {
    return <Loading message="Loading file tree..." />;
  }

  if (showContent && fileContent) {
    // Check if file is markdown
    const isMarkdown = selectedItem?.name.match(/\.(md|markdown)$/i);
    
    return (
      <Box flexDirection="column" height="100%">
        <Header
          title={`📄 ${selectedItem?.name || 'File'}`}
          subtitle="Press 'b' to go back"
        />

        <Box flexDirection="column" padding={1} borderStyle="single" borderColor="blue" flexGrow={1} overflow="hidden">
          {isMarkdown ? (
            <Box flexDirection="column">
              <Text color="green" bold>Markdown Preview:</Text>
              <Box marginTop={1} flexDirection="column">
                {fileContent.split('\n').slice(0, 50).map((line, index) => (
                  <Text key={index}>{line}</Text>
                ))}
              </Box>
            </Box>
          ) : (
            <Box flexDirection="column">
              {fileContent.split('\n').slice(0, 50).map((line, index) => (
                <Text key={index}>{truncate(line, 120)}</Text>
              ))}
            </Box>
          )}
          {fileContent.split('\n').length > 50 && (
            <Text dimColor>... (truncated, showing first 50 lines)</Text>
          )}
        </Box>

        <StatusBar left={`${fileContent.split('\n').length} lines`} right="b Back • q Quit" />
      </Box>
    );
  }

  return (
    <Box flexDirection="column" height="100%">
      <Header
        title="🌳 File Tree"
        subtitle={`${files.length} files • Use ↑↓ or j/k to navigate • Enter to view`}
      />

      <Box flexDirection="column" flexGrow={1} overflow="hidden">
        {visibleItems.map((file, index) => {
          const isSelected = selectedIndex === index + files.indexOf(visibleItems[0]);
          const indent = '  '.repeat(file.level);
          const icon = file.isDirectory ? '📁' : '📄';
          
          return (
            <Box key={file.path}>
              <ListItem selected={isSelected}>
                <Box width="100%">
                  <Text>
                    {indent}
                    {icon} {file.name}
                  </Text>
                </Box>
              </ListItem>
            </Box>
          );
        })}
      </Box>

      <StatusBar
        left={`File ${selectedIndex + 1}/${files.length}`}
        right="Enter View • b Back • q Quit"
      />
    </Box>
  );
}
