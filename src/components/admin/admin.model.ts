import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { IAdmin, IAdminAccount } from './admin.interface';

const AdminAccountSchema = new mongoose.Schema<IAdminAccount>(
  {
    firstVerificationEmailSent: { type: Boolean, default: false },
    verificationToken: { type: String, default: '' },
    verified: { type: Boolean, default: false },
    accountStatus: {
      type: String,
      enum: ['active', 'blocked', 'deleted'],
      default: 'active',
    },
    role: { type: String, default: 'admin' },
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
    console.log('Password not modified');
    return next();
  }

  console.log('Password modified');
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(admin.password, salt);

  admin.password = hashedPassword;

  next();
});

const AdminModel = mongoose.model<IAdmin>('Admin', AdminSchema);

export { AdminModel };
