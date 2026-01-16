# GitHub Copilot SDK Integration Guide

## Overview

The [GitHub Copilot SDK](https://github.com/github/copilot-sdk) provides programmatic access to the GitHub Copilot CLI via JSON-RPC. This guide explains how it relates to HistTUI's existing AG-UI integration and how to use both approaches.

## What is GitHub Copilot SDK?

The Copilot SDK is a TypeScript/Node.js library that:

- **Connects to Copilot CLI** via JSON-RPC (not a direct LLM integration)
- **Requires GitHub Copilot CLI** to be installed and authenticated
- **Manages sessions** with conversation context
- **Supports tools** for extending Copilot's capabilities
- **Streams responses** from the Copilot CLI server
- **Handles multiple models** (GPT-5, Claude Sonnet 4.5, etc.)

### Architecture

```
┌─────────────────────────────────────┐
│     Your Application (HistTUI)     │
│         ↓                           │
│   @github/copilot-sdk Client       │
│         ↓ JSON-RPC                  │
│   GitHub Copilot CLI (server mode) │
│         ↓                           │
│   GitHub Copilot Service           │
└─────────────────────────────────────┘
```

## Comparison: Copilot SDK vs. Current AG-UI Integration

HistTUI **already has** a sophisticated generative UI system. Here's how they compare:

| Feature | Current AG-UI Integration | GitHub Copilot SDK |
|---------|--------------------------|-------------------|
| **LLM Provider** | Multiple (OpenAI, Anthropic, Ollama, OpenRouter) | GitHub Copilot only |
| **Authentication** | API keys stored in `~/.histtui/config.json` | GitHub account + Copilot subscription |
| **Protocol** | AG-UI protocol with SSE streaming | JSON-RPC with event streaming |
| **Agent Backend** | Custom server (`agent-server/server.ts`) | Copilot CLI (external process) |
| **Setup Complexity** | Medium (API key configuration) | Higher (requires Copilot CLI install + auth) |
| **Cost** | Pay-per-use or self-hosted | Included with Copilot subscription |
| **Customization** | Full control over prompts and streaming | Limited to Copilot CLI capabilities |
| **Tool Calling** | Custom implementation | Built-in tool system |
| **Offline Support** | Yes (with Ollama) | No (requires Copilot service) |

## When to Use Copilot SDK

Consider using Copilot SDK if you:

✅ **Already have a GitHub Copilot subscription**  
✅ **Want to leverage Copilot's code-specific training**  
✅ **Prefer managed infrastructure** (no need to configure API keys)  
✅ **Need consistent model access** without managing providers  
✅ **Want built-in safety guardrails** from Copilot CLI

## When to Use Current AG-UI Integration

Stick with the current implementation if you:

✅ **Want provider flexibility** (OpenAI, Anthropic, Ollama, etc.)  
✅ **Need offline support** (via Ollama)  
✅ **Prefer simpler setup** (just API keys, no CLI install)  
✅ **Want full control** over prompts and system messages  
✅ **Don't have a Copilot subscription**

## How to Integrate Copilot SDK

If you want to add Copilot SDK as an **additional option** alongside the current AG-UI backend, follow these steps:

### Step 1: Install Dependencies

```bash
npm install @github/copilot-sdk
```

### Step 2: Create Copilot Agent Backend

Create a new backend option in `agent-server/copilot-server.ts`:

```typescript
#!/usr/bin/env bun
/**
 * Copilot SDK Agent Backend for HistTUI
 * Alternative agent backend using GitHub Copilot SDK
 */

import { createServer } from 'http';
import { CopilotClient, type Tool } from '@github/copilot-sdk';
import { readFileSync, existsSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

// Load HistTUI configuration
function loadConfig() {
  const configPath = join(homedir(), '.histtui', 'config.json');
  if (!existsSync(configPath)) {
    console.error('❌ HistTUI config not found. Please run histtui first.');
    process.exit(1);
  }
  return JSON.parse(readFileSync(configPath, 'utf-8'));
}

const config = loadConfig();

// Initialize Copilot client
let copilotClient: CopilotClient | null = null;

async function getCopilotClient() {
  if (!copilotClient) {
    copilotClient = new CopilotClient({
      logLevel: 'info',
      autoStart: true,
    });
    await copilotClient.start();
  }
  return copilotClient;
}

// AG-UI Event Types
interface AGUIEvent {
  type: 'message' | 'tool' | 'component' | 'state' | 'error';
  data: any;
}

// SSE Helper
function sendSSE(res: any, event: AGUIEvent) {
  res.write(`data: ${JSON.stringify(event)}\n\n`);
}

// Request handler
async function handleRequest(req: any, res: any) {
  const url = new URL(req.url!, `http://${req.headers.host}`);
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Health check
  if (url.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'ok',
      backend: 'copilot-sdk',
      provider: 'github-copilot',
    }));
    return;
  }

  // Main agent endpoint
  if (url.pathname === '/api/agent' && req.method === 'POST') {
    // Set up SSE
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });

    try {
      // Parse request body
      let body = '';
      req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
      await new Promise((resolve) => req.on('end', resolve));
      
      const { prompt, context, action } = JSON.parse(body);
      
      // Send initial message
      sendSSE(res, {
        type: 'message',
        data: { content: 'Starting Copilot analysis...', status: 'thinking' },
      });

      // Get Copilot client
      const client = await getCopilotClient();

      // Define tools for git repository analysis
      const tools: Tool[] = [
        {
          name: 'analyze_commits',
          description: 'Analyze commit patterns and statistics',
          parameters: {
            type: 'object',
            properties: {
              timeRange: { type: 'string', description: 'Time range to analyze' },
            },
          },
          handler: async () => ({
            textResultForLlm: JSON.stringify(context),
            resultType: 'success',
          }),
        },
      ];

      // Create session with appropriate model
      const session = await client.createSession({
        model: 'gpt-5',
        tools,
        systemMessage: {
          content: `
You are an AI assistant helping users understand Git repositories through HistTUI.

<workflow_rules>
- Analyze commit patterns and provide actionable insights
- Suggest code quality improvements
- Explain changes in clear, concise language
- Focus on trends, hotspots, and contributor patterns
</workflow_rules>
`,
        },
      });

      let fullContent = '';

      // Listen to session events
      const done = new Promise<void>((resolve) => {
        session.on((event) => {
          if (event.type === 'assistant.message_delta') {
            // Streaming chunk
            fullContent += event.data.deltaContent;
            sendSSE(res, {
              type: 'message',
              data: { content: fullContent, status: 'streaming' },
            });
          } else if (event.type === 'assistant.message') {
            // Final message
            fullContent = event.data.content;
            sendSSE(res, {
              type: 'message',
              data: { content: fullContent, status: 'complete' },
            });
          } else if (event.type === 'tool.execution_start') {
            sendSSE(res, {
              type: 'tool',
              data: { name: event.data.name, status: 'start' },
            });
          } else if (event.type === 'tool.execution_end') {
            sendSSE(res, {
              type: 'tool',
              data: { name: event.data.name, status: 'end' },
            });
          } else if (event.type === 'session.idle') {
            resolve();
          }
        });
      });

      // Send prompt
      await session.send({ 
        prompt: `${action ? `Action: ${action}\n\n` : ''}${prompt}\n\nRepository Context: ${JSON.stringify(context, null, 2)}` 
      });

      // Wait for completion
      await done;

      // Clean up session
      await session.destroy();

    } catch (error: any) {
      console.error('Copilot SDK error:', error);
      sendSSE(res, {
        type: 'error',
        data: { message: error.message || 'An error occurred' },
      });
    }

    res.end();
    return;
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
}

// Create and start server
const PORT = process.env.PORT || 3001;
const server = createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║  🤖 Copilot SDK Agent Server for HistTUI             ║
║                                                       ║
║  Status: ✅ Running                                   ║
║  Port: ${PORT}                                          ║
║  Backend: GitHub Copilot SDK                          ║
║  Provider: github-copilot                             ║
║                                                       ║
║  Endpoints:                                           ║
║  • POST /api/agent - Main agent endpoint              ║
║  • GET /health - Health check                         ║
║                                                       ║
║  Press Ctrl+C to stop                                 ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n👋 Shutting down Copilot SDK agent server...');
  if (copilotClient) {
    await copilotClient.stop();
  }
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
});
```

### Step 3: Update package.json Scripts

Add a new script to run the Copilot backend:

```json
{
  "scripts": {
    "agent:copilot": "bun agent-server/copilot-server.ts",
    "agent:copilot:dev": "bun --watch agent-server/copilot-server.ts"
  }
}
```

### Step 4: Update Configuration

Add a backend selection option to `config.example.json`:

```json
{
  "agent": {
    "backend": "default",
    "backends": {
      "default": {
        "endpoint": "http://localhost:3001/api/agent",
        "provider": "custom"
      },
      "copilot": {
        "endpoint": "http://localhost:3001/api/agent",
        "provider": "github-copilot"
      }
    }
  }
}
```

### Step 5: Add Setup Wizard Option

Update the setup wizard to include Copilot SDK as an option:

```typescript
// In src/components/common/SetupWizard.tsx
const providerOptions = [
  { label: 'OpenAI', value: 'openai' },
  { label: 'Anthropic', value: 'anthropic' },
  { label: 'OpenRouter', value: 'openrouter' },
  { label: 'Ollama (Local)', value: 'ollama' },
  { label: 'GitHub Copilot SDK', value: 'copilot-sdk' }, // NEW
];
```

## Prerequisites for Copilot SDK

Before using the Copilot SDK backend, you must:

1. **Install GitHub Copilot CLI:**
   ```bash
   # Follow the official guide
   # https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli
   ```

2. **Authenticate with GitHub:**
   ```bash
   copilot auth login
   ```

3. **Verify Copilot is working:**
   ```bash
   copilot --version
   ```

4. **Have an active Copilot subscription:**
   - GitHub Copilot Individual
   - GitHub Copilot Business
   - GitHub Copilot Enterprise

<details>
<summary><strong>For AI Agents / LLMs - Integration Steps</strong></summary>

**Step 0:** Verify prerequisites
```bash
# Check if Copilot CLI is installed
which copilot
copilot --version

# Check if authenticated
copilot auth status
```

**Step 1:** Install Copilot SDK dependency
```bash
cd /path/to/HistTUI
npm install @github/copilot-sdk
```

**Step 2:** Create the Copilot backend server
```bash
# Copy the copilot-server.ts code above
nano agent-server/copilot-server.ts
# Paste the code, save with Ctrl+X, Y, Enter
```

**Step 3:** Make the server executable
```bash
chmod +x agent-server/copilot-server.ts
```

**Step 4:** Update package.json
```bash
# Add the new scripts to package.json
npm pkg set scripts.agent:copilot="bun agent-server/copilot-server.ts"
npm pkg set scripts.agent:copilot:dev="bun --watch agent-server/copilot-server.ts"
```

**Step 5:** Test the Copilot backend
```bash
# Terminal 1: Start Copilot agent
npm run agent:copilot

# Terminal 2: Test health endpoint
curl http://localhost:3001/health

# Expected response:
# {"status":"ok","backend":"copilot-sdk","provider":"github-copilot"}
```

**Step 6:** Update HistTUI configuration
```bash
# Edit ~/.histtui/config.json
nano ~/.histtui/config.json

# Change agent.backend to "copilot"
# {
#   "agent": {
#     "backend": "copilot",
#     ...
#   }
# }
```

**Step 7:** Run HistTUI with Copilot backend
```bash
# Terminal 1: Keep agent:copilot running
npm run agent:copilot

# Terminal 2: Launch HistTUI
npm run launch
```

**Verification:**
- Check status bar shows Copilot activity
- Press 'a' in Timeline screen to trigger agent
- Verify responses are streaming from Copilot

</details>

## Advantages of Copilot SDK

### 1. **Code-Specific Intelligence**
Copilot is trained specifically for code understanding and generation, making it excellent for:
- Explaining commit diffs
- Analyzing code patterns
- Suggesting refactoring improvements
- Understanding programming idioms

### 2. **Built-in Tool System**
The SDK has a robust tool/function calling system:
```typescript
const tools: Tool[] = [
  defineTool('analyze_hotspots', {
    description: 'Find frequently changed files',
    parameters: z.object({
      threshold: z.number().describe('Minimum number of changes'),
    }),
    handler: async ({ threshold }) => {
      // Your implementation
      return hotspots;
    },
  }),
];
```

### 3. **Session Management**
Built-in conversation context management:
```typescript
const session = await client.createSession();
await session.send({ prompt: "Analyze this repo" });
await session.send({ prompt: "What about the hotspots?" }); // Maintains context
```

### 4. **Streaming Support**
Native streaming with delta events:
```typescript
session.on((event) => {
  if (event.type === 'assistant.message_delta') {
    process.stdout.write(event.data.deltaContent);
  }
});
```

## Limitations of Copilot SDK

### 1. **Requires External Service**
- Depends on GitHub Copilot infrastructure
- No offline support
- Requires active subscription

### 2. **Limited Provider Choice**
- Only works with GitHub Copilot
- Cannot switch to Anthropic, Ollama, etc.
- Model selection limited to Copilot's offerings

### 3. **Additional Complexity**
- Requires Copilot CLI installation
- More moving parts (CLI process management)
- JSON-RPC overhead

## Hybrid Approach: Best of Both Worlds

You can support **both** backends and let users choose:

```typescript
// In agent configuration
interface AgentConfig {
  backend: 'default' | 'copilot';
  defaultBackend: {
    provider: 'openai' | 'anthropic' | 'ollama' | 'openrouter';
    apiKey: string;
    model: string;
  };
  copilotBackend: {
    enabled: boolean;
    cliPath?: string;
  };
}
```

### Benefits of Hybrid Approach:
- ✅ Users can choose based on their needs
- ✅ Fallback if one backend is unavailable
- ✅ A/B test different providers
- ✅ Use Copilot for code analysis, other LLMs for general queries

## Recommendations

### For Most Users: **Stick with Current AG-UI Integration**
The current implementation is:
- More flexible (multiple providers)
- Easier to set up (just API keys)
- Fully controllable (custom prompts)
- Supports offline use (Ollama)

### For Copilot Subscribers: **Add as Optional Backend**
If you already have Copilot:
- Add Copilot SDK as secondary backend
- Use for code-specific analysis
- Leverage Copilot's code intelligence
- Maintain current backend as default

### Implementation Priority: **Low**
Unless specifically requested by users who:
1. Already have Copilot subscriptions
2. Want code-specific AI features
3. Prefer managed infrastructure

The current AG-UI implementation is **already production-ready and feature-complete**.

## Future Enhancements

If Copilot SDK integration is added, consider:

1. **Automatic Backend Selection**
   - Detect if Copilot CLI is available
   - Auto-switch based on query type
   - Code analysis → Copilot
   - General queries → Current backend

2. **Tool Federation**
   - Share tools between backends
   - Unified tool interface
   - Backend-agnostic tool definitions

3. **Performance Comparison**
   - A/B testing framework
   - Latency tracking
   - Quality metrics

4. **Cost Optimization**
   - Use Copilot for code queries
   - Use cheaper models for simple queries
   - Smart routing based on complexity

## Conclusion

The GitHub Copilot SDK is a powerful tool for code-specific AI features, but HistTUI's **current AG-UI integration is already excellent** and provides more flexibility.

**Recommendation:** Document the option but **don't implement unless requested**. The current implementation:
- ✅ Works great
- ✅ Is more flexible
- ✅ Easier to maintain
- ✅ Supports more use cases

If users specifically request Copilot SDK integration, this guide provides the complete implementation path.

## Related Documentation

- [AGUI_INTEGRATION.md](./AGUI_INTEGRATION.md) - Current AG-UI implementation
- [LAUNCH_GUIDE.md](./LAUNCH_GUIDE.md) - Setting up the agent backend
- [AGENT_BACKEND.md](./AGENT_BACKEND.md) - Agent backend architecture
- [GitHub Copilot SDK Documentation](https://github.com/github/copilot-sdk)

---

**Questions or issues?** Open an issue on GitHub or consult the [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) guide.
