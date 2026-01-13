/**
 * Plugin system for HistTUI
 * Allows extending functionality with custom screens, dashboards, and indexers
 */

import { Plugin, PluginAPI, CustomScreen, CustomDashboard, CustomIndexer } from '../types';
import { GitDatabase } from '../core/database';
import { GitClient } from '../core/git';
import { logger } from '../utils/logger';
import * as fs from 'fs';
import * as path from 'path';

export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private screens: Map<string, CustomScreen> = new Map();
  private dashboards: Map<string, CustomDashboard> = new Map();
  private indexers: Map<string, CustomIndexer> = new Map();
  private database: GitDatabase;
  private gitClient: GitClient;

  constructor(database: GitDatabase, gitClient: GitClient) {
    this.database = database;
    this.gitClient = gitClient;
  }

  /**
   * Load plugins from a directory
   */
  async loadPlugins(pluginDir: string): Promise<void> {
    if (!fs.existsSync(pluginDir)) {
      logger.info('Plugin directory not found:', pluginDir);
      return;
    }

    const entries = fs.readdirSync(pluginDir);

    for (const entry of entries) {
      const pluginPath = path.join(pluginDir, entry);
      
      if (fs.statSync(pluginPath).isDirectory()) {
        await this.loadPlugin(pluginPath);
      } else if (entry.endsWith('.js')) {
        await this.loadPlugin(pluginPath);
      }
    }

    logger.info(`Loaded ${this.plugins.size} plugins`);
  }

  /**
   * Load a single plugin
   */
  async loadPlugin(pluginPath: string): Promise<void> {
    try {
      // Dynamically import the plugin
      const pluginModule = require(pluginPath);
      const plugin: Plugin = pluginModule.default || pluginModule;

      if (!this.validatePlugin(plugin)) {
        logger.error('Invalid plugin:', pluginPath);
        return;
      }

      // Create plugin API
      const api = this.createPluginAPI(plugin.name);

      // Initialize plugin
      await plugin.init(api);

      this.plugins.set(plugin.name, plugin);
      logger.info('Loaded plugin:', plugin.name, plugin.version);
    } catch (error) {
      logger.error('Failed to load plugin:', pluginPath, error);
    }
  }

  /**
   * Validate plugin structure
   */
  private validatePlugin(plugin: any): plugin is Plugin {
    return (
      plugin &&
      typeof plugin.name === 'string' &&
      typeof plugin.version === 'string' &&
      typeof plugin.init === 'function'
    );
  }

  /**
   * Create plugin API
   */
  private createPluginAPI(pluginName: string): PluginAPI {
    return {
      registerScreen: (screen: CustomScreen) => {
        this.screens.set(screen.id, screen);
        logger.info(`Plugin ${pluginName} registered screen:`, screen.id);
      },
      registerDashboard: (dashboard: CustomDashboard) => {
        this.dashboards.set(dashboard.id, dashboard);
        logger.info(`Plugin ${pluginName} registered dashboard:`, dashboard.id);
      },
      registerIndexer: (indexer: CustomIndexer) => {
        this.indexers.set(indexer.id, indexer);
        // Initialize indexer tables
        indexer.init(this.database.getDatabase());
        this.database.registerPluginTable(pluginName, indexer.id);
        logger.info(`Plugin ${pluginName} registered indexer:`, indexer.id);
      },
      getDatabase: () => this.database.getDatabase(),
      getGitClient: () => this.gitClient,
      logger,
    };
  }

  /**
   * Get all registered custom screens
   */
  getScreens(): CustomScreen[] {
    return Array.from(this.screens.values());
  }

  /**
   * Get a specific custom screen
   */
  getScreen(id: string): CustomScreen | undefined {
    return this.screens.get(id);
  }

  /**
   * Get all registered custom dashboards
   */
  getDashboards(): CustomDashboard[] {
    return Array.from(this.dashboards.values());
  }

  /**
   * Get a specific custom dashboard
   */
  getDashboard(id: string): CustomDashboard | undefined {
    return this.dashboards.get(id);
  }

  /**
   * Get all registered custom indexers
   */
  getIndexers(): CustomIndexer[] {
    return Array.from(this.indexers.values());
  }

  /**
   * Run custom indexers
   */
  async runIndexers(commits: any[]): Promise<void> {
    for (const indexer of this.indexers.values()) {
      try {
        await indexer.index(this.database.getDatabase(), commits);
        logger.info('Ran custom indexer:', indexer.id);
      } catch (error) {
        logger.error('Failed to run custom indexer:', indexer.id, error);
      }
    }
  }

  /**
   * Cleanup all plugins
   */
  async cleanup(): Promise<void> {
    for (const plugin of this.plugins.values()) {
      if (plugin.cleanup) {
        try {
          await plugin.cleanup();
          logger.info('Cleaned up plugin:', plugin.name);
        } catch (error) {
          logger.error('Failed to cleanup plugin:', plugin.name, error);
        }
      }
    }
  }

  /**
   * Get plugin count
   */
  getPluginCount(): number {
    return this.plugins.size;
  }
}
