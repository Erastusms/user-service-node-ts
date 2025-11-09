import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { errorResponse } from '../utils/responseHandler';
import { logger } from '../core/logger';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  details?: any;

  constructor(
    message: string,
    statusCode = 500,
    details?: any,
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad request', details?: any) {
    super(message, 400, details);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation error', details?: any) {
    super(message, 422, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict detected') {
    super(message, 409);
  }
}

// 🟣 Prisma error normalization helper
const parsePrismaError = (err: any): AppError => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Known DB errors (constraint violation, missing relation, etc.)
    switch (err.code) {
      case 'P2002':
        return new ConflictError(
          'Duplicate field value violates unique constraint.'
        );
      case 'P2025':
        return new NotFoundError('Record not found.');
      default:
        return new BadRequestError(
          err.message.split('\n').pop()?.trim() || 'Database request error'
        );
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    // Validation errors like invalid format / type mismatch
    const cleaned =
      err.message.split('\n').pop()?.trim() || 'Invalid data input';
    return new ValidationError(cleaned);
  }

  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    return new AppError('Unknown database error', 500);
  }

  return new AppError(err.message || 'Unhandled database error', 500);
};

// 🟣 Zod error normalization helper + express middleware to convert Zod errors
const parseZodError = (err: ZodError): ValidationError => {
  const errors = err.issues.map((issue) => ({
    path: issue.path.length ? issue.path.join('.') : undefined,
    message: issue.message,
    code: issue.code,
    params: (issue as any).params ?? undefined,
  }));

  return new ValidationError('Validation failed', { errors });
};

export const zodErrorMiddleware = (
  err: any,
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    return next(parseZodError(err));
  }
  return next(err);
};

// 🟢 Centralized error handler
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let handledError: AppError;

  if (err instanceof ZodError) {
    handledError = parseZodError(err);
  } else {
    // Prisma error handler
    if (
      err instanceof Prisma.PrismaClientKnownRequestError ||
      err instanceof Prisma.PrismaClientValidationError ||
      err instanceof Prisma.PrismaClientUnknownRequestError
    ) {
      handledError = parsePrismaError(err);
    } else if (err instanceof AppError) {
      handledError = err;
    } else {
      handledError = new AppError(err.message || 'Internal server error', 500);
    }
  }

  logger.error({
    requestId: (req as any).requestId,
    message: handledError.message,
    stack: handledError.stack,
    path: req.originalUrl,
    method: req.method,
    statusCode: handledError.statusCode,
  });

  return errorResponse(
    res,
    handledError.message,
    handledError.statusCode,
    handledError.details
  );
};
