const mongoose = require('mongoose');
const Product = require('../models/Product.model');
require('dotenv').config();

// Segment 1 Product Data - 104 items
const segment1Data = [
  { serial: 1, barcode: "8850477018778", name: "Smart heart Treats - 4*15g- Chicken", category: "Food", price: 230.00, stock: 24 },
  { serial: 2, barcode: "8850477018785", name: "Smart heart Treats - 4*15g- Tuna", category: "Food", price: 230.00, stock: 24 },
  { serial: 3, barcode: "PDR.00504", name: "Delivery Charge", category: "Others", price: 80.00, stock: 0 },
  { serial: 4, barcode: "PDR.00503", name: "Wall mount Catnip", category: "Accessories", price: 190.00, stock: 4 },
  { serial: 5, barcode: "PDR.00502", name: "Pet Toothbrush", category: "Accessories", price: 130.00, stock: 2 },
  { serial: 6, barcode: "PDR.00501", name: "INJ. MARBO-REN - 10ml", category: "Medicine", price: 350.00, stock: 5 },
  { serial: 7, barcode: "PDR.00500", name: "Susp. Delentin 50mg/ml", category: "Medicine", price: 16.00, stock: 2 },
  { serial: 8, barcode: "PDR.00499", name: "Inj. Fusid", category: "Medicine", price: 9.00, stock: 5 },
  { serial: 9, barcode: "PDR.00498", name: "Syp. Moxacil - 100ml", category: "Medicine", price: 70.00, stock: 19 },
  { serial: 10, barcode: "PDR.00497", name: "Inj. Mega C - 500mg/5ml", category: "Medicine", price: 6.00, stock: 70 },
  { serial: 11, barcode: "PDR.00496", name: "INJ. CYNOMIN - 10 ML", category: "Medicine", price: 32.00, stock: 6 },
  { serial: 12, barcode: "P-DR.00495", name: "INJ. Melocam vet 0.5g - 10ml", category: "Medicine", price: 60.00, stock: 17 },
  { serial: 13, barcode: "8682631201142", name: "Jungle Cat treat - Tuna & Salmon - 70g", category: "Food", price: 250.00, stock: 9 },
  { serial: 14, barcode: "8682631201135", name: "Jungle Cat treat - Chicken - 70g", category: "Food", price: 250.00, stock: 8 },
  { serial: 15, barcode: "PDR.00492", name: "E collar - Elizabeth Collar - Size 3", category: "Accessories", price: 350.00, stock: 3 },
  { serial: 16, barcode: "PDR.00491", name: "E collar - Elizabeth Collar - Size 1", category: "Accessories", price: 500.00, stock: 3 },
  { serial: 17, barcode: "6970117120370", name: "Bioline Catnip Invigorating - 20g", category: "Food", price: 280.00, stock: 7 },
  { serial: 18, barcode: "PDR.00489", name: "Alice Lotion -60g", category: "Medicine", price: 130.00, stock: 3 },
  { serial: 19, barcode: "PDR.00488", name: "Syp. Bicozin - 100 ml", category: "Medicine", price: 60.00, stock: 8 },
  { serial: 20, barcode: "PDR.00487", name: "Pow Erocot Vet 10g", category: "Medicine", price: 45.00, stock: 2 },
  { serial: 21, barcode: "PDR.00486", name: "Pow. Neoxel vet - 10g", category: "Medicine", price: 40.00, stock: 2 },
  { serial: 22, barcode: "P-DR.00485", name: "Inj. Renamox - 1G", category: "Medicine", price: 103.00, stock: 1 },
  { serial: 23, barcode: "PDR.00484", name: "Pet Hex Shampoo - 200ml", category: "Medicine", price: 980.00, stock: 0 },
  { serial: 24, barcode: "PDR.00483", name: "Cat grass jar", category: "Food", price: 380.00, stock: 0 },
  { serial: 25, barcode: "PDR.00482", name: "Rivalta Test", category: "Service", price: 300.00, stock: -1 },
  { serial: 26, barcode: "PDR.00481", name: "Bell Only", category: "Accessories", price: 25.00, stock: 30 },
  { serial: 27, barcode: "PDR.00480", name: "Pow. Pronapen 40 Lac (Vet)", category: "Medicine", price: 65.00, stock: 5 },
  { serial: 28, barcode: "6970117120202", name: "Bioline Pet Dry Shampoo Powder - 100g", category: "Accessories", price: 590.00, stock: 5 },
  { serial: 29, barcode: "8682631204310", name: "Pet Bee's Cat Food - Chicken - 1KG", category: "Food", price: 500.00, stock: 0 },
  { serial: 30, barcode: "PDR.00477", name: "Oint. Dermupin - 15gm", category: "Medicine", price: 180.00, stock: 6 },
  { serial: 31, barcode: "PDR.00476", name: "Nasal Drop Solo", category: "Medicine", price: 25.00, stock: 16 },
  { serial: 32, barcode: "PDR.00475", name: "Syp. Alatrol Pediatric Drops", category: "Medicine", price: 28.00, stock: 13 },
  { serial: 33, barcode: "8904285511058", name: "Billi - Adult - Tuna - 1.5kg", category: "Food", price: 690.00, stock: 8 },
  { serial: 34, barcode: "8904285511027", name: "Billi - Kitten - Chicken - 1.5 kg", category: "Food", price: 690.00, stock: 19 },
  { serial: 35, barcode: "8906074445254", name: "Billi - Adult - Tuna - 500g", category: "Food", price: 270.00, stock: 20 },
  { serial: 36, barcode: "8906074445278", name: "Billi - Kitten - Tuna - 500g", category: "Food", price: 270.00, stock: 27 },
  { serial: 37, barcode: "PDR.00470", name: "L Favourite - 25L - Coffee", category: "Accessories", price: 1350.00, stock: 1 },
  { serial: 38, barcode: "PDR.00469", name: "L Favourite - 25L - Lemon", category: "Accessories", price: 1350.00, stock: 2 },
  { serial: 39, barcode: "PDR.00468", name: "L Favourite - 25L - Levender", category: "Accessories", price: 1350.00, stock: 23 },
  { serial: 40, barcode: "PDR.00467", name: "DR. PETZ Ultivite Gel - 6gm", category: "Medicine", price: 60.00, stock: 25 },
  { serial: 41, barcode: "PDR.00465", name: "Syp. PA Zinc Plus - 100 ml", category: "Medicine", price: 95.00, stock: 5 },
  { serial: 42, barcode: "8904285516572", name: "Miow Miow kitten milk replacer - 150g", category: "Food", price: 570.00, stock: 3 },
  { serial: 43, barcode: "6972577016347", name: "Snowcat Cat Litter - 10L - Coffee", category: "Accessories", price: 600.00, stock: 22 },
  { serial: 44, barcode: "6972577016347", name: "Snowcat Cat Litter - 10L - Levender", category: "Accessories", price: 600.00, stock: 9 },
  { serial: 45, barcode: "6972577016347", name: "Snowcat Cat Litter - 10L - Lemon", category: "Accessories", price: 600.00, stock: 7 },
  { serial: 46, barcode: "6972577016224", name: "Snowcat Cat Litter - 5L - Coffee", category: "Accessories", price: 320.00, stock: 4 },
  { serial: 47, barcode: "PDR.00459", name: "C. Section with Spay surgery", category: "Service", price: 7500.00, stock: -6 },
  { serial: 48, barcode: "PDR.00458", name: "Susp. Flamyd - 200mg/5ml - 60 ml", category: "Medicine", price: 35.00, stock: 3 },
  { serial: 49, barcode: "PDR.00457", name: "Inj. Hepavita - 100 ml", category: "Medicine", price: 360.00, stock: 0 },
  { serial: 50, barcode: "PDR.00456", name: "Inhaler Flutide 125/5 HFA", category: "Medicine", price: 625.00, stock: 0 },
  { serial: 51, barcode: "PDR.00455", name: "Viodin 5% Ointment", category: "Medicine", price: 55.00, stock: 7 },
  { serial: 52, barcode: "7870201379877", name: "Fouzan Chicken Wetfood Can - 400g", category: "Food", price: 230.00, stock: 84 },
  { serial: 53, barcode: "7830201379628", name: "CattoGel Multivitamin Paste - 120g", category: "Medicine", price: 620.00, stock: 0 },
  { serial: 54, barcode: "6972229788677", name: "Haisenpet Creamy Cat Treat - Chicken", category: "Food", price: 230.00, stock: 14 },
  { serial: 55, barcode: "6973373206109", name: "Haisenpet Premium Adult Food-450g", category: "Food", price: 250.00, stock: 2 },
  { serial: 56, barcode: "8694686406083", name: "Bonacibo Premium-Kitten Chicken,Anc&Rice - 1.5kg", category: "Food", price: 990.00, stock: 14 },
  { serial: 57, barcode: "PDR.00449", name: "GU Sandy Cat Litter - Levender - 5L", category: "Accessories", price: 280.00, stock: 0 },
  { serial: 58, barcode: "PDR.00448", name: "GU Sandy Cat Litter - Lemon - 5L", category: "Accessories", price: 280.00, stock: 0 },
  { serial: 59, barcode: "PDR.00447", name: "GU Sandy Cat Litter - Apple - 5L", category: "Accessories", price: 280.00, stock: 0 },
  { serial: 60, barcode: "PDR.00446", name: "Cat dress -Stylish Regular", category: "Accessories", price: 280.00, stock: 2 },
  { serial: 61, barcode: "PDR.00445", name: "Cat Grass stick", category: "Food", price: 210.00, stock: 0 },
  { serial: 62, barcode: "PDR.00444", name: "Spring Toy", category: "Accessories", price: 90.00, stock: 12 },
  { serial: 63, barcode: "PDR.00443", name: "Paw Paw Adult Cat food - 7kg", category: "Food", price: 2750.00, stock: 1 },
  { serial: 64, barcode: "PDR.00442", name: "Moxaclav Forte PFS - 50ml", category: "Medicine", price: 230.00, stock: 0 },
  { serial: 65, barcode: "PDR.00441", name: "Cuties Catz - Chicken & Tuna - 8 kg", category: "Food", price: 3350.00, stock: 2 },
  { serial: 66, barcode: "PDR.00440", name: "Sol. Itracon Vet - 15ml", category: "Medicine", price: 100.00, stock: 3 },
  { serial: 67, barcode: "P-DR.00439", name: "Syp. Alkari / Alkuli - 100ml", category: "Medicine", price: 75.00, stock: 2 },
  { serial: 68, barcode: "P-DR.00438", name: "Emema", category: "Service", price: 1500.00, stock: -1 },
  { serial: 69, barcode: "PDR.00437", name: "Inj. PPI 40 IV", category: "Medicine", price: 90.00, stock: 17 },
  { serial: 70, barcode: "8850477882850", name: "Smart Heart Pouch - Sardin w Chicken & Rice", category: "Food", price: 90.00, stock: 26 },
  { serial: 71, barcode: "8850477012653", name: "Smart Heart Pouch -Chicken w Rice and Carrot - 85g", category: "Food", price: 90.00, stock: 17 },
  { serial: 72, barcode: "8850477837072", name: "Smart Heart - Chicken and Tuna - 7.0 kg", category: "Food", price: 3400.00, stock: 2 },
  { serial: 73, barcode: "8850477017115", name: "Smart Heart - Chicken and Tuna - 10 kg", category: "Food", price: 4600.00, stock: 7 },
  { serial: 74, barcode: "8850125072978", name: "Friskies Meaty Grills Dry Cat Food- 400g", category: "Food", price: 400.00, stock: 5 },
  { serial: 75, barcode: "8850125072855", name: "FRISKIES Kitten Discoveries Dry Cat Food - 400gm", category: "Food", price: 400.00, stock: 1 },
  { serial: 76, barcode: "8850477007550", name: "Cuties Catz Can - Tuna - 400G", category: "Food", price: 200.00, stock: 32 },
  { serial: 77, barcode: "6927749871521", name: "Wanpy Meat Paste- Duck & Pumpkin", category: "Food", price: 150.00, stock: 29 },
  { serial: 78, barcode: "6927749871514", name: "Wanpy Meat Paste- Chicken & Carrot", category: "Food", price: 150.00, stock: 9 },
  { serial: 79, barcode: "8698995003544", name: "Reflex Plus Adult Cat Food Salmon 1.5Kg", category: "Food", price: 1250.00, stock: 0 },
  { serial: 80, barcode: "8698995027182", name: "Reflex Plus Adult Cat Food Choosy with Salmon 1.5K", category: "Food", price: 1250.00, stock: 0 },
  { serial: 81, barcode: "8698995003551", name: "Reflex Plus Adult Cat Food Chicken-1.5kg", category: "Food", price: 1250.00, stock: 0 },
  { serial: 82, barcode: "8694686406090", name: "Bonacibo Premium-Chicken With Anchovy & Rice-2KG", category: "Food", price: 1250.00, stock: 0 },
  { serial: 83, barcode: "8681889062116", name: "Cango Adult Chiken Recipe- 1 KG", category: "Food", price: 490.00, stock: 0 },
  { serial: 84, barcode: "8850477898509", name: "Smart Heart - Tuna & Shrimp - 480 g", category: "Food", price: 360.00, stock: 0 },
  { serial: 85, barcode: "6954016638839", name: "Pet Toothpaste - 70g", category: "Accessories", price: 270.00, stock: 4 },
  { serial: 86, barcode: "8857101750882", name: "Petme Plus Gel - 100g", category: "Medicine", price: 1000.00, stock: 12 },
  { serial: 87, barcode: "PDR.00419", name: "Inj. Barbit - 200mg/ml", category: "Medicine", price: 16.00, stock: 25 },
  { serial: 88, barcode: "PDR.00418", name: "Moxibac Eye drop", category: "Medicine", price: 160.00, stock: 0 },
  { serial: 89, barcode: "PDR.00417", name: "Toxoplasma kit test", category: "Diagnostic Test", price: 600.00, stock: -3 },
  { serial: 90, barcode: "PDR.00416", name: "Captain Meow Litter - Lemon - 5L", category: "Accessories", price: 280.00, stock: 0 },
  { serial: 91, barcode: "PDR.00415", name: "Captain Meow Litter - Lavender - 5L", category: "Accessories", price: 280.00, stock: 0 },
  { serial: 92, barcode: "PDR.00414", name: "Captain Meow Litter - Coffee - 5L", category: "Accessories", price: 280.00, stock: 0 },
  { serial: 93, barcode: "PDR.00413", name: "Tab. Methsolon 4", category: "Medicine", price: 6.00, stock: 33 },
  { serial: 94, barcode: "PDR.00412", name: "Tab. Monas 10", category: "Medicine", price: 17.50, stock: 30 },
  { serial: 95, barcode: "PDR.00411", name: "Cap. Neugalin 50", category: "Medicine", price: 14.60, stock: 0 },
  { serial: 96, barcode: "6927749871194", name: "Wanpy Creamy Treat - Tuna - 70g", category: "Food", price: 230.00, stock: 16 },
  { serial: 97, barcode: "6927749871217", name: "Wanpy Creamy Treat - Chicken and Carb - 70g", category: "Food", price: 230.00, stock: 5 },
  { serial: 98, barcode: "8720256113799", name: "Truly Creamy Cat treat - Salmon & Cranberry- 70g", category: "Food", price: 230.00, stock: 1 },
  { serial: 99, barcode: "8720256113751", name: "Truly Grain Free Can - Chicken & Carb - 95g", category: "Accessories", price: 180.00, stock: 14 },
  { serial: 100, barcode: "6972229783504", name: "Haisenpet Extreme Lavender - 5L", category: "Accessories", price: 320.00, stock: 0 },
  { serial: 101, barcode: "8904285510815", name: "Billi - Kitten - Chicken - 500g", category: "Food", price: 270.00, stock: 58 },
  { serial: 102, barcode: "P-DR.00404", name: "Inj. Onaseron - 4 ml", category: "Medicine", price: 32.00, stock: 249 },
  { serial: 103, barcode: "PDR.00403", name: "T-Mycin Plus Eye drop - 5ml", category: "Medicine", price: 150.00, stock: 0 },
  { serial: 104, barcode: "PDR.00402", name: "T-Mycin Eye Drop - 5ml", category: "Medicine", price: 100.00, stock: 1 }
];

// Category mapping function
function mapCategory(category) {
  const categoryMap = {
    'Food': 'food',
    'Accessories': 'accessories',
    'Medicine': 'healthcare',
    'Service': 'other',
    'Others': 'other',
    'Diagnostic Test': 'healthcare'
  };
  return categoryMap[category] || 'other';
}

// Transform data to match Product schema
function transformProductData(item) {
  const inStock = item.stock > 0;
  
  return {
    name: item.name,
    description: `${item.name} - Product Code: ${item.barcode}`,
    price: item.price,
    category: mapCategory(item.category),
    subCategory: item.category, // Keep original category as subcategory
    brand: extractBrand(item.name),
    images: [],
    stock: Math.max(0, item.stock), // Ensure stock is not negative
    inStock: inStock,
    featured: false,
    rating: 0,
    numReviews: 0,
    reviews: [],
    specifications: new Map([
      ['Product Code', item.barcode],
      ['Serial Number', item.serial.toString()],
      ['Original Category', item.category]
    ]),
    tags: generateTags(item.name, item.category),
    discount: 0,
    isActive: true
  };
}

// Extract brand from product name
function extractBrand(name) {
  const brands = [
    'Smart Heart', 'Smart heart', 'Billi', 'Bioline', 'Jungle', 'Pet Bee',
    'Snowcat', 'Miow Miow', 'Fouzan', 'CattoGel', 'Haisenpet', 'Bonacibo',
    'GU Sandy', 'Paw Paw', 'Cuties Catz', 'Friskies', 'FRISKIES', 'Wanpy',
    'Reflex Plus', 'Cango', 'Captain Meow', 'Truly', 'DR. PETZ', 'Petme Plus'
  ];
  
  for (const brand of brands) {
    if (name.toLowerCase().includes(brand.toLowerCase())) {
      return brand;
    }
  }
  
  return 'Generic';
}

// Generate tags from product name and category
function generateTags(name, category) {
  const tags = [category.toLowerCase()];
  const nameLower = name.toLowerCase();
  
  // Common keywords
  const keywords = [
    'chicken', 'tuna', 'salmon', 'fish', 'cat', 'kitten', 'adult',
    'food', 'treat', 'litter', 'toy', 'medicine', 'injection', 'drops',
    'shampoo', 'collar', 'grass', 'milk', 'wet', 'dry'
  ];
  
  keywords.forEach(keyword => {
    if (nameLower.includes(keyword)) {
      tags.push(keyword);
    }
  });
  
  return [...new Set(tags)]; // Remove duplicates
}

// Main upload function
async function uploadSegment1() {
  try {
    console.log('🚀 Starting Segment 1 Upload...');
    console.log(`📦 Total products to upload: ${segment1Data.length}`);

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pet-care');
    console.log('✅ Connected to MongoDB');

    // Transform all products
    const products = segment1Data.map(transformProductData);

    // Clear existing products (optional - comment out if you want to keep existing data)
    // await Product.deleteMany({});
    // console.log('🗑️  Cleared existing products');

    // Bulk insert maintaining serial order
    const result = await Product.insertMany(products, { ordered: true });
    
    console.log(`✅ Successfully uploaded ${result.length} products to database`);
    console.log('\n📊 Upload Summary:');
    
    // Group by category
    const categoryCount = {};
    result.forEach(product => {
      categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
    });
    
    console.log('Products by category:');
    Object.entries(categoryCount).forEach(([category, count]) => {
      console.log(`  - ${category}: ${count} products`);
    });
    
    console.log('\n🎯 Serial range: 1 - 104');
    console.log('✅ All products uploaded in correct serial order');
    
  } catch (error) {
    console.error('❌ Upload failed:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the upload
if (require.main === module) {
  uploadSegment1()
    .then(() => {
      console.log('\n✅ Segment 1 upload completed successfully!');
      console.log('📝 Ready for Segment 2');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Upload failed:', error.message);
      process.exit(1);
    });
}

module.exports = { uploadSegment1, segment1Data };
