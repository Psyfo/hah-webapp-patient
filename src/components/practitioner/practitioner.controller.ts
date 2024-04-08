import nodemailer from "nodemailer";
import { Request, Response } from "express";
import { customAlphabet } from "nanoid";
import { logger } from "../../config/logger.config";
import { IPractitioner } from './practitioner.interface';
import { PractitionerModel } from './practitioner.model';

import {
  practitionerPasswordResetEmail,
  practitionerVerificationEmail,
} from '../mail/mail.controller';

// Create a new practitioner
const createPractitioner = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Access authenticated practitioner information
    const authenticatedPractitioner = req.user;
    const newPractitionerData: IPractitioner = req.body;
    logger.info(`Req body: ${JSON.stringify(req.body)}`);
    const newPractitioner = new PractitionerModel(newPractitionerData);
    const savedPractitioner = await newPractitioner.save();
    res.status(201).json(savedPractitioner);
  } catch (error: any) {
    logger.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all practitioners
const getAllPractitioners = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const practitioners = await PractitionerModel.find();
    res.status(200).json(practitioners);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get active practitioners
const getActivePractitioners = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const practitioners = await PractitionerModel.find({
      'account.accountStatus': 'active',
    });
    res.status(200).json(practitioners);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get blocked practitioners
const getBlockedPractitioners = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const practitioners = await PractitionerModel.find({
      'account.accountStatus': 'blocked',
    });
    res.status(200).json(practitioners);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get deleted practitioners
const getDeletedPractitioners = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const practitioners = await PractitionerModel.find({
      'account.accountStatus': 'deleted',
    });
    res.status(200).json(practitioners);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get a specific practitioner by ID
const getPractitionerById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const practitionerId = req.params.id;
    const practitioner = await PractitionerModel.findById(practitionerId);
    if (!practitioner) {
      res.status(404).json({ error: 'Practitioner not found' });
      return;
    }
    res.status(200).json(practitioner);
  } catch (error: any) {
    logger.error(JSON.stringify(error.message));
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get a specific practitioner by Email
const getPractitionerByEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const email = req.params.email;
    const practitioner = await PractitionerModel.findOne({
      email: email,
    });
    if (!practitioner) {
      res.status(404).json({ error: 'Practitioner not found' });
      return;
    }
    res.status(200).json(practitioner);
  } catch (error: any) {
    logger.error(JSON.stringify(error.message));
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a practitioner by ID
const updatePractitionerById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const practitionerId = req.params.id;
    const updatedPractitionerData: IPractitioner = req.body;

    logger.info(
      `Updated practitioner data: ${JSON.stringify(updatedPractitionerData)}`
    );

    const updatedPractitioner = await PractitionerModel.findByIdAndUpdate(
      practitionerId,
      updatedPractitionerData,
      { new: true }
    );

    if (!updatedPractitioner) {
      res.status(404).json({ error: 'Practitioner not found' });
      return;
    }

    res.status(200).json(updatedPractitioner);
  } catch (error: any) {
    res.status(500).json({ error: 'Internal Server Error' });
    logger.error(error.message);
  }
};

// Update a practitioner by Email
const updatePractitionerByEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const email = req.params.email;
    const updatedPractitionerData: IPractitioner = req.body;

    logger.info(
      `Updated practitioner data: ${JSON.stringify(updatedPractitionerData)}`
    );

    const updatedPractitioner = await PractitionerModel.findOneAndUpdate(
      { email: email },
      updatedPractitionerData,
      { new: true }
    );

    if (!updatedPractitioner) {
      res.status(404).json({ error: 'Practitioner not found' });
      return;
    }

    res.status(200).json(updatedPractitioner);
  } catch (error: any) {
    res.status(500).json({ error: 'Internal Server Error' });
    logger.error(error.message);
  }
};

// Delete a practitioner by ID
const deletePractitionerById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const practitionerId = req.params.id;
    const deletedPractitioner = await PractitionerModel.findByIdAndUpdate(
      practitionerId,
      { 'account.accountStatus': 'deleted' },
      { new: true }
    );
    if (!deletedPractitioner) {
      res.status(404).json({ error: 'Practitioner not found' });
      return;
    }
    res.status(204).json();
  } catch (error: any) {
    res.status(500).json({ error: JSON.stringify(error) });
  }
};

// Delete a practitioner by Email
const deletePractitionerByEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const email = req.params.email;
    const deletedPractitioner = await PractitionerModel.findOneAndUpdate(
      { email: email },
      { 'account.accountStatus': 'deleted' },
      { new: true }
    );
    if (!deletedPractitioner) {
      res.status(404).json({ error: 'Practitioner not found' });
      return;
    }
    res.status(204).json();
  } catch (error: any) {
    res.status(500).json({ error: JSON.stringify(error) });
  }
};

// Reactivate a practitioner by Email
const reactivatePractitionerByEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const email = req.params.email;
    const reactivatedPractitioner = await PractitionerModel.findByIdAndUpdate(
      email,
      { 'account.accountStatus': 'active' },
      { new: true }
    );
    if (!reactivatedPractitioner) {
      res.status(404).json({ error: 'Practitioner not found' });
      return;
    }
    res.status(200).json(reactivatedPractitioner);
  } catch (error: any) {
    res.status(500).json({ error: JSON.stringify(error) });
  }
};

// Block a practitioner by Email
const blockPractitionerByEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const email = req.params.email;
    const blockedPractitioner = await PractitionerModel.findByIdAndUpdate(
      email,
      { 'account.accountStatus': 'blocked' },
      { new: true }
    );
    if (!blockedPractitioner) {
      res.status(404).json({ error: 'Practitioner not found' });
      return;
    }
    res.status(200).json(blockedPractitioner);
  } catch (error: any) {
    res.status(500).json({ error: JSON.stringify(error) });
  }
};

// Check if a practitioner exists by email
const practitionerExistsByEmail = async (
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
    const user = await PractitionerModel.findOne({ email });

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

    // Find the practitioner by email
    const practitioner = await PractitionerModel.findOne({
      email,
    });

    // If practitioner doesn't exist or is already verified, return an error
    if (!practitioner || practitioner.account.verified) {
      console.log('Practitioner not found or already verified');
      res
        .status(400)
        .json({ message: 'Practitioner not found or already verified' });
    }

    if (practitioner) {
      // Regenerate the verification token
      const nanoid = customAlphabet('1234567890abcdef', 32); // Use customAlphabet to generate a random string
      const verificationToken = nanoid();
      practitioner.account.verificationToken = verificationToken;
      logger.info(`New verification token issued: ${verificationToken}`);

      // Save the practitioner with the new verification token
      await practitioner.save();

      // Call the mail controller method to send the verification email
      await practitionerVerificationEmail(practitioner, verificationToken);
    }

    res.status(200).json({ message: 'Verification email sent' });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

const approvePractitioner = async (
  req: Request,
  res: Response
): Promise<void> => {};

const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  console.log('Forgot password request received');

  try {
    const email = req.body.email;

    // Find the practitioner by email
    const practitioner = await PractitionerModel.findOne({ email });

    if (!practitioner) {
      res.status(404).json({ error: 'Practitioner not found' });
      return;
    }

    // Regenerate the password reset token
    const nanoid = customAlphabet('1234567890abcdef', 32); // Use customAlphabet to generate a random string
    const passwordResetToken = nanoid();
    logger.info(`Current practitioner: ${practitioner}`);
    practitioner.account.passwordResetToken = passwordResetToken;
    logger.info(`New password reset token issued: ${passwordResetToken}`);

    // Save the practitioner with the new password reset token
    await practitioner.save();

    // Call the mail controller method to send the password reset email
    await practitionerPasswordResetEmail(practitioner, passwordResetToken);

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { passwordResetToken, newPassword } = req.body;

    // Find the patient by passwordToken
    const practitioner = await PractitionerModel.findOne({
      'account.passwordResetToken': passwordResetToken,
    });

    // Check if the practitioner exists
    if (!practitioner) {
      res.status(404).json({ error: 'Practitioner not found' });
      return;
    }

    // Update the password
    practitioner.password = newPassword;

    // Clear the password reset token
    practitioner.account.passwordResetToken = '';

    // Save the practitioner with the new password
    await practitioner.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error: any) {
    console.error(error.message);
    logger.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export {
  createPractitioner,
  getAllPractitioners,
  getActivePractitioners,
  getBlockedPractitioners,
  getDeletedPractitioners,
  getPractitionerById,
  getPractitionerByEmail,
  updatePractitionerById,
  updatePractitionerByEmail,
  deletePractitionerById,
  deletePractitionerByEmail,
  reactivatePractitionerByEmail,
  blockPractitionerByEmail,
  practitionerExistsByEmail,
  resendVerificationEmail,
  approvePractitioner,
  forgotPassword,
  resetPassword,
};
