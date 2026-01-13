/**
 * Command Executor - Safe command execution with controls
 * Allows AI to run commands in isolated environments
 */

import { execa } from 'execa';
import type { CommandResult } from '../types/index.js';
import { logger } from '../../../utils/logger.js';

export class CommandExecutor {
  private allowedCommands: Set<string> = new Set([
    'npm', 'yarn', 'pnpm',
    'node', 'deno', 'bun',
    'python', 'python3',
    'go', 'cargo',
    'git',
    'ls', 'cat', 'echo', 'pwd',
    'make',
    'test', 'jest', 'vitest', 'mocha',
  ]);

  private deniedCommands: Set<string> = new Set([
    'rm', 'rmdir', 'del',
    'format', 'mkfs',
    'dd', 'fdisk',
    'shutdown', 'reboot',
    'sudo', 'su',
  ]);

  private timeout = 30000; // 30 seconds default timeout

  /**
   * Execute a command
   */
  async execute(
    command: string,
    args: string[] = [],
    cwd?: string,
    timeoutMs?: number
  ): Promise<CommandResult> {
    const startTime = Date.now();

    try {
      // Security check
      if (!this.isAllowedCommand(command)) {
        return {
          command: `${command} ${args.join(' ')}`,
          stdout: '',
          stderr: `Command not allowed: ${command}`,
          exitCode: 1,
          duration: 0,
          timestamp: new Date(),
        };
      }

      logger.info(`Executing command: ${command} ${args.join(' ')}`);

      const result = await execa(command, args, {
        cwd,
        timeout: timeoutMs || this.timeout,
        reject: false, // Don't throw on non-zero exit
      });

      const duration = Date.now() - startTime;

      return {
        command: `${command} ${args.join(' ')}`,
        stdout: result.stdout,
        stderr: result.stderr,
        exitCode: result.exitCode || 0,
        duration,
        timestamp: new Date(),
      };
    } catch (error: any) {
      const duration = Date.now() - startTime;

      logger.error(`Command execution failed: ${command}`, error);

      return {
        command: `${command} ${args.join(' ')}`,
        stdout: error.stdout || '',
        stderr: error.stderr || error.message,
        exitCode: error.exitCode || 1,
        duration,
        timestamp: new Date(),
      };
    }
  }

  /**
   * Execute a shell script
   */
  async executeScript(script: string, cwd?: string): Promise<CommandResult> {
    return this.execute('sh', ['-c', script], cwd);
  }

  /**
   * Check if a command is allowed
   */
  private isAllowedCommand(command: string): boolean {
    // Extract base command (without path)
    const baseCommand = command.split('/').pop() || command;

    // Check denied list first
    if (this.deniedCommands.has(baseCommand)) {
      logger.warn(`Command denied: ${command}`);
      return false;
    }

    // Check allowed list
    if (this.allowedCommands.has(baseCommand)) {
      return true;
    }

    // By default, deny unknown commands
    logger.warn(`Command not in allowed list: ${command}`);
    return false;
  }

  /**
   * Add an allowed command
   */
  addAllowedCommand(command: string): void {
    this.allowedCommands.add(command);
    logger.info('Added allowed command:', command);
  }

  /**
   * Add a denied command
   */
  addDeniedCommand(command: string): void {
    this.deniedCommands.add(command);
    logger.info('Added denied command:', command);
  }

  /**
   * Set command timeout
   */
  setTimeout(ms: number): void {
    this.timeout = ms;
    logger.info('Command timeout set to:', ms, 'ms');
  }

  /**
   * Get allowed commands
   */
  getAllowedCommands(): string[] {
    return Array.from(this.allowedCommands);
  }

  /**
   * Get denied commands
   */
  getDeniedCommands(): string[] {
    return Array.from(this.deniedCommands);
  }
}
