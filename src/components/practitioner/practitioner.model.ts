import bcrypt from "bcrypt";
import mongoose, { Schema, model } from "mongoose";
import nodemailer from "nodemailer";
import { customAlphabet } from "nanoid";
import { logger } from "../../config/logger.config";
import { IPractitioner, IPractitionerAccount } from "./practitioner.interface";

const PractitionerAccountSchema = new Schema<IPractitionerAccount>(
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

const PractitionerSchema = new Schema<IPractitioner>(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    idNumber: { type: String, unique: true },
    dob: { type: Date, default: Date.now },
    idUrl: { type: String },
    avatarUrl: { type: String },
    phoneNumber: { type: String },
    account: { type: PractitionerAccountSchema, default: {} },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Hash password before saving to database
PractitionerSchema.pre<IPractitioner>('save', async function (next) {
  const Practitioner = this;

  if (!Practitioner.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(Practitioner.password, salt);

  Practitioner.password = hashedPassword;

  // Generate verification token
  const nanoid = customAlphabet('1234567890abcdef', 32); // Use customAlphabet to generate a random string
  const verificationToken = nanoid();
  Practitioner.account.verificationToken = verificationToken;

  next();
});

// Define post save middleware to trigger webhook after Practitioner creation
PractitionerSchema.post<IPractitioner>('save', async function (doc) {
  const frontEndUrl: string | undefined =
    process.env.NODE_ENV === 'production'
      ? process.env.FRONTEND_PROD_URL
      : process.env.FRONTEND_DEV_URL;

  if (doc.account.firstVerificationEmailSent) {
    return;
  }

  logger.info('Sending verification email');
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
        <p>You've just signed up for a Health at Home Practitioner account with this email.</p>
        <p>Click this link to verify your email and continue with registering.</p>
            
        <a href="${frontEndUrl}/verify-practitioner/${doc.account.verificationToken}">Verify</a>
            
        <p>Having trouble? Copy and paste this link into your browser:</p>
        <p>"${frontEndUrl}/verify-practitioner/${doc.account.verificationToken}"</p>
            
        <p>Need help?</p>
        <p>FAQ: <a href="${frontEndUrl}/faq">${frontEndUrl}/faq</a></p>
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

  // Set firstVerificationEmailSent to true
  doc.account.firstVerificationEmailSent = true;
  doc.save();
});

const PractitionerModel = model<IPractitioner>('Practitioner', PractitionerSchema);

export { PractitionerModel };
