# 🚀 Launcher Guide

**Complete Guide to HistTUI's Unified Launcher System**

The HistTUI Launcher (`launch-with-agent.ts`) provides a unified command to start both the AG-UI agent server and HistTUI application with a single command. This guide covers all launcher features, npm scripts, and orchestration.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Launcher Script](#-launcher-script)
- [NPM Scripts](#-npm-scripts)
- [Startup Sequencing](#-startup-sequencing)
- [Environment Handling](#-environment-handling)
- [Graceful Shutdown](#-graceful-shutdown)
- [Advanced Usage](#-advanced-usage)
- [Troubleshooting](#-troubleshooting)

---

## 🌟 Overview

### What is the Launcher?

The **HistTUI Launcher** is a Node.js script that:

✅ **Starts agent server** on port 3001  
✅ **Waits for server readiness** (2 seconds)  
✅ **Launches HistTUI** with all CLI arguments  
✅ **Manages both processes** lifecycle  
✅ **Handles graceful shutdown** (Ctrl+C)  
✅ **Forwards all output** to terminal  

### Why Use the Launcher?

**Without Launcher:**
```bash
# Terminal 1
bun run agent

# Terminal 2 (wait for agent to start)
bun run dev
```

**With Launcher:**
```bash
# Single command!
bun run launch
```

### File Location

```
launch-with-agent.ts
```

**Size:** ~131 lines  
**Runtime:** Bun  
**Language:** TypeScript

---

## 📜 Launcher Script

### Script Structure

```typescript
#!/usr/bin/env bun
/**
 * HistTUI Launcher with AG-UI Agent
 * Starts both agent server and HistTUI with a single command
 */

import { spawn } from 'child_process';
import { homedir } from 'os';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';

const AGENT_PORT = 3001;
const STARTUP_DELAY = 2000; // Wait 2s for agent to start

// ... implementation ...
```

### Key Constants

| Constant | Value | Purpose |
|----------|-------|---------|
| `AGENT_PORT` | `3001` | Port for agent server |
| `STARTUP_DELAY` | `2000` | Milliseconds to wait before launching HistTUI |

### Main Flow

```
1. Display startup banner
2. Check for existing config (~/.histtui/config.json)
3. Start agent server process (port 3001)
4. Monitor agent server output
5. Wait 2 seconds for agent readiness
6. Launch HistTUI with forwarded CLI args
7. Monitor HistTUI output
8. Handle Ctrl+C shutdown
9. Clean up processes on exit
```

### Process Management

**Agent Server Process:**
```typescript
const agentProcess = spawn('bun', ['agent-server/server.ts'], {
  stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, PORT: AGENT_PORT.toString() },
  detached: false,
});

agentProcess.stdout?.on('data', (data) => {
  process.stdout.write(data);
});

agentProcess.stderr?.on('data', (data) => {
  process.stderr.write(data);
});
```

**HistTUI Process:**
```typescript
const args = process.argv.slice(2); // Forward CLI args
const histtuiProcess = spawn('bun', ['dist/cli.js', ...args], {
  stdio: 'inherit',
});
```

### Startup Banner

```
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║  🚀 HistTUI Launcher with AG-UI                      ║
║                                                       ║
║  Starting both agent server and TUI...               ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝

✅ LLM Provider: openai (gpt-4-turbo)
✅ AG-UI: Enabled (endpoint: http://localhost:3001/api/agent)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣  Starting AG-UI Agent Server on port 3001 ...
[Agent server output]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2️⃣  Launching HistTUI...
[HistTUI output]
```

---

## 📦 NPM Scripts

### Available Scripts

HistTUI provides several npm scripts for different use cases:

```json
{
  "scripts": {
    "build": "bun build src/cli.ts --outdir dist --target bun --format esm",
    "start": "bun dist/cli.js",
    "dev": "bun --watch src/cli.ts",
    "agent": "bun agent-server/server.ts",
    "agent:dev": "bun --watch agent-server/server.ts",
    "launch": "bun launch-with-agent.ts",
    "launch:dev": "bun build && bun launch-with-agent.ts"
  }
}
```

### Script Reference

#### `bun run build`

**Purpose:** Build HistTUI for production

**What it does:**
- Compiles `src/cli.ts` to `dist/cli.js`
- Uses Bun bundler
- Target: Bun runtime
- Format: ESM (ES modules)

**Usage:**
```bash
bun run build
```

**Output:**
```
dist/cli.js    # Main executable
```

---

#### `bun run start`

**Purpose:** Run built HistTUI (after `build`)

**What it does:**
- Executes compiled `dist/cli.js`
- Production mode

**Usage:**
```bash
bun run build
bun run start [repo-url]
```

**Example:**
```bash
bun run start https://github.com/user/repo
```

---

#### `bun run dev`

**Purpose:** Development mode with auto-restart

**What it does:**
- Runs `src/cli.ts` directly (no build needed)
- Watches for file changes
- Auto-restarts on changes

**Usage:**
```bash
bun run dev [repo-url]
```

**Example:**
```bash
bun run dev https://github.com/user/repo
```

**Output:**
```
[HistTUI starts]
[File changed: src/components/App.tsx]
[HistTUI restarts automatically]
```

---

#### `bun run agent`

**Purpose:** Run AG-UI agent server only

**What it does:**
- Starts agent server on port 3001
- Production mode

**Usage:**
```bash
bun run agent
```

**Output:**
```
╔═══════════════════════════════════════════════════════╗
║  🤖 AG-UI Agent Server for HistTUI                   ║
║  Status: ✅ Running                                   ║
║  Port: 3001                                          ║
║  Provider: openai                                    ║
║  Model: gpt-4-turbo                                  ║
╚═══════════════════════════════════════════════════════╝
```

---

#### `bun run agent:dev`

**Purpose:** Development mode for agent server

**What it does:**
- Runs agent server with auto-restart
- Watches for file changes in `agent-server/`
- Reloads on changes

**Usage:**
```bash
bun run agent:dev
```

**When to use:**
- Developing custom agents
- Modifying agent server logic
- Testing API changes

---

#### `bun run launch` ⭐

**Purpose:** Unified launcher (RECOMMENDED)

**What it does:**
1. Starts agent server (port 3001)
2. Waits 2 seconds
3. Launches HistTUI
4. Manages both processes

**Usage:**
```bash
bun run launch [repo-url]
```

**Example:**
```bash
bun run launch https://github.com/user/repo
```

**Advantages:**
- ✅ Single command
- ✅ Correct startup order
- ✅ Automatic cleanup
- ✅ Graceful shutdown

---

#### `bun run launch:dev`

**Purpose:** Development launch with build

**What it does:**
1. Builds HistTUI (`bun run build`)
2. Runs launcher

**Usage:**
```bash
bun run launch:dev [repo-url]
```

**When to use:**
- Testing production build
- After code changes
- Before deployment

---

## ⏱️ Startup Sequencing

### Startup Timeline

```
T+0ms    : Display banner
T+100ms  : Check config file
T+200ms  : Start agent server process
           └─ Agent server starts HTTP server
T+2000ms : Wait complete (STARTUP_DELAY)
T+2100ms : Launch HistTUI process
           └─ HistTUI connects to agent
T+3000ms : Both processes running
```

### Why Wait 2 Seconds?

The launcher waits `STARTUP_DELAY` (2000ms) to ensure:

✅ **Agent server is listening** on port 3001  
✅ **HTTP server is ready** to accept connections  
✅ **Configuration is loaded** and validated  
✅ **AI provider is initialized**  

**Without delay:**
```
HistTUI: Error: Cannot connect to agent
Agent:   [Still starting...]
```

**With delay:**
```
Agent:   ✅ Running on port 3001
HistTUI: ✅ Connected to agent
```

### Readiness Detection

The launcher monitors agent output for readiness signals:

```typescript
let agentReady = false;

agentProcess.stdout?.on('data', (data) => {
  const output = data.toString();
  
  // Detect readiness from banner
  if (output.includes('Running') || output.includes('✅')) {
    agentReady = true;
  }
  
  process.stdout.write(output);
});
```

---

## 🌍 Environment Handling

### Environment Variables

The launcher passes environment variables to child processes:

**Agent Server:**
```typescript
{
  ...process.env,           // Inherit all env vars
  PORT: AGENT_PORT.toString() // Override PORT
}
```

**HistTUI:**
```typescript
{
  ...process.env  // Inherit all env vars
}
```

### Supported Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `PORT` | `3001` | Agent server port |
| `NODE_ENV` | `development` | Runtime environment |
| `HISTTUI_CACHE_DIR` | `~/.histtui/cache` | Cache directory |

### Custom Port

```bash
# Use custom agent port
PORT=3002 bun run launch
```

---

## 🛑 Graceful Shutdown

### Shutdown Flow

```
1. User presses Ctrl+C
2. Launcher catches SIGINT
3. Send SIGTERM to agent process
4. Wait 1 second for graceful shutdown
5. Send SIGKILL to force terminate
6. Display goodbye message
7. Exit with code 0
```

### Implementation

```typescript
process.on('SIGINT', () => {
  console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('👋 Shutting down all processes...');
  
  // Graceful shutdown
  agentProcess.kill('SIGTERM');
  
  setTimeout(() => {
    // Force kill if still running
    agentProcess.kill('SIGKILL');
    console.log('✅ Goodbye!\n');
    process.exit(0);
  }, 1000);
});
```

### Process Cleanup

**When HistTUI exits:**
```typescript
histtuiProcess.on('exit', (code) => {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('👋 HistTUI closed. Stopping agent server...');
  
  agentProcess.kill('SIGTERM');
  
  setTimeout(() => {
    agentProcess.kill('SIGKILL');
    console.log('✅ All processes stopped\n');
    process.exit(code || 0);
  }, 1000);
});
```

---

## 🔧 Advanced Usage

### Forward CLI Arguments

The launcher forwards all arguments to HistTUI:

```bash
# With repository URL
bun run launch https://github.com/user/repo

# With options
bun run launch --max-commits 5000 --no-cache

# Multiple arguments
bun run launch https://github.com/user/repo --verbose
```

**Implementation:**
```typescript
const args = process.argv.slice(2); // Get all args after 'node script.js'
const histtuiProcess = spawn('bun', ['dist/cli.js', ...args], {
  stdio: 'inherit',
});
```

### Background Mode

Run launcher in background:

```bash
# Background with nohup
nohup bun run launch > /tmp/histtui.log 2>&1 &

# Check if running
ps aux | grep "launch-with-agent"

# Stop background process
pkill -f "launch-with-agent"
```

### Custom Startup Delay

Modify `STARTUP_DELAY` in `launch-with-agent.ts`:

```typescript
// Faster startup (risky - agent may not be ready)
const STARTUP_DELAY = 1000; // 1 second

// Slower startup (safe for slow machines)
const STARTUP_DELAY = 5000; // 5 seconds
```

---

## 🔍 Troubleshooting

### Issue: Agent Server Fails to Start

**Symptoms:**
- "Failed to start agent server" error
- Port already in use

**Solutions:**

```bash
# Check if port 3001 is in use
lsof -i :3001

# Kill process using port
kill -9 $(lsof -t -i:3001)

# Use different port
PORT=3002 bun run launch

# Check Bun is installed
bun --version
```

---

### Issue: HistTUI Fails to Start

**Symptoms:**
- "Failed to start HistTUI" error
- Build not found

**Solutions:**

```bash
# Build HistTUI first
bun run build

# Verify build exists
ls -la dist/cli.js

# Check for build errors
bun run build 2>&1 | grep -i error

# Run directly (bypass launcher)
bun run dev
```

---

### Issue: Both Processes Start But Don't Connect

**Symptoms:**
- Agent server running
- HistTUI running
- No connection between them

**Solutions:**

```bash
# Verify agent is listening
curl http://localhost:3001/health

# Check HistTUI config
jq '.agui.endpoint' ~/.histtui/config.json

# Increase STARTUP_DELAY
# Edit launch-with-agent.ts:
# const STARTUP_DELAY = 5000;

# Check firewall/network
telnet localhost 3001
```

---

### Issue: Processes Don't Stop on Ctrl+C

**Symptoms:**
- Ctrl+C doesn't work
- Processes remain running

**Solutions:**

```bash
# Find PIDs
ps aux | grep -E "(agent-server|histtui)"

# Kill manually
kill -9 <PID>

# Kill all Bun processes (nuclear option)
pkill -9 bun

# Check for zombie processes
ps aux | grep Z
```

---

<details>
<summary><h3>For AI Agents / LLMs</h3></summary>

## Automated Launcher Usage

**Step 0:** Verify prerequisites

```bash
# Check Bun installation
bun --version || { echo "Install Bun first"; exit 1; }

# Check config exists
test -f ~/.histtui/config.json || echo "Run setup wizard first"

# Build HistTUI
bun run build
```

**Step 1:** Launch with default settings

```bash
# Standard launch
bun run launch

# With repository URL
bun run launch https://github.com/user/repo

# Development mode
bun run launch:dev
```

**Step 2:** Monitor processes

```bash
# Check both processes are running
ps aux | grep -E "(agent-server|histtui)" | grep -v grep

# Monitor agent server
curl http://localhost:3001/health

# Check logs
tail -f /tmp/histtui.log
```

**Step 3:** Stop launcher

```bash
# Graceful shutdown (if running in foreground)
# Press Ctrl+C

# Force kill (if backgrounded)
pkill -f "launch-with-agent"

# Clean up any remaining processes
pkill -f "agent-server"
pkill -f "histtui"
```

## Programmatic Usage

```typescript
// Import launcher programmatically
import { spawn } from 'child_process';

const launcher = spawn('bun', ['launch-with-agent.ts', repoUrl], {
  cwd: '/path/to/histtui',
  stdio: 'pipe',
});

launcher.stdout.on('data', (data) => {
  console.log('Launcher:', data.toString());
});

launcher.on('exit', (code) => {
  console.log('Launcher exited:', code);
});
```

</details>

---

**Last Updated:** 2026-01-14  
**HistTUI Version:** 1.1.0  
**Launcher File:** `launch-with-agent.ts` (~131 lines)  
**Default Port:** 3001  
**Startup Delay:** 2000ms
