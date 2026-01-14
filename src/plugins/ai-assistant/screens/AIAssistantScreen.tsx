/**
 * AI Assistant Screen - Main UI for AI-powered coding assistant
 * Integrates chat, file operations, command execution, and task management
 */

import React, { useState, useEffect } from 'react';
import { Box, Text, useInput, useApp } from 'ink';
import { TextInput } from '@inkjs/ui';
import type { AIService } from '../services/AIService.js';
import type { WorktreeManager } from '../services/WorktreeManager.js';
import type { FileOperations } from '../services/FileOperations.js';
import type { CommandExecutor } from '../services/CommandExecutor.js';
import type { TaskManager } from '../services/TaskManager.js';
import type { AIMessage, Task } from '../types/index.js';
import { BoxBorder, StatusBar, Loading } from '../../../components/common/UI.js';

interface AIAssistantScreenProps {
  aiService: AIService;
  worktreeManager: WorktreeManager;
  fileOps: FileOperations;
  commandExecutor: CommandExecutor;
  taskManager: TaskManager;
  repoPath: string;
  currentBranch: string;
  onExit: () => void;
}

type View = 'chat' | 'tasks' | 'worktrees' | 'help';

export function AIAssistantScreen({
  aiService,
  worktreeManager,
  fileOps,
  commandExecutor,
  taskManager,
  repoPath,
  currentBranch,
  onExit,
}: AIAssistantScreenProps) {
  const [view, setView] = useState<View>('chat');
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const { exit } = useApp();

  // Load tasks on mount
  useEffect(() => {
    setTasks(taskManager.getAllTasks());
  }, []);

  useInput((input, key) => {
    if (key.escape) {
      onExit();
    } else if (key.tab) {
      // Cycle through views
      const views: View[] = ['chat', 'tasks', 'worktrees', 'help'];
      const currentIndex = views.indexOf(view);
      const nextIndex = (currentIndex + 1) % views.length;
      setView(views[nextIndex]);
    }
  });

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message
    const newMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);

    try {
      // Get AI response
      const response = await aiService.sendMessage(userMessage, {
        repoPath,
        currentBranch,
        recentCommits: [],
        modifiedFiles: [],
        taskContext: selectedTask || undefined,
      });

      // Add assistant response
      const assistantMessage: AIMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        model: aiService.getConfig().model,
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage: AIMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Error: ${error.message}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderChat = () => (
    <Box flexDirection="column" height="100%">
      <BoxBorder title="AI Assistant Chat" borderColor="cyan">
        <Box flexDirection="column" paddingX={1}>
          {messages.length === 0 ? (
            <Text dimColor>Ask me anything about this repository...</Text>
          ) : (
            messages.slice(-10).map(msg => (
              <Box key={msg.id} flexDirection="column" marginBottom={1}>
                <Text bold color={msg.role === 'user' ? 'green' : 'cyan'}>
                  {msg.role === 'user' ? '➤ You' : '✦ AI'}
                </Text>
                <Text>{msg.content}</Text>
              </Box>
            ))
          )}
          {isLoading && <Loading message="AI is thinking..." />}
        </Box>
      </BoxBorder>

      <Box marginTop={1}>
        <Text bold>{'> '}</Text>
        <TextInput
          defaultValue={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          placeholder="Type your message..."
          isDisabled={isLoading}
        />
      </Box>
    </Box>
  );

  const renderTasks = () => {
    const stats = taskManager.getStatistics();

    return (
      <BoxBorder title="Task Board (Kanban)" borderColor="yellow">
        <Box flexDirection="column" paddingX={1}>
          <Box marginBottom={1}>
            <Text>
              Total: <Text bold color="cyan">{stats.total}</Text> | 
              Todo: <Text color="gray">{stats.byStatus.todo}</Text> | 
              In Progress: <Text color="yellow">{stats.byStatus['in-progress']}</Text> | 
              Done: <Text color="green">{stats.byStatus.done}</Text>
            </Text>
          </Box>

          {tasks.length === 0 ? (
            <Text dimColor>No tasks yet. Create one to get started!</Text>
          ) : (
            tasks.slice(0, 10).map(task => (
              <Box key={task.id} marginBottom={1} flexDirection="column">
                <Text>
                  <Text bold color={
                    task.status === 'done' ? 'green' :
                    task.status === 'in-progress' ? 'yellow' :
                    task.status === 'blocked' ? 'red' : 'gray'
                  }>
                    [{task.status.toUpperCase()}]
                  </Text>
                  {' '}
                  <Text color={
                    task.priority === 'critical' ? 'red' :
                    task.priority === 'high' ? 'yellow' : 'white'
                  }>
                    {task.title}
                  </Text>
                </Text>
                <Text dimColor>{task.description.slice(0, 80)}...</Text>
                {task.branch && <Text dimColor>Branch: {task.branch}</Text>}
              </Box>
            ))
          )}
        </Box>
      </BoxBorder>
    );
  };

  const renderWorktrees = () => (
    <BoxBorder title="Git Worktrees" borderColor="magenta">
      <Box flexDirection="column" paddingX={1}>
        <Text dimColor>
          Isolated worktrees for safe AI-assisted changes
        </Text>
        <Text dimColor>Coming soon: List and manage worktrees</Text>
      </Box>
    </BoxBorder>
  );

  const renderHelp = () => (
    <BoxBorder title="AI Assistant Help" borderColor="blue">
      <Box flexDirection="column" paddingX={1}>
        <Text bold color="cyan">Keyboard Shortcuts:</Text>
        <Text>  Tab        - Switch between views</Text>
        <Text>  Esc        - Exit AI Assistant</Text>
        <Text>  Enter      - Send message (in chat)</Text>
        
        <Box marginTop={1}>
          <Text bold color="cyan">Features:</Text>
        </Box>
        <Text>  • Chat with AI about your repository</Text>
        <Text>  • Create and manage coding tasks</Text>
        <Text>  • Work in isolated git worktrees</Text>
        <Text>  • Execute commands safely</Text>
        <Text>  • Explain commits and changes</Text>

        <Box marginTop={1}>
          <Text bold color="cyan">Current Provider:</Text>
        </Box>
        <Text>  {aiService.getConfig().provider} - {aiService.getConfig().model}</Text>
      </Box>
    </BoxBorder>
  );

  return (
    <Box flexDirection="column" height="100%">
      <Box marginBottom={1}>
        <Text bold color="cyan">AI Assistant</Text>
        <Text dimColor> | Repository: {repoPath.split('/').pop()}</Text>
        <Text dimColor> | Branch: {currentBranch}</Text>
      </Box>

      <Box flexGrow={1}>
        {view === 'chat' && renderChat()}
        {view === 'tasks' && renderTasks()}
        {view === 'worktrees' && renderWorktrees()}
        {view === 'help' && renderHelp()}
      </Box>

      <StatusBar
        left={`View: ${view}`}
        center="Tab: Switch | Esc: Exit"
        right={`${messages.length} messages`}
      />
    </Box>
  );
}
