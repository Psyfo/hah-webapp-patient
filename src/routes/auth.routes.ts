import bcrypt from 'bcrypt';
import express, { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import { json } from 'body-parser';
import { IPatient } from '../components/patient/patient.interface';
import { PatientModel } from '../components/patient/patient.model';
import { logger } from '../config/logger.config';

// auth.routes.ts

const authRouter: Router = express.Router();

authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { userName, password } = req.body;
    const patient: IPatient | null = await PatientModel.findOne({ userName });

    if (!patient) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, patient.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ sub: patient._id }, 'your-secret-key', {
      expiresIn: '30m',
    });
    res.json({ token });
  } catch (error: any) {
    logger.error(JSON.stringify(error.message));
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export { authRouter };
