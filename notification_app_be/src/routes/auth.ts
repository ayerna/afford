/**
 * Authentication Routes
 * 
 * Endpoints for token generation and authentication
 */

import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { TokenPayload } from '../types';

const router = Router();

/**
 * POST /auth/token
 * 
 * Generate a JWT token for API access
 * 
 * Request Body:
 * - username: Username (optional, default: "test-user")
 * - password: Password (optional, for demo purposes)
 */
router.post('/token', (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { username = 'test-user', password } = req.body;

    // In production, validate credentials against a database
    // For now, accept any username/password combination
    if (!username) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Username is required',
        statusCode: 400,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const payload: TokenPayload = {
      sub: username,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
      role: 'user',
    };

    const token = jwt.sign(payload, secret);

    res.json({
      access_token: token,
      token_type: 'Bearer',
      expires_in: 24 * 60 * 60,
      user: {
        username,
        role: payload.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /auth/verify
 * 
 * Verify current token validity
 * Requires: Bearer token in Authorization header
 */
router.get('/verify', (req: Request, res: Response, next: NextFunction): void => {
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

    const token = authHeader.replace('Bearer ', '');
    const secret = process.env.JWT_SECRET || 'your-secret-key';

    try {
      const decoded = jwt.verify(token, secret);
      res.json({
        valid: true,
        token: decoded,
      });
    } catch (error) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token',
        statusCode: 401,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
