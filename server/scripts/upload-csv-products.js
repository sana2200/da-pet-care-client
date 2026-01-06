require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product.model');
const fs = require('fs');
const path = require('path');

// Parse CSV data
const csvData = `#SN.,Image,Code,Name,Category,Sell,Stock
1,,8850477018778,Smart heart Treats - 4*15g- Chicken,Food,230.00,24
2,,8850477018785,Smart heart Treats - 4*15g- Tuna,Food,230.00,24
3,,PDR.00504,Delivery Charge,Others,80.00,0
4,,PDR.00503,Wall mount Catnip,Accessories,190.00,4
5,,PDR.00502,Pet Toothbrush,Accessories,130.00,2
6,,PDR.00501,INJ. MARBO-REN - 10ml,Medicine,350.00,5
7,,PDR.00500,Susp. Delentin 50mg/ml,Medicine,16.00,2
8,,PDR.00499,Inj. Fusid,Medicine,9.00,5
9,,PDR.00498,Syp. Moxacil - 100ml,Medicine,70.00,19
10,,PDR.00497,Inj. Mega C - 500mg/5ml,Medicine,6.00,70`;

// Function to parse CSV
function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const obj = {};
    headers.forEach((header, index) => {
      obj[header.trim()] = values[index]?.trim() || '';
    });
    data.push(obj);
  }

  return data;
}

// Function to convert CSV product to MongoDB format
function convertToProduct(csvProduct, index) {
  const category = csvProduct.Category?.toLowerCase() || 'other';
  const price = parseFloat(csvProduct.Sell?.replace(/,/g, '') || 0);
  const stock = parseInt(csvProduct.Stock || 0);
  
  // Determine if it's a service or product
  const isService = ['Service', 'Surgery', 'Diagnostic Test'].includes(csvProduct.Category);
  
  // Map category to appropriate subcategory
  let subCategory = '';
  let mainCategory = 'accessories';
  
  if (category.includes('food')) {
    mainCategory = 'food';
    subCategory = 'cat-food';
  } else if (category.includes('medicine')) {
    mainCategory = 'health';
    subCategory = 'medicine';
  } else if (category.includes('accessories')) {
    mainCategory = 'accessories';
    subCategory = 'general';
  }

  return {
    name: csvProduct.Name || `Product ${index + 1}`,
    description: `${csvProduct.Name} - ${csvProduct.Code}`,
    price: price,
    originalPrice: price * 1.2, // Add 20% markup for original price
    category: mainCategory,
    subCategory: subCategory,
    brand: csvProduct.Code?.includes('PDR') ? 'Generic' : 'Branded',
    sku: csvProduct.Code || `SKU${index + 1}`,
    images: [
      csvProduct.Image || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500'
    ],
    stock: Math.max(0, stock), // Ensure non-negative stock
    featured: index < 10, // First 10 as featured
    rating: 4 + Math.random(), // Random rating 4-5
    numReviews: 0,
    reviews: [],
    specifications: {
      "Product Code": csvProduct.Code,
      "Category": csvProduct.Category,
      "Stock Status": stock > 0 ? 'In Stock' : 'Out of Stock'
    },
    tags: [mainCategory, subCategory, csvProduct.Category?.toLowerCase()],
    discount: Math.round((1 - (price / (price * 1.2))) * 100),
    isActive: stock >= 0, // Active if stock is non-negative
    inStock: stock > 0
  };
}

async function uploadProductsFromCSV() {
  try {
    console.log('🔄 Connecting to MongoDB...\n');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Read the actual CSV file
    const csvFilePath = path.join(__dirname, '../../Resources/Product.csv');
    let csvContent;
    
    try {
      csvContent = fs.readFileSync(csvFilePath, 'utf-8');
      console.log('✅ CSV file loaded successfully\n');
    } catch (err) {
      console.error('❌ Error reading CSV file:', err.message);
      console.log('Using sample data instead...\n');
      csvContent = csvData;
    }

    // Parse CSV
    const lines = csvContent.trim().split('\n');
    const products = [];
    
    // Skip first row (header) and second row if it's the header labels
    const startIndex = lines[0].includes('Product') ? 2 : 1;
    
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;
      
      // Split by comma but handle quoted values
      const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
      
      if (values.length < 6) continue; // Skip invalid rows
      
      const sn = values[0]?.replace(/"/g, '').trim();
      const image = values[1]?.replace(/"/g, '').trim();
      const code = values[2]?.replace(/"/g, '').trim();
      const name = values[3]?.replace(/"/g, '').trim();
      const category = values[4]?.replace(/"/g, '').trim();
      const price = values[5]?.replace(/"/g, '').replace(/,/g, '').trim();
      const stock = values[6]?.replace(/"/g, '').trim();
      
      if (!name || !price) continue; // Skip if essential fields are missing
      
      const priceNum = Math.abs(parseFloat(price) || 0); // Use absolute value
      const stockNum = parseInt(stock) || 0;
      
      // Determine category mapping
      let mainCategory = 'accessories';
      let subCategory = 'general';
      
      if (category === 'Food') {
        mainCategory = 'food';
        subCategory = 'cat-food';
      } else if (category === 'Medicine') {
        mainCategory = 'health';
        subCategory = 'medicine';
      } else if (category === 'Accessories') {
        mainCategory = 'accessories';
        subCategory = 'general';
      } else if (['Service', 'Surgery', 'Diagnostic Test'].includes(category)) {
        continue; // Skip services for now (add to services collection separately)
      }
      
      const product = {
        name: name,
        description: code ? `${name} (${code})` : name,
        price: priceNum,
        originalPrice: Math.round(priceNum * 1.15), // 15% markup
        category: mainCategory,
        subCategory: subCategory,
        brand: code?.startsWith('PDR') ? 'Pet Direct' : code ? 'Branded' : 'Generic',
        sku: code || `SKU${i}`,
        images: [
          image || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500'
        ],
        stock: Math.max(0, stockNum),
        featured: i <= 15, // First 15 as featured
        rating: 4 + (Math.random() * 1), // 4.0 - 5.0
        numReviews: Math.floor(Math.random() * 50),
        reviews: [],
        specifications: {
          "Product Code": code,
          "Original Category": category
        },
        tags: [mainCategory, subCategory, category?.toLowerCase()].filter(Boolean),
        discount: priceNum > 0 ? Math.round(((priceNum * 1.15 - priceNum) / (priceNum * 1.15)) * 100) : 0,
        isActive: true,
        inStock: stockNum > 0
      };
      
      products.push(product);
    }

    console.log(`📦 Parsed ${products.length} products from CSV\n`);

    // Clear existing products
    console.log('🗑️  Clearing existing products...');
    await Product.deleteMany({});
    console.log('✅ Existing products cleared\n');

    // Insert new products
    console.log('📤 Uploading products to database...');
    const inserted = await Product.insertMany(products);
    console.log(`✅ Successfully uploaded ${inserted.length} products!\n`);

    // Display summary
    console.log('📊 Upload Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Total Products: ${inserted.length}`);
    console.log(`Food Items: ${products.filter(p => p.category === 'food').length}`);
    console.log(`Accessories: ${products.filter(p => p.category === 'accessories').length}`);
    console.log(`Health/Medicine: ${products.filter(p => p.category === 'health').length}`);
    console.log(`In Stock: ${products.filter(p => p.inStock).length}`);
    console.log(`Out of Stock: ${products.filter(p => !p.inStock).length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('✨ Database is ready with real data!');
    console.log('🚀 Restart your server to see the changes.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run the upload
uploadProductsFromCSV();
