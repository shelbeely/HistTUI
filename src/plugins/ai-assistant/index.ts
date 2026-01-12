/**
 * AI Assistant Plugin for HistTUI
 * 
 * Local-first CLI coding agent inspired by nanocoder and vibe-kanban
 * Brings agentic coding tools (Claude Code, Gemini CLI) to controlled APIs like OpenRouter
 * 
 * Features:
 * - Multi-provider AI support (OpenAI, Anthropic, OpenRouter, Ollama)
 * - File operations with safety controls
 * - Command execution in isolated git worktrees
 * - Repository context awareness
 * - Task orchestration with kanban integration
 * 
 * Attribution:
 * - Inspired by nanocoder (MIT with Attribution) - Nano Collective
 *   https://github.com/Nano-Collective/nanocoder
 * - Inspired by vibe-kanban (Apache 2.0) - BloopAI
 *   https://github.com/BloopAI/vibe-kanban
 */

import type { Plugin, PluginAPI } from '../../types/index.js';
import { AIAssistantScreen } from './screens/AIAssistantScreen.js';
import { AIService } from './services/AIService.js';
import { WorktreeManager } from './services/WorktreeManager.js';
import { FileOperations } from './services/FileOperations.js';
import { CommandExecutor } from './services/CommandExecutor.js';
import { TaskManager } from './services/TaskManager.js';
import { logger } from '../../utils/logger.js';

export class AIAssistantPlugin implements Plugin {
  name = 'ai-assistant';
  version = '1.0.0';
  description = 'AI coding assistant with worktree isolation and task orchestration';

  private aiService?: AIService;
  private worktreeManager?: WorktreeManager;
  private fileOps?: FileOperations;
  private commandExecutor?: CommandExecutor;
  private taskManager?: TaskManager;

  async init(api: PluginAPI): Promise<void> {
    logger.info('Initializing AI Assistant Plugin');

    const gitClient = api.getGitClient();
    const database = api.getDatabase();

    // Initialize services
    this.aiService = new AIService();
    this.worktreeManager = new WorktreeManager(gitClient);
    this.fileOps = new FileOperations(gitClient);
    this.commandExecutor = new CommandExecutor();
    this.taskManager = new TaskManager(database);

    // Register custom screen
    api.registerScreen({
      id: 'ai-assistant',
      name: 'AI Assistant',
      shortcut: 'a',
      render: (props: any) => AIAssistantScreen({
        ...props,
        aiService: this.aiService!,
        worktreeManager: this.worktreeManager!,
        fileOps: this.fileOps!,
        commandExecutor: this.commandExecutor!,
        taskManager: this.taskManager!,
      }),
    });

    // Register custom indexer for AI context
    api.registerIndexer({
      id: 'ai-context',
      name: 'AI Context Indexer',
      init: (db: any) => {
        // Create tables for AI context
        db.exec(`
          CREATE TABLE IF NOT EXISTS ai_conversations (
            id TEXT PRIMARY KEY,
            task_id TEXT,
            timestamp INTEGER NOT NULL,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            model TEXT,
            tokens INTEGER
          );

          CREATE TABLE IF NOT EXISTS ai_actions (
            id TEXT PRIMARY KEY,
            conversation_id TEXT NOT NULL,
            action_type TEXT NOT NULL,
            target TEXT,
            result TEXT,
            timestamp INTEGER NOT NULL,
            success INTEGER NOT NULL,
            FOREIGN KEY (conversation_id) REFERENCES ai_conversations(id)
          );

          CREATE INDEX IF NOT EXISTS idx_ai_conversations_task 
            ON ai_conversations(task_id);
          CREATE INDEX IF NOT EXISTS idx_ai_actions_conversation 
            ON ai_actions(conversation_id);
        `);
      },
      index: async (db: any, commits: any[]) => {
        // Index commits for AI context (already indexed in main tables)
        logger.debug('AI context indexer: commits already indexed');
      },
    });

    logger.info('AI Assistant Plugin initialized');
  }

  async cleanup(): Promise<void> {
    logger.info('Cleaning up AI Assistant Plugin');
    await this.worktreeManager?.cleanup();
  }
}

// Export plugin instance
export default new AIAssistantPlugin();
