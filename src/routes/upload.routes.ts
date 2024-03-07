import { Router } from 'express';
import { uploadPatientID } from './upload.controller';

const uploadRouter = Router();

uploadRouter.get('/patient-id', uploadPatientID);

export { uploadRouter };
