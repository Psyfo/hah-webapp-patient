import express, { Request, Response } from "express";
import { LoggerMiddleware } from "../middleware/logger.middleware";

// router for express

const router = express.Router();

/**
 * @swagger
 * /:
 *  get:
 *      description: Patient microservice index route
 *      responses:
 *         200:
 *         description: Patient microservice working!
 *         content:
 *             application/json:
 *                example: { "status": 200, "message": "Patient microservice working!" }
 */
router.get('/', LoggerMiddleware.reqLog, (req: Request, res: Response) => {
  res.send('Patient microservice working!');
});

export { router };
