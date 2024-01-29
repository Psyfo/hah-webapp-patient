import express, { Request, Response, Router } from 'express';
import { Error } from 'mongoose';
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
} from './patient.controller';

// router for express
const patientRouter: Router = express.Router();

// Create a new patient
patientRouter.post('/', LoggerMiddleware.reqLog, createPatient);

// Get all patients
patientRouter.get('/', LoggerMiddleware.reqLog, getAllPatients);

// Get a specific patient by ID
patientRouter.get('/:id', LoggerMiddleware.reqLog, getPatientById);

// Update a patient by ID
patientRouter.put('/:id', LoggerMiddleware.reqLog, updatePatientById);

// Delete a patient by ID
patientRouter.delete('/:id', LoggerMiddleware.reqLog, deletePatientById);

// Create a new patient with dummy data
patientRouter.get(
  '/patient/addDummy',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const dummyPatientData = {
        id: '5',
        date: new Date('2024-01-29T12:00:00Z'),
        firstName: 'Eva',
        lastName: 'White',
        gender: 'Female',
        dob: new Date('1987-12-05T00:00:00Z'),
        pic: 'https://example.com/evawhite.jpg',
        email: 'eva.white@example.com',
        phoneNumber: '+1122334455',
        userName: 'evaw',
        password: 'evapass',
        associatedAccountId: 'account111',
        associatedAccountRelationship: 'Sister',
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
