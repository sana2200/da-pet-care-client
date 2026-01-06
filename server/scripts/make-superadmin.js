require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User.model');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

async function makeSuperAdmin() {
  try {
    // Get email from command line argument
    const email = process.argv[2];
    
    if (!email) {
      console.log('❌ Usage: node make-superadmin.js <user-email>');
      console.log('Example: node make-superadmin.js admin@example.com');
      process.exit(1);
    }

    console.log(`\n🔍 Looking for user: ${email}...`);
    
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.log(`❌ User not found with email: ${email}`);
      console.log('\n📋 Available users:');
      const users = await User.find().select('email role');
      users.forEach(u => console.log(`   - ${u.email} (${u.role})`));
      process.exit(1);
    }

    console.log(`✅ Found user: ${user.name} (${user.email})`);
    console.log(`   Current role: ${user.role}`);
    
    if (user.role === 'superadmin') {
      console.log('⚠️  User is already a Super Admin!');
      process.exit(0);
    }

    // Update to superadmin
    user.role = 'superadmin';
    await user.save();

    console.log(`\n🎉 SUCCESS! ${user.name} is now a Super Admin!`);
    console.log(`\n📝 User Details:`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`\n✅ You can now login and access the Users tab in Admin Dashboard`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

makeSuperAdmin();
