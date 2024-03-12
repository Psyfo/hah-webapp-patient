import { Document } from "mongoose";

interface IPatientAccount extends Document {
  firstVerificationEmailSent: boolean;
  verificationToken?: string;
  verified: boolean;
  activationStep: number;
  approvalStatus: string;
  country: string;
  deleted: boolean;
  active: string;
  role: string;
}

interface IPatient extends Document {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dob: Date;
  imgUrl: string;
  phoneNumber: string;
  account: IPatientAccount;
}


export { IPatient, IPatientAccount };
