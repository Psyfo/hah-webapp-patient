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

// Upload patient ID
uploadRouter.post('/patient-id', upload.single('file'), uploadPatientID);

// Upload practitioner ID
uploadRouter.post(
  '/practitioner-id',
  upload.single('file'),
  uploadPractitionerID
);

// Upload patient avatar
uploadRouter.post(
  '/patient-avatar',
  upload.single('file'),
  uploadPatientAvatar
);

// Upload practitioner avatar
uploadRouter.post(
  '/practitioner-avatar',
  upload.single('file'),
  uploadPractitionerAvatar
);

// Upload admin avatar
uploadRouter.post('/admin-avatar', upload.single('file'), uploadAdminAvatar);

// Upload practitioner qualification
uploadRouter.post(
  '/practitioner-qualification',
  upload.single('file'),
  uploadAdminAvatar
);

export { uploadRouter };
