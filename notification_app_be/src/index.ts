/**
 * Campus Notifications Backend API
 * 
 * Express.js server for the notifications API service
 * Stage 1: Backend API implementation
 */

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authMiddleware } from './middleware/auth';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import notificationsRouter from './routes/notifications';
import authRouter from './routes/auth';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Request logging middleware
app.use((req: Request, res: Response, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint (no auth required)
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes

// Authentication routes (no auth required)
app.use('/auth', authRouter);

// Public notification routes (auth not required for GET)
app.use('/notifications', notificationsRouter);

// Protected API routes (would require auth middleware)
app.get('/api/status', authMiddleware, (req: Request, res: Response) => {
  res.json({
    message: 'Authenticated access successful',
    user: (req as any).user,
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║  Campus Notifications Backend API                          ║
║  Stage 1: Backend Implementation                           ║
╚════════════════════════════════════════════════════════════╝

  Server running at: http://localhost:${PORT}
  Environment: ${NODE_ENV}
  
  Available Endpoints:
  
  🔓 Public (No Auth):
    GET  /health                    - Health check
    POST /auth/token                - Generate JWT token
    GET  /auth/verify               - Verify token
    GET  /notifications             - List all notifications (paginated)
    GET  /notifications/:id         - Get specific notification
    GET  /notifications/type/:type  - Get notifications by type
  
  🔐 Protected (Bearer Token Required):
    GET  /api/status                - API status (requires auth)

  Example Usage:
  
  1. Get token:
     curl -X POST http://localhost:${PORT}/auth/token \\
       -H "Content-Type: application/json" \\
       -d '{"username": "student@campus.edu"}'
  
  2. Fetch notifications:
     curl http://localhost:${PORT}/notifications?page=1&limit=10
  
  3. Fetch with auth:
     curl -H "Authorization: Bearer <token>" \\
       http://localhost:${PORT}/api/status

`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export default app;
