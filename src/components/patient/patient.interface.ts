import { Document } from 'mongoose';

interface IPatient extends Document {
  date: Date;
  firstName: string;
  lastName: string;
  gender: string;
  dob: Date;
  pic: string;
  email: string;
  phoneNumber: string;
  userName: string;
  password: string;
  associatedAccountId: string;
  associatedAccountRelationship: string;
  deleted: boolean;
}

export { IPatient };
