import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

/**
 * Middleware to attach requestId and startTime to every request
 */
declare global {
  namespace Express {
    interface Request {
      startTime?: Date;
      requestId?: string;
    }
  }
}

export const requestContext = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  req.requestId = randomUUID();
  req.startTime = new Date();
  next();
};
