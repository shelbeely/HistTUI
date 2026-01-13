/**
 * AI Service - Multi-provider AI integration
 * Supports OpenAI, Anthropic, OpenRouter, and Ollama
 * 
 * Inspired by nanocoder's AI SDK integration patterns
 */

import { generateText, streamText, tool } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import type { AIConfig, AIMessage, AITool, ConversationContext } from '../types/index.js';
import { logger } from '../../../utils/logger.js';

export class AIService {
  private config: AIConfig;
  private provider: any;
  private conversationHistory: AIMessage[] = [];

  constructor(config?: Partial<AIConfig>) {
    this.config = {
      provider: 'openrouter',
      model: 'anthropic/claude-3.5-sonnet',
      maxTokens: 4000,
      temperature: 0.7,
      ...config,
    };

    this.initializeProvider();
  }

  private initializeProvider(): void {
    const apiKey = this.config.apiKey || process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;

    switch (this.config.provider) {
      case 'openai':
        this.provider = createOpenAI({
          apiKey: apiKey || process.env.OPENAI_API_KEY,
        });
        break;

      case 'anthropic':
        this.provider = createAnthropic({
          apiKey: apiKey || process.env.ANTHROPIC_API_KEY,
        });
        break;

      case 'openrouter':
        this.provider = createOpenAI({
          apiKey: apiKey || '',
          baseURL: 'https://openrouter.ai/api/v1',
          headers: {
            'HTTP-Referer': 'https://github.com/shelbeely/HistTUI',
            'X-Title': 'HistTUI AI Assistant',
          },
        });
        break;

      case 'ollama':
        this.provider = createOpenAI({
          apiKey: 'ollama', // Ollama doesn't need an API key
          baseURL: this.config.baseURL || 'http://localhost:11434/v1',
        });
        break;

      default:
        throw new Error(`Unknown provider: ${this.config.provider}`);
    }

    logger.info(`AI Service initialized with provider: ${this.config.provider}`);
  }

  /**
   * Send a message to the AI and get a response
   */
  async sendMessage(
    message: string,
    context?: ConversationContext,
    tools?: AITool[]
  ): Promise<string> {
    try {
      // Build system prompt with context
      const systemPrompt = this.buildSystemPrompt(context);

      // Add user message to history
      this.conversationHistory.push({
        id: Date.now().toString(),
        role: 'user',
        content: message,
        timestamp: new Date(),
      });

      // Convert custom tools to AI SDK format
      const aiTools = tools ? this.convertTools(tools) : {};

      // Generate response
      const { text, toolCalls } = await generateText({
        model: this.provider(this.config.model),
        system: systemPrompt,
        messages: this.conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: this.config.temperature,
        tools: aiTools,
      });

      // Add assistant response to history
      this.conversationHistory.push({
        id: Date.now().toString(),
        role: 'assistant',
        content: text,
        timestamp: new Date(),
        model: this.config.model,
      });

      // Execute tool calls if any
      if (toolCalls && toolCalls.length > 0) {
        logger.info(`AI requested ${toolCalls.length} tool calls`);
        // Tool execution would happen here
      }

      return text;
    } catch (error) {
      logger.error('AI Service error:', error);
      throw error;
    }
  }

  /**
   * Stream a response from the AI
   */
  async *streamMessage(
    message: string,
    context?: ConversationContext
  ): AsyncGenerator<string> {
    try {
      const systemPrompt = this.buildSystemPrompt(context);

      this.conversationHistory.push({
        id: Date.now().toString(),
        role: 'user',
        content: message,
        timestamp: new Date(),
      });

      const { textStream } = await streamText({
        model: this.provider(this.config.model),
        system: systemPrompt,
        messages: this.conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: this.config.temperature,
      });

      let fullResponse = '';
      for await (const chunk of textStream) {
        fullResponse += chunk;
        yield chunk;
      }

      this.conversationHistory.push({
        id: Date.now().toString(),
        role: 'assistant',
        content: fullResponse,
        timestamp: new Date(),
        model: this.config.model,
      });
    } catch (error) {
      logger.error('AI Service streaming error:', error);
      throw error;
    }
  }

  /**
   * Build system prompt with repository context
   */
  private buildSystemPrompt(context?: ConversationContext): string {
    let prompt = `You are an expert coding assistant integrated into HistTUI, a git history explorer.

You have access to the repository's full history, commits, branches, and files. You can:
- Analyze code and suggest improvements
- Explain commits and changes
- Help plan refactoring tasks
- Execute file operations safely in isolated git worktrees
- Run commands to test changes

Always be concise and practical. Focus on actionable advice.`;

    if (context) {
      prompt += `\n\nCurrent Context:
- Repository: ${context.repoPath}
- Branch: ${context.currentBranch}
- Recent commits: ${context.recentCommits.length}`;

      if (context.modifiedFiles.length > 0) {
        prompt += `\n- Modified files: ${context.modifiedFiles.join(', ')}`;
      }

      if (context.taskContext) {
        prompt += `\n- Current task: ${context.taskContext.title}
- Status: ${context.taskContext.status}
- Description: ${context.taskContext.description}`;
      }
    }

    return prompt;
  }

  /**
   * Convert custom tools to AI SDK format
   */
  private convertTools(tools: AITool[]): Record<string, any> {
    const result: Record<string, any> = {};

    for (const customTool of tools) {
      // Create a tool without execute function initially
      const toolDef: any = {
        description: customTool.description,
        parameters: z.object(customTool.parameters),
      };

      // Wrap the execute function
      result[customTool.name] = tool({
        ...toolDef,
        execute: async (params: any) => await customTool.execute(params),
      } as any);
    }

    return result;
  }

  /**
   * Clear conversation history
   */
  clearHistory(): void {
    this.conversationHistory = [];
    logger.info('Conversation history cleared');
  }

  /**
   * Get conversation history
   */
  getHistory(): AIMessage[] {
    return [...this.conversationHistory];
  }

  /**
   * Update AI configuration
   */
  updateConfig(config: Partial<AIConfig>): void {
    this.config = { ...this.config, ...config };
    this.initializeProvider();
    logger.info('AI configuration updated');
  }

  /**
   * Get current configuration
   */
  getConfig(): AIConfig {
    return { ...this.config };
  }
}
