/**
 * Logging Middleware - Type Definitions
 * 
 * Defines interfaces for request/response logging,
 * log levels, transports, and formatting options.
 */

import { Request, Response } from 'express';

/**
 * Log level enumeration
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

/**
 * Log record structure
 */
export interface LogRecord {
  timestamp: string;
  level: LogLevel;
  message: string;
  method: string;
  url: string;
  statusCode?: number;
  duration?: number;
  userId?: string;
  ip?: string;
  error?: string;
  requestBody?: Record<string, any>;
  responseBody?: Record<string, any>;
  metadata?: Record<string, any>;
}

/**
 * Transport interface for different output targets
 */
export interface ITransport {
  write(record: LogRecord): void | Promise<void>;
}

/**
 * Logger configuration options
 */
export interface LoggerConfig {
  level: LogLevel;
  format: 'json' | 'text';
  transports: ITransport[];
  excludePaths?: string[];
  includeRequestBody?: boolean;
  includeResponseBody?: boolean;
  maxBodySize?: number;
}

/**
 * Log context attached to requests
 */
export interface LogContext {
  startTime: number;
  requestId: string;
}

declare global {
  namespace Express {
    interface Request {
      logContext?: LogContext;
    }
  }
}
