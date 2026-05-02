/**
 * Logger Factory
 * 
 * Creates and manages logger instances with configurable transports.
 */

import { LogLevel, LogRecord, ITransport, LoggerConfig } from './types';
import { ConsoleTransport } from './transports/ConsoleTransport';
import { FileTransport } from './transports/FileTransport';
import { v4 as uuidv4 } from 'crypto';

export class Logger {
  private config: LoggerConfig;
  private transports: ITransport[];

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: config.level || LogLevel.INFO,
      format: config.format || 'text',
      transports: config.transports || [new ConsoleTransport()],
      excludePaths: config.excludePaths || [],
      includeRequestBody: config.includeRequestBody || false,
      includeResponseBody: config.includeResponseBody || false,
      maxBodySize: config.maxBodySize || 1000,
    };
    this.transports = this.config.transports;
  }

  /**
   * Log a record at DEBUG level
   */
  debug(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, metadata);
  }

  /**
   * Log a record at INFO level
   */
  info(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, metadata);
  }

  /**
   * Log a record at WARN level
   */
  warn(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, metadata);
  }

  /**
   * Log a record at ERROR level
   */
  error(message: string, error?: Error | string, metadata?: Record<string, any>): void {
    const errorStr = typeof error === 'string' ? error : error?.message;
    this.log(LogLevel.ERROR, message, { ...metadata, error: errorStr });
  }

  /**
   * Log an HTTP request/response
   */
  httpRequest(
    method: string,
    url: string,
    statusCode: number,
    duration: number,
    userId?: string,
    ip?: string,
  ): void {
    const record: LogRecord = {
      timestamp: this.getTimestamp(),
      level: statusCode >= 500 ? LogLevel.ERROR : statusCode >= 400 ? LogLevel.WARN : LogLevel.INFO,
      message: 'HTTP Request',
      method,
      url,
      statusCode,
      duration,
      userId,
      ip,
    };
    this.writeRecord(record);
  }

  /**
   * Write a formatted record to all transports
   */
  private log(level: LogLevel, message: string, metadata?: Record<string, any>): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const record: LogRecord = {
      timestamp: this.getTimestamp(),
      level,
      message,
      method: 'N/A',
      url: 'N/A',
      metadata,
    };
    this.writeRecord(record);
  }

  /**
   * Write record to all configured transports
   */
  private writeRecord(record: LogRecord): void {
    this.transports.forEach((transport) => {
      try {
        transport.write(record);
      } catch (error) {
        console.error('Transport error:', error);
      }
    });
  }

  /**
   * Check if a log level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    const currentIndex = levels.indexOf(this.config.level);
    const targetIndex = levels.indexOf(level);
    return targetIndex >= currentIndex;
  }

  /**
   * Get ISO timestamp
   */
  private getTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Add a transport
   */
  addTransport(transport: ITransport): void {
    this.transports.push(transport);
  }

  /**
   * Get current log level
   */
  getLevel(): LogLevel {
    return this.config.level;
  }

  /**
   * Set log level
   */
  setLevel(level: LogLevel): void {
    this.config.level = level;
  }
}

/**
 * Create a global logger instance
 */
export const createLogger = (config?: Partial<LoggerConfig>): Logger => {
  return new Logger(config);
};

export { LogLevel, LogRecord, ITransport, LoggerConfig };
