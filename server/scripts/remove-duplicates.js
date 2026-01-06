const mongoose = require('mongoose');
require('dotenv').config();

async function removeDuplicateProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/da-pet-care');
    console.log('✅ Connected to MongoDB');

    const Product = require('../models/Product.model');

    // Get all products
    const allProducts = await Product.find().lean();
    console.log(`📦 Total products found: ${allProducts.length}`);

    // Group products by unique identifier (Product Code or name + description)
    const grouped = {};
    allProducts.forEach(product => {
      // Use Product Code if available, otherwise use name + description
      const productCode = product.specifications?.['Product Code'] || product.specifications?.['Serial Number'];
      const key = productCode 
        ? `CODE:${productCode}`
        : `${product.name}|${product.description}`;
      
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(product);
    });

    // Find duplicates
    let duplicateCount = 0;
    let idsToDelete = [];

    for (const [key, products] of Object.entries(grouped)) {
      if (products.length > 1) {
        duplicateCount++;
        // Sort by createdAt to keep the oldest one
        products.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        
        // Keep the first (oldest), delete the rest
        const toDelete = products.slice(1);
        idsToDelete.push(...toDelete.map(p => p._id));
        
        console.log(`🔍 Found ${products.length} duplicates of: "${products[0].name}" - ৳${products[0].price}`);
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Total products: ${allProducts.length}`);
    console.log(`   Duplicate groups: ${duplicateCount}`);
    console.log(`   Products to delete: ${idsToDelete.length}`);
    console.log(`   Products remaining: ${allProducts.length - idsToDelete.length}`);

    if (idsToDelete.length > 0) {
      console.log(`\n🗑️  Deleting ${idsToDelete.length} duplicate products...`);
      const result = await Product.deleteMany({ _id: { $in: idsToDelete } });
      console.log(`✅ Deleted ${result.deletedCount} duplicate products`);

      // Verify
      const remainingCount = await Product.countDocuments();
      console.log(`\n✅ Final product count: ${remainingCount}`);
    } else {
      console.log('\n✅ No duplicates found!');
    }

    await mongoose.connection.close();
    console.log('👋 Connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

removeDuplicateProducts();
