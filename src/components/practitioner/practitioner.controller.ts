import nodemailer from "nodemailer";
import { Request, Response } from "express";
import { customAlphabet } from "nanoid";
import { logger } from "../../config/logger.config";
import { IPractitioner } from "./practitioner.interface";
import { PractitionerModel } from "./practitioner.model";

// Create a new practitioner
const createPractitioner = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Access authenticated practitioner information
    const authenticatedPractitioner = req.user;
    const newPractitionerData: IPractitioner = req.body;
    logger.info(`Req body: ${JSON.stringify(req.body)}`);
    const newPractitioner = new PractitionerModel(newPractitionerData);
    const savedPractitioner = await newPractitioner.save();
    res.status(201).json(savedPractitioner);
  } catch (error: any) {
    logger.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all practitioners
const getAllPractitioners = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const practitioners = await PractitionerModel.find();
    res.status(200).json(practitioners);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get active practitioners
const getActivePractitioners = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const practitioners = await PractitionerModel.find({
      'account.accountStatus': 'active',
    });
    res.status(200).json(practitioners);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get blocked practitioners
const getBlockedPractitioners = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const practitioners = await PractitionerModel.find({
      'account.accountStatus': 'blocked',
    });
    res.status(200).json(practitioners);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get deleted practitioners
const getDeletedPractitioners = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const practitioners = await PractitionerModel.find({
      'account.accountStatus': 'deleted',
    });
    res.status(200).json(practitioners);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get a specific practitioner by ID
const getPractitionerById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const practitionerId = req.params.id;
    const practitioner = await PractitionerModel.findById(practitionerId);
    if (!practitioner) {
      res.status(404).json({ error: 'Practitioner not found' });
      return;
    }
    res.status(200).json(practitioner);
  } catch (error: any) {
    logger.error(JSON.stringify(error.message));
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get a specific practitioner by Email
const getPractitionerByEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const email = req.params.email;
    const practitioner = await PractitionerModel.findOne({
      email: email,
    });
    if (!practitioner) {
      res.status(404).json({ error: 'Practitioner not found' });
      return;
    }
    res.status(200).json(practitioner);
  } catch (error: any) {
    logger.error(JSON.stringify(error.message));
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a practitioner by ID
const updatePractitionerById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const practitionerId = req.params.id;
    const updatedPractitionerData: IPractitioner = req.body;

    logger.info(
      `Updated practitioner data: ${JSON.stringify(updatedPractitionerData)}`
    );

    const updatedPractitioner = await PractitionerModel.findByIdAndUpdate(
      practitionerId,
      updatedPractitionerData,
      { new: true }
    );

    if (!updatedPractitioner) {
      res.status(404).json({ error: 'Practitioner not found' });
      return;
    }

    res.status(200).json(updatedPractitioner);
  } catch (error: any) {
    res.status(500).json({ error: 'Internal Server Error' });
    logger.error(error.message);
  }
};

// Update a practitioner by Email
const updatePractitionerByEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const email = req.params.email;
    const updatedPractitionerData: IPractitioner = req.body;

    logger.info(
      `Updated practitioner data: ${JSON.stringify(updatedPractitionerData)}`
    );

    const updatedPractitioner = await PractitionerModel.findOneAndUpdate(
      { email: email },
      updatedPractitionerData,
      { new: true }
    );

    if (!updatedPractitioner) {
      res.status(404).json({ error: 'Practitioner not found' });
      return;
    }

    res.status(200).json(updatedPractitioner);
  } catch (error: any) {
    res.status(500).json({ error: 'Internal Server Error' });
    logger.error(error.message);
  }
};

// Delete a practitioner by ID
const deletePractitionerById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const practitionerId = req.params.id;
    const deletedPractitioner = await PractitionerModel.findByIdAndUpdate(
      practitionerId,
      { 'account.accountStatus': 'deleted' },
      { new: true }
    );
    if (!deletedPractitioner) {
      res.status(404).json({ error: 'Practitioner not found' });
      return;
    }
    res.status(204).json();
  } catch (error: any) {
    res.status(500).json({ error: JSON.stringify(error) });
  }
};

// Delete a practitioner by Email
const deletePractitionerByEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const email = req.params.email;
    const deletedPractitioner = await PractitionerModel.findOneAndUpdate(
      { email: email },
      { 'account.accountStatus': 'deleted' },
      { new: true }
    );
    if (!deletedPractitioner) {
      res.status(404).json({ error: 'Practitioner not found' });
      return;
    }
    res.status(204).json();
  } catch (error: any) {
    res.status(500).json({ error: JSON.stringify(error) });
  }
};

// Reactivate a practitioner by Email
const reactivatePractitionerByEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const email = req.params.email;
    const reactivatedPractitioner = await PractitionerModel.findByIdAndUpdate(
      email,
      { 'account.accountStatus': 'active' },
      { new: true }
    );
    if (!reactivatedPractitioner) {
      res.status(404).json({ error: 'Practitioner not found' });
      return;
    }
    res.status(200).json(reactivatedPractitioner);
  } catch (error: any) {
    res.status(500).json({ error: JSON.stringify(error) });
  }
};

// Block a practitioner by Email
const blockPractitionerByEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const email = req.params.email;
    const blockedPractitioner = await PractitionerModel.findByIdAndUpdate(
      email,
      { 'account.accountStatus': 'blocked' },
      { new: true }
    );
    if (!blockedPractitioner) {
      res.status(404).json({ error: 'Practitioner not found' });
      return;
    }
    res.status(200).json(blockedPractitioner);
  } catch (error: any) {
    res.status(500).json({ error: JSON.stringify(error) });
  }
};

// Check if a practitioner exists by email
const practitionerExistsByEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.params;

    // Validate email format (you may want to add more robust validation)
    if (!email) {
      res.status(400).json({ error: 'Email is required' });
    }

    // Check if email exists in the database
    const user = await PractitionerModel.findOne({ email });

    if (user) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const resendVerificationEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  const frontEndUrl: string | undefined =
    process.env.NODE_ENV === 'production'
      ? process.env.FRONTEND_PROD_URL
      : process.env.FRONTEND_DEV_URL;

  try {
    // Retrieve the email from the request body or wherever you expect it to come from
    const { email } = req.params;

    // Find the practitioner by email
    const practitioner = await PractitionerModel.findOne({ email });

    // If practitioner doesn't exist or is already verified, return an error
    if (!practitioner || practitioner.account.verified) {
      res
        .status(400)
        .json({ message: 'Practitioner not found or already verified' });
    }

    if (practitioner) {
      // Regenerate the verification token
      const nanoid = customAlphabet('1234567890abcdef', 32); // Use customAlphabet to generate a random string
      const verificationToken = nanoid();
      logger.info(`Current practitioner: ${JSON.stringify(practitioner)}`);
      practitioner.account.verificationToken = verificationToken;
      logger.info(`New verification token issued: ${verificationToken}`);

      // Save the practitioner with the new verification token
      await practitioner.save();

      // Reuse the email template and send verification email
      const transport = nodemailer.createTransport({
        host: 'smtp.zeptomail.eu',
        port: 587,
        auth: {
          user: 'emailapikey',
          pass: 'yA6KbHsI4w//kz0FSBE11sWP+tw1/axq3Sux5n3kfMF1e4S03KE/hkdpItvoITra3NfZ4f4FbYtCII24vtFeeZY0M9MDfJTGTuv4P2uV48xh8ciEYNYhhJ+gALkXFqZBeB0lDCozQvkiWA==',
        },
      });

      const mailOptions = {
        from: '"Hah Team" <noreply@healthathome.co.zw>',
        to: practitioner.email,
        subject: 'Health at Home Email Verification',
        html: `    
              <h1>Health at Home Email Verification</h1>
              <h2>Click the link to verify your email</h2>
                  
              <p>Hello!</p>
              <p>You've just signed up for a Health at Home Practitioner account with this email.</p>
              <p>Click this link to verify your email and continue with registering.</p>
                  
              <a href="${frontEndUrl}/verify/${practitioner.account.verificationToken}">Verify</a>
                  
              <p>Having trouble? Copy and paste this link into your browser:</p>
              <p>"${frontEndUrl}/verify/${practitioner.account.verificationToken}"</p>
                  
              <p>Need help?</p>
              <p>FAQ: <a href="${frontEndUrl}/faq">${frontEndUrl}/faq</a></p>
              <p>Email: <a href="mailto:hello@healthathome.co.zw">hello@healthathome.co.zw</a></p>
              <p>Phone: +263 780 147 562</p>
              <p>Working hours: Monday - Friday, 9:00am - 5:00pm</p>
              `,
      };

      // Send the email
      transport.sendMail(mailOptions, (error: any, info: any) => {
        if (error) {
          console.log(error);
          return res
            .status(500)
            .json({ message: 'Failed to send verification email' });
        }
        console.log('Successfully sent');
        return res
          .status(200)
          .json({ message: 'Verification email sent successfully' });
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export {
  createPractitioner,
  getAllPractitioners,
  getActivePractitioners,
  getBlockedPractitioners,
  getDeletedPractitioners,
  getPractitionerById,
  getPractitionerByEmail,
  updatePractitionerById,
  updatePractitionerByEmail,
  deletePractitionerById,
  deletePractitionerByEmail,
  reactivatePractitionerByEmail,
  blockPractitionerByEmail,
  practitionerExistsByEmail,
  resendVerificationEmail,
};