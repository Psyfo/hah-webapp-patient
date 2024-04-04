import { Document } from "mongoose";

interface IPractitionerAccount extends Document {
  firstVerificationEmailSent: boolean;
  verificationToken?: string;
  verified: boolean;
  passwordResetToken?: string;
  activationStep: number;
  approvalStatus: string;
  rejectionReason: string;
  country: string;
  accountStatus: string;
  role: string;
}

interface IPractitioner extends Document {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  idNumber: string;
  medicalLicenseNumber: string;
  dob: Date;
  idUrl: string;
  avatarUrl: string;
  phoneNumber: string;
  account: IPractitionerAccount;
}


export { IPractitioner, IPractitionerAccount };
