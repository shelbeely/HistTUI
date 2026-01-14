#!/usr/bin/env bun
/**
 * HistTUI Launcher with AG-UI Agent
 * Starts both the agent server and HistTUI with a single command
 */

import { spawn } from 'child_process';
import { homedir } from 'os';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';

const AGENT_PORT = 3001;
const STARTUP_DELAY = 2000; // Wait 2s for agent to start

console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║  🚀 HistTUI Launcher with AG-UI                      ║
║                                                       ║
║  Starting both agent server and TUI...               ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
`);

// Check if config exists
const configPath = join(homedir(), '.histtui', 'config.json');
if (!existsSync(configPath)) {
  console.log('⚠️  No HistTUI configuration found.');
  console.log('   First launch will run setup wizard.');
  console.log('   Starting anyway...\n');
} else {
  try {
    const config = JSON.parse(readFileSync(configPath, 'utf-8'));
    if (config.llm?.provider) {
      console.log(`✅ LLM Provider: ${config.llm.provider} (${config.llm.model || 'default model'})`);
    }
    if (config.agui?.enabled) {
      console.log(`✅ AG-UI: Enabled (endpoint: ${config.agui.endpoint || 'http://localhost:3001/api/agent'})`);
    }
  } catch (err) {
    console.log('⚠️  Could not read config file');
  }
}

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Start agent server
console.log('1️⃣  Starting AG-UI Agent Server on port', AGENT_PORT, '...');
const agentProcess = spawn('bun', ['agent-server/server.ts'], {
  stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, PORT: AGENT_PORT.toString() },
  detached: false,
});

let agentReady = false;

agentProcess.stdout?.on('data', (data) => {
  const output = data.toString();
  if (output.includes('Running') || output.includes('✅')) {
    agentReady = true;
  }
  process.stdout.write(output);
});

agentProcess.stderr?.on('data', (data) => {
  process.stderr.write(data);
});

agentProcess.on('error', (err) => {
  console.error('\n❌ Failed to start agent server:', err.message);
  console.log('\n💡 Tip: Make sure bun is installed and HistTUI is built');
  process.exit(1);
});

agentProcess.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`\n❌ Agent server exited with code ${code}`);
  }
});

// Wait for agent to start, then launch HistTUI
setTimeout(() => {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('2️⃣  Launching HistTUI...\n');
  
  const args = process.argv.slice(2); // Forward all CLI arguments
  const histtuiProcess = spawn('bun', ['dist/cli.js', ...args], {
    stdio: 'inherit',
  });

  histtuiProcess.on('error', (err) => {
    console.error('\n❌ Failed to start HistTUI:', err.message);
    console.log('💡 Tip: Run `bun run build` first to build HistTUI');
    agentProcess.kill('SIGTERM');
    setTimeout(() => agentProcess.kill('SIGKILL'), 1000);
    process.exit(1);
  });

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
}, STARTUP_DELAY);

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('👋 Shutting down all processes...');
  agentProcess.kill('SIGTERM');
  setTimeout(() => {
    agentProcess.kill('SIGKILL');
    console.log('✅ Goodbye!\n');
    process.exit(0);
  }, 1000);
});

process.on('SIGTERM', () => {
  agentProcess.kill('SIGTERM');
  setTimeout(() => agentProcess.kill('SIGKILL'), 1000);
  process.exit(0);
});

// Keep process alive
process.stdin.resume();
