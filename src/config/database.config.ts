import bcrypt from 'bcrypt';
import mongoose, { ConnectOptions } from 'mongoose';
import { AdminModel } from '../components/admin/admin.model';
import { logger } from './logger.config';

// Function to seed admin account if the collection is empty
async function seedAdminAccount() {
  try {
    const adminCount = await AdminModel.countDocuments();
    if (adminCount === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Password12@', salt);

      const adminData = {
        email: 'admin@healthathome.co.zw',
        password: hashedPassword,
        account: { verified: true, role: 'admin' }, // You may add other default account data here
      };

      await AdminModel.create(adminData);
      console.log('Admin account seeded successfully.');
    }
  } catch (error) {
    console.error('Error seeding admin account:', error);
  }
}

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

    // Seed admin account
    await seedAdminAccount();

    logger.info(`Connected to MongoDB at ${dbUrl}`);
  } catch (err: any) {
    logger.error('Failed to connect to MongoDB', err.message);
  }
};

mongoose.set('debug', true); // Log MongoDB query to console
mongoose.connection.on('error', (error) => logger.error(error)); // Log MongoDB errors to console

export { connectToDatabase };
