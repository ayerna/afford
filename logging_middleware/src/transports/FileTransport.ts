/**
 * File Transport
 * 
 * Outputs log records to file system
 */

import { writeFileSync, appendFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { LogRecord, ITransport } from '../types';

export class FileTransport implements ITransport {
  private readonly filepath: string;
  private readonly maxSize: number;
  private readonly backupCount: number;

  constructor(filepath: string, maxSize = 10 * 1024 * 1024, backupCount = 5) {
    this.filepath = filepath;
    this.maxSize = maxSize;
    this.backupCount = backupCount;
    this.ensureDirectory();
  }

  write(record: LogRecord): void {
    try {
      const line = `${record.timestamp} [${record.level}] ${record.message} ${record.method} ${record.url}`;
      const fullLine = record.error 
        ? `${line}\n  Error: ${record.error}\n`
        : `${line}\n`;

      this.ensureFileExists();
      appendFileSync(this.filepath, fullLine, 'utf-8');
      this.checkAndRotate();
    } catch (error) {
      console.error('FileTransport error:', error);
    }
  }

  private ensureDirectory(): void {
    const dir = dirname(this.filepath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }

  private ensureFileExists(): void {
    if (!existsSync(this.filepath)) {
      writeFileSync(this.filepath, '', 'utf-8');
    }
  }

  private checkAndRotate(): void {
    try {
      const stats = require('fs').statSync(this.filepath);
      if (stats.size > this.maxSize) {
        this.rotateLogs();
      }
    } catch (error) {
      // File doesn't exist yet
    }
  }

  private rotateLogs(): void {
    // Remove oldest backup if we exceed limit
    for (let i = this.backupCount; i > 1; i--) {
      const oldFile = `${this.filepath}.${i - 1}`;
      const newFile = `${this.filepath}.${i}`;
      if (existsSync(oldFile)) {
        try {
          if (existsSync(newFile)) {
            require('fs').unlinkSync(newFile);
          }
          require('fs').renameSync(oldFile, newFile);
        } catch (error) {
          // Ignore rotation errors
        }
      }
    }

    // Rename current file
    try {
      const backupFile = `${this.filepath}.1`;
      if (existsSync(backupFile)) {
        require('fs').unlinkSync(backupFile);
      }
      require('fs').renameSync(this.filepath, backupFile);
    } catch (error) {
      // Ignore rotation errors
    }
  }
}
