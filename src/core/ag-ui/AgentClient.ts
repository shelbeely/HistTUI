/**
 * AG-UI Agent Client
 * Handles communication with AG-UI protocol agents
 * Manages event streaming, tool execution, and generative UI rendering
 */

import { EventEmitter } from 'events';

export interface AgentClientConfig {
  endpoint: string;
  onStateChange?: (state: any) => void;
  onMessage?: (message: string) => void;
  onToolStart?: (toolName: string) => void;
  onToolComplete?: (toolName: string) => void;
  onStream?: (content: string) => void;
  onComponentRender?: (component: React.ReactNode) => void;
  onError?: (error: Error) => void;
}

export class AgentClient extends EventEmitter {
  private endpoint: string;
  private eventSource: EventSource | null = null;
  private config: AgentClientConfig;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(config: AgentClientConfig) {
    super();
    this.config = config;
    this.endpoint = config.endpoint;
    this.connect();
  }

  private connect() {
    try {
      // Note: EventSource is not available in Node.js/Bun environment by default
      // This is a placeholder for when the app runs in a context with SSE support
      // In production, you'd use a library like 'eventsource' for Node.js
      
      // For now, we'll set up a mock connection that can be enhanced later
      console.log('[AG-UI] Agent client initialized (SSE connection pending)');
      
      // TODO: Implement actual SSE connection when agent endpoint is available
      // This would typically use the 'eventsource' npm package in Node.js
      // or native EventSource in browser contexts
      
      this.reconnectAttempts = 0;
    } catch (err) {
      console.error('[AG-UI] Failed to connect:', err);
      this.config.onError?.(err as Error);
    }
  }

  private handleAgentMessage(data: any) {
    if (data.type === 'message') {
      this.config.onMessage?.(data.content);
    }
  }

  private handleComponentRender(data: any) {
    // In a terminal context, we'll need to translate component descriptors
    // to Ink components. For now, emit the raw data.
    this.config.onComponentRender?.(data);
  }

  public async sendMessage(message: string, context?: any) {
    try {
      const response = await fetch(`${this.endpoint}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (err) {
      console.error('[AG-UI] Failed to send message:', err);
      this.config.onError?.(err as Error);
      throw err;
    }
  }

  public async executeAction(action: string, params?: any) {
    try {
      const response = await fetch(`${this.endpoint}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, params }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to execute action: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (err) {
      console.error('[AG-UI] Failed to execute action:', err);
      this.config.onError?.(err as Error);
      throw err;
    }
  }

  public disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}
