import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // Database errors
  if (err.name === 'QueryFailedError' || (err as any).code) {
    const dbError = err as any;

    // Unique constraint violation
    if (dbError.code === '23505') {
      return res.status(409).json({
        status: 'error',
        message: 'Resource already exists',
      });
    }

    // Foreign key violation
    if (dbError.code === '23503') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid reference to related resource',
      });
    }
  }

  // Default error
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};
