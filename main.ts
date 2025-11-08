// src/main.ts
import 'reflect-metadata'; // Wajib untuk tsyringe
import { container, Lifecycle } from 'tsyringe';
import express from 'express';

import { config } from './infrastructure/config';
import { logger } from './infrastructure/logging/logger';
import { userRouter } from './infrastructure/http/user.routes';
import { loggingMiddleware } from './infrastructure/http/middlewares/logging.middleware';
import { errorHandler } from './infrastructure/http/middlewares/errorHandler';
import { PostgresUserRepository } from './infrastructure/database/pg.repository';

// ---------- DI Container Setup (Penyambungan) ----------
// Ini adalah inti dari Dependency Inversion
// Kita memberitahu container: "Jika ada yang minta 'IUserRepository',
// berikan dia 'PostgresUserRepository' sebagai singleton."
container.register(
  'IUserRepository',
  {
    useClass: PostgresUserRepository,
  },
  { lifecycle: Lifecycle.Singleton }
); // Sekali dibuat, pakai terus

// ---------- Express App Setup ----------
const app = express();

app.use(express.json()); // Middleware untuk parse JSON body
app.use(loggingMiddleware); // Middleware logging kustom kita

// Daftarkan Rute
app.use('/api/v1/users', userRouter);

// Middleware untuk menangani error
app.use(errorHandler);

// Start Server
app.listen(config.port, () => {
  logger.info(`User-Service running on http://localhost:${config.port}`);
  logger.info(`Environment: ${config.nodeEnv}`);
});
