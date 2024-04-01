import express, { Request, Response, Router } from "express";
import { LoggerMiddleware } from "../../middleware/logger.middleware";

import {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatientById,
  deletePatientById,
  patientExistsByEmail,
  getPatientByEmail,
  resendVerificationEmail,
  approvePatient,
  forgotPassword,
  resetPassword,
} from './patient.controller';

// router for express
const patientRouter: Router = express.Router();

// Create a new patient
patientRouter.post('/', LoggerMiddleware.reqLog, createPatient);

// Get all patients
patientRouter.get('/', LoggerMiddleware.reqLog, getAllPatients);

// Get all active patients
patientRouter.get('/active', LoggerMiddleware.reqLog, getAllPatients);

// Get all blocked patients
patientRouter.get('/blocked', LoggerMiddleware.reqLog, getAllPatients);

// Get all deleted patients
patientRouter.get('/deleted', LoggerMiddleware.reqLog, getAllPatients);

// Get a specific patient by ID
patientRouter.get('/:id', LoggerMiddleware.reqLog, getPatientById);

// Get a specific patient by email
patientRouter.get('/email/:email', LoggerMiddleware.reqLog, getPatientByEmail);

// Update a patient by ID
patientRouter.patch('/:id', LoggerMiddleware.reqLog, updatePatientById);

// Update a patient by email
patientRouter.patch(
  '/email/:email',
  LoggerMiddleware.reqLog,
  updatePatientById
);

// Delete a patient by ID
patientRouter.delete('/:id', LoggerMiddleware.reqLog, deletePatientById);

// Delete a patient by email
patientRouter.delete(
  '/email/:email',
  LoggerMiddleware.reqLog,
  deletePatientById
);

// Reactivate a patient by email
patientRouter.patch(
  '/reactivate/:email',
  LoggerMiddleware.reqLog,
  updatePatientById
);

// Block a patient by email
patientRouter.patch(
  '/block/:email',
  LoggerMiddleware.reqLog,
  updatePatientById
);

// Check if patient exists by email
patientRouter.get(
  '/exists/:email',
  LoggerMiddleware.reqLog,
  patientExistsByEmail
);

// Resend verification email
patientRouter.get(
  '/resend-verification/:email',
  LoggerMiddleware.reqLog,
  resendVerificationEmail
);

// Approve a patient
patientRouter.patch('/approve/:id', LoggerMiddleware.reqLog, approvePatient);

// Forgot password
patientRouter.post('/forgot-password', LoggerMiddleware.reqLog, forgotPassword);

// Reset password
patientRouter.post('/reset-password', LoggerMiddleware.reqLog, resetPassword);

export { patientRouter };
