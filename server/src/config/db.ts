import mongoose from 'mongoose';
import User, { UserRole } from '../models/User';
import bcrypt from 'bcryptjs';

const seedAdmin = async () => {
  try {
    const adminEmail = 'admin@rozgaarhub.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('Admin@123', salt);
      
      await User.create({
        name: 'System Admin',
        email: adminEmail,
        phone: '9999999999',
        passwordHash: passwordHash,
        role: UserRole.ADMIN,
        isVerified: true,
        walletBalance: 100000
      });
      console.log('✅ Default fixed Admin account seeded successfully: admin@rozgaarhub.com / Admin@123');
    }
  } catch (err: any) {
    console.error(`Admin seeding failed: ${err.message}`);
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/rozgaarhub');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedAdmin();
  } catch (error: any) {
    console.error('❌ MONGODB CONNECTION ERROR:');
    console.error('--------------------------------------------------');
    console.error(error.message);
    console.error('--------------------------------------------------');
    console.error('👉 IMPORTANT: If this is an IP Whitelist error, please ensure that your current IP address is whitelisted in your MongoDB Atlas Dashboard:');
    console.error('   1. Go to cloud.mongodb.com and log in.');
    console.error('   2. Navigate to Security -> Network Access.');
    console.error('   3. Click "+ ADD IP ADDRESS".');
    console.error('   4. Choose "Allow Access From Anywhere" (0.0.0.0/0) or "Add Current IP Address".');
    console.error('   5. Click Confirm and wait 1 minute before restarting the server.');
    console.error('--------------------------------------------------');
    process.exit(1);
  }
};

export default connectDB;
