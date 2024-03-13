import express, { Request, Response, Router } from "express";
import { LoggerMiddleware } from "../../middleware/logger.middleware";

import {
  createPractitioner,
  getAllPractitioners,
  getPractitionerById,
  updatePractitionerById,
  deletePractitionerById,
  practitionerExistsByEmail,
  getPractitionerByEmail,
  resendVerificationEmail,
} from './practitioner.controller';

// router for express
const practitionerRouter: Router = express.Router();

// Create a new practitioner
practitionerRouter.post('/', LoggerMiddleware.reqLog, createPractitioner);

// Get all practitioners
practitionerRouter.get('/', LoggerMiddleware.reqLog, getAllPractitioners);

// Get all active practitioners
practitionerRouter.get('/active', LoggerMiddleware.reqLog, getAllPractitioners);

// Get all blocked practitioners
practitionerRouter.get(
  '/blocked',
  LoggerMiddleware.reqLog,
  getAllPractitioners
);

// Get all deleted practitioners
practitionerRouter.get(
  '/deleted',
  LoggerMiddleware.reqLog,
  getAllPractitioners
);

// Get a specific practitioner by ID
practitionerRouter.get('/:id', LoggerMiddleware.reqLog, getPractitionerById);

// Get a specific practitioner by email
practitionerRouter.get(
  '/email/:email',
  LoggerMiddleware.reqLog,
  getPractitionerByEmail
);

// Update a practitioner by ID
practitionerRouter.patch(
  '/:id',
  LoggerMiddleware.reqLog,
  updatePractitionerById
);

// Update a practitioner by email
practitionerRouter.patch(
  '/email/:email',
  LoggerMiddleware.reqLog,
  updatePractitionerById
);

// Delete a practitioner by ID
practitionerRouter.delete(
  '/:id',
  LoggerMiddleware.reqLog,
  deletePractitionerById
);

// Delete a practitioner by email
practitionerRouter.delete(
  '/email/:email',
  LoggerMiddleware.reqLog,
  deletePractitionerById
);

// Reactivate a practitioner by email
practitionerRouter.patch(
  '/reactivate/:email',
  LoggerMiddleware.reqLog,
  updatePractitionerById
);

// Block a practitioner by email
practitionerRouter.patch(
  '/block/:email',
  LoggerMiddleware.reqLog,
  updatePractitionerById
);

// Check if practitioner exists by email
practitionerRouter.get(
  '/exists/:email',
  LoggerMiddleware.reqLog,
  practitionerExistsByEmail
);

// Resend verification email
practitionerRouter.get(
  '/resend-verification/:email',
  LoggerMiddleware.reqLog,
  resendVerificationEmail
);

export { practitionerRouter };
