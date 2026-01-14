#!/usr/bin/env bun
/**
 * AG-UI Agent Backend Server
 * Provides generative UI capabilities for HistTUI using AG-UI protocol
 * Supports streaming, tool execution, and dynamic UI component generation
 */

import { createServer } from 'http';
import { generateText, streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { readFileSync, existsSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

// Load HistTUI configuration
function loadConfig() {
  const configPath = join(homedir(), '.histtui', 'config.json');
  if (!existsSync(configPath)) {
    console.error('❌ HistTUI config not found. Please run histtui first to configure.');
    process.exit(1);
  }
  
  try {
    return JSON.parse(readFileSync(configPath, 'utf-8'));
  } catch (error) {
    console.error('❌ Failed to parse config:', error);
    process.exit(1);
  }
}

const config = loadConfig();

// Initialize AI provider based on config
function getAIProvider() {
  const { provider, apiKey, baseUrl, model } = config.llm || {};
  
  if (!provider || !apiKey) {
    throw new Error('LLM provider and API key must be configured. Run histtui setup.');
  }

  if (provider === 'openai' || provider === 'openrouter') {
    return {
      provider: createOpenAI({
        apiKey,
        baseURL: baseUrl || (provider === 'openrouter' ? 'https://openrouter.ai/api/v1' : undefined),
      }),
      model: model || 'gpt-4-turbo',
    };
  } else if (provider === 'anthropic') {
    return {
      provider: createAnthropic({ apiKey }),
      model: model || 'claude-3-5-sonnet-20241022',
    };
  } else if (provider === 'ollama') {
    return {
      provider: createOpenAI({
        apiKey: 'ollama',
        baseURL: baseUrl || 'http://localhost:11434/v1',
      }),
      model: model || 'llama3.1',
    };
  }
  
  throw new Error(`Unsupported provider: ${provider}`);
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
      provider: config.llm?.provider,
      model: config.llm?.model,
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
        data: { content: 'Analyzing repository...', status: 'thinking' },
      });

      // Get AI provider
      const { provider, model: modelName } = getAIProvider();
      const aiModel = provider(modelName);

      // Build system prompt based on action
      let systemPrompt = 'You are an AI assistant helping users understand Git repositories.';
      
      if (action === 'analyze_commits') {
        systemPrompt += ' Analyze commit patterns and provide insights.';
      } else if (action === 'suggest_improvements') {
        systemPrompt += ' Suggest code quality improvements and best practices.';
      } else if (action === 'explain_changes') {
        systemPrompt += ' Explain what changed in commits and why it matters.';
      }

      // Stream response
      const result = await streamText({
        model: aiModel,
        system: systemPrompt,
        prompt: `${prompt}\n\nContext: ${JSON.stringify(context)}`,
        temperature: 0.7,
      });

      let fullContent = '';
      
      for await (const chunk of result.textStream) {
        fullContent += chunk;
        sendSSE(res, {
          type: 'message',
          data: { content: fullContent, status: 'streaming' },
        });
      }

      // Send completion
      sendSSE(res, {
        type: 'message',
        data: { content: fullContent, status: 'complete' },
      });

      // Send component suggestion based on analysis
      if (fullContent.toLowerCase().includes('file') || fullContent.toLowerCase().includes('hotspot')) {
        sendSSE(res, {
          type: 'component',
          data: {
            type: 'badge',
            props: { variant: 'info', text: '📊 View Hotspots' },
          },
        });
      }

    } catch (error: any) {
      console.error('Agent error:', error);
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
║  🤖 AG-UI Agent Server for HistTUI                   ║
║                                                       ║
║  Status: ✅ Running                                   ║
║  Port: ${PORT}                                          ║
║  Provider: ${config.llm?.provider || 'Not configured'}                                 ║
║  Model: ${(config.llm?.model || 'Not configured').padEnd(32)}  ║
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
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down AG-UI agent server...');
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
});
