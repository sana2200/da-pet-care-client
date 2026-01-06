require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User.model');

async function listUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const users = await User.find({}).select('email name role firebaseUid isActive');
    
    if (users.length === 0) {
      console.log('❌ No users found in database');
      console.log('\n💡 Please sign up on the website first, then run:');
      console.log('   node scripts/check-admin.js YOUR_EMAIL\n');
    } else {
      console.log('📋 Users in Database:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email || 'No email'}`);
        console.log(`   Name: ${user.name || 'N/A'}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Active: ${user.isActive}`);
        console.log(`   Firebase: ${user.firebaseUid ? 'Linked' : 'Not linked'}\n`);
      });
      
      const adminUsers = users.filter(u => u.role === 'admin');
      if (adminUsers.length > 0) {
        console.log(`✅ ${adminUsers.length} admin user(s) found\n`);
      } else {
        console.log('⚠️  No admin users found!\n');
        console.log('To set a user as admin, run:');
        console.log('node scripts/check-admin.js YOUR_EMAIL\n');
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

listUsers();
