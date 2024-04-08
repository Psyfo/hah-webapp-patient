import admin from "firebase-admin";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../../config/logger.config";
import { AdminModel } from "../admin/admin.model";
import { patientIDUploadEmail } from "../mail/mail.controller";
import { PatientModel } from "../patient/patient.model";
import { PractitionerModel } from "../practitioner/practitioner.model";

// Initialize Firebase Admin SDK
const serviceAccountKeyPath =
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH ||
  'src/config/serviceAccountKey.json';
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKeyPath),
  storageBucket: 'gs://webapp-90a63.appspot.com',
});

const uploadPatientID = async (req: Request, res: Response) => {
  logger.info('Uploading patient ID');

  try {
    const { email } = req?.body;
    console.log('Email:', email);
    const file = req.file;
    console.log('File:', file?.originalname);

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const bucket = admin.storage().bucket(); // Get a reference to the bucket

    // Generate a unique filename for the document
    const filename = `${uuidv4()}-${file?.originalname}`; // Use UUID to avoid filename conflicts
    console.log('Filename:', filename);

    // Specify the destination folder (patient-id in this case)
    const destination = `patient-id/${filename}`;
    console.log('Destination:', destination);

    // Upload the document to Firebase Storage
    await bucket.file(destination).save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
      public: true, // Make the document publicly accessible
    });

    // Construct the public URL for accessing the uploaded document
    const fileUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;
    console.log('File URL:', fileUrl);

    // Update the patient model with the URL of the uploaded image
    const patient = await PatientModel.findOneAndUpdate(
      { email: email },
      { $set: { idUrl: fileUrl } },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Send email to patient
    await patientIDUploadEmail(patient);

    // Respond with the URL of the uploaded document
    res.status(200).json({ url: fileUrl });
  } catch (error: any) {
    console.error('Error uploading document:', error.message);
    res.status(500).json({ error: error.message });
  }
};

const uploadPractitionerID = async (req: Request, res: Response) => {
  logger.info('Uploading practitioner ID');

  try {
    const { email } = req?.body;
    console.log('Email:', email);
    const file = req.file;
    console.log('File:', file?.originalname);

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const bucket = admin.storage().bucket(); // Get a reference to the bucket

    // Generate a unique filename for the document
    const filename = `${uuidv4()}-${file?.originalname}`; // Use UUID to avoid filename conflicts
    console.log('Filename:', filename);

    // Specify the destination folder (practitioner-id in this case)
    const destination = `practitioner-id/${filename}`;
    console.log('Destination:', destination);

    // Upload the document to Firebase Storage
    await bucket.file(destination).save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
      public: true, // Make the document publicly accessible
    });

    // Construct the public URL for accessing the uploaded document
    const fileUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;
    console.log('File URL:', fileUrl);

    // Update the practitioner model with the URL of the uploaded image
    const practitioner = await PractitionerModel.findOneAndUpdate(
      { email: email },
      { $set: { idUrl: fileUrl } },
      { new: true }
    );

    if (!practitioner) {
      return res.status(404).json({ error: 'Practitioner not found' });
    }

    // Send email to practitioner
    await patientIDUploadEmail(practitioner);

    // Respond with the URL of the uploaded document
    res.status(200).json({ url: fileUrl });
  } catch (error: any) {
    console.error('Error uploading document:', error.message);
    res.status(500).json({ error: error.message });
  }
};

const uploadPatientAvatar = async (req: Request, res: Response) => {
  logger.info('Uploading patient avatar');

  try {
    const { email } = req?.body;
    console.log('Email:', email);
    const file = req.file;
    console.log('File:', file?.originalname);

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const bucket = admin.storage().bucket(); // Get a reference to the bucket

    // Generate a unique filename for the avatar
    const filename = `${uuidv4()}-${file?.originalname}`; // Use UUID to avoid filename conflicts
    console.log('Filename:', filename);

    // Specify the destination folder (avatars in this case)
    const destination = `patient-avatar/${filename}`;
    console.log('Destination:', destination);

    // Upload the avatar to Firebase Storage
    await bucket.file(destination).save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
      public: true, // Make the avatar publicly accessible
    });

    // Construct the public URL for accessing the uploaded avatar
    const fileUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;
    console.log('File URL:', fileUrl);

    // Update the patient model with the URL of the uploaded avatar
    const patient = await PatientModel.findOneAndUpdate(
      { email: email },
      { $set: { avatarUrl: fileUrl } },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Respond with the URL of the uploaded avatar
    res.status(200).json({ url: fileUrl });
  } catch (error: any) {
    console.error('Error uploading avatar:', error.message);
    res.status(500).json({ error: error.message });
  }
};

const uploadPractitionerAvatar = async (req: Request, res: Response) => {
  logger.info('Uploading practitioner avatar');

  try {
    const { email } = req?.body;
    console.log('Email:', email);
    const file = req.file;
    console.log('File:', file?.originalname);

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const bucket = admin.storage().bucket(); // Get a reference to the bucket

    // Generate a unique filename for the avatar
    const filename = `${uuidv4()}-${file?.originalname}`; // Use UUID to avoid filename conflicts
    console.log('Filename:', filename);

    // Specify the destination folder (avatars in this case)
    const destination = `practitioner-avatar/${filename}`;
    console.log('Destination:', destination);

    // Upload the avatar to Firebase Storage
    await bucket.file(destination).save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
      public: true, // Make the avatar publicly accessible
    });

    // Construct the public URL for accessing the uploaded avatar
    const fileUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;
    console.log('File URL:', fileUrl);

    // Update the practitioner model with the URL of the uploaded avatar
    const practitioner = await PractitionerModel.findOneAndUpdate(
      { email: email },
      { $set: { avatarUrl: fileUrl } },
      { new: true }
    );

    if (!practitioner) {
      return res.status(404).json({ error: 'Practitioner not found' });
    }

    // Respond with the URL of the uploaded avatar
    res.status(200).json({ url: fileUrl });
  } catch (error: any) {
    console.error('Error uploading avatar:', error.message);
    res.status(500).json({ error: error.message });
  }
};

const uploadAdminAvatar = async (req: Request, res: Response) => {
  logger.info('Uploading admin avatar');

  try {
    const { email } = req?.body;
    console.log('Email:', email);
    const file = req.file;
    console.log('File:', file?.originalname);

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const bucket = admin.storage().bucket(); // Get a reference to the bucket

    // Generate a unique filename for the avatar
    const filename: string = `${uuidv4()}-${file?.originalname}`; // Use UUID to avoid filename conflicts
    console.log('Filename:', filename);

    // Specify the destination folder (avatars in this case)
    const destination = `admin-avatar/${filename}`;
    console.log('Destination:', destination);

    // Upload the avatar to Firebase Storage
    await bucket.file(destination).save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
      public: true, // Make the avatar publicly accessible
    });

    // Construct the public URL for accessing the uploaded avatar
    const fileUrl: string = `https://storage.googleapis.com/${bucket.name}/${destination}`;
    console.log('File URL:', fileUrl);

    // Update the admin model with the URL of the uploaded avatar
    const administrator = await AdminModel.findOneAndUpdate(
      { email: email },
      { $set: { avatarUrl: fileUrl } },
      { new: true }
    );

    if (!administrator) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Respond with the URL of the uploaded avatar
    res.status(200).json({ url: fileUrl });
  } catch (error: any) {
    console.error('Error uploading avatar:', error.message);
    res.status(500).json({ error: error.message });
  }
};

const uploadPractitionerQualification = async (req: Request, res: Response) => {
  logger.info('Uploading practitioner qualification');

  try {
    const { email } = req?.body;
    console.log('Email:', email);
    const file = req.file;
    console.log('File:', file?.originalname);

    // Check if a file was uploaded
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const bucket = admin.storage().bucket(); // Get a reference to the bucket

    // Generate a unique filename for the qualification
    const filename = `${uuidv4()}-${file?.originalname}`; // Use UUID to avoid filename conflicts
    console.log('Filename:', filename);

    // Specify the destination folder (qualifications in this case)
    const destination = `practitioner-qualification/${filename}`;
    console.log('Destination:', destination);

    // Upload the qualification to Firebase Storage
    await bucket.file(destination).save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
      public: true, // Make the qualification publicly accessible
    });

    // Construct the public URL for accessing the uploaded qualification
    const fileUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;
    console.log('File URL:', fileUrl);

    // Update the practitioner model with the URL of the uploaded qualification
    const practitioner = await PractitionerModel.findOneAndUpdate(
      { email: email },
      { $set: { qualificationUrl: fileUrl } },
      { new: true }
    );

    // Check if the practitioner exists
    if (!practitioner) {
      return res.status(404).json({ error: 'Practitioner not found' });
    }

    // Respond with the URL of the uploaded qualification
    res.status(200).json({ url: fileUrl });
  } catch (error: any) {
    console.error('Error uploading qualification:', error.message);
    res.status(500).json({ error: error.message });
  }
};

export {
  uploadPatientID,
  uploadPractitionerID,
  uploadPatientAvatar,
  uploadPractitionerAvatar,
  uploadAdminAvatar,
  uploadPractitionerQualification,
};
