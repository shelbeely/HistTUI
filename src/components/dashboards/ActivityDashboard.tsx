/**
 * Activity Dashboard
 * Shows repository activity statistics with Material Design 3 expressive styling
 */

import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import Gradient from 'ink-gradient';
import chalk from 'chalk';
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
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    setLoading(true);
    setAnimationStep(0); // Reset animation on data load
    try {
      const activityData = database.getDashboardActivity();
      const hotspotsData = database.getFileHotspots(10);
      setData(activityData);
      setHotspots(hotspotsData);
    } finally {
      setLoading(false);
    }
  }, [database]);

  // Progressive animation effect for bars
  useEffect(() => {
    if (!loading && data && animationStep < 100) {
      const timer = setInterval(() => {
        setAnimationStep(prev => Math.min(100, prev + 5));
      }, 30);
      return () => clearInterval(timer);
    }
  }, [loading, data, animationStep]);

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

  // Helper to create animated progress bars with colors
  const createColorBar = (value: number, maxValue: number, color: 'green' | 'blue' | 'magenta' | 'cyan') => {
    const percentage = Math.min(100, (value / maxValue) * 100);
    const animatedPercentage = (percentage * animationStep) / 100;
    const barLength = Math.floor((animatedPercentage / 100) * 30);
    
    const colorMap = {
      green: chalk.hex('#00C853'), // M3 Green
      blue: chalk.hex('#2979FF'),  // M3 Blue
      magenta: chalk.hex('#D500F9'), // M3 Magenta
      cyan: chalk.hex('#00E5FF'),   // M3 Cyan
    };
    
    return barLength > 0 ? colorMap[color]('█'.repeat(barLength)) : '';
  };

  // Get max commits for scaling
  const maxHourlyCommits = Math.max(...data.activityByHour.map(h => h.commits), 1);

  return (
    <Box flexDirection="column" height="100%">
      <Box marginBottom={1}>
        <Gradient name="rainbow">
          <Text bold>🚀 Activity Dashboard</Text>
        </Gradient>
        <Text dimColor> Press 1-4 to switch screens</Text>
      </Box>

      <Box flexDirection="row" gap={2}>
        <BoxBorder title="📊 Overview" borderColor="magenta" width="50%">
          <Box flexDirection="column" gap={0}>
            <Box>
              <Text bold color="cyan">💫 Total Commits: </Text>
              <Text color="magenta" bold>{formatNumber(totalCommits)}</Text>
            </Box>
            <Box marginTop={0}>
              <Text bold color="greenBright">✨ Insertions: </Text>
              <Text color="green" bold>+{formatNumber(totalInsertions)}</Text>
            </Box>
            <Box marginTop={0}>
              <Text bold color="redBright">🔥 Deletions: </Text>
              <Text color="red" bold>-{formatNumber(totalDeletions)}</Text>
            </Box>
            <Box marginTop={0}>
              <Text bold color="yellow">👥 Contributors: </Text>
              <Text color="yellowBright" bold>{data.topAuthors.length}</Text>
            </Box>
          </Box>
        </BoxBorder>

        <BoxBorder title="⏰ Activity by Hour" borderColor="cyan" width="50%">
          <Box flexDirection="column">
            {data.activityByHour.slice(0, 8).map(({ hour, commits }) => (
              <Box key={hour}>
                <Box width="15%">
                  <Text color="blueBright" bold>{hour.toString().padStart(2, '0')}:00</Text>
                </Box>
                <Box width="60%">
                  {createColorBar(commits, maxHourlyCommits, 'cyan')}
                </Box>
                <Box width="25%">
                  <Text color="cyan"> {commits}</Text>
                </Box>
              </Box>
            ))}
          </Box>
        </BoxBorder>
      </Box>

      <Box marginTop={1}>
        <BoxBorder title="🏆 Top Contributors" borderColor="yellow" width="100%">
          <Box flexDirection="column">
            {data.topAuthors.slice(0, 10).map((author, index) => {
              const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32']; // Gold, Silver, Bronze
              const rankColor = index < 3 ? chalk.hex(medalColors[index]) : chalk.yellow;
              const medals = ['🥇', '🥈', '🥉'];
              const medal = index < 3 ? medals[index] : '🎖️';
              
              return (
                <Box key={index}>
                  <Box width="4%">
                    <Text>{medal}</Text>
                  </Box>
                  <Box width="3%">
                    <Text>{rankColor(String(index + 1))}</Text>
                  </Box>
                  <Box width="35%">
                    <Text bold color="white">{author.author}</Text>
                  </Box>
                  <Box width="15%">
                    <Text color="gray">{author.commits} commits</Text>
                  </Box>
                  <Box width="21%">
                    <Text color="greenBright">+{formatNumber(author.insertions)}</Text>
                  </Box>
                  <Box width="22%">
                    <Text color="redBright">-{formatNumber(author.deletions)}</Text>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </BoxBorder>
      </Box>

      <Box marginTop={1}>
        <BoxBorder title="🔥 File Hotspots (Most Changed)" borderColor="red" width="100%">
          <Box flexDirection="column">
            {hotspots.slice(0, 10).map((file, index) => {
              const heatColors = [
                chalk.hex('#FF1744'), // Hot red
                chalk.hex('#FF5722'), // Deep orange
                chalk.hex('#FF9800'), // Orange
                chalk.hex('#FFC107'), // Amber
                chalk.hex('#FFEB3B'), // Yellow
              ];
              const colorIndex = Math.min(index, heatColors.length - 1);
              
              return (
                <Box key={index}>
                  <Box width="3%">
                    <Text>{heatColors[colorIndex](`${index + 1}.`)}</Text>
                  </Box>
                  <Box width="65%">
                    <Text color="white">{file.path}</Text>
                  </Box>
                  <Box width="17%">
                    <Text color="magenta">{file.changes} changes</Text>
                  </Box>
                  <Box width="15%">
                    <Text color="cyan">{file.authors} authors</Text>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </BoxBorder>
      </Box>

      <StatusBar 
        left={chalk.hex('#BB86FC')('🎨 Dashboard')} 
        right="1️⃣-4️⃣ Switch Screen • ❓ Help • 🚪 q Quit" 
      />
    </Box>
  );
}
