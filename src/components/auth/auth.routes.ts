import express, { Router } from 'express';
import { LoggerMiddleware } from '../../middleware/logger.middleware';

import {
  adminLogin,
  login,
  practitionerLogin,
  verifyEmail,
} from './auth.controller';

// auth.routes.ts

const authRouter: Router = express.Router();

authRouter.post('/login', LoggerMiddleware.reqLog, login);
authRouter.post('/admin/login', LoggerMiddleware.reqLog, adminLogin);
authRouter.post(
  '/practitioner/login',
  LoggerMiddleware.reqLog,
  practitionerLogin
);
authRouter.get('/verify/:token', LoggerMiddleware.reqLog, verifyEmail);
authRouter.get(
  '/verify-practitioner/:token',
  LoggerMiddleware.reqLog,
  verifyEmail
);

export { authRouter };
