import moment from 'moment';
import { IPatient } from '../patient/patient.interface';
import { IPractitioner } from '../practitioner/practitioner.interface';

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
  const token =
    'Zoho-enczapikey yA6KbHsI4w//kz0FSBE11sWP+tw1/axq3Sux5n3kfMF1e4S03KE/hkdpItvoITra3NfZ4f4FbYtCII24vtFeeZY0M9MDfJTGTuv4P2uV48xh8ciEYNYhhJ+gALkXFqZBeB0lDCozQvkiWA==';

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
  const token =
    'Zoho-enczapikey yA6KbHsI4w//kz0FSBE11sWP+tw1/axq3Sux5n3kfMF1e4S03KE/hkdpItvoITra3NfZ4f4FbYtCII24vtFeeZY0M9MDfJTGTuv4P2uV48xh8ciEYNYhhJ+gALkXFqZBeB0lDCozQvkiWA==';

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
  const token =
    'Zoho-enczapikey yA6KbHsI4w//kz0FSBE11sWP+tw1/axq3Sux5n3kfMF1e4S03KE/hkdpItvoITra3NfZ4f4FbYtCII24vtFeeZY0M9MDfJTGTuv4P2uV48xh8ciEYNYhhJ+gALkXFqZBeB0lDCozQvkiWA==';

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
  const token =
    'Zoho-enczapikey yA6KbHsI4w//kz0FSBE11sWP+tw1/axq3Sux5n3kfMF1e4S03KE/hkdpItvoITra3NfZ4f4FbYtCII24vtFeeZY0M9MDfJTGTuv4P2uV48xh8ciEYNYhhJ+gALkXFqZBeB0lDCozQvkiWA==';

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
      merge_info: { rejectReason: patient.account.rejectionReason },
      subject: 'Test Email',
    })
    .then((response: any) => console.log('Patient ID rejected email sent'))
    .catch((error: any) =>
      console.log(error, 'Patient ID rejected email failed')
    );
};

export {
  patientVerificationEmail,
  patientIDUploadEmail,
  patientIDApprovedEmail,
  patientIDRejectedEmail,
};
