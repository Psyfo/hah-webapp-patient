import mongoose, { Schema, model } from 'mongoose';
import { IPatient } from './patient.interface';

const patientSchema = new Schema<IPatient>({
  date: { type: Date, default: Date.now },
  firstName: { type: String },
  lastName: { type: String },
  gender: { type: String },
  dob: { type: Date },
  pic: { type: String },
  email: { type: String },
  phoneNumber: { type: String },
  userName: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  associatedAccountId: { type: String },
  associatedAccountRelationship: { type: String },
  deleted: { type: Boolean, default: false },
});

const PatientModel = model<IPatient>('Patient', patientSchema);

export { PatientModel };
