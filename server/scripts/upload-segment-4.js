const mongoose = require('mongoose');
const Product = require('../models/Product.model');
require('dotenv').config();

// Segment 4 Product Data (FINAL SEGMENT)
const segment4Data = [
  { serial: 315, barcode: "PDR.00126", name: "Microchip", category: "Service", price: 3000.00, stock: 29 },
  { serial: 316, barcode: "PDR.00119", name: "Vac DHPPL-With checkup,Pushing,Card re/issue fees", category: "Medicine", price: 1300.00, stock: 15 },
  { serial: 317, barcode: "PDR.00118", name: "Vac PCH - with Checkup,Pushing,Card", category: "Medicine", price: 1300.00, stock: 91 },
  { serial: 318, barcode: "PDR.00117", name: "Vac Rabies-With checkup,Pushing,Card re/issue fees", category: "Medicine", price: 300.00, stock: 175 },
  { serial: 319, barcode: "9551017800141", name: "Enrich Champion Cat Litter- Levender - 10L", category: "Accessories", price: 520.00, stock: 0 },
  { serial: 320, barcode: "6972577016224", name: "Snowcat Cat Litter - 5L - Levender", category: "Accessories", price: 320.00, stock: 8 },
  { serial: 321, barcode: "PDR.00110", name: "Litter box - Large", category: "Accessories", price: 520.00, stock: 16 },
  { serial: 322, barcode: "PDR.00109", name: "Cat Carry Bag - Handbag", category: "Accessories", price: 1850.00, stock: 0 },
  { serial: 323, barcode: "PDR.00108", name: "Cat Carry Bag - Bagpack", category: "Accessories", price: 1350.00, stock: 11 },
  { serial: 324, barcode: "9551017801476", name: "Enrich Champion Cat Litter- Levender - 5L", category: "Accessories", price: 270.00, stock: 0 },
  { serial: 325, barcode: "9551017801483", name: "Enrich Champion  Cat Litter- Lemon - 5L", category: "Accessories", price: 270.00, stock: 0 },
  { serial: 326, barcode: "6972577016224", name: "Snowcat Cat Litter - 5L - Lemon", category: "Accessories", price: 320.00, stock: 13 },
  { serial: 327, barcode: "6972577016422", name: "Maxpet Cat litter - Levenda - 25L", category: "Accessories", price: 1400.00, stock: 0 },
  { serial: 328, barcode: "6972577016224", name: "Maxpet Cat litter - Levender - 5L", category: "Accessories", price: 320.00, stock: 0 },
  { serial: 329, barcode: "9551017800134", name: "Enrich Champion Bentonite Cat Litter- Lemon- 10L", category: "Accessories", price: 520.00, stock: 0 },
  { serial: 330, barcode: "6972876650549", name: "Shifaa Carbon Bentonite Litter - 10L", category: "Accessories", price: 600.00, stock: 62 },
  { serial: 331, barcode: "6972577016415", name: "Snowcat Cat Litter - 25L - Levender", category: "Accessories", price: 1400.00, stock: 0 },
  { serial: 332, barcode: "6972577016415", name: "Snowcat Cat Litter - 25L - Coffee", category: "Accessories", price: 1400.00, stock: 0 },
  { serial: 333, barcode: "6972577016415", name: "Snowcat Cat Litter - 25L - Lemon", category: "Accessories", price: 1400.00, stock: 0 },
  { serial: 334, barcode: "PDR.00094", name: "E collar - Elizabeth Collar - Size 2", category: "Accessories", price: 450.00, stock: 3 },
  { serial: 335, barcode: "PDR.00093", name: "E collar - Elizabeth Collar - Size 4", category: "Accessories", price: 330.00, stock: 9 },
  { serial: 336, barcode: "PDR.00092", name: "E collar - Elizabeth Collar - Size 7", category: "Accessories", price: 300.00, stock: 8 },
  { serial: 337, barcode: "PDR.00091", name: "E collar - Elizabeth Collar - Size 5", category: "Accessories", price: 300.00, stock: 14 },
  { serial: 338, barcode: "PDR.00090", name: "E collar - Elizabeth Collar - Size 6", category: "Accessories", price: 300.00, stock: 10 },
  { serial: 339, barcode: "PDR.00089", name: "Feeding Kit", category: "Accessories", price: 200.00, stock: 22 },
  { serial: 340, barcode: "PDR.00088", name: "Scoope Large", category: "Accessories", price: 150.00, stock: 53 },
  { serial: 341, barcode: "PDR.00087", name: "Thermometer Flexiable", category: "Accessories", price: 380.00, stock: 1 },
  { serial: 342, barcode: "PDR.00086", name: "Kitten Feeder Small", category: "Accessories", price: 150.00, stock: 0 },
  { serial: 343, barcode: "PDR.00085", name: "Belt Regular", category: "Accessories", price: 100.00, stock: 25 },
  { serial: 344, barcode: "PDR.00084", name: "Belt Premium", category: "Accessories", price: 220.00, stock: 3 },
  { serial: 345, barcode: "PDR.00083", name: "Nail Cutter Plus shaped - Small", category: "Accessories", price: 250.00, stock: 11 },
  { serial: 346, barcode: "PDR.00082", name: "Belt Febric Premium - M", category: "Accessories", price: 120.00, stock: 0 },
  { serial: 347, barcode: "PDR.00081", name: "Belt Febric Premium - S", category: "Accessories", price: 120.00, stock: 4 },
  { serial: 348, barcode: "PDR.00080", name: "Harness open type", category: "Accessories", price: 220.00, stock: 9 },
  { serial: 349, barcode: "PDR.00079", name: "Jacket Herness - XL", category: "Accessories", price: 270.00, stock: 3 },
  { serial: 350, barcode: "PDR.00078", name: "Jacket Herness - L", category: "Accessories", price: 270.00, stock: 4 },
  { serial: 351, barcode: "PDR.00077", name: "Food Bowl Steel", category: "Accessories", price: 220.00, stock: 4 },
  { serial: 352, barcode: "PDR.00076", name: "Frog Face - Double Bowl", category: "Accessories", price: 440.00, stock: 0 },
  { serial: 353, barcode: "PDR.00075", name: "Treasure toy - Mouse", category: "Accessories", price: 90.00, stock: 0 },
  { serial: 354, barcode: "PDR.00074", name: "Cat Toy ball", category: "Accessories", price: 30.00, stock: 0 },
  { serial: 355, barcode: "PDR.00073", name: "Treasure toy - Plastic & Wire Stick", category: "Accessories", price: 120.00, stock: 0 },
  { serial: 356, barcode: "PDR.00072", name: "Treasure toy - Thin Stick", category: "Accessories", price: 120.00, stock: 0 },
  { serial: 357, barcode: "PDR.00071", name: "Treasure toy - Wooden Stick", category: "Accessories", price: 160.00, stock: -1 },
  { serial: 358, barcode: "PDR.00069", name: "Treasure toy - Magic stick", category: "Accessories", price: 160.00, stock: 6 },
  { serial: 359, barcode: "8857101750295", name: "Tab. Helminticide L", category: "Medicine", price: 100.00, stock: 267 },
  { serial: 360, barcode: "8905045002632", name: "Tab. Kiwof", category: "Medicine", price: 120.00, stock: 88 },
  { serial: 361, barcode: "8859238500163", name: "Revolution Spot on - 0.75ml", category: "Accessories", price: 1300.00, stock: 0 },
  { serial: 362, barcode: "PDR.00065", name: "Frontline Spot on - 0.50ml", category: "Accessories", price: 550.00, stock: 10 },
  { serial: 363, barcode: "PDR.00064", name: "Frontline Spray - 100ml", category: "Accessories", price: 850.00, stock: 3 },
  { serial: 364, barcode: "6970117121902", name: "Bioline Ear Mite - 30ml", category: "Accessories", price: 490.00, stock: 23 },
  { serial: 365, barcode: "8857101750851", name: "Petme Plus Gel - 30g", category: "Medicine", price: 390.00, stock: 22 },
  { serial: 366, barcode: "8901138507800", name: "Himalaya Erina EP Shampoo - 200ml", category: "Accessories", price: 600.00, stock: 11 },
  { serial: 367, barcode: "X001LNV5JX", name: "Lime Sulfur Dip - 237ml", category: "Medicine", price: 1080.00, stock: 8 },
  { serial: 368, barcode: "8850477007581", name: "Cuties Catz Can - Chicken - 400G", category: "Food", price: 200.00, stock: 43 },
  { serial: 369, barcode: "8850477000117", name: "Smart Heart Can - Sardine With Chicken in Jelly -", category: "Food", price: 230.00, stock: 39 },
  { serial: 370, barcode: "8852021015882", name: "Bellotta Can - Real tuna topping chicken in Jelly", category: "Food", price: 220.00, stock: 0 },
  { serial: 371, barcode: "8720256113744", name: "Truly Grain Free Can - Chicken & Tuna - 95g", category: "Food", price: 180.00, stock: 0 },
  { serial: 372, barcode: "8720256113737", name: "Truly Grain Free Can - Chicken & Salmon - 95g", category: "Food", price: 180.00, stock: 16 },
  { serial: 373, barcode: "8850589000708", name: "Bellotta Kitten Pouch - chicken mousse - 65g", category: "Food", price: 90.00, stock: 0 },
  { serial: 374, barcode: "8850477019713", name: "Smart Heart Pouch- Adult - Tuna in jelly- 85g", category: "Food", price: 90.00, stock: 114 },
  { serial: 375, barcode: "8850477013278", name: "Smart Heart Pouch- Kitten - Tuna in jelly- 85g", category: "Food", price: 90.00, stock: 147 },
  { serial: 376, barcode: "6927749871088", name: "Wanpy Creamy Treat - Chicken - 70g", category: "Food", price: 230.00, stock: 0 },
  { serial: 377, barcode: "8850477007079", name: "Cuties Catz Pouch - Chicken - 75g", category: "Food", price: 90.00, stock: 72 },
  { serial: 378, barcode: "8850589000975", name: "Bellotta Grain free - Senior- Chicken with whitefi", category: "Food", price: 120.00, stock: 0 },
  { serial: 379, barcode: "8850589000913", name: "Bellotta Grain free - Indoor- Tuna & Whitefish - 7", category: "Food", price: 120.00, stock: 0 },
  { serial: 380, barcode: "8850589000951", name: "Bellotta Grain free - Hairball- Tuna & Chicken Jel", category: "Food", price: 120.00, stock: 25 },
  { serial: 381, barcode: "8850589000937", name: "Bellotta Grain free - Healthy Immune & Multivitami", category: "Food", price: 120.00, stock: 4 },
  { serial: 382, barcode: "8850589000876", name: "Bellotta Grain free - Baby & Mother- Tuna Mousse -", category: "Food", price: 120.00, stock: 0 },
  { serial: 383, barcode: "8718692582101", name: "Truly Tuna Sticks Cat treat - 50g", category: "Food", price: 250.00, stock: 0 },
  { serial: 384, barcode: "6927749871699", name: "Wanpy Meat Broath - Chicken- 50g", category: "Food", price: 100.00, stock: 4 },
  { serial: 385, barcode: "6927749871729", name: "Wanpy Meat Broath - Salmon & Tuna - 50g", category: "Food", price: 100.00, stock: 0 },
  { serial: 386, barcode: "6927749871705", name: "Wanpy Meat Broath - Tuna - 50g", category: "Food", price: 100.00, stock: 1 },
  { serial: 387, barcode: "6927749871682", name: "Wanpy Meat Broath - Chicken, Pumpkin & Carrot - 50", category: "Food", price: 100.00, stock: 3 },
  { serial: 388, barcode: "8853301550017", name: "Whiskas Pouch Adult - Tuna - 80g", category: "Food", price: 90.00, stock: 217 },
  { serial: 389, barcode: "8853301550123", name: "Whiskas Pouch Junior - Mackerel - 80g", category: "Food", price: 90.00, stock: 0 },
  { serial: 390, barcode: "8853301550048", name: "Whiskas Pouch Junior - Tuna - 80g", category: "Food", price: 90.00, stock: 0 },
  { serial: 391, barcode: "8850238094515", name: "Coco Cat Milk Replacer - 150g", category: "Food", price: 680.00, stock: 0 },
  { serial: 392, barcode: "8720256113805", name: "Truly Creamy Cat treat - Tuna & Bonito- 70g", category: "Food", price: 230.00, stock: 4 },
  { serial: 393, barcode: "8720256113782", name: "Truly Creamy Cat treat - Salmon & Codfish- 70g", category: "Food", price: 230.00, stock: 4 },
  { serial: 394, barcode: "8850477801509", name: "Smart Heart - Chicken,Fish,Egg & Milk - 450 g", category: "Food", price: 360.00, stock: 58 },
  { serial: 395, barcode: "8850477837508", name: "Smart Heart - Chicken and Tuna - 480 g", category: "Food", price: 360.00, stock: 99 },
  { serial: 396, barcode: "8850477837157", name: "Smart Heart - Chicken and Tuna - 1.2 kg", category: "Food", price: 790.00, stock: 42 },
  { serial: 397, barcode: "8859764100776", name: "Dog Harness", category: "Accessories", price: 650.00, stock: 0 },
  { serial: 398, barcode: "8850477801158", name: "Smart Heart - Chicken,Fish,Egg & Milk - 1.1 kg", category: "Food", price: 790.00, stock: 31 },
  { serial: 399, barcode: "PDR.00023", name: "Mixed Cat food - 300g", category: "Food", price: 160.00, stock: 8 },
  { serial: 400, barcode: "8850477837355", name: "Smart Heart - Chicken and Tuna - 3.0 kg", category: "Food", price: 1650.00, stock: 34 },
  { serial: 401, barcode: "6936363902689", name: "Cuties Catz - Chicken & Tuna - 350g", category: "Food", price: 200.00, stock: 100 },
  { serial: 402, barcode: "8681299602049", name: "Jungle Adult - Chicken and Fish - 1.5kg", category: "Food", price: 840.00, stock: 17 },
  { serial: 403, barcode: "8681299602537", name: "Jungle Kitten - Chicken - 500g", category: "Food", price: 360.00, stock: 0 },
  { serial: 404, barcode: "8681299603619", name: "Jungle Kitten - Chicken - 1.5 kg", category: "Food", price: 840.00, stock: 7 },
  { serial: 405, barcode: "8681299606641", name: "Felicia Urinary Care - 2.0 kg", category: "Food", price: 1450.00, stock: 0 },
  { serial: 406, barcode: "9310022866500", name: "whiskas Adult - Tuna- 480", category: "Food", price: 380.00, stock: 0 },
  { serial: 407, barcode: "8681299601851", name: "Jungle Adult - Salmon - 500g", category: "Food", price: 360.00, stock: 16 },
  { serial: 408, barcode: "8681299602544", name: "Jungle Adult - Lamb - 500g", category: "Food", price: 360.00, stock: 1 },
  { serial: 409, barcode: "8681299601875", name: "Jungle Adult - Chicken and fish - 500g", category: "Food", price: 360.00, stock: 0 },
  { serial: 410, barcode: "8853301001939", name: "whiskas Junior - Mackerel - 1.1 g", category: "Food", price: 790.00, stock: 0 },
  { serial: 411, barcode: "8853301400114", name: "whiskas Hairball control - Chicken and tuna- 1.1 g", category: "Food", price: 790.00, stock: 0 },
  { serial: 412, barcode: "8681692100227", name: "Paw Paw adult Cat food- Chicken - 1.0 kg", category: "Food", price: 480.00, stock: 33 },
  { serial: 413, barcode: "6927749825104", name: "Wanpy Grain Free - Chicken - 1.5 kg", category: "Food", price: 1350.00, stock: 4 }
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
async function uploadSegment4() {
  try {
    console.log('🚀 Starting Segment 4 Upload (FINAL)...');
    console.log(`📦 Total products to upload: ${segment4Data.length}`);

    if (segment4Data.length === 0) {
      console.log('⚠️  No data found. Please add Segment 4 data to this file.');
      return;
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pet-care');
    console.log('✅ Connected to MongoDB');

    // Transform all products
    const products = segment4Data.map(transformProductData);

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
    
    const serials = segment4Data.map(p => p.serial);
    console.log(`\n🎯 Serial range: ${Math.min(...serials)} - ${Math.max(...serials)}`);
    console.log('✅ All products uploaded in correct serial order');
    
    // Final statistics
    const totalProducts = await Product.countDocuments();
    console.log(`\n🎉 FINAL STATISTICS:`);
    console.log(`Total products in database: ${totalProducts}`);
    
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
  uploadSegment4()
    .then(() => {
      console.log('\n✅ Segment 4 upload completed successfully!');
      console.log('🎊 ALL SEGMENTS UPLOADED! Your product database is complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Upload failed:', error.message);
      process.exit(1);
    });
}

module.exports = { uploadSegment4, segment4Data };
