require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product.model');
const Service = require('../models/Service.model');
const productsData = require('../data/products.seed');
const servicesData = require('../data/services.seed');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Product.deleteMany({});
    await Service.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Seed products
    console.log('📦 Seeding products...');
    const products = await Product.insertMany(productsData);
    console.log(`✅ ${products.length} products added\n`);

    // Seed services
    console.log('🛎️  Seeding services...');
    const services = await Service.insertMany(servicesData);
    console.log(`✅ ${services.length} services added\n`);

    // Display summary
    console.log('📊 Seeding Summary:');
    console.log('==================');
    console.log(`Total Products: ${products.length}`);
    console.log(`Total Services: ${services.length}`);
    
    console.log('\n📋 Products by Category:');
    const productsByCategory = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    productsByCategory.forEach(cat => {
      console.log(`  - ${cat._id}: ${cat.count}`);
    });

    console.log('\n📋 Services by Category:');
    const servicesByCategory = await Service.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    servicesByCategory.forEach(cat => {
      console.log(`  - ${cat._id}: ${cat.count}`);
    });

    console.log('\n✨ Database seeding completed successfully!');
    console.log('\n🚀 You can now:');
    console.log('  1. Start your server: npm run dev');
    console.log('  2. View products: GET http://localhost:5000/api/products');
    console.log('  3. View services: GET http://localhost:5000/api/services');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
