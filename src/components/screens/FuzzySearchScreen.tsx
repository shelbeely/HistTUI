/**
 * Fuzzy Search Screen
 * Interactive fuzzy search across commits
 * 
 * Search interaction patterns inspired by emoj by Sindre Sorhus (MIT License)
 * https://github.com/sindresorhus/emoj
 */

import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import Fuse from 'fuse.js';
import { useApp } from '../AppContext';
import { Header, StatusBar, ListItem } from '../common/UI';
import { Commit } from '../../types';
import { GitDatabase } from '../../core/database';
import { formatRelativeTime, truncate } from '../../utils';

interface FuzzySearchScreenProps {
  database: GitDatabase;
}

export function FuzzySearchScreen({ database }: FuzzySearchScreenProps) {
  const { setScreen, setSelectedCommit } = useApp();
  const [query, setQuery] = useState('');
  const [allCommits, setAllCommits] = useState<Commit[]>([]);
  const [results, setResults] = useState<Commit[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [fuse, setFuse] = useState<Fuse<Commit> | null>(null);

  // Load all commits on mount
  useEffect(() => {
    const commits = database.getCommits({ limit: 1000 });
    setAllCommits(commits);
    
    // Initialize Fuse.js for fuzzy search
    const fuseInstance = new Fuse(commits, {
      keys: [
        { name: 'subject', weight: 0.4 },
        { name: 'body', weight: 0.2 },
        { name: 'author', weight: 0.2 },
        { name: 'hash', weight: 0.1 },
        { name: 'shortHash', weight: 0.1 },
      ],
      threshold: 0.4, // More lenient matching
      includeScore: true,
      minMatchCharLength: 2,
    });
    setFuse(fuseInstance);
    setResults(commits.slice(0, 10)); // Show first 10 initially
  }, [database]);

  // Update results when query changes (debounced for performance)
  useEffect(() => {
    if (!fuse) return;

    if (query.trim() === '') {
      setResults(allCommits.slice(0, 10));
      setSelectedIndex(0);
      return;
    }

    // Debounce search for better performance (pattern from emoj)
    const timer = setTimeout(() => {
      const searchResults = fuse.search(query);
      const commits = searchResults.map(result => result.item).slice(0, 10);
      setResults(commits);
      setSelectedIndex(0);
    }, 100);

    return () => clearTimeout(timer);
  }, [query, fuse, allCommits]);

  const handleSubmit = () => {
    if (results.length > 0) {
      const selected = results[selectedIndex];
      setSelectedCommit(selected);
      setScreen('commit-detail');
    }
  };

  // Keyboard navigation (pattern from emoj: up/down for selection, esc to exit)
  useInput((input, key) => {
    if (key.upArrow && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    } else if (key.downArrow && selectedIndex < results.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    } else if (key.escape) {
      setScreen('timeline');
    } else if (key.return) {
      handleSubmit();
    } else if (input >= '1' && input <= '9') {
      // Number shortcuts (1-9) for quick selection
      const index = parseInt(input, 10) - 1;
      if (index < results.length) {
        setSelectedIndex(index);
        handleSubmit();
      }
    }
  });

  return (
    <Box flexDirection="column" height="100%">
      <Header
        title="🔍 Fuzzy Search"
        subtitle="Type to search commits • ↑↓ to navigate • Enter to view • Esc to exit"
      />

      <Box marginBottom={1} borderStyle="single" borderColor="cyan" padding={1}>
        <Box flexDirection="column" width="100%">
          <Text bold>Search commits:</Text>
          <Box marginTop={1}>
            <Text color="cyan">❯ </Text>
            <TextInput
              value={query}
              onChange={setQuery}
              onSubmit={handleSubmit}
              placeholder="author, message, hash..."
            />
          </Box>
        </Box>
      </Box>

      <Box flexDirection="column" flexGrow={1}>
        {results.length === 0 ? (
          <Box justifyContent="center" alignItems="center" flexGrow={1}>
            <Text dimColor>No commits found</Text>
          </Box>
        ) : (
          results.map((commit, index) => (
            <Box key={commit.hash}>
              <ListItem selected={index === selectedIndex}>
                <Box width="100%">
                  <Box width="5%">
                    <Text color="yellow">{index + 1}</Text>
                  </Box>
                  <Box width="10%">
                    <Text color="yellow">{commit.shortHash}</Text>
                  </Box>
                  <Box width="45%">
                    <Text>{truncate(commit.subject, 45)}</Text>
                  </Box>
                  <Box width="20%">
                    <Text color="cyan">{truncate(commit.author, 18)}</Text>
                  </Box>
                  <Box width="20%">
                    <Text dimColor>{formatRelativeTime(commit.date)}</Text>
                  </Box>
                </Box>
              </ListItem>
            </Box>
          ))
        )}
      </Box>

      <StatusBar
        left={`${results.length} results`}
        center={query ? `Searching: "${query}"` : 'Type to search'}
        right="1-9 Quick Select • ↑↓ Navigate • Esc Exit"
      />
    </Box>
  );
}
