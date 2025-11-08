import app from './app';
import { env } from './config/env';
import { logger } from './core/logger';

app.listen(env.port, () => {
  logger.info(`User-Service running on port ${env.port}`);
});
