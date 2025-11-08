import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: process.env.PORT || 4000,
  databaseUrl: process.env.DATABASE_URL as string,
  nodeEnv: process.env.NODE_ENV || 'development',
};
export const isProduction = env.nodeEnv === 'production';
export const isDevelopment = env.nodeEnv === 'development';
export const isTest = env.nodeEnv === 'test';
export const jwtSecret = process.env.JWT_SECRET as string;
export const jwtExpiration = process.env.JWT_EXPIRATION || '1h';
export const saltRounds = parseInt(process.env.SALT_ROUNDS || '10', 10);
export const logLevel =
  process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug');
export const corsOrigin = process.env.CORS_ORIGIN || '*';
export const rateLimitWindowMs = parseInt(
  process.env.RATE_LIMIT_WINDOW_MS || '60000',
  10
); // 1 minute
export const rateLimitMaxRequests = parseInt(
  process.env.RATE_LIMIT_MAX_REQUESTS || '100',
  10
); // 100 requests per window
export const emailServiceApiKey = process.env.EMAIL_SERVICE_API_KEY as string;
export const emailServiceDomain = process.env.EMAIL_SERVICE_DOMAIN as string;
