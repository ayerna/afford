# Logging Middleware

Centralized request/response logging middleware for the Campus Notifications System.

## Overview

A TypeScript logging library that provides:
- Multi-transport logging (console, file)
- Configurable log levels (DEBUG, INFO, WARN, ERROR)
- Request/response context tracking
- Structured log records
- File rotation support

## Features

### Log Levels

- **DEBUG**: Detailed diagnostic information
- **INFO**: General informational messages
- **WARN**: Warning messages for potentially harmful situations
- **ERROR**: Error messages for failure events

### Transports

- **ConsoleTransport**: Output to stdout/stderr with color formatting
- **FileTransport**: Append to file with automatic rotation

### Usage

```typescript
import { Logger, ConsoleTransport, FileTransport, LogLevel } from 'logging-middleware';

// Create logger with console output
const logger = new Logger({
  level: LogLevel.INFO,
  format: 'text',
  transports: [new ConsoleTransport()],
});

// Create logger with file output
const fileLogger = new Logger({
  level: LogLevel.DEBUG,
  transports: [
    new ConsoleTransport(),
    new FileTransport('./logs/app.log'),
  ],
});

// Log messages
logger.info('Server started', { port: 3001 });
logger.warn('High memory usage', { memory: '85%' });
logger.error('Database connection failed', new Error('Connection timeout'));

// Log HTTP requests
logger.httpRequest('GET', '/api/users', 200, 45, 'user123', '192.168.1.1');
```

## Installation

```bash
npm install logging-middleware
```

## Configuration

### LoggerConfig

```typescript
interface LoggerConfig {
  level: LogLevel;           // Minimum log level to output
  format: 'json' | 'text';   // Output format
  transports: ITransport[];  // Output destinations
  excludePaths?: string[];   // Paths to exclude from logging
  includeRequestBody?: boolean;
  includeResponseBody?: boolean;
  maxBodySize?: number;      // Max bytes to log for request/response bodies
}
```

### Example Configuration

```typescript
const logger = new Logger({
  level: process.env.LOG_LEVEL === 'debug' ? LogLevel.DEBUG : LogLevel.INFO,
  format: 'text',
  transports: [
    new ConsoleTransport(),
    new FileTransport('./logs/app.log', 10 * 1024 * 1024), // 10MB max
  ],
  excludePaths: ['/health', '/metrics'],
  includeRequestBody: true,
  includeResponseBody: false,
  maxBodySize: 1000,
});
```

## API

### Logger Methods

#### `logger.debug(message, metadata?): void`

Log at DEBUG level with optional metadata.

```typescript
logger.debug('Processing request', { userId: 123, duration: 45 });
```

#### `logger.info(message, metadata?): void`

Log at INFO level.

```typescript
logger.info('User logged in', { username: 'john@example.com' });
```

#### `logger.warn(message, metadata?): void`

Log at WARN level.

```typescript
logger.warn('API rate limit approaching', { used: 950, limit: 1000 });
```

#### `logger.error(message, error?, metadata?): void`

Log at ERROR level with optional error object.

```typescript
logger.error('Database query failed', new Error('Connection timeout'), {
  query: 'SELECT * FROM users',
  duration: 5000,
});
```

#### `logger.httpRequest(method, url, statusCode, duration, userId?, ip?): void`

Log an HTTP request with response status.

```typescript
logger.httpRequest('GET', '/api/notifications', 200, 45, 'user123', '192.168.1.1');
logger.httpRequest('POST', '/api/auth', 401, 23, undefined, '192.168.1.1');
```

#### `logger.addTransport(transport): void`

Add a new transport at runtime.

```typescript
logger.addTransport(new FileTransport('./logs/error.log'));
```

#### `logger.setLevel(level): void`

Change log level at runtime.

```typescript
logger.setLevel(LogLevel.DEBUG);
```

#### `logger.getLevel(): LogLevel`

Get current log level.

```typescript
const currentLevel = logger.getLevel();
```

## ConsoleTransport

Outputs logs to console with color formatting.

### Features

- Color-coded by log level (Cyan/DEBUG, Green/INFO, Yellow/WARN, Red/ERROR)
- Single-line format for easy reading
- Multi-line format for errors with stack traces

### Example Output

```
2026-05-02T10:30:00.000Z INFO Server started port=3001
2026-05-02T10:30:05.000Z WARN High memory usage memory=85%
2026-05-02T10:30:10.000Z ERROR Database connection failed
  Error: Connection timeout
```

### Constructor

```typescript
new ConsoleTransport(colorize?: boolean)
```

## FileTransport

Writes logs to file with automatic rotation.

### Features

- Append-only file writing
- Automatic file rotation when size exceeds limit
- Backup file naming scheme (app.log, app.log.1, app.log.2, ...)
- Directory creation if not exists

### Example Output

```
2026-05-02T10:30:00.000Z [INFO] Server started
2026-05-02T10:30:05.000Z [WARN] High memory usage
2026-05-02T10:30:10.000Z [ERROR] Database connection failed
  Error: Connection timeout
```

### Constructor

```typescript
new FileTransport(
  filepath: string,
  maxSize?: number,    // Default: 10MB
  backupCount?: number // Default: 5
)
```

### Rotation Example

With default settings (10MB max, keep 5 backups):

```
app.log (current, growing)
app.log.1 (previous)
app.log.2 (older)
app.log.3 (oldest kept)
app.log.4, app.log.5 (archived)
```

When app.log reaches 10MB:
- app.log → app.log.1
- app.log.2 → app.log.3
- app.log.5 deleted
- New app.log created

## Log Record Structure

```typescript
interface LogRecord {
  timestamp: string;          // ISO 8601 timestamp
  level: LogLevel;            // Log level
  message: string;            // Main message
  method: string;             // HTTP method or 'N/A'
  url: string;                // Request URL or 'N/A'
  statusCode?: number;        // HTTP status code
  duration?: number;          // Request duration in ms
  userId?: string;            // User identifier
  ip?: string;                // Client IP address
  error?: string;             // Error message
  requestBody?: any;          // Request payload
  responseBody?: any;         // Response payload
  metadata?: Record<string, any>; // Custom metadata
}
```

## Express Integration

Integrate with Express middleware:

```typescript
import express from 'express';
import { Logger, ConsoleTransport, FileTransport } from 'logging-middleware';

const app = express();
const logger = new Logger({
  transports: [
    new ConsoleTransport(),
    new FileTransport('./logs/app.log'),
  ],
});

// Custom middleware for HTTP logging
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.httpRequest(
      req.method,
      req.path,
      res.statusCode,
      duration,
      (req as any).userId,
      req.ip,
    );
  });
  
  next();
});

// Log errors
app.use((err, req, res, next) => {
  logger.error('Unhandled error', err, {
    path: req.path,
    method: req.method,
  });
  res.status(500).json({ error: 'Internal Server Error' });
});
```

## Environment Configuration

Configure via `.env` file:

```env
LOG_LEVEL=INFO
LOG_FORMAT=text
LOG_FILE_PATH=./logs/app.log
LOG_FILE_MAX_SIZE=10485760
LOG_FILE_BACKUP_COUNT=5
LOG_INCLUDE_REQUEST_BODY=false
LOG_INCLUDE_RESPONSE_BODY=false
LOG_MAX_BODY_SIZE=1000
LOG_EXCLUDE_PATHS=/health,/metrics
```

## Custom Transport

Create custom transport by implementing `ITransport`:

```typescript
import { ITransport, LogRecord } from 'logging-middleware';

class DatabaseTransport implements ITransport {
  write(record: LogRecord): void {
    // Send to database
    db.logs.insert({
      ...record,
      timestamp: new Date(record.timestamp),
    });
  }
}

// Use custom transport
logger.addTransport(new DatabaseTransport());
```

## Performance

- **No I/O blocking**: File writes are asynchronous
- **Minimal overhead**: Typically <1ms per log call
- **File rotation**: Efficient with O(n) backup management
- **Memory efficient**: Streams for file writing

## Best Practices

1. **Set appropriate log level** for environment:
   - Development: DEBUG
   - Staging: INFO
   - Production: WARN

2. **Use metadata** for contextual information:
   ```typescript
   logger.info('Payment processed', {
     orderId: 12345,
     amount: 99.99,
     currency: 'USD',
   });
   ```

3. **Log errors with full context**:
   ```typescript
   logger.error('Request failed', error, {
     endpoint: req.path,
     method: req.method,
     duration: elapsed,
   });
   ```

4. **Exclude sensitive paths**:
   ```typescript
   {
     excludePaths: ['/health', '/metrics', '/internal/*'],
   }
   ```

5. **Rotate files** in production:
   ```typescript
   new FileTransport('./logs/app.log', 50 * 1024 * 1024, 10)
   ```

## Troubleshooting

### Logs not appearing

- Check log level: `logger.getLevel()`
- Verify transport is configured
- Ensure file path has write permissions

### File not rotating

- Verify `maxSize` threshold is realistic
- Check disk space availability
- Ensure write permissions for log directory

### Performance degradation

- Increase `LOG_LEVEL` to reduce logging volume
- Reduce `LOG_FILE_MAX_SIZE` for more frequent rotations
- Consider batching writes for high-volume scenarios

## License

MIT
