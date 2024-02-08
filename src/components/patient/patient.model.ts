import bcrypt from "bcrypt";
import mongoose, { Schema, model } from "mongoose";
import nodemailer from "nodemailer";
import { IPatient } from "./patient.interface";

const patientSchema = new Schema<IPatient>(
  {
    date: { type: Date, default: Date.now },
    firstName: { type: String },
    lastName: { type: String },
    gender: { type: String },
    dob: { type: Date },
    pic: { type: String },
    email: { type: String, unique: true, required: true },
    verified: { type: Boolean, default: false },
    country: { type: String },
    phoneNumber: { type: String },
    username: { type: String },
    password: { type: String, required: true },
    associatedAccountId: { type: String },
    associatedAccountRelationship: { type: String },
    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

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

// Define post save middleware to trigger webhook after patient creation
patientSchema.post<IPatient>('save', async function (doc) {
  var transport = nodemailer.createTransport({
    host: 'smtp.zeptomail.eu',
    port: 587,
    auth: {
      user: 'emailapikey',
      pass: 'yA6KbHsI4w//kz0FSBE11sWP+tw1/axq3Sux5n3kfMF1e4S03KE/hkdpItvoITra3NfZ4f4FbYtCII24vtFeeZY0M9MDfJTGTuv4P2uV48xh8ciEYNYhhJ+gALkXFqZBeB0lDCozQvkiWA==',
    },
  });

  var mailOptions = {
    from: '"Hah Team" <noreply@healthathome.co.zw>',
    to: doc.email,
    subject: 'Test Email',
    html: 'Test email sent successfully.',
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Successfully sent');
  });
});

const PatientModel = model<IPatient>('Patient', patientSchema);

export { PatientModel };
