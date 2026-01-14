# 🚀 Single Command Launch Guide

This guide explains how to launch HistTUI with AG-UI generative features using a single command.

## Quick Start

```bash
# From HistTUI directory
bun run launch

# With repository URL
bun run launch https://github.com/user/repo

# With local path
bun run launch /path/to/repo
```

## What Happens

When you run `bun run launch`, the system:

1. **Starts AG-UI Agent Server** (port 3001)
   - Loads your LLM configuration from `~/.histtui/config.json`
   - Initializes AI provider (OpenAI/Anthropic/OpenRouter/Ollama)
   - Opens HTTP endpoint for streaming AI responses

2. **Launches HistTUI** (after 2 second delay)
   - Connects to agent server automatically
   - Shows generative status bar at top
   - Enables real-time AI insights and suggestions

3. **First Launch Setup** (if not configured)
   - Interactive repository URL input (if not provided)
   - LLM provider selection wizard
   - API key configuration (secure/masked)
   - Model selection
   - AG-UI endpoint configuration
   - Saves to `~/.histtui/config.json`

## Requirements

- **Bun**: v1.3.5 or higher
- **LLM API Key**: One of:
  - OpenRouter API key (recommended - supports multiple models)
  - OpenAI API key
  - Anthropic API key
  - Or local Ollama installation

## First Time Setup

### Step 1: Build HistTUI

```bash
cd /path/to/HistTUI
bun install
bun run build
```

### Step 2: Run First Launch

```bash
bun run launch
```

This will guide you through:
- Repository URL input (if not provided)
- LLM provider selection
- API key configuration
- Model selection
- AG-UI settings

### Step 3: Explore!

Once launched, you'll see:
- **Status bar at top** showing agent activity
- **Press '5'** to access repository manager
- **Real-time AI insights** as you navigate
- **Streaming suggestions** in the dashboard

## Running Components Separately

If you need more control, you can run components separately:

### Terminal 1: Agent Server Only
```bash
bun run agent
```

### Terminal 2: HistTUI Only
```bash
bun start https://github.com/user/repo
```

## Package.json Scripts

- `bun run launch` - Launch everything together (RECOMMENDED)
- `bun run launch:dev` - Build + launch (for development)
- `bun run agent` - Run agent server only
- `bun run agent:dev` - Run agent with auto-reload
- `bun run start` - Run HistTUI only
- `bun run dev` - Run HistTUI with auto-reload
- `bun run build` - Build HistTUI

## Configuration

### Config Location
`~/.histtui/config.json`

### Example Config
```json
{
  "llm": {
    "provider": "openrouter",
    "apiKey": "sk-or-v1-...",
    "model": "anthropic/claude-3.5-sonnet",
    "baseUrl": "https://openrouter.ai/api/v1"
  },
  "agui": {
    "enabled": true,
    "endpoint": "http://localhost:3001/api/agent"
  }
}
```

## Troubleshooting

### "Cannot find config"
**Solution:** Run `histtui` first to go through setup wizard, or run `bun run launch` which handles first-launch setup.

### "Failed to start agent server"
**Causes:**
- Port 3001 already in use
- Missing dependencies
- Invalid API key

**Solutions:**
```bash
# Check if port is in use
lsof -i :3001

# Kill process using port
kill -9 <PID>

# Verify API key in config
cat ~/.histtui/config.json

# Reinstall dependencies
bun install
```

### "Agent not responding"
**Solution:** Check agent server logs - server prints all requests and responses to console.

### Build errors
```bash
# Clean install
rm -rf node_modules bun.lockb
bun install
bun run build
```

## Advanced Usage

### Custom Port
```bash
PORT=8080 bun run agent  # Terminal 1
# Update config agui.endpoint to http://localhost:8080/api/agent
bun start  # Terminal 2
```

### Multiple Repositories
1. Launch with `bun run launch`
2. Press '5' to open Repository Manager
3. Navigate and press Enter to switch repos
4. No restart needed!

### Development Mode
```bash
# Terminal 1: Agent with auto-reload
bun run agent:dev

# Terminal 2: HistTUI with auto-reload
bun run dev
```

## Features Enabled by AG-UI

When launched with AG-UI agent:

✅ **Real-time insights** - AI analyzes commits as you browse
✅ **Smart suggestions** - Context-aware recommendations
✅ **Dynamic UI** - AI-generated badges, alerts, and components
✅ **Streaming responses** - See AI thinking in real-time
✅ **Repository analysis** - Automated code quality insights
✅ **Pattern detection** - Identifies trends and hotspots

## Support

- 📖 Documentation: See `AGUI_INTEGRATION.md` for technical details
- 🐛 Issues: GitHub issues
- 💬 Questions: GitHub discussions

## License

MIT
