import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env';

interface ErrorWithStatus extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: ErrorWithStatus,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const explicitStatus = err instanceof ApiError ? err.statusCode : err.statusCode;
  const statusCode = explicitStatus || (res.statusCode === 200 ? 500 : res.statusCode);

  res.status(statusCode).json({
    message: err.message,
    // Only include the stack trace when explicitly running in development,
    // so an unset/misconfigured NODE_ENV defaults to hiding it.
    stack: env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

export const errorMiddleware = errorHandler;
