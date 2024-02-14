import { Request, Response } from 'express';
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

export {
  createPatient,
  getAllPatients,
  getPatientById,
  getPatientByEmail,
  updatePatientById,
  deletePatientById,
  patientExistsByEmail,
};
