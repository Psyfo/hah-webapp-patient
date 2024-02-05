import { Document } from 'mongoose';

interface IPatient extends Document {
  date: Date;
  firstName: string;
  lastName: string;
  gender: string;
  dob: Date;
  pic: string;
  email: string;
  verified: boolean;
  phoneNumber: string;
  username: string;
  password: string;
  associatedAccountId: string;
  associatedAccountRelationship: string;
  deleted: boolean;
}

export { IPatient };
