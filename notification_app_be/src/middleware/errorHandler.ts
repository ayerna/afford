/**
 * Error Handler Middleware
 * 
 * Centralized error handling for all routes
 */

import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../types';

export class APIError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public error: string = 'Error',
  ) {
    super(message);
    Object.setPrototypeOf(this, APIError.prototype);
  }
}

/**
 * Global error handler middleware
 */
export const errorHandler = (
  err: Error | APIError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const response: ErrorResponse = {
    error: 'Internal Server Error',
    message: err.message,
    statusCode: 500,
    timestamp: new Date().toISOString(),
  };

  if (err instanceof APIError) {
    response.error = err.error;
    response.statusCode = err.statusCode;
    response.message = err.message;
  } else {
    console.error('Unhandled error:', err);
  }

  res.status(response.statusCode).json(response);
};

/**
 * 404 handler for undefined routes
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const response: ErrorResponse = {
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    statusCode: 404,
    timestamp: new Date().toISOString(),
  };
  res.status(404).json(response);
};
