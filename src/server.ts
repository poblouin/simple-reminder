import cors from 'cors';
import cron from 'node-cron';
import morgan from 'morgan';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import { BAD_REQUEST } from 'http-status-codes';
import 'express-async-errors';

import logger from '@shared/logger';
import BaseRouter from './routes';
import { processRecurrences } from './cron-jobs';

// Init express
const app = express();

/** **********************************************************************************
 *                              Set basic express settings
 ********************************************************************************** */

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Security
if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
}

// Add APIs
app.use('/api', BaseRouter);

// Print API errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message, err);
  return res.status(BAD_REQUEST).json({
    error: err.message,
  });
});

// Cron
// Process recurrences each day at midnight
cron.schedule('* 0 * * *', processRecurrences);

// Export express instance
export default app;
