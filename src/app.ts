import * as bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import passport from 'passport';
import { loggers } from 'winston';
import { patientRouter } from './components/patient/patient.routes';
import { connectToDatabase } from './config/database.config';
import { logger } from './config/logger.config';
import { setupSwagger } from './config/swagger.config';
import { errorHandler } from './middleware/error.middleware';
import { authRouter } from './routes/auth.routes';
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

// Error handling
app.use(errorHandler);

// Routes
app.use('/', router); // Use router from index.routes.ts
app.use('/patients', patientRouter); // Use router from patient.routes.ts
app.use('/auth', authRouter); // Use router from auth.routes.ts

// Swagger
setupSwagger(app);

// Start server
const environment = process.env.NODE_ENV || 'development';
logger.info('Environment: ' + environment);

// Set the port based on the environment
const port = environment === 'production' ? 80 : process.env.PORT || 3000;
// Start the server
app.listen(port, () => {
  logger.info(`Server is running on port ${port} in ${environment} mode`);
});
//
