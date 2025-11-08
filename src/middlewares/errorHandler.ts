import { Request, Response, NextFunction } from 'express';
import { logger } from '../core/logger';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(500).json({ success: false, message: 'Internal server error' });
}
