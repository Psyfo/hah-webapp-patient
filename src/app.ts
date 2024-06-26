import * as bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import passport from "passport";
import { adminRouter } from "./components/admin/admin.routes";
import { authRouter } from './components/auth/auth.routes';
import { patientRouter } from './components/patient/patient.routes';
import { practitionerRouter } from './components/practitioner/practitioner.routes';
import { uploadRouter } from './components/upload/upload.routes';
import { connectToDatabase } from './config/database.config';
import { logger } from './config/logger.config';
import { setupSwagger } from './config/swagger.config';
import { errorHandler } from './middleware/error.middleware';
import { router } from './routes/index.routes';

const app = express();
dotenv.config();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
express.json();
express.urlencoded({ extended: true });

// Initialize and configure Passport
app.use(passport.initialize());

// Connect to database
connectToDatabase();

// Routes
app.use('/', router); // Use router from index.routes.ts
app.use('/admins', adminRouter);
app.use('/auth', authRouter); // Use router from auth.routes.ts
app.use('/patients', patientRouter); // Use router from patient.routes.ts
app.use('/practitioners', practitionerRouter);
app.use('/upload', uploadRouter);

// Swagger
setupSwagger(app);

// Start server
const environment = process.env.NODE_ENV || 'development';
logger.info('Environment: ' + environment);

// Set the port based on the environment
const port =
  environment === 'production'
    ? process.env.PORT || 80
    : process.env.PORT || 3000;
// Start the server
app.listen(port, () => {
  logger.info(`Server is running on port ${port} in ${environment} mode`);
});
//

// Error handling
app.use(errorHandler);
