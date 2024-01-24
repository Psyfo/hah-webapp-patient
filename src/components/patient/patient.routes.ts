import express, { Request, Response } from "express";
import { LoggerMiddleware } from "../../middleware/logger.middleware";

// router for express

const patientRouter = express.Router();

patientRouter.get(
  '/',
  LoggerMiddleware.reqLog,
  (req: Request, res: Response) => {
    res.status(200).send({
      status: res.statusCode,
      message: 'Patient index route responding!',
      data: {
        patient: 'patient',
      },
    });
  }
);

export { patientRouter };
