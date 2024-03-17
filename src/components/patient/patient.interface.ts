import { Document } from "mongoose";

interface IPatientAccount extends Document {
  firstVerificationEmailSent: boolean;
  verificationToken?: string;
  verified: boolean;
  activationStep: number;
  approvalStatus: string;
  country: string;
  accountStatus: string;
  role: string;
}

interface IPatient extends Document {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  idNumber: string;
  dob: Date;
  idUrl: string;
  avatarUrl: string;
  phoneNumber: string;
  account: IPatientAccount;
}


export { IPatient, IPatientAccount };
