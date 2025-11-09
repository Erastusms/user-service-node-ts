import { Request, Response } from 'express';

interface MetaData {
  page?: number;
  limit?: number;
  total?: number;
  [key: string]: any;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  meta?: MetaData;
  requestId: string;
  path: string;
  executionTime: string;
  timestamp: string;
}

/**
 * Calculates execution time from request start
 */
type ReqWithStart = Request & { startTime?: Date };

const getExecutionTime = (req: ReqWithStart): string => {
  const start = req.startTime ? req.startTime.getTime() : Date.now();
  const end = Date.now();
  const diff = end - start;
  return `${diff}ms`;
};

/**
 * Generate standardized success response
 */
export const successResponse = (
  res: Response,
  message: string,
  data?: any,
  meta?: MetaData,
  statusCode = 200
) => {
  const req: any = res.req;
  const response: ApiResponse = {
    success: true,
    message,
    data,
    ...(meta ? { meta } : {}),
    requestId: (req as any).requestId || 'N/A',
    path: req.originalUrl || 'N/A',
    executionTime: getExecutionTime(req),
    timestamp: new Date().toISOString(),
  };

  return res.status(statusCode).json(response);
};

/**
 * Generate standardized error response
 */
export const errorResponse = (
  res: Response,
  message: string,
  statusCode = 500,
  details?: any
) => {
  const req: any = res.req;
  const response = {
    success: false,
    message,
    ...(details ? { details } : {}),
    requestId: (req as any).requestId || 'N/A',
    path: req.originalUrl || 'N/A',
    executionTime: getExecutionTime(req),
    timestamp: new Date().toISOString(),
  };

  return res.status(statusCode).json(response);
};
