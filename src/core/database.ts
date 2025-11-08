import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

export const prisma = new PrismaClient();

prisma
  .$connect()
  .then(() => logger.info('Database connected successfully'))
  .catch((err: { message: any }) =>
    logger.error(`Database connection error: ${err.message}`)
  );
