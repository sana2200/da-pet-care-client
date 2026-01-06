const mongoose = require('mongoose');
const Product = require('../models/Product.model');
require('dotenv').config();

// Segment 2 Product Data
const segment2Data = [
  { serial: 105, barcode: "8850477890404", name: "Smart Heart Can - Tuna in Jelly -400g", category: "Food", price: 230.00, stock: 32 },
  { serial: 106, barcode: "8850477898158", name: "Smart Heart - Tuna and Shrimp - 1.2kg", category: "Food", price: 790.00, stock: 0 },
  { serial: 107, barcode: "8850477898356", name: "Smart Heart - Tuna and Shrimp - 3kg", category: "Food", price: 1650.00, stock: 0 },
  { serial: 108, barcode: "8850477840508", name: "Smart Heart - Sea Food - 480 g", category: "Food", price: 360.00, stock: 0 },
  { serial: 109, barcode: "8850477895485", name: "Smart Heart - Salmon - 480 g", category: "Food", price: 360.00, stock: 0 },
  { serial: 110, barcode: "PDR.00396", name: "Non listed Service  - Mox", category: "Medicine", price: 80.00, stock: 2 },
  { serial: 111, barcode: "PDR.00395", name: "Cat Carry Bag - Bagpack Ball Shaped", category: "Accessories", price: 1450.00, stock: 7 },
  { serial: 112, barcode: "PDR.00394", name: "Vac Purevax-With checkup,Pushing,Card re/issue fee", category: "Medicine", price: 1300.00, stock: 140 },
  { serial: 113, barcode: "PDR.00393", name: "Inj. Parasitin Vet - 10 ml", category: "Medicine", price: 118.00, stock: 5 },
  { serial: 114, barcode: "PDR.00392", name: "INJ. TPC", category: "Medicine", price: 25.00, stock: 1 },
  { serial: 115, barcode: "PDR.00391", name: "FHV Test", category: "Diagnostic Test", price: 8.00, stock: 20 },
  { serial: 116, barcode: "PDR.00390", name: "SYP. PA Cool Pet - 50ml", category: "Medicine", price: 90.00, stock: 10 },
  { serial: 117, barcode: "PDR.00389", name: "Syp. Ceevit - 100ml", category: "Medicine", price: 40.00, stock: 0 },
  { serial: 118, barcode: "PDR.00388", name: "Susp. Ciprocin - 60ml", category: "Medicine", price: 100.00, stock: 4 },
  { serial: 119, barcode: "PDR.00387", name: "Susp. Moxaclav- 100ml", category: "Medicine", price: 220.00, stock: 25 },
  { serial: 120, barcode: "PDR.00386", name: "Tab. Mucomist-DT - 600mg", category: "Medicine", price: 15.00, stock: 13 },
  { serial: 121, barcode: "PDR.00385", name: "Syp. Inolac - 100ml", category: "Medicine", price: 140.00, stock: 5 },
  { serial: 122, barcode: "P-DR.00384", name: "Inj. P-20 Vet", category: "Medicine", price: 150.00, stock: 7 },
  { serial: 123, barcode: "P-DR.00383", name: "Inj. Renamic Vet - 10ml", category: "Medicine", price: 50.00, stock: 16 },
  { serial: 124, barcode: "P-DR.00382", name: "Inj. Dexaren - 10ml", category: "Medicine", price: 35.00, stock: 14 },
  { serial: 125, barcode: "P-DR.00378", name: "Radium Collar Belt", category: "Accessories", price: 150.00, stock: 84 },
  { serial: 126, barcode: "6972229780251", name: "Haisenpet Cat litter - Coffee - 10L", category: "Accessories", price: 600.00, stock: 6 },
  { serial: 127, barcode: "6972229780268", name: "Haisenpet Cat litter - Lemon - 10L", category: "Accessories", price: 600.00, stock: 18 },
  { serial: 128, barcode: "6972229780282", name: "Haisenpet Cat litter - Levender - 10L", category: "Accessories", price: 600.00, stock: 27 },
  { serial: 129, barcode: "8681692601915", name: "Paw Paw kitten Can - Chicken", category: "Food", price: 190.00, stock: 12 },
  { serial: 130, barcode: "8681692601908", name: "Paw Paw Kitten Can - Fish", category: "Food", price: 190.00, stock: 17 },
  { serial: 131, barcode: "6927749871538", name: "Wanpy Meat Paste- Salmon,Chicken & Carrot", category: "Food", price: 150.00, stock: 16 },
  { serial: 132, barcode: "6927749871545", name: "Wanpy Meat Paste- Tuna,Chicken & Carrot", category: "Food", price: 150.00, stock: 37 },
  { serial: 133, barcode: "8681299603626", name: "Jungle Adult - Lamb - 1.5 kg", category: "Accessories", price: 840.00, stock: 2 },
  { serial: 134, barcode: "P-DR.00368", name: "Treasure toy - Palok", category: "Accessories", price: 120.00, stock: 26 },
  { serial: 135, barcode: "PDR.00367", name: "Rubber Chew Toy", category: "Accessories", price: 150.00, stock: 1 },
  { serial: 136, barcode: "PDR.00366", name: "Treasure toy", category: "Accessories", price: 120.00, stock: 8 },
  { serial: 137, barcode: "PDR.00365", name: "Inj. Oxyton DS", category: "Medicine", price: 26.00, stock: 10 },
  { serial: 138, barcode: "PDR.00364", name: "Inj. Moxin - 500mg", category: "Medicine", price: 55.00, stock: 6 },
  { serial: 139, barcode: "P-DR.00363", name: "Oral Paste Trialon", category: "Medicine", price: 100.00, stock: 1 },
  { serial: 140, barcode: "P-DR.00362", name: "Single Belt collar", category: "Medicine", price: 100.00, stock: 40 },
  { serial: 141, barcode: "PDR.00361", name: "Inj. Clindacin 600", category: "Medicine", price: 70.00, stock: 26 },
  { serial: 142, barcode: "P-DR.00360", name: "Tab. Tracid 500mg", category: "Medicine", price: 23.00, stock: 9 },
  { serial: 143, barcode: "PDR.00359", name: "Syp. Alanil - 50ml", category: "Medicine", price: 48.00, stock: 21 },
  { serial: 144, barcode: "PDR.00358", name: "Oint. Combo 4 - 15g", category: "Medicine", price: 150.00, stock: 9 },
  { serial: 145, barcode: "8850477883857", name: "Smart Heart Pouch Adult-Tuna with Chicken in Jelly", category: "Food", price: 90.00, stock: 145 },
  { serial: 146, barcode: "8852021705622", name: "Bellotta Adult Pouch - Tuna & Chicken - 85g", category: "Food", price: 90.00, stock: 0 },
  { serial: 147, barcode: "PDR.00355", name: "Neuter surgery (cryptorchid cat)", category: "Service", price: 4000.00, stock: -2 },
  { serial: 148, barcode: "P-DR.00354", name: "Pow. Nebanol - 10g", category: "Medicine", price: 25.00, stock: 12 },
  { serial: 149, barcode: "P-DR.00353", name: "Oral Paste Apsol", category: "Medicine", price: 80.00, stock: 9 },
  { serial: 150, barcode: "P-DR.00352", name: "E/E drop Gentabac - 5ml", category: "Medicine", price: 32.00, stock: 2 },
  { serial: 151, barcode: "PDR.00351", name: "Eye drop Gatiflox - 5ml", category: "Medicine", price: 125.00, stock: 5 },
  { serial: 152, barcode: "PDR.00350", name: "Mouse Ball", category: "Accessories", price: 100.00, stock: 0 },
  { serial: 153, barcode: "PDR.00349", name: "Inf. Normalin - 500ml", category: "Medicine", price: 67.00, stock: 32 },
  { serial: 154, barcode: "PDR.00348", name: "Inf. Electrosal  - 500 ml", category: "Medicine", price: 71.00, stock: 15 },
  { serial: 155, barcode: "PDR.00346", name: "Pow. Ectonil Vet  - 10g", category: "Medicine", price: 38.00, stock: 0 },
  { serial: 156, barcode: "8857101750837", name: "Petme Lyte - 15g", category: "Medicine", price: 140.00, stock: 4 },
  { serial: 157, barcode: "6972229781180", name: "Haisenpet cat litter -Lemon- 25L", category: "Accessories", price: 1500.00, stock: 0 },
  { serial: 158, barcode: "6972229781630", name: "Haisenpet cat litter -Coffee-  25L", category: "Accessories", price: 1500.00, stock: 2 },
  { serial: 159, barcode: "6972229781579", name: "Haisenpet cat litter -Levender- 25L", category: "Accessories", price: 1500.00, stock: 14 },
  { serial: 160, barcode: "6972229780367", name: "Haisenpet cat litter -Lemon-  5L", category: "Accessories", price: 320.00, stock: 26 },
  { serial: 161, barcode: "6972229780367", name: "Haisenpet cat litter -Levender-  5L", category: "Accessories", price: 320.00, stock: 49 },
  { serial: 162, barcode: "6972229780367", name: "Haisenpet cat litter -Coffee-  5L", category: "Accessories", price: 320.00, stock: 24 },
  { serial: 163, barcode: "6927749871125", name: "Wanpy Creamy cat Treat tuna & Cod fish -70 g", category: "Food", price: 230.00, stock: 24 },
  { serial: 164, barcode: "8720256113775", name: "Truly Creamy Cat treat - Shrimp & Codfish- 70g", category: "Food", price: 230.00, stock: 9 },
  { serial: 165, barcode: "8859483600014", name: "Frontguard Plus Spot on", category: "Medicine", price: 380.00, stock: 24 },
  { serial: 166, barcode: "PDR.00331", name: "Susp. Pet Gasnil - 30ml", category: "Medicine", price: 95.00, stock: 7 },
  { serial: 167, barcode: "PDR.00330", name: "Tab. PA-Dr Petz Iromin", category: "Medicine", price: 30.00, stock: 77 },
  { serial: 168, barcode: "PDR.00329", name: "Sol. OTI-PURE", category: "Accessories", price: 1350.00, stock: 0 },
  { serial: 169, barcode: "P-DR.00328", name: "Syp. Vitagrow -100ml", category: "Medicine", price: 80.00, stock: 8 },
  { serial: 170, barcode: "P-DR.00327", name: "Susp. Tridosil - 15ml", category: "Medicine", price: 85.00, stock: 14 },
  { serial: 171, barcode: "P-DR.00326", name: "Urine Pad / Pee pad", category: "Accessories", price: 70.00, stock: 45 },
  { serial: 172, barcode: "P-DR.00325", name: "Grooming Brush Large", category: "Accessories", price: 280.00, stock: 8 },
  { serial: 173, barcode: "8681299602032", name: "Jungle Adult- Salmon - 1.5 kg", category: "Food", price: 840.00, stock: 12 },
  { serial: 174, barcode: "P-DR.00323", name: "Litter box - M", category: "Accessories", price: 400.00, stock: 10 },
  { serial: 175, barcode: "PDR.00322", name: "Hormon Injection", category: "Medicine", price: 500.00, stock: -11 },
  { serial: 176, barcode: "PDR.00321", name: "Butterfly Needle", category: "Others", price: 10.00, stock: -420 },
  { serial: 177, barcode: "PDR.00320", name: "Saline pushing & Medicine Cost", category: "Service", price: 300.00, stock: -343 },
  { serial: 178, barcode: "PDR.00319", name: "Saline Pushing & Prescribed Medicine cost", category: "Service", price: 500.00, stock: -107 },
  { serial: 179, barcode: "PDR.00318", name: "Oxygen Supply (Per 10 Minutes)", category: "Service", price: 200.00, stock: -25 },
  { serial: 180, barcode: "PDR.00317", name: "Follow up Consultancy", category: "Service", price: 400.00, stock: -117 },
  { serial: 181, barcode: "PDR.00316", name: "Minor Surgery", category: "Surgery", price: 1000.00, stock: -12 },
  { serial: 182, barcode: "PDR.00315", name: "Consultancy - Rescue animal", category: "Service", price: 400.00, stock: -17 },
  { serial: 183, barcode: "PDR.00314", name: "Others Service Cost", category: "Service", price: 50.00, stock: -444 },
  { serial: 184, barcode: "PDR.00313", name: "Syringe - 1ml - JMI", category: "Accessories", price: 5.50, stock: -96 },
  { serial: 185, barcode: "PDR.00312", name: "Syringe - 1ml - OSL", category: "Medicine", price: 4.50, stock: -1318 },
  { serial: 186, barcode: "PDR.00311", name: "Syringe - 3ml - Incepta", category: "Medicine", price: 4.00, stock: -105 },
  { serial: 187, barcode: "PDR.00310", name: "Syringe - 5ml - OSL", category: "Medicine", price: 5.00, stock: -72 },
  { serial: 188, barcode: "PDR.00309", name: "Flushing -Follow up-Fixed catheterization", category: "Surgery", price: 800.00, stock: -8 },
  { serial: 189, barcode: "PDR.00308", name: "Flushing -Follow up-Setup new catheterization", category: "Surgery", price: 1000.00, stock: -1 },
  { serial: 190, barcode: "PDR.00307", name: "Catheterization - Cat", category: "Surgery", price: 2500.00, stock: -10 },
  { serial: 191, barcode: "PDR.00306", name: "Medicated Bath", category: "Service", price: 1000.00, stock: -13 },
  { serial: 192, barcode: "PDR.00305", name: "Fur Trimming - Dog", category: "Service", price: 3500.00, stock: 0 },
  { serial: 193, barcode: "PDR.00304", name: "Fur Trimming - Cat", category: "Service", price: 2000.00, stock: -32 },
  { serial: 194, barcode: "PDR.00303", name: "Ear Cleaning", category: "Service", price: 300.00, stock: -69 },
  { serial: 195, barcode: "PDR.00302", name: "Nail trimming", category: "Service", price: 300.00, stock: -122 },
  { serial: 196, barcode: "PDR.00301", name: "Rectal / Vaginal Prolapse Correction", category: "Surgery", price: 1500.00, stock: -3 },
  { serial: 197, barcode: "PDR.00300", name: "Enucleation Surgery", category: "Surgery", price: 3000.00, stock: 0 },
  { serial: 198, barcode: "PDR.00299", name: "Hernia Surgery", category: "Surgery", price: 4000.00, stock: -1 },
  { serial: 199, barcode: "PDR.00298", name: "Amputation Surgery", category: "Surgery", price: 5000.00, stock: -2 },
  { serial: 200, barcode: "PDR.00297", name: "Enema", category: "Service", price: 1500.00, stock: -14 },
  { serial: 201, barcode: "PDR.00296", name: "Fracture Management - Cat", category: "Service", price: 3500.00, stock: -7 },
  { serial: 202, barcode: "PDR.00295", name: "Fracture Management - Dog", category: "Service", price: 5000.00, stock: 0 },
  { serial: 203, barcode: "PDR.00294", name: "Pyometra Surgery - Cat", category: "Surgery", price: 4500.00, stock: -8 },
  { serial: 204, barcode: "PDR.00293", name: "Pyometra Surgery - Dog", category: "Surgery", price: 5000.00, stock: -1 },
  { serial: 205, barcode: "PDR.00292", name: "Tumor Surgery - Large Scale Zone", category: "Surgery", price: 5000.00, stock: -1 },
  { serial: 206, barcode: "PDR.00291", name: "Tumor Surgery - Average Zone", category: "Surgery", price: 2500.00, stock: -2 },
  { serial: 207, barcode: "PDR.00290", name: "Tumor Surgery - Tiny Zone", category: "Surgery", price: 1500.00, stock: 0 },
  { serial: 208, barcode: "PDR.00289", name: "C section Surgery - Dog", category: "Surgery", price: 6000.00, stock: 0 },
  { serial: 209, barcode: "PDR.00288", name: "C section Surgery - Cat", category: "Surgery", price: 5000.00, stock: -7 },
  { serial: 210, barcode: "PDR.00287", name: "Neuter surgery / Orchiectomy - Dog", category: "Surgery", price: 2500.00, stock: -2 }
];

// Category mapping function
function mapCategory(category) {
  const categoryMap = {
    'Food': 'food',
    'Accessories': 'accessories',
    'Medicine': 'healthcare',
    'Service': 'other',
    'Surgery': 'other',
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
    subCategory: item.category,
    brand: extractBrand(item.name),
    images: [],
    stock: Math.max(0, item.stock),
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
  
  return [...new Set(tags)];
}

// Main upload function
async function uploadSegment2() {
  try {
    console.log('🚀 Starting Segment 2 Upload...');
    console.log(`📦 Total products to upload: ${segment2Data.length}`);

    if (segment2Data.length === 0) {
      console.log('⚠️  No data found. Please add Segment 2 data to this file.');
      return;
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pet-care');
    console.log('✅ Connected to MongoDB');

    // Transform all products
    const products = segment2Data.map(transformProductData);

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
    
    const serials = segment2Data.map(p => p.serial);
    console.log(`\n🎯 Serial range: ${Math.min(...serials)} - ${Math.max(...serials)}`);
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
  uploadSegment2()
    .then(() => {
      console.log('\n✅ Segment 2 upload completed successfully!');
      console.log('📝 Ready for Segment 3');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Upload failed:', error.message);
      process.exit(1);
    });
}

module.exports = { uploadSegment2, segment2Data };
