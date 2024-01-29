import * as bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import passport from 'passport';
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
const port = process.env.PORT || 3000; // Use default port if not set
app.listen(process.env.PORT, () => {
  logger.info(`Patient microservice listening on port ${port}`);
});
//
