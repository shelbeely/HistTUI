# AG-UI Agent Server for HistTUI

This is the backend agent server that provides generative UI capabilities for HistTUI using the AG-UI protocol.

## Features

- 🤖 **AI-Powered Insights**: Analyzes repository data and provides intelligent suggestions
- 📡 **Real-Time Streaming**: Uses Server-Sent Events (SSE) for live updates
- 🎨 **Dynamic UI Generation**: Can generate UI components based on context
- 🔧 **Multi-Provider Support**: Works with OpenAI, Anthropic, OpenRouter, and Ollama
- ⚡ **Fast & Lightweight**: Built with Bun for optimal performance

## Quick Start

### Prerequisites

- Bun installed (`curl -fsSL https://bun.sh/install | bash`)
- HistTUI configured with LLM provider (run `histtui` first)

### Running the Server

```bash
# From the HistTUI root directory
bun run agent

# Or directly
bun agent-server/server.ts

# With custom port
PORT=8080 bun agent-server/server.ts
```

The server will automatically:
1. Load your HistTUI configuration from `~/.histtui/config.json`
2. Initialize the configured LLM provider (OpenAI/Anthropic/OpenRouter/Ollama)
3. Start listening on port 3001 (or custom PORT)

## API Endpoints

### Health Check
```bash
GET /health
```

Returns server status and configuration:
```json
{
  "status": "ok",
  "provider": "openrouter",
  "model": "anthropic/claude-3-5-sonnet"
}
```

### Agent Endpoint
```bash
POST /api/agent
Content-Type: application/json

{
  "prompt": "Analyze recent commits",
  "context": {
    "repoName": "myorg/myrepo",
    "branch": "main",
    "commits": [...]
  },
  "action": "analyze_commits"
}
```

Returns Server-Sent Events (SSE) stream:
```
data: {"type":"message","data":{"content":"Analyzing...","status":"thinking"}}

data: {"type":"message","data":{"content":"Based on recent...","status":"streaming"}}

data: {"type":"component","data":{"type":"badge","props":{"variant":"info","text":"📊 View"}}}
```

## Supported Actions

- `analyze_commits` - Analyze commit patterns and provide insights
- `suggest_improvements` - Suggest code quality improvements
- `explain_changes` - Explain what changed and why

## Event Types

The server emits AG-UI protocol events:

- **message**: Text content with status (thinking/streaming/complete)
- **tool**: Tool execution notifications
- **component**: Dynamic UI component generation
- **state**: State updates
- **error**: Error messages

## Configuration

The server uses your HistTUI configuration from `~/.histtui/config.json`:

```json
{
  "llm": {
    "provider": "openrouter",
    "apiKey": "sk-or-...",
    "model": "anthropic/claude-3-5-sonnet",
    "baseUrl": "https://openrouter.ai/api/v1"
  },
  "agui": {
    "enabled": true,
    "endpoint": "http://localhost:3001/api/agent"
  }
}
```

## Development

The server is built with:
- **Bun** - Fast JavaScript runtime
- **Vercel AI SDK** - Unified AI provider interface
- **AG-UI Protocol** - Agentic UI event protocol

## Troubleshooting

### Server won't start
- Ensure HistTUI is configured: `histtui` (run setup wizard)
- Check config file exists: `cat ~/.histtui/config.json`
- Verify API key is valid

### Connection errors in HistTUI
- Ensure server is running on correct port (default: 3001)
- Check firewall settings
- Verify endpoint in config matches server address

### AI responses fail
- Verify API key is valid and has credits
- Check provider status (OpenRouter/OpenAI/Anthropic)
- Review server logs for error messages

## License

MIT
