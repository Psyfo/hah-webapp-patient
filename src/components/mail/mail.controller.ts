import moment from "moment";
import { IPatient } from "../patient/patient.interface";
import { IPractitioner } from "../practitioner/practitioner.interface";

const { SendMailClient } = require('zeptomail');

const patientVerificationEmail = async (
  patient: IPatient,
  verificationToken: string | undefined
) => {
  const frontEndUrl: string | undefined =
    process.env.NODE_ENV === 'production'
      ? process.env.FRONTEND_PROD_URL
      : process.env.FRONTEND_DEV_URL;

  console.log('Patient being mailed: ', patient.email);
  console.log('Verification token: ', verificationToken);

  const url = 'api.zeptomail.eu/v1.1/email/template';
  const token = process.env.ZEPTO_SENDMAIL_TOKEN;

  let client = new SendMailClient({ url, token });

  client
    .sendMail({
      mail_template_key:
        '13ef.41cbf9823b7248c1.k1.54a8fff0-e4fb-11ee-bf72-52540048feb1.18e5084bd6f',
      from: {
        address: 'noreply@healthathome.co.zw',
        name: 'noreply',
      },
      to: [
        {
          email_address: {
            address: patient.email,
            name: 'Patient',
          },
        },
      ],
      merge_info: {
        verificationToken: verificationToken,
        frontEndUrl: frontEndUrl,
        url: frontEndUrl,
      },
      subject: 'Health At Home Patient Verification Email',
    })
    .then((response: any) => {
      console.log('Patient verification email sent');
    })
    .catch((error: any) => {
      console.error(error, 'Patient verification email failed');
    });
};

const patientIDUploadEmail = async (patient: IPatient) => {
  const url = 'api.zeptomail.eu/v1.1/email/template';
  const token = process.env.ZEPTO_SENDMAIL_TOKEN;

  let client = new SendMailClient({ url, token });

  client
    .sendMail({
      mail_template_key:
        '13ef.41cbf9823b7248c1.k1.93d116c0-e4f8-11ee-bf72-52540048feb1.18e5072b22c',
      from: {
        address: 'noreply@healthathome.co.zw',
        name: 'noreply',
      },
      to: [
        {
          email_address: {
            address: patient.email,
            name: patient.firstName + ' ' + patient.lastName,
          },
        },
      ],
      merge_info: {
        firstName: patient.firstName,
        lastName: patient.lastName,
        phoneNumber: patient.phoneNumber,
        dob: moment(patient.dob).format('DD-MM-YYYY'),
        idNumber: patient.idNumber,
      },
      subject: 'Test Email',
    })
    .then((response: any) => console.log('Patient ID upload email sent'))
    .catch((error: any) =>
      console.log(error, 'Patient ID upload email failed')
    );
};

const patientIDApprovedEmail = async (patient: IPatient) => {
  const url = 'api.zeptomail.eu/v1.1/email/template';
  const token = process.env.ZEPTO_SENDMAIL_TOKEN;

  let client = new SendMailClient({ url, token });

  client
    .sendMail({
      mail_template_key:
        '13ef.41cbf9823b7248c1.k1.1b6c0e00-e4f9-11ee-bf72-52540048feb1.18e50762ae0',
      from: {
        address: 'noreply@healthathome.co.zw',
        name: 'noreply',
      },
      to: [
        {
          email_address: {
            address: patient.email,
            name: `${patient.firstName} ${patient.lastName}`,
          },
        },
      ],
      merge_info: { firstName: `${patient.firstName}` },
      subject: 'Test Email',
    })
    .then((response: any) => console.log('Patient ID approved email sent'))
    .catch((error: any) =>
      console.log(error, 'Patient ID approved email failed')
    );
};

const patientIDRejectedEmail = async (patient: IPatient) => {
  const url = 'api.zeptomail.eu/v1.1/email/template';
  const token = process.env.ZEPTO_SENDMAIL_TOKEN;

  let client = new SendMailClient({ url, token });

  client
    .sendMail({
      mail_template_key:
        '13ef.41cbf9823b7248c1.k1.86ccc360-e4f9-11ee-bf72-52540048feb1.18e5078ea96',
      from: {
        address: 'noreply@healthathome.co.zw',
        name: 'noreply',
      },
      to: [
        {
          email_address: {
            address: patient.email,
            name: `${patient.firstName} ${patient.lastName}`,
          },
        },
      ],
      merge_info: { rejectionReason: patient.account.rejectionReason },
      subject: 'Test Email',
    })
    .then((response: any) => console.log('Patient ID rejected email sent'))
    .catch((error: any) =>
      console.log(error, 'Patient ID rejected email failed')
    );
};

const patientPasswordResetEmail = async (
  patient: IPatient,
  passwordResetToken: string
) => {
  const frontEndUrl: string | undefined =
    process.env.NODE_ENV === 'production'
      ? process.env.FRONTEND_PROD_URL
      : process.env.FRONTEND_DEV_URL;

  const url = 'api.zeptomail.eu/v1.1/email/template';
  const token = process.env.ZEPTO_SENDMAIL_TOKEN;

  let client = new SendMailClient({ url, token });

  client
    .sendMail({
      mail_template_key:
        '13ef.41cbf9823b7248c1.k1.edec0d10-ec21-11ee-aed2-52540063e0e7.18e7f61c061',
      from: {
        address: 'noreply@healthathome.co.zw',
        name: 'noreply',
      },
      to: [
        {
          email_address: {
            address: patient.email,
            name: `${patient.firstName} ${patient.lastName}`,
          },
        },
      ],
      merge_info: {
        frontEndUrl: frontEndUrl,
        resetToken: passwordResetToken,
      },
      subject: 'Test Email',
    })
    .then((response: any) => console.log('success'))
    .catch((error: any) => console.log(error, 'error'));
};

const practitionerVerificationEmail = async (
  practitioner: IPractitioner,
  verificationToken: string | undefined
) => {
  const frontEndUrl: string | undefined =
    process.env.NODE_ENV === 'production'
      ? process.env.FRONTEND_PROD_URL
      : process.env.FRONTEND_DEV_URL;

  const url = 'api.zeptomail.eu/v1.1/email/template';
  const token = process.env.ZEPTO_SENDMAIL_TOKEN;

  let client = new SendMailClient({ url, token });

  client
    .sendMail({
      mail_template_key:
        '13ef.41cbf9823b7248c1.k1.2e83c220-ef90-11ee-86da-52540063e0e7.18e95dd7742',
      from: {
        address: 'noreply@healthathome.co.zw',
        name: 'noreply',
      },
      to: [
        {
          email_address: {
            address: practitioner.email,
            name: `${practitioner.firstName} ${practitioner.lastName}`,
          },
        },
      ],
      merge_info: {
        frontEndUrl: frontEndUrl,
        verificationToken: verificationToken,
        url: frontEndUrl,
      },
      subject: 'Test Email',
    })
    .then((response: any) => console.log('success'))
    .catch((error: any) => console.log(error, 'error'));
};

const practitionerIDUploadEmail = async (practitioner: IPractitioner) => {
  const url = 'api.zeptomail.eu/v1.1/email/template';
  const token = process.env.ZEPTO_SENDMAIL_TOKEN;

  let client = new SendMailClient({ url, token });

  client
    .sendMail({
      mail_template_key:
        '13ef.41cbf9823b7248c1.k1.ad899c70-ef90-11ee-86da-52540063e0e7.18e95e0b7b7',
      from: {
        address: 'noreply@healthathome.co.zw',
        name: 'noreply',
      },
      to: [
        {
          email_address: {
            address: practitioner.email,
            name: `${practitioner.firstName} ${practitioner.lastName}`,
          },
        },
      ],
      merge_info: {
        firstName: practitioner.firstName,
        lastName: practitioner.lastName,
        phoneNumber: practitioner.phoneNumber,
        dob: moment(practitioner.dob).format('DD-MM-YYYY'),
        idNumber: practitioner.idNumber,
      },
      subject: 'Test Email',
    })
    .then((response: any) => console.log('success'))
    .catch((error: any) => console.log(error, 'error'));
};

const practitionerIDApprovedEmail = async (practitioner: IPractitioner) => {
  const url = 'api.zeptomail.eu/v1.1/email/template';
  const token = process.env.ZEPTO_SENDMAIL_TOKEN;

  let client = new SendMailClient({ url, token });

  client
    .sendMail({
      mail_template_key:
        '13ef.41cbf9823b7248c1.k1.e155b150-ef91-11ee-86da-52540063e0e7.18e95e898e5',
      from: {
        address: 'noreply@healthathome.co.zw',
        name: 'noreply',
      },
      to: [
        {
          email_address: {
            address: practitioner.email,
            name: `${practitioner.firstName} ${practitioner.lastName}`,
          },
        },
      ],
      merge_info: { firstName: practitioner.firstName },
      subject: 'Test Email',
    })
    .then((response: any) => console.log('success'))
    .catch((error: any) => console.log(error, 'error'));
};

const practitionerIDRejectedEmail = async (practitioner: IPractitioner) => {
  const url = 'api.zeptomail.eu/v1.1/email/template';
  const token = process.env.ZEPTO_SENDMAIL_TOKEN;

  let client = new SendMailClient({ url, token });

  client
    .sendMail({
      mail_template_key:
        '13ef.41cbf9823b7248c1.k1.66703f40-ef92-11ee-86da-52540063e0e7.18e95ec0134',
      from: {
        address: 'noreply@healthathome.co.zw',
        name: 'noreply',
      },
      to: [
        {
          email_address: {
            address: practitioner.email,
            name: `${practitioner.firstName} ${practitioner.lastName}`,
          },
        },
      ],
      merge_info: { rejectionReason: practitioner.account.rejectionReason },
      subject: 'Test Email',
    })
    .then((response: any) => console.log('success'))
    .catch((error: any) => console.log(error, 'error'));
};

const practitionerPasswordResetEmail = async (
  practitioner: IPractitioner,
  passwordResetToken: string
) => {
  const frontEndUrl: string | undefined =
    process.env.NODE_ENV === 'production'
      ? process.env.FRONTEND_PROD_URL
      : process.env.FRONTEND_DEV_URL;

  const url = 'api.zeptomail.eu/v1.1/email/template';
  const token = process.env.ZEPTO_SENDMAIL_TOKEN;

  let client = new SendMailClient({ url, token });

  client
    .sendMail({
      mail_template_key:
        '13ef.41cbf9823b7248c1.k1.8c6a3b60-ef92-11ee-86da-52540063e0e7.18e95ecfa16',
      from: {
        address: 'noreply@healthathome.co.zw',
        name: 'noreply',
      },
      to: [
        {
          email_address: {
            address: practitioner.email,
            name: `${practitioner.firstName} ${practitioner.lastName}`,
          },
        },
      ],
      merge_info: { frontEndUrl: frontEndUrl, resetToken: passwordResetToken },
      subject: 'Test Email',
    })
    .then((response: any) => console.log('success'))
    .catch((error: any) => console.log(error, 'error'));
};

export {
  patientVerificationEmail,
  patientIDUploadEmail,
  patientIDApprovedEmail,
  patientIDRejectedEmail,
  patientPasswordResetEmail,
  practitionerVerificationEmail,
  practitionerIDUploadEmail,
  practitionerIDApprovedEmail,
  practitionerIDRejectedEmail,
  practitionerPasswordResetEmail,
};
