#!/usr/bin/env node

/**
 * CLI entry point for HistTUI
 * Handles argument parsing and launches the TUI
 */

import { Command } from 'commander';
import { render } from 'ink';
import React from 'react';
import { App } from './components/App';
import { config } from './config';
import { logger } from './utils/logger';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../package.json'), 'utf-8')
);

const program = new Command();

program
  .name('histtui')
  .description('Interactive Git History TUI - Explore repository history with a beautiful terminal interface')
  .version(packageJson.version)
  .argument('[repo-url]', 'Git repository URL or local path (optional - will prompt if not provided)')
  .option('-s, --skip-update', 'Skip fetching updates from remote')
  .option('-d, --debug', 'Enable debug logging')
  .option('--cache-dir <path>', 'Custom cache directory')
  .option('--max-commits <number>', 'Maximum number of commits to index', parseInt)
  .action((repoUrl: string | undefined, options) => {
    // Enable debug logging if requested
    if (options.debug) {
      logger.setEnabled(true);
      logger.info('Debug logging enabled');
    }

    // Update config if options provided
    if (options.cacheDir) {
      config.set({ cacheDir: options.cacheDir });
      logger.info('Using custom cache directory:', options.cacheDir);
    }

    if (options.maxCommits) {
      config.set({ maxCommits: options.maxCommits });
      logger.info('Max commits set to:', options.maxCommits);
    }

    // Render the app
    try {
      render(
        React.createElement(App, {
          repoUrl: repoUrl || undefined,
          skipUpdate: options.skipUpdate,
        })
      );
    } catch (error) {
      console.error('Failed to start HistTUI:', error);
      process.exit(1);
    }
  });

// Add config command
program
  .command('config')
  .description('Manage HistTUI configuration')
  .action(() => {
    const currentConfig = config.get();
    console.log('Current Configuration:');
    console.log(JSON.stringify(currentConfig, null, 2));
  });

// Add cache command
program
  .command('cache')
  .description('Manage cached repositories')
  .option('-l, --list', 'List all cached repositories')
  .option('-c, --clear [url]', 'Clear cache for a specific repository or all')
  .action((options) => {
    const { CacheManager } = require('./core/cache');
    const cacheManager = new CacheManager(config.getCacheDir());

    if (options.list) {
      const cached = cacheManager.listCached();
      console.log(`Cached Repositories (${cached.length}):`);
      cached.forEach((info) => {
        console.log(`\n${info.repoName}`);
        console.log(`  URL: ${info.repoUrl}`);
        console.log(`  Path: ${info.localPath}`);
        console.log(`  Commits: ${info.commitCount}`);
        console.log(`  Last Updated: ${info.lastUpdated.toLocaleString()}`);
      });
    } else if (options.clear) {
      if (typeof options.clear === 'string') {
        cacheManager.clearCache(options.clear);
        console.log(`Cleared cache for: ${options.clear}`);
      } else {
        cacheManager.clearAllCache();
        console.log('Cleared all cache');
      }
    }
  });

program.parse();
