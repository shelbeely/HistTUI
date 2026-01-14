/**
 * AG-UI Agent State Hook
 * Provides real-time access to agent state across the application
 */

import { useState, useEffect, useContext, createContext } from 'react';

export interface AgentState {
  isAgentActive: boolean;
  currentMessage: string;
  agentStatus: 'idle' | 'thinking' | 'executing' | 'success' | 'error';
  toolsExecuting: string[];
  streamingContent: string;
  generatedComponents: React.ReactNode[];
}

const AgentStateContext = createContext<AgentState>({
  isAgentActive: false,
  currentMessage: '',
  agentStatus: 'idle',
  toolsExecuting: [],
  streamingContent: '',
  generatedComponents: [],
});

export const useAgentState = () => useContext(AgentStateContext);

export { AgentStateContext };
