/**
 * Code Planner Screen
 * Main entry point for agent-driven development features
 */

import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { useApp } from '../AppContext';
import { useKeyboard } from '../common/hooks';
import { Header, StatusBar, ListItem, EmptyState, Loading } from '../common/UI';
import { CodeSpec, ProjectContext, SpecStatus, SpecPriority } from '../../types/code-planner';
import { ProjectContextManager, SpecStorage, SPEC_TEMPLATES } from '../../core/code-planner';
import { formatRelativeTime } from '../../utils';

interface CodePlannerScreenProps {
  repoUrl: string;
  cacheDir: string;
}

type ViewMode = 'list' | 'create' | 'edit' | 'review' | 'context' | 'templates';

export function CodePlannerScreen({ repoUrl, cacheDir }: CodePlannerScreenProps) {
  const { setScreen, setError } = useApp();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [specs, setSpecs] = useState<CodeSpec[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [projectContext, setProjectContext] = useState<ProjectContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [contextManager] = useState(() => new ProjectContextManager(cacheDir));
  const [specStorage] = useState(() => new SpecStorage(cacheDir));
  const [filterStatus, setFilterStatus] = useState<SpecStatus | 'all'>('all');
  const [showHelp, setShowHelp] = useState(false);

  // Load specs and context
  useEffect(() => {
    try {
      setLoading(true);
      
      // Load or create project context
      let ctx = contextManager.loadContext(repoUrl);
      if (!ctx) {
        ctx = contextManager.createContext(repoUrl);
        contextManager.saveContext(ctx);
      }
      setProjectContext(ctx);

      // Load specs
      const loadedSpecs = specStorage.loadSpecs(repoUrl);
      setSpecs(loadedSpecs);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load code planner data');
    } finally {
      setLoading(false);
    }
  }, [repoUrl, cacheDir]);

  // Keyboard handlers
  useKeyboard({
    onUp: () => setSelectedIndex(prev => Math.max(0, prev - 1)),
    onDown: () => setSelectedIndex(prev => Math.min(filteredSpecs.length - 1, prev + 1)),
    onEnter: () => {
      if (filteredSpecs.length > 0 && viewMode === 'list') {
        // TODO: Open spec editor
        setViewMode('edit');
      }
    },
    onEscape: () => {
      if (viewMode !== 'list') {
        setViewMode('list');
      } else {
        setScreen('dashboard-activity');
      }
    },
    onCustom: (key) => {
      if (key === 'n' && viewMode === 'list') {
        // New spec
        handleCreateSpec();
      } else if (key === 'c' && viewMode === 'list') {
        // Open context manager
        setViewMode('context');
      } else if (key === 't' && viewMode === 'list') {
        // Open templates
        setViewMode('templates');
      } else if (key === 'd' && viewMode === 'list' && filteredSpecs.length > 0) {
        // Delete spec
        handleDeleteSpec();
      } else if (key === 'f' && viewMode === 'list') {
        // Cycle filter
        cycleFilter();
      } else if (key === '?') {
        setShowHelp(!showHelp);
      }
    },
  });

  const handleCreateSpec = () => {
    const newSpec = specStorage.createSpec('New Spec');
    specStorage.saveSpec(repoUrl, newSpec);
    setSpecs(prev => [newSpec, ...prev]);
    setSelectedIndex(0);
  };

  const handleDeleteSpec = () => {
    const spec = filteredSpecs[selectedIndex];
    if (spec) {
      specStorage.deleteSpec(repoUrl, spec.id);
      setSpecs(prev => prev.filter(s => s.id !== spec.id));
      setSelectedIndex(prev => Math.max(0, prev - 1));
    }
  };

  const cycleFilter = () => {
    const filters: Array<SpecStatus | 'all'> = ['all', 'draft', 'ready', 'in-progress', 'review', 'completed'];
    const currentIndex = filters.indexOf(filterStatus);
    const nextIndex = (currentIndex + 1) % filters.length;
    setFilterStatus(filters[nextIndex]);
    setSelectedIndex(0);
  };

  const filteredSpecs = filterStatus === 'all' 
    ? specs 
    : specs.filter(s => s.status === filterStatus);

  const getStatusColor = (status: SpecStatus) => {
    const colors: Record<SpecStatus, string> = {
      draft: '#6750A4',
      ready: '#4CAF50',
      'in-progress': '#FF9800',
      review: '#2196F3',
      completed: '#4CAF50',
      archived: '#9E9E9E',
    };
    return colors[status];
  };

  const getStatusIcon = (status: SpecStatus) => {
    const icons: Record<SpecStatus, string> = {
      draft: '📝',
      ready: '✅',
      'in-progress': '⚙️',
      review: '👀',
      completed: '✔️',
      archived: '📦',
    };
    return icons[status];
  };

  const getPriorityIcon = (priority: SpecPriority) => {
    const icons: Record<SpecPriority, string> = {
      low: '🟢',
      medium: '🟡',
      high: '🟠',
      critical: '🔴',
    };
    return icons[priority];
  };

  if (loading) {
    return <Loading message="Loading code planner..." />;
  }

  if (!projectContext) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color="red">Failed to load project context</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" height="100%">
      <Header 
        title={`Code Planner - ${projectContext.repoName}`}
        subtitle="Agent-Driven Development"
      />

      {showHelp && (
        <Box flexDirection="column" borderStyle="single" borderColor="cyan" padding={1} marginBottom={1}>
          <Text bold color="cyan">Keyboard Shortcuts:</Text>
          <Text>n - New spec | c - Context | t - Templates | d - Delete</Text>
          <Text>f - Filter by status | Enter - Edit spec | Esc - Back</Text>
          <Text>↑/↓ - Navigate | ? - Toggle help</Text>
        </Box>
      )}

      <Box flexDirection="column" padding={1} flexGrow={1}>
        {viewMode === 'list' && (
          <>
            <Box marginBottom={1}>
              <Text>
                Filter: <Text color="cyan">{filterStatus}</Text> | 
                Total: <Text color="green">{specs.length}</Text> | 
                Showing: <Text color="yellow">{filteredSpecs.length}</Text>
              </Text>
            </Box>

            {filteredSpecs.length === 0 ? (
              <EmptyState
                icon="📋"
                message="No specs found"
                hint="Press 'n' to create a new spec or 't' to browse templates"
              />
            ) : (
              <Box flexDirection="column">
                {filteredSpecs.map((spec, index) => (
                  <ListItem
                    key={spec.id}
                    selected={index === selectedIndex}
                    prefix={`${getStatusIcon(spec.status)} ${getPriorityIcon(spec.priority)}`}
                  >
                    <Box flexDirection="column">
                      <Text bold>{spec.title}</Text>
                      <Text dimColor>
                        {spec.description.substring(0, 60)}{spec.description.length > 60 ? '...' : ''}
                      </Text>
                      <Text dimColor>
                        Updated {formatRelativeTime(new Date(spec.updatedAt))}
                        {spec.tags.length > 0 && ` • Tags: ${spec.tags.join(', ')}`}
                      </Text>
                    </Box>
                  </ListItem>
                ))}
              </Box>
            )}
          </>
        )}

        {viewMode === 'context' && (
          <Box flexDirection="column">
            <Text bold color="cyan">Project Context</Text>
            <Box marginTop={1} flexDirection="column">
              <Text>Tech Stack: {projectContext.techStack.languages.join(', ') || 'Not set'}</Text>
              <Text>Frameworks: {projectContext.techStack.frameworks.join(', ') || 'Not set'}</Text>
              <Text>Vision: {projectContext.productGoals.vision || 'Not set'}</Text>
            </Box>
            <Text dimColor marginTop={1}>Press Esc to return</Text>
          </Box>
        )}

        {viewMode === 'templates' && (
          <Box flexDirection="column">
            <Text bold color="cyan">Spec Templates</Text>
            <Box marginTop={1} flexDirection="column">
              {SPEC_TEMPLATES.map((template, index) => (
                <Box key={template.id} marginBottom={1}>
                  <Text>
                    {template.icon} <Text bold>{template.name}</Text> - {template.description}
                  </Text>
                </Box>
              ))}
            </Box>
            <Text dimColor marginTop={1}>Press Esc to return</Text>
          </Box>
        )}
      </Box>

      <StatusBar
        left={`${viewMode.toUpperCase()} | ${filteredSpecs.length} specs`}
        center={projectContext.repoName}
        right="Press ? for help"
      />
    </Box>
  );
}
