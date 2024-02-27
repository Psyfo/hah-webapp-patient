import express, { Request, Response, Router } from 'express';
import { login, verifyEmail } from './auth.controller';

// auth.routes.ts

const authRouter: Router = express.Router();

authRouter.post('/login', login);

// Express route for handling verification
authRouter.get('/verify/:token', verifyEmail);

export { authRouter };
