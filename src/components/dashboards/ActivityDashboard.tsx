/**
 * Activity Dashboard
 * Shows repository activity statistics
 */

import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { useApp } from '../AppContext';
import { useKeyboard } from '../common/hooks';
import { Header, StatusBar, Loading, BoxBorder } from '../common/UI';
import { DashboardData } from '../../types';
import { GitDatabase } from '../../core/database';
import { formatNumber } from '../../utils';

interface ActivityDashboardProps {
  database: GitDatabase;
}

export function ActivityDashboard({ database }: ActivityDashboardProps) {
  const { setScreen } = useApp();
  const [data, setData] = useState<DashboardData | null>(null);
  const [hotspots, setHotspots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    try {
      const activityData = database.getDashboardActivity();
      const hotspotsData = database.getFileHotspots(10);
      setData(activityData);
      setHotspots(hotspotsData);
    } finally {
      setLoading(false);
    }
  }, [database]);

  useKeyboard({
    onNumber: (num) => {
      if (num === 1) setScreen('timeline');
      else if (num === 2) setScreen('branches');
      else if (num === 3) setScreen('files');
      else if (num === 4) setScreen('dashboard-activity');
    },
  });

  if (loading) {
    return <Loading message="Loading activity data..." />;
  }

  if (!data) {
    return null;
  }

  const totalCommits = data.topAuthors.reduce((sum, a) => sum + a.commits, 0);
  const totalInsertions = data.topAuthors.reduce((sum, a) => sum + a.insertions, 0);
  const totalDeletions = data.topAuthors.reduce((sum, a) => sum + a.deletions, 0);

  return (
    <Box flexDirection="column" height="100%">
      <Header title="📈 Activity Dashboard" subtitle="Press 1-4 to switch screens" />

      <Box flexDirection="row" gap={2}>
        <BoxBorder title="Overview" borderColor="cyan" width="50%">
          <Box flexDirection="column">
            <Text>
              <Text bold>Total Commits:</Text> {formatNumber(totalCommits)}
            </Text>
            <Text>
              <Text bold color="green">
                Insertions:
              </Text>{' '}
              +{formatNumber(totalInsertions)}
            </Text>
            <Text>
              <Text bold color="red">
                Deletions:
              </Text>{' '}
              -{formatNumber(totalDeletions)}
            </Text>
            <Text>
              <Text bold>Contributors:</Text> {data.topAuthors.length}
            </Text>
          </Box>
        </BoxBorder>

        <BoxBorder title="Activity by Hour" borderColor="blue" width="50%">
          <Box flexDirection="column">
            {data.activityByHour.slice(0, 8).map(({ hour, commits }) => (
              <Text key={hour}>
                <Text dimColor>{hour.toString().padStart(2, '0')}:00</Text> {'█'.repeat(Math.max(1, Math.floor(commits / 10)))} {commits}
              </Text>
            ))}
          </Box>
        </BoxBorder>
      </Box>

      <Box marginTop={1}>
        <BoxBorder title="Top Contributors" borderColor="green" width="100%">
          <Box flexDirection="column">
            {data.topAuthors.slice(0, 10).map((author, index) => (
              <Box key={index}>
                <Box width="3%">
                  <Text color="yellow">{index + 1}.</Text>
                </Box>
                <Box width="40%">
                  <Text>{author.author}</Text>
                </Box>
                <Box width="15%">
                  <Text dimColor>{author.commits} commits</Text>
                </Box>
                <Box width="21%">
                  <Text color="green">+{formatNumber(author.insertions)}</Text>
                </Box>
                <Box width="21%">
                  <Text color="red">-{formatNumber(author.deletions)}</Text>
                </Box>
              </Box>
            ))}
          </Box>
        </BoxBorder>
      </Box>

      <Box marginTop={1}>
        <BoxBorder title="File Hotspots (Most Changed)" borderColor="yellow" width="100%">
          <Box flexDirection="column">
            {hotspots.slice(0, 10).map((file, index) => (
              <Box key={index}>
                <Box width="3%">
                  <Text color="yellow">{index + 1}.</Text>
                </Box>
                <Box width="70%">
                  <Text>{file.path}</Text>
                </Box>
                <Box width="15%">
                  <Text dimColor>{file.changes} changes</Text>
                </Box>
                <Box width="12%">
                  <Text dimColor>{file.authors} authors</Text>
                </Box>
              </Box>
            ))}
          </Box>
        </BoxBorder>
      </Box>

      <StatusBar left="Dashboard" right="1-4 Switch Screen • ? Help • q Quit" />
    </Box>
  );
}
