#!/usr/bin/env node
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
