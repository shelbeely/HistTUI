/**
 * Branches Screen
 * Shows all branches and tags
 */

import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { useApp } from '../AppContext';
import { useKeyboard, useListNavigation } from '../common/hooks';
import { Header, StatusBar, ListItem, EmptyState, Loading, TabBar } from '../common/UI';
import { Branch, Tag } from '../../types';
import { GitDatabase } from '../../core/database';

interface BranchesScreenProps {
  database: GitDatabase;
}

export function BranchesScreen({ database }: BranchesScreenProps) {
  const { setScreen } = useApp();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'branches' | 'tags'>('branches');

  const items: (Branch | Tag)[] = view === 'branches' ? branches : tags;
  const {
    selectedIndex,
    visibleItems,
    moveUp,
    moveDown,
    pageUp,
    pageDown,
    goHome,
    goEnd,
  } = useListNavigation<Branch | Tag>(items, 20);

  useEffect(() => {
    setLoading(true);
    try {
      setBranches(database.getBranches());
      setTags(database.getTags());
    } finally {
      setLoading(false);
    }
  }, [database]);

  useKeyboard({
    onUp: moveUp,
    onDown: moveDown,
    onPageUp: pageUp,
    onPageDown: pageDown,
    onHome: goHome,
    onEnd: goEnd,
    onTab: () => setView(view === 'branches' ? 'tags' : 'branches'),
    onNumber: (num) => {
      if (num === 1) setScreen('timeline');
      else if (num === 2) setScreen('branches');
      else if (num === 3) setScreen('files');
      else if (num === 4) setScreen('dashboard-activity');
    },
  });

  if (loading) {
    return <Loading message="Loading branches and tags..." />;
  }

  return (
    <Box flexDirection="column" height="100%">
      <Header title="🌿 Branches & Tags" subtitle="Use ↑↓ or j/k to navigate • Tab to switch view" />

      <TabBar
        tabs={[
          { key: 'branches', label: 'Branches', shortcut: 'b' },
          { key: 'tags', label: 'Tags', shortcut: 't' },
        ]}
        activeTab={view}
      />

      {view === 'branches' && branches.length === 0 && (
        <EmptyState icon="🌿" message="No branches found" />
      )}

      {view === 'tags' && tags.length === 0 && (
        <EmptyState icon="🏷️" message="No tags found" />
      )}

      <Box flexDirection="column" flexGrow={1} overflow="hidden">
        {view === 'branches' &&
          visibleItems.map((item, index) => {
            const branch = item as Branch;
            const isSelected = selectedIndex === index + items.indexOf(visibleItems[0]);
            return (
              <Box key={branch.name}>
                <ListItem selected={isSelected}>
                  <Box width="100%">
                    {branch.current && <Text color="green">* </Text>}
                    {branch.remote && <Text color="cyan">📡 </Text>}
                    <Box width="50%">
                      <Text color={branch.current ? 'green' : 'white'}>{branch.name}</Text>
                    </Box>
                    <Box width="50%">
                      <Text dimColor>{branch.commit.substring(0, 7)}</Text>
                    </Box>
                  </Box>
                </ListItem>
              </Box>
            );
          })}

        {view === 'tags' &&
          visibleItems.map((item, index) => {
            const tag = item as Tag;
            const isSelected = selectedIndex === index + items.indexOf(visibleItems[0]);
            return (
              <Box key={tag.name}>
                <ListItem selected={isSelected}>
                  <Box width="100%">
                    <Box width="30%">
                      <Text color="magenta">{tag.name}</Text>
                    </Box>
                    <Box width="15%">
                      <Text dimColor>{tag.commit.substring(0, 7)}</Text>
                    </Box>
                    <Box width="55%">
                      <Text dimColor>{tag.message || ''}</Text>
                    </Box>
                  </Box>
                </ListItem>
              </Box>
            );
          })}
      </Box>

      <StatusBar
        left={`${view === 'branches' ? 'Branch' : 'Tag'} ${selectedIndex + 1}/${items.length}`}
        center={`${branches.length} branches • ${tags.length} tags`}
        right="Tab Switch View • ? Help • q Quit"
      />
    </Box>
  );
}
