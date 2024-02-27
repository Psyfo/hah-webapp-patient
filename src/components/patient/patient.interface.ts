import { Document } from "mongoose";

interface IPatient extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dob: Date;
  imgUrl: string;
  phoneNumber: string;
  account: IPatientAccount;
}

interface IPatientAccount extends Document {
  firstVerificationEmailSent: boolean;
  verificationToken?: string;
  verified: boolean;
  approvalStatus: string;
  country: string;
  deleted: boolean;
}

export { IPatient, IPatientAccount };
