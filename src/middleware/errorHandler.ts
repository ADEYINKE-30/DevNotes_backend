import type { NextFunction, Request, Response } from 'express';

export interface AppError extends Error {
  statusCode?: number;
}

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error: AppError = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction): void => {
  const statusCode = err.statusCode ?? 500;
  const message = err.message ?? 'Internal server error';

  // Handle duplicate email error
  if ((err as { code?: number }).code === 11000) {
    res.status(400).json({
      success: false,
      message: 'Email already in use'
    });
    return;
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      message: 'Validation error',
      details: err.message
    });
    return;
  }

  res.status(statusCode).json({
    success: false,
    message
  });
};
