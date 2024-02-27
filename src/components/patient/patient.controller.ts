import nodemailer from 'nodemailer';
import { Request, Response } from 'express';
import { customAlphabet } from 'nanoid';
import { logger } from '../../config/logger.config';
import { IPatient } from './patient.interface';
import { PatientModel } from './patient.model';

// Create a new patient
const createPatient = async (req: Request, res: Response): Promise<void> => {
  try {
    // Access authenticated patient information
    const authenticatedPatient = req.user;
    const newPatientData: IPatient = req.body;
    logger.info(`Req body: ${req.body}`);
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
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a patient by ID
const deletePatientById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const patientId = req.params.id;
    const deletedPatient = await PatientModel.findByIdAndDelete(patientId);
    if (!deletedPatient) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
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
      patient.account.verificationToken = verificationToken;
      logger.info(`New verification token issued: ${verificationToken}`);

      // Save the patient with the new verification token
      await patient.save();

      // Reuse the email template and send verification email
      const transport = nodemailer.createTransport({
        host: 'smtp.zeptomail.eu',
        port: 587,
        auth: {
          user: 'emailapikey',
          pass: 'yA6KbHsI4w//kz0FSBE11sWP+tw1/axq3Sux5n3kfMF1e4S03KE/hkdpItvoITra3NfZ4f4FbYtCII24vtFeeZY0M9MDfJTGTuv4P2uV48xh8ciEYNYhhJ+gALkXFqZBeB0lDCozQvkiWA==',
        },
      });

      const mailOptions = {
        from: '"Hah Team" <noreply@healthathome.co.zw>',
        to: patient.email,
        subject: 'Health at Home Email Verification',
        html: `    
            <h1>Health at Home Email Verification</h1>
            <h2>Click the link to verify your email</h2>
                
            <p>Hello!</p>
            <p>You've just signed up for a Health at Home account with this email.</p>
            <p>Click this link to verify your email and continue with registering.</p>
                
            <a href="http://hah-webapp-client.vercel.app/verify/${patient.account.verificationToken}">Verify</a>
                
            <p>Having trouble? Copy and paste this link into your browser:</p>
            <p>"http://hah-webapp-client.vercel.app/verify/${patient.account.verificationToken}"</p>
                
            <p>Need help?</p>
            <p>FAQ: <a href="http://hah-webapp-client.vercel.app/faq">https://help.healthathome.co.zw/en/</a></p>
            <p>Email: <a href="mailto:hello@healthathome.co.zw">hello@healthathome.co.zw</a></p>
            <p>Phone: +263 780 147 562</p>
            <p>Working hours: Monday - Friday, 9:00am - 5:00pm</p>
            `,
      };

      // Send the email
      transport.sendMail(mailOptions, (error: any, info: any) => {
        if (error) {
          console.log(error);
          return res
            .status(500)
            .json({ message: 'Failed to send verification email' });
        }
        console.log('Successfully sent');
        return res
          .status(200)
          .json({ message: 'Verification email sent successfully' });
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export {
  createPatient,
  getAllPatients,
  getPatientById,
  getPatientByEmail,
  updatePatientById,
  deletePatientById,
  patientExistsByEmail,
  resendVerificationEmail,
};
