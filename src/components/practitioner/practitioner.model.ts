import bcrypt from "bcrypt";
import mongoose, { Schema, model } from "mongoose";
import nodemailer from "nodemailer";
import { customAlphabet } from "nanoid";
import { logger } from "../../config/logger.config";
import { practitionerVerificationEmail } from "../mail/mail.controller";
import { IPractitioner, IPractitionerAccount } from "./practitioner.interface";

const practitionerAccountSchema = new Schema<IPractitionerAccount>(
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
    role: { type: String, default: 'Practitioner' },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const practitionerSchema = new Schema<IPractitioner>(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    idNumber: { type: String, unique: true },
    medicalLicenseNumber: { type: String, unique: true },
    dob: { type: Date, default: Date.now },
    idUrl: { type: String },
    avatarUrl: { type: String },
    qualificationUrl: { type: String },
    phoneNumber: { type: String },
    account: { type: practitionerAccountSchema, default: {} },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Define PRE save middleware to hash the password before saving
practitionerSchema.pre<IPractitioner>('save', async function (next) {
  const practitioner = this;

  if (!practitioner.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(practitioner.password, salt);

  practitioner.password = hashedPassword;

  // Generate verification token
  const nanoid = customAlphabet('1234567890abcdef', 32); // Use customAlphabet to generate a random string
  const verificationToken = nanoid();
  practitioner.account.verificationToken = verificationToken;

  next();
});

// Define post save middleware to trigger webhook after Practitioner creation
practitionerSchema.post<IPractitioner>('save', async function (doc) {
  if (doc.account.firstVerificationEmailSent) {
    return;
  }

  // Save the doc with the new verification token
  await doc.save();

  // Call the mail controller method to send the verification email
  await practitionerVerificationEmail(doc, doc.account.verificationToken);

  // Set firstVerificationEmailSent to true
  doc.account.firstVerificationEmailSent = true;
  await doc.save();
});

const PractitionerModel = model<IPractitioner>(
  'Practitioner',
  practitionerSchema
);

export { PractitionerModel };
