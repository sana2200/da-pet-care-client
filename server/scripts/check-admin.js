const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User.model');

async function checkAndSetAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get user email from command line argument
    const email = process.argv[2];

    if (!email) {
      console.log('❌ Please provide an email address');
      console.log('Usage: node check-admin.js your-email@example.com');
      process.exit(1);
    }

    // Find user by email
    const user = await User.findOne({ email: email });

    if (!user) {
      console.log(`❌ User with email "${email}" not found\n`);
      console.log('Available users:');
      const allUsers = await User.find({}).select('email name role');
      allUsers.forEach(u => {
        console.log(`  - ${u.email} (${u.name}) - Role: ${u.role}`);
      });
      process.exit(1);
    }

    console.log('📋 Current User Info:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Name:     ${user.name}`);
    console.log(`Email:    ${user.email}`);
    console.log(`Role:     ${user.role}`);
    console.log(`Active:   ${user.isActive}`);
    console.log(`Firebase: ${user.firebaseUid || 'Not linked'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (user.role === 'admin') {
      console.log('✅ User already has admin role!\n');
    } else {
      console.log('⚠️  User is NOT an admin. Setting admin role...\n');
      
      user.role = 'admin';
      await user.save();
      
      console.log('✅ User role updated to ADMIN successfully!\n');
      console.log('You can now access admin routes.\n');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkAndSetAdmin();
