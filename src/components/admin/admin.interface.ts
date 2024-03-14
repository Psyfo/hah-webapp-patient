import { Document } from "mongoose";

interface IAdminAccount extends Document {
  firstVerificationEmailSent: boolean;
  verificationToken?: string;
  verified: boolean;
  accountStatus: string;
  role: string;
}

interface IAdmin extends Document {
  id: string;
  email: string;
  password: string;
  dob: Date;
  avatarUrl: string;
  account: IAdminAccount;
}

export { IAdmin, IAdminAccount };
