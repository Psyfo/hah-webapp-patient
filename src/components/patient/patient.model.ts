import bcrypt from "bcrypt";
import mongoose, { Schema, model } from "mongoose";
import nodemailer from "nodemailer";
import { customAlphabet } from 'nanoid';
import { IPatient } from './patient.interface';

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
    verificationToken: { type: String },
    country: { type: String, default: 'ZW' },
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

  // Generate verification token
  const nanoid = customAlphabet('1234567890abcdef', 32); // Use customAlphabet to generate a random string
  const verificationToken = nanoid();
  patient.verificationToken = verificationToken;

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
    subject: 'Health at Home Email Verification',
    html: `    
    <h1>Health at Home Email Verification</h1>
    <h2>Click the link to verify your email</h2>
        
    <p>Hello!</p>
    <p>You've just signed up for a Health at Home account with this email.</p>
    <p>Click this link to verify your email and continue with registering.</p>
        
    <a href="http://hah-webapp-client.vercel.app/verify/${doc.verificationToken}">Verify</a>
        
    <p>Having trouble? Copy and paste this link into your browser:</p>
    <p>"http://hah-webapp-client.vercel.app/verify/${doc.verificationToken}"</p>
        
    <p>Need help?</p>
    <p>FAQ: <a href="http://hah-webapp-client.vercel.app/faq">https://help.healthathome.co.zw/en/</a></p>
    <p>Email: <a href="mailto:hello@healthathome.co.zw">hello@healthathome.co.zw</a></p>
    <p>Phone: +263 780 147 562</p>
    <p>Working hours: Monday - Friday, 9:00am - 5:00pm</p>
    `,
  };

  transport.sendMail(mailOptions, (error: any, info: any) => {
    if (error) {
      return console.log(error);
    }
    console.log('Successfully sent');
  });
});

const PatientModel = model<IPatient>('Patient', patientSchema);

export { PatientModel };
