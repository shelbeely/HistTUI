/**
 * Logger for HistTUI
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export class Logger {
  private logFile: string;
  private enabled: boolean;

  constructor(enabled: boolean = false) {
    this.enabled = enabled;
    this.logFile = path.join(os.homedir(), '.histtui', 'debug.log');
    
    if (this.enabled) {
      this.ensureLogDir();
    }
  }

  private ensureLogDir(): void {
    const dir = path.dirname(this.logFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private write(level: string, message: string, ...args: any[]): void {
    if (!this.enabled) return;

    const timestamp = new Date().toISOString();
    const formattedArgs = args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' ');
    
    const logMessage = `[${timestamp}] [${level}] ${message} ${formattedArgs}\n`;
    
    try {
      fs.appendFileSync(this.logFile, logMessage);
    } catch (error) {
      // Fail silently
    }
  }

  public info(message: string, ...args: any[]): void {
    this.write('INFO', message, ...args);
  }

  public warn(message: string, ...args: any[]): void {
    this.write('WARN', message, ...args);
  }

  public error(message: string, ...args: any[]): void {
    this.write('ERROR', message, ...args);
  }

  public debug(message: string, ...args: any[]): void {
    this.write('DEBUG', message, ...args);
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (enabled) {
      this.ensureLogDir();
    }
  }
}

export const logger = new Logger(process.env.DEBUG === 'true');
