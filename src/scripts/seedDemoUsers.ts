import dotenv from 'dotenv';
import connectDatabase from '../config/database.js';
import User from '../models/User.js';

dotenv.config();

const demoUsers = [
  { name: 'Demo Student', email: 'demo.student@devnotes.com', role: 'user' as const, password: process.env.DEMO_STUDENT_PASSWORD },
  { name: 'Demo Admin', email: 'demo.admin@devnotes.com', role: 'admin' as const, password: process.env.DEMO_ADMIN_PASSWORD }
];

const seedDemoUsers = async (): Promise<void> => {
  try {
    await connectDatabase();
    for (const demoUser of demoUsers) {
      if (!demoUser.password) throw new Error(`Missing password environment variable for ${demoUser.email}`);
      const existingUser = await User.findOne({ email: demoUser.email });
      if (existingUser) {
        existingUser.name = demoUser.name;
        existingUser.role = demoUser.role;
        existingUser.password = demoUser.password;
        await existingUser.save();
        console.log(`Updated ${demoUser.email}`);
      } else {
        await User.create(demoUser);
        console.log(`Created ${demoUser.email}`);
      }
    }
    process.exit(0);
  } catch (error) {
    console.error('Demo user seed failed:', error);
    process.exit(1);
  }
};

seedDemoUsers();