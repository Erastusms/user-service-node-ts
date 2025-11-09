import express from 'express';
import { requestContext } from './middlewares/requestContext';
import userRoutes from './routes/user.routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());
app.use(requestContext); // harus sebelum router
app.use('/api/users', userRoutes);
app.use(errorHandler);

export default app;
