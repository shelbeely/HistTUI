# AG-UI Integration Guide for HistTUI

## Overview

HistTUI now features **true generative UI** powered by the AG-UI protocol. This enables AI agents to dynamically create and update terminal interface components based on context and user intent.

## What is AG-UI?

AG-UI (Agent-User Interaction) is an open, event-driven protocol that standardizes how AI agents connect to user-facing applications, including terminal/CLI interfaces like HistTUI.

### Key Features

- **Event-Driven Architecture**: Real-time streaming of agent actions and state
- **Terminal-Native**: Designed specifically for CLI/TUI applications
- **Framework Agnostic**: Works with LangGraph, CrewAI, OpenAI, Anthropic, etc.
- **Generative UI**: Agents can dynamically render custom UI components
- **State Synchronization**: Bi-directional state updates between agent and UI

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     HistTUI Application                     │
│  ┌───────────────────────────────────────────────────────┐  │
│  │             ThemeProvider (@inkjs/ui)                 │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │           AGUIProvider (AG-UI Core)             │  │  │
│  │  │  ┌───────────────────────────────────────────┐  │  │  │
│  │  │  │         AppProvider (App State)           │  │  │  │
│  │  │  │  ┌─────────────────────────────────────┐  │  │  │  │
│  │  │  │  │  GenerativeStatusBar (Always On)    │  │  │  │  │
│  │  │  │  └─────────────────────────────────────┘  │  │  │  │
│  │  │  │  ┌─────────────────────────────────────┐  │  │  │  │
│  │  │  │  │       Screen/Dashboard Router       │  │  │  │  │
│  │  │  │  │  - ActivityDashboard (AG-UI aware)  │  │  │  │  │
│  │  │  │  │  - TimelineScreen (AG-UI aware)     │  │  │  │  │
│  │  │  │  │  - All other screens...             │  │  │  │  │
│  │  │  │  └─────────────────────────────────────┘  │  │  │  │
│  │  │  └───────────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↕
                    AG-UI Protocol (SSE/HTTP)
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                    Agent Backend                             │
│  (LangGraph, CrewAI, OpenAI, Anthropic, Custom)             │
└─────────────────────────────────────────────────────────────┘
```

## Components

### 1. AGUIProvider

**Location**: `src/core/ag-ui/AGUIProvider.tsx`

Wraps the entire application and manages:
- Agent connection lifecycle
- Event streaming from agent backend
- State synchronization
- Error handling and reconnection

**Usage**:
```tsx
<AGUIProvider database={database} gitClient={gitClient}>
  <App />
</AGUIProvider>
```

### 2. GenerativeStatusBar

**Location**: `src/components/common/GenerativeStatusBar.tsx`

Always-visible status bar at the top showing:
- Current repository and screen
- Real-time agent activity status
- Streaming content from agent
- Tool execution indicators
- Time and system status

**Features**:
- Shows spinner when agent is active
- Displays streaming messages in real-time
- Badge indicators for running tools
- Color-coded status (thinking, executing, success, error)

### 3. AgentClient

**Location**: `src/core/ag-ui/AgentClient.ts`

Handles communication with AG-UI protocol agents:
- Server-Sent Events (SSE) for real-time streaming
- HTTP POST for sending messages and actions
- Automatic reconnection with exponential backoff
- Event parsing and routing

**Supported Events**:
- `message` - Agent text messages
- `tool_start` - Tool execution started
- `tool_complete` - Tool execution completed
- `stream` - Streaming content chunks
- `component_render` - Generate UI components
- `state_update` - Shared state changes

### 4. useAgentState Hook

**Location**: `src/core/ag-ui/useAgentState.ts`

React hook providing access to agent state from any component:

```tsx
const {
  isAgentActive,       // Is agent currently processing?
  currentMessage,      // Latest agent message
  agentStatus,         // idle | thinking | executing | success | error
  toolsExecuting,      // Array of currently running tools
  streamingContent,    // Current streaming content
  generatedComponents  // Dynamically generated UI components
} = useAgentState();
```

## Using AG-UI in Screens/Dashboards

### Example: Enhanced Dashboard

```tsx
import { useAgentState } from '../../core/ag-ui';
import { StatusMessage, Badge } from '../common/UI';

export function MyDashboard() {
  const agentState = useAgentState();

  return (
    <Box flexDirection="column">
      {/* Your normal dashboard content */}
      <Text>Dashboard Content</Text>

      {/* Show generative AI insights */}
      {agentState.generatedComponents.length > 0 && (
        <Box>
          <Text bold color="green">🤖 AI Insights:</Text>
          {agentState.generatedComponents.map((comp, i) => (
            <Box key={i}>{comp}</Box>
          ))}
        </Box>
      )}

      {/* Show streaming updates */}
      {agentState.streamingContent && (
        <StatusMessage variant="info">
          {agentState.streamingContent}
        </StatusMessage>
      )}

      {/* Show tool execution */}
      {agentState.toolsExecuting.map(tool => (
        <Badge key={tool} variant="warning">
          Running: {tool}
        </Badge>
      ))}
    </Box>
  );
}
```

## Agent Backend Setup

### Prerequisites

1. An AG-UI compatible agent backend (LangGraph, CrewAI, custom)
2. Server-Sent Events (SSE) endpoint
3. HTTP POST endpoint for messages/actions

### Example Agent Backend (TypeScript)

```typescript
import { createAGUIServer } from '@ag-ui/server';
import { OpenAI } from 'openai';

const server = createAGUIServer({
  port: 3001,
  agent: async (context) => {
    const openai = new OpenAI();
    
    // Your agent logic here
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: context.messages,
      stream: true,
    });

    // Stream responses back to HistTUI
    for await (const chunk of response) {
      context.stream(chunk.choices[0]?.delta?.content || '');
    }

    return { status: 'success' };
  },
  tools: {
    analyzeRepo: async (params) => {
      // Tool implementation
      return { insights: ['...'] };
    },
    suggestRefactoring: async (params) => {
      // Tool implementation
      return { suggestions: ['...'] };
    },
  },
});

server.start();
```

### Example Agent Backend (Python with LangGraph)

```python
from ag_ui import AGUIServer
from langgraph.graph import Graph

# Define your LangGraph workflow
workflow = Graph()
# ... configure workflow ...

# Create AG-UI server
server = AGUIServer(
    agent=workflow,
    tools={
        "analyze_repo": analyze_repo_tool,
        "suggest_refactoring": suggest_refactoring_tool,
    }
)

server.run(port=3001)
```

## Configuration

### Environment Variables

```bash
# AG-UI agent endpoint (optional, defaults to http://localhost:3001/api/agent)
AGUI_ENDPOINT=http://localhost:3001/api/agent

# Agent provider (openai, anthropic, custom)
AGUI_PROVIDER=openai

# API keys (if using cloud providers)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-...
```

### HistTUI Config

Create `~/.histtui/agent-config.json`:

```json
{
  "agui": {
    "enabled": true,
    "endpoint": "http://localhost:3001/api/agent",
    "reconnect": true,
    "maxReconnectAttempts": 5,
    "timeout": 30000
  },
  "features": {
    "generativeInsights": true,
    "autoSuggestions": true,
    "contextAware": true
  }
}
```

## Use Cases

### 1. Intelligent Repository Analysis

Agent analyzes repository and displays insights:
- Code quality trends
- Potential refactoring opportunities
- Dependency updates needed
- Security vulnerabilities

### 2. Contextual Recommendations

Based on current screen, agent suggests:
- Related commits to review
- Files to examine together
- Branches to merge
- Contributors to contact

### 3. Interactive Exploration

User asks questions:
- "Show me all commits that modified authentication"
- "Who worked on this feature?"
- "What changed in the last release?"

Agent dynamically generates relevant UI components with answers.

### 4. Workflow Automation

Agent helps with common tasks:
- Creating meaningful commit summaries
- Generating changelogs
- Identifying merge conflicts
- Suggesting PR reviewers

## Development

### Running with Agent Backend

1. Start your AG-UI agent backend:
   ```bash
   # Example with sample backend
   cd agent-backend
   npm start  # or python app.py
   ```

2. Start HistTUI:
   ```bash
   histtui https://github.com/user/repo
   ```

3. Agent will automatically connect and status bar will show connection state

### Testing AG-UI Integration

```bash
# Run without agent (graceful degradation)
histtui https://github.com/user/repo

# Run with local agent
AGUI_ENDPOINT=http://localhost:3001/api/agent histtui repo-url

# Run with custom agent
AGUI_ENDPOINT=https://my-agent.com/api histtui repo-url
```

### Debugging

Enable AG-UI debug logging:

```bash
DEBUG=ag-ui:* histtui repo-url
```

Check browser console (if running in terminal that supports it) or log files at:
```
~/.histtui/logs/ag-ui.log
```

## Troubleshooting

### Agent Not Connecting

1. Check agent backend is running: `curl http://localhost:3001/api/agent`
2. Verify AGUI_ENDPOINT environment variable
3. Check firewall/network settings
4. Review logs: `~/.histtui/logs/ag-ui.log`

### Streaming Not Working

1. Ensure agent backend supports Server-Sent Events (SSE)
2. Check HTTP headers include: `Content-Type: text/event-stream`
3. Verify no proxy/CDN is buffering the response

### Components Not Rendering

1. Check agent is sending `component_render` events
2. Verify component format matches expected structure
3. Review browser/terminal console for errors

## Future Enhancements

- [ ] Voice input for queries
- [ ] Multi-agent coordination
- [ ] Persistent conversation history
- [ ] Custom agent personas
- [ ] Agent marketplace integration
- [ ] Offline mode with local LLMs

## Resources

- [AG-UI Protocol Specification](https://ag-ui.com/docs/protocol)
- [AG-UI GitHub](https://github.com/ag-ui-protocol/ag-ui)
- [HistTUI Documentation](./README.md)
- [Example Agent Backends](https://github.com/ag-ui-protocol/examples)

## License

AG-UI integration follows HistTUI's ISC license.
AG-UI Protocol itself is MIT licensed.
