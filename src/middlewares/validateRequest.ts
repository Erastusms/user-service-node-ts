import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ValidationError } from '../middlewares/errorHandler';

export const validateRequest =
  (schema: ZodSchema<any>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Body, params, dan query dapat digabung tergantung kebutuhan
      schema.parse(req.body);
      next();
    } catch (error: any) {
      if (error.errors) {
        const details = error.errors.map((e: any) => ({
          path: e.path.join('.'),
          message: e.message,
        }));
        return next(new ValidationError('Invalid request data', details));
      }
      next(error);
    }
  };
