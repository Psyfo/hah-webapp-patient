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
    const { email, password } = req.body;
    const patient: IPatient | null = await PatientModel.findOne({ email });

    if (!patient) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, patient.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
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

// Express route for handling verification
authRouter.get('/verify/:token', async (req, res) => {
  const token = req.params.token;

  try {
    const patient = await PatientModel.findOne({ verificationToken: token });
    if (!patient) {
      return res
        .status(404)
        .json({ message: 'patient not found or token expired' });
    }

    patient.verified = true;
    patient.verificationToken = undefined;
    await patient.save();

    res.json({ message: 'User verified successfully' });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export { authRouter };
