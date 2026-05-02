/**
 * Console Transport
 * 
 * Outputs log records to console (stdout/stderr)
 */

import { LogRecord, ITransport, LogLevel } from '../types';

export class ConsoleTransport implements ITransport {
  private readonly colorize: boolean;

  constructor(colorize = true) {
    this.colorize = colorize;
  }

  write(record: LogRecord): void {
    const formatted = this.format(record);
    const stream = record.level === LogLevel.ERROR ? console.error : console.log;
    stream(formatted);
  }

  private format(record: LogRecord): string {
    const timestamp = record.timestamp;
    const level = this.colorize ? this.colorizeLevel(record.level) : record.level;
    const message = record.message;
    const method = record.method;
    const url = record.url;
    const statusCode = record.statusCode ? `[${record.statusCode}]` : '';
    const duration = record.duration ? `${record.duration}ms` : '';

    const baseLine = `${timestamp} ${level} ${message} ${method} ${url} ${statusCode} ${duration}`.trim();

    if (record.error) {
      return `${baseLine}\n  Error: ${record.error}`;
    }

    if (record.metadata) {
      return `${baseLine}\n  ${JSON.stringify(record.metadata, null, 2)}`;
    }

    return baseLine;
  }

  private colorizeLevel(level: LogLevel): string {
    const colors = {
      DEBUG: '\x1b[36m',    // Cyan
      INFO: '\x1b[32m',     // Green
      WARN: '\x1b[33m',     // Yellow
      ERROR: '\x1b[31m',    // Red
    };
    const reset = '\x1b[0m';
    return `${colors[level]}${level}${reset}`;
  }
}
