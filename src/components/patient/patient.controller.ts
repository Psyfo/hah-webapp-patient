import nodemailer from 'nodemailer';
import { Request, Response } from 'express';
import { customAlphabet } from 'nanoid';
import { logger } from '../../config/logger.config';
import { IPatient } from './patient.interface';
import { PatientModel } from './patient.model';

import {
  patientIDApprovedEmail,
  patientIDRejectedEmail,
  patientPasswordResetEmail,
  patientVerificationEmail,
} from '../mail/mail.controller';

// Create a new patient
const createPatient = async (req: Request, res: Response): Promise<void> => {
  try {
    // Access authenticated patient information
    const authenticatedPatient = req.user;
    const newPatientData: IPatient = req.body;
    logger.info(`Req body: ${JSON.stringify(req.body)}`);
    const newPatient = new PatientModel(newPatientData);
    const savedPatient = await newPatient.save();
    res.status(201).json(savedPatient);
  } catch (error: any) {
    logger.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all patients
const getAllPatients = async (req: Request, res: Response): Promise<void> => {
  try {
    const patients = await PatientModel.find();
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get active patients
const getActivePatients = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const patients = await PatientModel.find({
      'account.accountStatus': 'active',
    });
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get blocked patients
const getBlockedPatients = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const patients = await PatientModel.find({
      'account.accountStatus': 'blocked',
    });
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get deleted patients
const getDeletedPatients = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const patients = await PatientModel.find({
      'account.accountStatus': 'deleted',
    });
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get a specific patient by ID
const getPatientById = async (req: Request, res: Response): Promise<void> => {
  try {
    const patientId = req.params.id;
    const patient = await PatientModel.findById(patientId);
    if (!patient) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }
    res.status(200).json(patient);
  } catch (error: any) {
    logger.error(JSON.stringify(error.message));
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get a specific patient by Email
const getPatientByEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const email = req.params.email;
    const patient = await PatientModel.findOne({
      email: email,
    });
    if (!patient) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }
    res.status(200).json(patient);
  } catch (error: any) {
    logger.error(JSON.stringify(error.message));
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a patient by ID
const updatePatientById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const patientId = req.params.id;
    const updatedPatientData: IPatient = req.body;

    logger.info(`Updated patient data: ${JSON.stringify(updatedPatientData)}`);

    const updatedPatient = await PatientModel.findByIdAndUpdate(
      patientId,
      updatedPatientData,
      { new: true }
    );

    if (!updatedPatient) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }

    res.status(200).json(updatedPatient);
  } catch (error: any) {
    res.status(500).json({ error: 'Internal Server Error' });
    logger.error(error.message);
  }
};

// Update a patient by Email
const updatePatientByEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const email = req.params.email;
    const updatedPatientData: IPatient = req.body;

    logger.info(`Updated patient data: ${JSON.stringify(updatedPatientData)}`);

    const updatedPatient = await PatientModel.findOneAndUpdate(
      { email: email },
      updatedPatientData,
      { new: true }
    );

    if (!updatedPatient) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }

    res.status(200).json(updatedPatient);
  } catch (error: any) {
    res.status(500).json({ error: 'Internal Server Error' });
    logger.error(error.message);
  }
};

// Delete a patient by ID
const deletePatientById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const patientId = req.params.id;
    const deletedPatient = await PatientModel.findByIdAndUpdate(
      patientId,
      { 'account.accountStatus': 'deleted' },
      { new: true }
    );
    if (!deletedPatient) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }
    res.status(204).json();
  } catch (error: any) {
    res.status(500).json({ error: JSON.stringify(error) });
  }
};

// Delete a patient by Email
const deletePatientByEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const email = req.params.email;
    const deletedPatient = await PatientModel.findOneAndUpdate(
      { email: email },
      { 'account.accountStatus': 'deleted' },
      { new: true }
    );
    if (!deletedPatient) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }
    res.status(204).json();
  } catch (error: any) {
    res.status(500).json({ error: JSON.stringify(error) });
  }
};

// Reactivate a patient by Email
const reactivatePatientByEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const email = req.params.email;
    const reactivatedPatient = await PatientModel.findByIdAndUpdate(
      email,
      { 'account.accountStatus': 'active' },
      { new: true }
    );
    if (!reactivatedPatient) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }
    res.status(200).json(reactivatedPatient);
  } catch (error: any) {
    res.status(500).json({ error: JSON.stringify(error) });
  }
};

// Block a patient by Email
const blockPatientByEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const email = req.params.email;
    const blockedPatient = await PatientModel.findByIdAndUpdate(
      email,
      { 'account.accountStatus': 'blocked' },
      { new: true }
    );
    if (!blockedPatient) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }
    res.status(200).json(blockedPatient);
  } catch (error: any) {
    res.status(500).json({ error: JSON.stringify(error) });
  }
};

// Check if a patient exists by email
const patientExistsByEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.params;

    // Validate email format (you may want to add more robust validation)
    if (!email) {
      res.status(400).json({ error: 'Email is required' });
    }

    // Check if email exists in the database
    const user = await PatientModel.findOne({ email });

    if (user) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const resendVerificationEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  const frontEndUrl: string | undefined =
    process.env.NODE_ENV === 'production'
      ? process.env.FRONTEND_PROD_URL
      : process.env.NODE_ENV === 'staging'
      ? process.env.FRONTEND_STAGING_URL
      : process.env.FRONTEND_DEV_URL;

  try {
    // Retrieve the email from the request body or wherever you expect it to come from
    const { email } = req.params;

    // Find the patient by email
    const patient = await PatientModel.findOne({ email });

    // If patient doesn't exist or is already verified, return an error
    if (!patient || patient.account.verified) {
      res
        .status(400)
        .json({ message: 'Patient not found or already verified' });
    }

    if (patient) {
      // Regenerate the verification token
      const nanoid = customAlphabet('1234567890abcdef', 32); // Use customAlphabet to generate a random string
      const verificationToken = nanoid();
      logger.info(`Current patient: ${JSON.stringify(patient)}`);
      patient.account.verificationToken = verificationToken;
      logger.info(`New verification token issued: ${verificationToken}`);

      // Save the patient with the new verification token
      await patient.save();

      // Call the mail controller method to send the verification email
      await patientVerificationEmail(patient, verificationToken);

      res.status(200).json({ message: 'Verification email sent' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const approvePatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const patientId = req.params.id;
    const patientData: IPatient = req.body;

    const updatedPatient = await PatientModel.findByIdAndUpdate(
      patientId,
      {
        'account.approvalStatus': patientData.account.approvalStatus,
        'account.rejectionReason': patientData.account.rejectionReason,
      },
      { new: true }
    );

    if (!updatedPatient) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }

    // Send mail based on approval status
    if (patientData.account.approvalStatus === 'approved') {
      // Send approval email
      logger.info('Sending approval email');
      patientIDApprovedEmail(updatedPatient);
    } else if (patientData.account.approvalStatus === 'rejected') {
      // Change activation step to 0
      updatedPatient.account.activationStep = 0;
      await updatedPatient.save();

      // Send rejection email
      logger.info('Sending rejection email');
      patientIDRejectedEmail(updatedPatient);
    }

    res.status(200).json(updatedPatient);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ error: JSON.stringify(error) });
  }
};

const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    // Find the patient by email
    const patient = await PatientModel.findOne({
      email,
    });

    if (!patient) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }

    // Regenerate the password reset token
    const nanoid = customAlphabet('1234567890abcdef', 32); // Use customAlphabet to generate a random string
    const passwordResetToken = nanoid();
    patient.account.passwordResetToken = passwordResetToken;
    logger.info(`New password reset token issued: ${passwordResetToken}`);

    // Save the patient with the new password reset token
    await patient.save();

    // Call the mail controller method to send the password reset email
    await patientPasswordResetEmail(patient, passwordResetToken);

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { passwordResetToken, newPassword } = req.body;

    console.log('Password Reset Token: ', passwordResetToken);
    console.log('New Password: ', newPassword);

    // Validate the password reset token and new password
    if (!passwordResetToken || !newPassword) {
      res
        .status(400)
        .json({ error: 'Password reset token and new password are required' });
      return;
    }

    // Find the patient by passwordToken
    const patient = await PatientModel.findOne({
      'account.passwordResetToken': passwordResetToken,
    });

    // Check if the patient exists
    if (!patient) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }
    logger.info(`Patient: ${JSON.stringify(patient)}`);

    // Update the password
    patient.password = newPassword;

    // Clear the password reset token
    patient.account.passwordResetToken = '';

    // Save the patient with the new password
    await patient.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error: any) {
    console.error(error.message);
    logger.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export {
  createPatient,
  getAllPatients,
  getActivePatients,
  getBlockedPatients,
  getDeletedPatients,
  getPatientById,
  getPatientByEmail,
  updatePatientById,
  updatePatientByEmail,
  deletePatientById,
  deletePatientByEmail,
  reactivatePatientByEmail,
  blockPatientByEmail,
  patientExistsByEmail,
  resendVerificationEmail,
  approvePatient,
  forgotPassword,
  resetPassword,
};
