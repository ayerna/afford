/**
 * Authentication Middleware
 * 
 * Bearer token validation for protected routes
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { TokenPayload } from '../types';

/**
 * Verify bearer token from Authorization header
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing Authorization header',
        statusCode: 401,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid Authorization header format',
        statusCode: 401,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const token = parts[1];
    const secret = process.env.JWT_SECRET || 'your-secret-key';

    try {
      const decoded = jwt.verify(token, secret) as TokenPayload;
      (req as any).user = decoded;
      next();
    } catch (error) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token',
        statusCode: 401,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication check failed',
      statusCode: 500,
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Generate a mock JWT token for testing
 */
export const generateMockToken = (): string => {
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  const payload: TokenPayload = {
    sub: 'test-user',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
    role: 'user',
  };
  return jwt.sign(payload, secret);
};
