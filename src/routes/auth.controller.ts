import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { AdminModel } from "../components/admin/admin.model";
import { IPatient } from "../components/patient/patient.interface";
import { PatientModel } from "../components/patient/patient.model";
import { PractitionerModel } from "../components/practitioner/practitioner.model";
import { logger } from "../config/logger.config";

// Patient login
const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const patient: IPatient | null = await PatientModel.findOne({ email });

    if (!patient) {
      return res.status(401).json({ message: 'Patient not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, patient.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Password is invalid' });
    }

    const token = jwt.sign({ sub: patient._id }, 'your-secret-key', {
      expiresIn: '30m',
    });
    res.json({ token });
  } catch (error: any) {
    logger.error(JSON.stringify(error.message));
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

// Practitioner login
const practitionerLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const practitioner = await PractitionerModel.findOne({ email });

    if (!practitioner) {
      return res.status(401).json({ message: 'Practitioner not found' });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      practitioner.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Password is invalid' });
    }

    const token = jwt.sign({ sub: practitioner._id }, 'your-secret-key', {
      expiresIn: '30m',
    });
    res.json({ token });
  } catch (error: any) {
    logger.error(JSON.stringify(error.message));
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

// Admin login
const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const admin = await AdminModel.findOne({
      email,
    });
    if (!admin) {
      return res.status(401).json({ message: 'Admin not found' });
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    console.log(`isPasswordValid: ${isPasswordValid}`);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Password is invalid' });
    }
    const token = jwt.sign({ sub: admin._id }, 'your-secret-key', {
      expiresIn: '30m',
    });
    res.json({ token });
  } catch (error: any) {
    logger.error(JSON.stringify(error.message));
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

const verifyEmail = async (req: Request, res: Response) => {
  const token = req.params.token;

  try {
    const patient = await PatientModel.findOne({
      'account.verificationToken': token,
    });
    if (!patient) {
      return res
        .status(404)
        .json({ message: 'patient not found or token expired' });
    }

    patient.account.verified = true;
    patient.account.verificationToken = undefined;
    await patient.save();

    logger.info(`User ${patient.email} verified successfully`);
    res.json({
      message: 'Congratulations! Your email has been verified.',
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export { login, practitionerLogin, adminLogin, verifyEmail };
