import B2 from 'backblaze-b2';
import { NextFunction, Request, Response } from 'express';
import { logger } from '../config/logger.config';

// Configure Backblaze B2 client
const b2 = new B2({
  applicationKeyId: '0056f44309948fc0000000002',
  applicationKey: 'K005yZEQQuOzdm88oWAPQ2bT20nu9aY',
});

const uploadPatientID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await b2.authorize();
    const bucket = await b2.getBucket({ bucketName: 'HealthAtHome' });
    const bucketId = bucket.data.bucketId;
    const uploadUrl = await b2.getUploadUrl({ bucketId: bucketId });

    // Assuming you have the file data in req.body.fileData and filename in req.body.fileName
    const fileData = req.body.fileData;
    const fileName = req.body.fileName;

    // Uploading the file to Backblaze B2
    // const uploadResult = await b2.uploadFile({
    //     uploadUrl: uploadUrl.data.uploadUrl,
    //     uploadAuthToken: uploadUrl.data.authorizationToken,
    //     filename: fileName,
    //     data: fileData,
    // });

    // console.log('File uploaded:', uploadResult.data);

    // Respond with success message or do further processing
    res.status(200).json({ message: 'File uploaded successfully' });
  } catch (err) {
    logger.error('Error getting bucket', err);
  }
};

export { uploadPatientID };
