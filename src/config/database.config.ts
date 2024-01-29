import mongoose, { ConnectOptions } from 'mongoose';
import { logger } from './logger.config';

// Filename: database.ts
const connectToDatabase = async () => {
  const dbUrl: string | undefined =
    process.env.NODE_ENV === 'production'
      ? process.env.MONGODB_URI_PROD
      : process.env.MONGODB_URI_DEV;

  try {
    await mongoose.connect(
      dbUrl as string,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as ConnectOptions
    );
    logger.info(`Connected to MongoDB at ${dbUrl}`);
  } catch (err: any) {
    logger.error('Failed to connect to MongoDB', err.message);
  }
};

mongoose.set('debug', true); // Log MongoDB query to console
mongoose.connection.on('error', (error) => logger.error(error)); // Log MongoDB errors to console

export { connectToDatabase };
