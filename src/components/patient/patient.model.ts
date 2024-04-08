import bcrypt from "bcrypt";
import { Schema, model } from 'mongoose';
import { customAlphabet } from 'nanoid';
import { logger } from '../../config/logger.config';
import { patientVerificationEmail } from '../mail/mail.controller';
import { IPatient, IPatientAccount } from './patient.interface';

const patientAccountSchema = new Schema<IPatientAccount>(
  {
    verified: { type: Boolean, default: false },
    verificationToken: { type: String, default: '' },
    firstVerificationEmailSent: { type: Boolean, default: false },
    passwordResetToken: { type: String, default: '' },
    activationStep: { type: Number, default: 0 },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    rejectionReason: { type: String, default: '' },
    country: { type: String, default: 'ZW' },
    accountStatus: {
      type: String,
      enum: ['active', 'blocked', 'deleted'],
      default: 'active',
    },
    role: { type: String, default: 'patient' },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const patientSchema = new Schema<IPatient>(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    idNumber: { type: String, unique: true },
    dob: { type: Date, default: new Date() },
    idUrl: { type: String },
    avatarUrl: { type: String },
    phoneNumber: { type: String },
    account: { type: patientAccountSchema, default: {} },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Define PRE save middleware to hash the password before saving
patientSchema.pre<IPatient>('save', async function (next) {
  const patient = this;

  if (!patient.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(patient.password, salt);

  patient.password = hashedPassword;

  // Generate verification token
  const nanoid = customAlphabet('1234567890abcdef', 32); // Use customAlphabet to generate a random string
  const verificationToken = nanoid();
  patient.account.verificationToken = verificationToken;

  next();
});

// Define POST save middleware to trigger webhook after patient creation
patientSchema.post<IPatient>('save', async function (doc) {
  if (doc.account.firstVerificationEmailSent) {
    return;
  }

  // Save the doc with the new verification token
  await doc.save();

  await patientVerificationEmail(doc, doc.account.verificationToken);

  // Set firstVerificationEmailSent to true
  doc.account.firstVerificationEmailSent = true;
  await doc.save();
});

const PatientModel = model<IPatient>('Patient', patientSchema);

export { PatientModel };
