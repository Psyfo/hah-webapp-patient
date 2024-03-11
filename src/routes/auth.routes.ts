import express, { Request, Response, Router } from 'express';
import { adminLogin, login, verifyEmail } from './auth.controller';

// auth.routes.ts

const authRouter: Router = express.Router();

authRouter.post('/login', login);
authRouter.post('/admin/login', adminLogin);
authRouter.get('/verify/:token', verifyEmail);

export { authRouter };
