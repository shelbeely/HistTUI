# 🤖 AG-UI Agent Backend Guide

**Complete Guide to HistTUI's Generative UI Agent Server**

The AG-UI Agent Backend provides AI-powered features for HistTUI using Server-Sent Events (SSE) streaming and the AG-UI protocol. This guide documents the complete architecture, API, and custom agent development.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Server Architecture](#-server-architecture)
- [SSE Streaming Implementation](#-sse-streaming-implementation)
- [AG-UI Protocol](#-ag-ui-protocol)
- [Configuration Reading](#-configuration-reading)
- [API Endpoints](#-api-endpoints)
- [Custom Agent Development](#-custom-agent-development)
- [Error Handling](#-error-handling)
- [Troubleshooting](#-troubleshooting)

---

## 🌟 Overview

### What is the Agent Backend?

The **AG-UI Agent Server** is a standalone Node.js/Bun server that:

✅ **Receives requests** from HistTUI client  
✅ **Streams responses** using Server-Sent Events (SSE)  
✅ **Executes AI prompts** via LLM providers  
✅ **Generates dynamic UI** components in real-time  
✅ **Maintains state** across interactions  

### Architecture Diagram

```
┌─────────────────┐          HTTP POST           ┌──────────────────┐
│                 │ ─────────────────────────────▶│                  │
│  HistTUI Client │                               │  Agent Server    │
│  (Ink/React)    │                               │  (port 3001)     │
│                 │◀───── SSE Stream ─────────────│                  │
└─────────────────┘                               └──────────────────┘
         │                                                  │
         │                                                  │
         ▼                                                  ▼
┌─────────────────┐                               ┌──────────────────┐
│  Config File    │                               │  LLM Provider    │
│  ~/.histtui/    │                               │  (OpenAI/etc.)   │
│  config.json    │                               └──────────────────┘
└─────────────────┘
```

### Key Files

| File | Purpose |
|------|---------|
| `agent-server/server.ts` | Main server implementation |
| `src/core/ag-ui/AgentClient.ts` | Client-side AG-UI connector |
| `src/core/ag-ui/useAgentState.ts` | React hook for agent state |
| `src/core/ag-ui/AGUIProvider.tsx` | React context provider |
| `~/.histtui/config.json` | Configuration file |

---

## 🏗️ Server Architecture

### Server File: `agent-server/server.ts`

**Location:** `/agent-server/server.ts`  
**Lines:** ~228  
**Language:** TypeScript (runs with Bun)

### Main Components

```typescript
// 1. Configuration Loading
function loadConfig() {
  const configPath = join(homedir(), '.histtui', 'config.json');
  return JSON.parse(readFileSync(configPath, 'utf-8'));
}

// 2. AI Provider Initialization
function getAIProvider() {
  const { provider, apiKey, baseUrl, model } = config.llm;
  
  switch (provider) {
    case 'openai':
    case 'openrouter':
      return createOpenAI({ apiKey, baseURL });
    case 'anthropic':
      return createAnthropic({ apiKey });
    case 'ollama':
      return createOpenAI({ apiKey: 'ollama', baseURL });
  }
}

// 3. Request Handler
async function handleRequest(req, res) {
  // Route to endpoints
  // - /health
  // - /api/agent
}

// 4. Server Creation
const server = createServer(handleRequest);
server.listen(PORT);
```

### Startup Sequence

```
1. Load configuration from ~/.histtui/config.json
2. Validate LLM provider and API key
3. Initialize AI provider (OpenAI/Anthropic/etc.)
4. Create HTTP server
5. Listen on port 3001
6. Display startup banner
7. Wait for requests
```

### Dependencies

```json
{
  "ai": "^6.0.30",              // Vercel AI SDK
  "@ai-sdk/openai": "^3.0.9",   // OpenAI provider
  "@ai-sdk/anthropic": "^3.0.12", // Anthropic provider
  "bun": ">=1.3.5"              // Runtime
}
```

---

## 📡 SSE Streaming Implementation

### What is SSE?

**Server-Sent Events (SSE)** allows the server to push real-time updates to the client over a single HTTP connection.

**Benefits:**
- ✅ Real-time streaming
- ✅ Automatic reconnection
- ✅ Simple HTTP-based protocol
- ✅ Works through firewalls/proxies

### SSE Response Format

```javascript
// Server sends:
data: {"type":"message","data":{"content":"Hello","status":"streaming"}}

data: {"type":"message","data":{"content":"Hello world","status":"streaming"}}

data: {"type":"message","data":{"content":"Hello world!","status":"complete"}}


// (empty line signals end of event)
```

### Server-Side Implementation

```typescript
async function handleAgentRequest(req: any, res: any) {
  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });

  // Helper to send SSE events
  function sendSSE(event: AGUIEvent) {
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  }

  // Parse request body
  let body = '';
  req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
  await new Promise((resolve) => req.on('end', resolve));
  
  const { prompt, context, action } = JSON.parse(body);

  // Send initial message
  sendSSE({
    type: 'message',
    data: { content: 'Analyzing...', status: 'thinking' },
  });

  // Stream AI response
  const result = await streamText({
    model: aiModel,
    prompt: `${prompt}\n\nContext: ${JSON.stringify(context)}`,
  });

  for await (const chunk of result.textStream) {
    sendSSE({
      type: 'message',
      data: { content: chunk, status: 'streaming' },
    });
  }

  // Send completion
  sendSSE({
    type: 'message',
    data: { content: fullText, status: 'complete' },
  });

  res.end();
}
```

### Client-Side Consumption

```typescript
// In AgentClient.ts
async queryAgent(prompt: string, context: any) {
  const response = await fetch('http://localhost:3001/api/agent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, context, action: 'analyze' }),
  });

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const event = JSON.parse(line.slice(6));
        this.handleEvent(event);
      }
    }
  }
}
```

---

## 🔌 AG-UI Protocol

### Event Types

The AG-UI protocol defines 5 event types:

```typescript
interface AGUIEvent {
  type: 'message' | 'tool' | 'component' | 'state' | 'error';
  data: any;
}
```

### Event Type: `message`

**Purpose:** Text message from AI agent

```typescript
{
  type: 'message',
  data: {
    content: string,      // Message text
    status: 'thinking' | 'streaming' | 'complete'
  }
}
```

**Example:**
```json
{
  "type": "message",
  "data": {
    "content": "I found 3 hotspots in the codebase...",
    "status": "complete"
  }
}
```

---

### Event Type: `tool`

**Purpose:** Tool execution status

```typescript
{
  type: 'tool',
  data: {
    name: string,         // Tool name
    status: 'start' | 'progress' | 'complete' | 'error',
    result?: any          // Tool output
  }
}
```

**Example:**
```json
{
  "type": "tool",
  "data": {
    "name": "analyze_hotspots",
    "status": "complete",
    "result": {
      "files": ["src/App.tsx", "src/utils.ts"],
      "changes": [45, 32]
    }
  }
}
```

---

### Event Type: `component`

**Purpose:** Dynamic UI component to render

```typescript
{
  type: 'component',
  data: {
    type: string,         // Component type (badge, chart, table)
    props: object         // Component properties
  }
}
```

**Example:**
```json
{
  "type": "component",
  "data": {
    "type": "badge",
    "props": {
      "variant": "info",
      "text": "📊 View Hotspots"
    }
  }
}
```

---

### Event Type: `state`

**Purpose:** Update agent state

```typescript
{
  type: 'state',
  data: {
    key: string,          // State key
    value: any            // New value
  }
}
```

**Example:**
```json
{
  "type": "state",
  "data": {
    "key": "analysis_complete",
    "value": true
  }
}
```

---

### Event Type: `error`

**Purpose:** Error notification

```typescript
{
  type: 'error',
  data: {
    message: string,      // Error message
    code?: string,        // Error code
    details?: any         // Additional details
  }
}
```

**Example:**
```json
{
  "type": "error",
  "data": {
    "message": "API rate limit exceeded",
    "code": "RATE_LIMIT",
    "details": { "retryAfter": 60 }
  }
}
```

---

## ⚙️ Configuration Reading

### Configuration File Location

```
~/.histtui/config.json
```

### Required Configuration Fields

```json
{
  "llm": {
    "provider": "openai",        // Required
    "apiKey": "sk-...",          // Required (except Ollama)
    "model": "gpt-4-turbo",      // Optional (provider default)
    "baseUrl": null              // Optional (custom endpoint)
  },
  "agui": {
    "enabled": true,             // Optional (default: false)
    "endpoint": "http://localhost:3001/api/agent"  // Optional
  }
}
```

### Loading Configuration

```typescript
function loadConfig() {
  const configPath = join(homedir(), '.histtui', 'config.json');
  
  if (!existsSync(configPath)) {
    console.error('❌ HistTUI config not found');
    console.log('Run histtui first to configure');
    process.exit(1);
  }
  
  try {
    return JSON.parse(readFileSync(configPath, 'utf-8'));
  } catch (error) {
    console.error('❌ Failed to parse config:', error);
    process.exit(1);
  }
}
```

### Provider-Specific Configuration

**OpenAI:**
```json
{
  "llm": {
    "provider": "openai",
    "apiKey": "sk-...",
    "model": "gpt-4-turbo"
  }
}
```

**Anthropic:**
```json
{
  "llm": {
    "provider": "anthropic",
    "apiKey": "sk-ant-...",
    "model": "claude-3-5-sonnet-20241022"
  }
}
```

**OpenRouter:**
```json
{
  "llm": {
    "provider": "openrouter",
    "apiKey": "sk-or-...",
    "model": "anthropic/claude-3.5-sonnet",
    "baseUrl": "https://openrouter.ai/api/v1"
  }
}
```

**Ollama:**
```json
{
  "llm": {
    "provider": "ollama",
    "model": "llama3.1",
    "baseUrl": "http://localhost:11434"
  }
}
```

---

## 🌐 API Endpoints

### Endpoint: `/health`

**Method:** `GET`  
**Purpose:** Health check and status

**Response:**
```json
{
  "status": "ok",
  "provider": "openai",
  "model": "gpt-4-turbo"
}
```

**Usage:**
```bash
curl http://localhost:3001/health
```

---

### Endpoint: `/api/agent`

**Method:** `POST`  
**Purpose:** Main agent endpoint for AI queries

**Request Body:**
```json
{
  "prompt": "Analyze this repository",
  "context": {
    "repoUrl": "https://github.com/user/repo",
    "commits": 1234,
    "files": ["App.tsx", "utils.ts"]
  },
  "action": "analyze_commits"
}
```

**Response:** SSE stream (see [SSE Implementation](#-sse-streaming-implementation))

**Actions:**

| Action | Purpose |
|--------|---------|
| `analyze_commits` | Analyze commit patterns |
| `suggest_improvements` | Code quality suggestions |
| `explain_changes` | Explain what changed |
| `find_hotspots` | Identify frequently changed files |
| `analyze_contributors` | Analyze contributor activity |

**Usage:**
```bash
curl -X POST http://localhost:3001/api/agent \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Find code hotspots",
    "context": {"files": ["App.tsx"]},
    "action": "find_hotspots"
  }'
```

---

## 🛠️ Custom Agent Development

### Creating a Custom Agent

**Step 1:** Create agent file

```typescript
// agent-server/custom-agent.ts
import { streamText } from 'ai';
import { getAIProvider } from './server';

export async function customAgent(prompt: string, context: any) {
  const { provider, model } = getAIProvider();
  
  const systemPrompt = `
    You are a custom agent for HistTUI.
    Analyze the given repository data and provide insights.
  `;
  
  const result = await streamText({
    model: provider(model),
    system: systemPrompt,
    prompt: `${prompt}\n\nContext: ${JSON.stringify(context)}`,
  });
  
  return result;
}
```

**Step 2:** Register agent in server

```typescript
// agent-server/server.ts
import { customAgent } from './custom-agent';

// In handleRequest
if (action === 'custom_analysis') {
  const result = await customAgent(prompt, context);
  
  for await (const chunk of result.textStream) {
    sendSSE({
      type: 'message',
      data: { content: chunk, status: 'streaming' },
    });
  }
}
```

**Step 3:** Call from client

```typescript
// In HistTUI client
const result = await agentClient.queryAgent(
  'Run custom analysis',
  { files, commits },
  'custom_analysis'  // Custom action
);
```

### Custom Tools

**Example: File Analysis Tool**

```typescript
export const fileAnalysisTool = {
  name: 'analyze_file',
  description: 'Analyze a specific file for complexity',
  
  parameters: {
    filePath: { type: 'string', required: true },
    metrics: { type: 'array', required: false },
  },
  
  execute: async (params: any) => {
    const { filePath, metrics = ['complexity', 'lines'] } = params;
    
    // Analysis logic
    const analysis = await analyzeFile(filePath, metrics);
    
    return {
      file: filePath,
      complexity: analysis.complexity,
      lines: analysis.lines,
      recommendations: analysis.suggestions,
    };
  },
};
```

**Register tool:**

```typescript
const result = await streamText({
  model: aiModel,
  tools: {
    analyze_file: fileAnalysisTool,
  },
  prompt: userPrompt,
});
```

---

## ❌ Error Handling

### Error Types

**1. Configuration Errors**

```typescript
// Config file not found
{
  "type": "error",
  "data": {
    "message": "HistTUI config not found. Run histtui first.",
    "code": "CONFIG_NOT_FOUND"
  }
}
```

**2. API Errors**

```typescript
// Invalid API key
{
  "type": "error",
  "data": {
    "message": "Invalid API key",
    "code": "AUTH_ERROR"
  }
}

// Rate limit
{
  "type": "error",
  "data": {
    "message": "API rate limit exceeded",
    "code": "RATE_LIMIT",
    "details": { "retryAfter": 60 }
  }
}
```

**3. Server Errors**

```typescript
// Internal server error
{
  "type": "error",
  "data": {
    "message": "Internal server error",
    "code": "SERVER_ERROR",
    "details": error.message
  }
}
```

### Error Handling in Server

```typescript
async function handleAgentRequest(req: any, res: any) {
  try {
    // ... agent logic ...
  } catch (error: any) {
    console.error('Agent error:', error);
    
    sendSSE(res, {
      type: 'error',
      data: {
        message: error.message || 'An error occurred',
        code: error.code || 'UNKNOWN_ERROR',
      },
    });
  }
  
  res.end();
}
```

---

## 🔍 Troubleshooting

### Issue: Server Won't Start

**Symptoms:**
- Server exits immediately
- Port already in use error

**Solutions:**

```bash
# Check if port 3001 is in use
lsof -i :3001

# Kill process using port 3001
kill -9 $(lsof -t -i:3001)

# Use different port
PORT=3002 bun agent-server/server.ts

# Check Bun installation
bun --version
```

---

### Issue: Configuration Not Found

**Symptoms:**
- "Config not found" error on startup

**Solutions:**

```bash
# Verify config exists
cat ~/.histtui/config.json

# Create config if missing
mkdir -p ~/.histtui
cat > ~/.histtui/config.json << 'EOF'
{
  "llm": {
    "provider": "openai",
    "apiKey": "sk-...",
    "model": "gpt-4-turbo"
  }
}
EOF

# Run setup wizard
histtui
```

---

### Issue: API Connection Failed

**Symptoms:**
- Timeout errors
- Connection refused

**Solutions:**

```bash
# Test API key
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"

# Check network connectivity
ping api.openai.com

# Verify baseUrl in config
jq '.llm.baseUrl' ~/.histtui/config.json

# Test with curl
curl -X POST http://localhost:3001/api/agent \
  -H "Content-Type: application/json" \
  -d '{"prompt":"test","context":{},"action":"analyze"}'
```

---

<details>
<summary><h3>For AI Agents / LLMs</h3></summary>

## Automated Server Management

**Step 0:** Start agent server

```bash
# Development mode (auto-restart)
bun --watch agent-server/server.ts

# Production mode
bun agent-server/server.ts

# Background mode
nohup bun agent-server/server.ts > /tmp/agent.log 2>&1 &
```

**Step 1:** Verify server is running

```bash
# Check if server is listening
curl http://localhost:3001/health

# Expected response:
# {"status":"ok","provider":"openai","model":"gpt-4-turbo"}

# Check server logs
tail -f /tmp/agent.log
```

**Step 2:** Send test request

```bash
# Test with curl
curl -X POST http://localhost:3001/api/agent \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Analyze repository",
    "context": {"commits": 100},
    "action": "analyze_commits"
  }'

# Watch SSE stream
curl -N http://localhost:3001/api/agent \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"prompt":"test","context":{},"action":"analyze"}'
```

**Step 3:** Monitor server performance

```bash
# Check memory usage
ps aux | grep "agent-server"

# Monitor requests
tail -f /tmp/agent.log | grep "POST /api/agent"

# Check open connections
lsof -i :3001
```

**Step 4:** Stop server gracefully

```bash
# Find process ID
lsof -t -i:3001

# Send SIGTERM (graceful shutdown)
kill -TERM $(lsof -t -i:3001)

# Force kill if needed
kill -9 $(lsof -t -i:3001)
```

## Configuration Validation

```bash
# Validate JSON syntax
jq empty ~/.histtui/config.json && echo "Valid" || echo "Invalid"

# Check required fields
jq -r '.llm | "\(.provider) \(.apiKey) \(.model)"' ~/.histtui/config.json

# Validate API key format
api_key=$(jq -r '.llm.apiKey' ~/.histtui/config.json)
case $api_key in
  sk-*) echo "Valid OpenAI key format" ;;
  sk-ant-*) echo "Valid Anthropic key format" ;;
  sk-or-*) echo "Valid OpenRouter key format" ;;
  *) echo "Unknown key format" ;;
esac
```

</details>

---

**Last Updated:** 2026-01-14  
**HistTUI Version:** 1.1.0  
**AG-UI Protocol Version:** 0.0.42  
**Server File:** `agent-server/server.ts` (~228 lines)
