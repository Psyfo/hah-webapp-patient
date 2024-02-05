import bcrypt from 'bcrypt';
import mongoose, { Schema, model } from 'mongoose';
import { IPatient } from './patient.interface';

const patientSchema = new Schema<IPatient>({
  date: { type: Date, default: Date.now },
  firstName: { type: String },
  lastName: { type: String },
  gender: { type: String },
  dob: { type: Date },
  pic: { type: String },
  email: { type: String, unique: true, required: true },
  verified: { type: Boolean, default: false },
  phoneNumber: { type: String },
  username: { type: String },
  password: { type: String, required: true },
  associatedAccountId: { type: String },
  associatedAccountRelationship: { type: String },
  deleted: { type: Boolean, default: false },
});

// Hash password before saving to database
patientSchema.pre<IPatient>('save', async function (next) {
  const patient = this;

  if (!patient.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(patient.password, salt);

  patient.password = hashedPassword;
  next();
});

const PatientModel = model<IPatient>('Patient', patientSchema);

export { PatientModel };
