import { Request, Response } from 'express';
import { logger } from '../../config/logger.config';
import { IPatient } from './patient.interface';
import { PatientModel } from './patient.model';

// Create a new patient
const createPatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const newPatientData: IPatient = req.body;
    const newPatient = new PatientModel(newPatientData);
    const savedPatient = await newPatient.save();
    res.status(201).json(savedPatient);
  } catch (error) {
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

export {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatientById,
  deletePatientById,
};
