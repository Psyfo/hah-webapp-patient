import multer from 'multer';
import { Router } from 'express';
import { LoggerMiddleware } from '../../middleware/logger.middleware';

import {
  uploadPatientID,
  uploadPractitionerID,
  uploadPatientAvatar,
  uploadPractitionerAvatar,
  uploadAdminAvatar,
} from './upload.controller';

const uploadRouter = Router();

const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

uploadRouter.post('/patient-id', upload.single('file'), uploadPatientID);
uploadRouter.post(
  '/practitioner-id',
  upload.single('file'),
  uploadPractitionerID
);
uploadRouter.post(
  '/patient-avatar',
  upload.single('file'),
  uploadPatientAvatar
);
uploadRouter.post(
  '/practitioner-avatar',
  upload.single('file'),
  uploadPractitionerAvatar
);
uploadRouter.post('/admin-avatar', upload.single('file'), uploadAdminAvatar);

export { uploadRouter };
