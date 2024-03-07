import express, { Request, Response, Router } from 'express';
import { Error } from 'mongoose';
import { authenticateToken } from '../../config/auth.middleware';
import { logger } from '../../config/logger.config';
import { LoggerMiddleware } from '../../middleware/logger.middleware';
import { IPatient } from './patient.interface';
import { PatientModel } from './patient.model';

import {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatientById,
  deletePatientById,
  patientExistsByEmail,
  getPatientByEmail,
  resendVerificationEmail,
} from './patient.controller';

// router for express
const patientRouter: Router = express.Router();

// Create a new patient
patientRouter.post('/', createPatient);

// Get all patients
patientRouter.get('/', LoggerMiddleware.reqLog, getAllPatients);

// Get a specific patient by ID
patientRouter.get('/:id', LoggerMiddleware.reqLog, getPatientById);

// Get a specific patient by email
patientRouter.get('/email/:email', LoggerMiddleware.reqLog, getPatientByEmail);

// Update a patient by ID
patientRouter.patch('/:id', LoggerMiddleware.reqLog, updatePatientById);

// Delete a patient by ID
patientRouter.delete('/:id', LoggerMiddleware.reqLog, deletePatientById);

// Check if patient exists by email
patientRouter.get(
  '/exists/:email',
  LoggerMiddleware.reqLog,
  patientExistsByEmail
);

// Resend verification email
patientRouter.get('/resend-verification/:email', resendVerificationEmail);

// Create a new patient with dummy data
patientRouter.get(
  '/patient/addDummy',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const dummyPatientData = {
        id: '6',
        date: new Date('2024-02-05T10:30:00Z'),
        firstName: 'John',
        lastName: 'Doe',
        gender: 'Male',
        dob: new Date('1990-06-15T00:00:00Z'),
        pic: 'https://example.com/johndoe.jpg',
        email: 'john.doe@example.com',
        phoneNumber: '+1234567890',
        userName: 'johnd',
        password: 'johnpass',
        associatedAccountId: 'account222',
        associatedAccountRelationship: 'Friend',
        deleted: false,
      };
      // Create a new patient using the PatientModel
      const newPatient = new PatientModel(dummyPatientData);
      //const savedPatient = await newPatient.save();
      await newPatient.save();

      // Respond with the newly created patient
      res.status(201).json(newPatient);
    } catch (error: any) {
      logger.error(JSON.stringify(error));

      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

export { patientRouter };
