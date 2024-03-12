import express, { Router } from 'express';
import { LoggerMiddleware } from '../middleware/logger.middleware';
import { adminLogin, login, verifyEmail } from './auth.controller';

// auth.routes.ts

const authRouter: Router = express.Router();

authRouter.post('/login', LoggerMiddleware.reqLog, login);
authRouter.post('/admin/login', LoggerMiddleware.reqLog, adminLogin);
authRouter.get('/verify/:token', LoggerMiddleware.reqLog, verifyEmail);

export { authRouter };
