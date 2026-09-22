import dotenv from 'dotenv';
import connectDatabase from '../config/database.js';
import User from '../models/User.js';

dotenv.config();

const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin User';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@devnotes.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123456';

const seedAdmin = async (): Promise<void> => {
  try {
    console.log('🌱 Starting admin seed...');

    // Connect to database
    await connectDatabase();
    console.log('✓ Connected to database');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });

    if (existingAdmin) {
      console.log(`⚠️  Admin account already exists with email: ${ADMIN_EMAIL}`);
      console.log(`   Role: ${existingAdmin.role}`);
      
      // Update role to admin if user exists but is not admin
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✓ Updated existing user to admin role');
      }
      
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'admin'
    });

    console.log('✓ Admin account created successfully!');
    console.log(`   Name: ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
    console.log('\n⚠️  Please change the default admin password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
