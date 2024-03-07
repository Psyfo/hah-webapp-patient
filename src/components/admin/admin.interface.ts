import { Document } from 'mongoose';

interface IAdminAccount extends Document {
  firstVerificationEmailSent: boolean;
  verificationToken?: string;
  verified: boolean;
  deleted: boolean;
}

interface IAdmin extends Document {
  email: string;
  password: string;
  dob: Date;
  imgUrl: string;
  account: IAdminAccount;
}

export { IAdmin, IAdminAccount };
