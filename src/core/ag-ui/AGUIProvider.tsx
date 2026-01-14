/**
 * AG-UI Provider
 * Wraps the application with AG-UI agent capabilities
 * Manages agent state, event streaming, and generative UI rendering
 */

import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import { AgentStateContext, AgentState } from './useAgentState';
import { AgentClient } from './AgentClient';
import type { GitDatabase } from '../database';
import type { GitClient } from '../git';

interface AGUIProviderProps {
  children: ReactNode;
  database?: GitDatabase;
  gitClient?: GitClient;
  agentEndpoint?: string;
}

export function AGUIProvider({ 
  children, 
  database,
  gitClient,
  agentEndpoint 
}: AGUIProviderProps) {
  const [agentState, setAgentState] = useState<AgentState>({
    isAgentActive: false,
    currentMessage: '',
    agentStatus: 'idle',
    toolsExecuting: [],
    streamingContent: '',
    generatedComponents: [],
  });

  const [agentClient, setAgentClient] = useState<AgentClient | null>(null);

  useEffect(() => {
    // Initialize AG-UI client when database and gitClient are available
    if (database && gitClient) {
      const client = new AgentClient({
        endpoint: agentEndpoint || 'http://localhost:3001/api/agent',
        onStateChange: (newState) => {
          setAgentState(prev => ({ ...prev, ...newState }));
        },
        onMessage: (message) => {
          setAgentState(prev => ({
            ...prev,
            currentMessage: message,
            isAgentActive: true,
          }));
        },
        onToolStart: (toolName) => {
          setAgentState(prev => ({
            ...prev,
            toolsExecuting: [...prev.toolsExecuting, toolName],
            agentStatus: 'executing',
          }));
        },
        onToolComplete: (toolName) => {
          setAgentState(prev => ({
            ...prev,
            toolsExecuting: prev.toolsExecuting.filter(t => t !== toolName),
            agentStatus: prev.toolsExecuting.length > 1 ? 'executing' : 'success',
          }));
        },
        onStream: (content) => {
          setAgentState(prev => ({
            ...prev,
            streamingContent: content,
          }));
        },
        onComponentRender: (component) => {
          setAgentState(prev => ({
            ...prev,
            generatedComponents: [...prev.generatedComponents, component],
          }));
        },
      });

      setAgentClient(client);

      return () => {
        client.disconnect();
      };
    }
  }, [database, gitClient, agentEndpoint]);

  const updateAgentState = useCallback((updates: Partial<AgentState>) => {
    setAgentState(prev => ({ ...prev, ...updates }));
  }, []);

  return (
    <AgentStateContext.Provider value={agentState}>
      {children}
    </AgentStateContext.Provider>
  );
}
