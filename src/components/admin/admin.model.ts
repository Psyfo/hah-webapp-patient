import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { logger } from '../../config/logger.config';
import { IAdmin, IAdminAccount } from './admin.interface';

const AdminAccountSchema = new mongoose.Schema<IAdminAccount>(
  {
    firstVerificationEmailSent: { type: Boolean, default: false },
    verificationToken: { type: String, default: '' },
    verified: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const AdminSchema = new mongoose.Schema<IAdmin>(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    imgUrl: { type: String },
    account: { type: AdminAccountSchema, default: {} },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Hash password before saving to database
AdminSchema.pre('save', async function (next) {
  const admin = this;

  if (!admin.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(admin.password, salt);

  admin.password = hashedPassword;

  next();
});

const AdminModel = mongoose.model<IAdmin>('Admin', AdminSchema);

export { AdminModel };