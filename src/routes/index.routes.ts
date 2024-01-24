import express, { Request, Response } from 'express';
import { LoggerMiddleware } from '../middleware/logger.middleware';

// router for express

const router = express.Router();

router.get('/', LoggerMiddleware.reqLog, (req: Request, res: Response) => {
  res.send('Patient microservice working!');
});

export { router };
