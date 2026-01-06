const mongoose = require('mongoose');
const Product = require('../models/Product.model');
require('dotenv').config();

// Segment 3 Product Data
const segment3Data = [
  { serial: 211, barcode: "PDR.00286", name: "Neuter surgery / Orchiectomy - Cat", category: "Surgery", price: 1800.00, stock: -123 },
  { serial: 212, barcode: "PDR.00285", name: "Spay surgery / Ovariohysterectomy - Dog", category: "Surgery", price: 6000.00, stock: -1 },
  { serial: 213, barcode: "PDR.00284", name: "Spay surgery / Ovariohysterectomy - Cat", category: "Surgery", price: 3000.00, stock: -102 },
  { serial: 214, barcode: "PDR.00283", name: "Wood lamp skin test", category: "Diagnostic Test", price: 200.00, stock: -16 },
  { serial: 215, barcode: "PDR.00282", name: "Biochemical tests - kidney function", category: "Diagnostic Test", price: 800.00, stock: -9 },
  { serial: 216, barcode: "PDR.00281", name: "Biochemical tests - Liver function", category: "Diagnostic Test", price: 1200.00, stock: -7 },
  { serial: 217, barcode: "PDR.00280", name: "Microscopic Test", category: "Diagnostic Test", price: 200.00, stock: -3 },
  { serial: 218, barcode: "PDR.00279", name: "Sedative / Anaesthesia", category: "Service", price: 200.00, stock: -45 },
  { serial: 219, barcode: "PDR.00278", name: "General Wound Dressing - Large-Scale Zone", category: "Service", price: 800.00, stock: -3 },
  { serial: 220, barcode: "PDR.00277", name: "General Wound Dressing - Moderate Area", category: "Service", price: 500.00, stock: -18 },
  { serial: 221, barcode: "PDR.00276", name: "General Wound Dressing - Limited Region", category: "Service", price: 300.00, stock: -42 },
  { serial: 222, barcode: "PDR.00275", name: "Maggot Wound Dressing - Large-Scale Zone", category: "Service", price: 2000.00, stock: -13 },
  { serial: 223, barcode: "PDR.00274", name: "Maggot Wound Dressing - Moderate Area", category: "Service", price: 1500.00, stock: -9 },
  { serial: 224, barcode: "PDR.00273", name: "Maggot Wound Dressing - Limited Region", category: "Service", price: 1000.00, stock: -4 },
  { serial: 225, barcode: "PDR.00272", name: "Home Call- Veterinarian", category: "Service", price: 1500.00, stock: -13 },
  { serial: 226, barcode: "PDR.00271", name: "Chemo", category: "Service", price: 800.00, stock: 0 },
  { serial: 227, barcode: "PDR.00270", name: "Medicine Cost (From Clinic)", category: "Service", price: 200.00, stock: -177 },
  { serial: 228, barcode: "PDR.00269", name: "Follow Up Injection", category: "Service", price: 300.00, stock: -7 },
  { serial: 229, barcode: "PDR.00267", name: "Nebulization", category: "Service", price: 300.00, stock: 0 },
  { serial: 230, barcode: "PDR.00265", name: "Deworming (Oral / Injectable) / Tick-Flea Inj", category: "Service", price: 300.00, stock: -680 },
  { serial: 231, barcode: "PDR.00264", name: "Service Charge", category: "Service", price: 200.00, stock: -201 },
  { serial: 232, barcode: "PDR.00263", name: "Vet Consultancy (Birds/Rabbit)", category: "Service", price: 500.00, stock: -27 },
  { serial: 233, barcode: "PDR.00259", name: "Vet Consultancy (Dog/Cat)", category: "Service", price: 600.00, stock: -979 },
  { serial: 234, barcode: "6975954675229", name: "Flea comb Large", category: "Accessories", price: 190.00, stock: 14 },
  { serial: 235, barcode: "PDR.00257", name: "Inj. GS", category: "Medicine", price: 1650.00, stock: 11 },
  { serial: 236, barcode: "PDR.00256", name: "Inj. Vitabion", category: "Medicine", price: 28.00, stock: 31 },
  { serial: 237, barcode: "PDR.00255", name: "Jacket Herness - M", category: "Accessories", price: 210.00, stock: 0 },
  { serial: 238, barcode: "PDR.00254", name: "Jacket Herness - S", category: "Accessories", price: 210.00, stock: 7 },
  { serial: 239, barcode: "PDR.00253", name: "Feeder Premium", category: "Accessories", price: 220.00, stock: 2 },
  { serial: 240, barcode: "PDR.00250", name: "Cat treat - 70g", category: "Food", price: 50.00, stock: 568 },
  { serial: 241, barcode: "PDR.00248", name: "Syp. Famodin - 60ml", category: "Medicine", price: 50.00, stock: 0 },
  { serial: 242, barcode: "PDR.00247", name: "Saline Set", category: "Medicine", price: 40.00, stock: 9 },
  { serial: 243, barcode: "PDR.00246", name: "Atlas Cat / Pet Metro Cat Pouch", category: "Food", price: 100.00, stock: 0 },
  { serial: 244, barcode: "5410340410615", name: "Lara Adult - 10 kg", category: "Food", price: 5000.00, stock: 0 },
  { serial: 245, barcode: "8681299601882", name: "Jungle Adult - Chicken and fish - 15KG", category: "Food", price: 7300.00, stock: 0 },
  { serial: 246, barcode: "8904235835081", name: "Bengal Cat Carrier Jhuri", category: "Accessories", price: 430.00, stock: 16 },
  { serial: 247, barcode: "8901138501235", name: "Syp. Liv 52", category: "Medicine", price: 270.00, stock: 14 },
  { serial: 248, barcode: "PDR.00236", name: "Inj. Maroxacin Vet -10ml", category: "Medicine", price: 350.00, stock: 0 },
  { serial: 249, barcode: "PDR.00235", name: "Inj. Mel Vet - 10ml", category: "Medicine", price: 45.00, stock: 2 },
  { serial: 250, barcode: "PDR.00234", name: "Inj. Tracid Vet- 10ml", category: "Medicine", price: 50.00, stock: 0 },
  { serial: 251, barcode: "PDR.00233", name: "Inj. Steron Vet - 10ml", category: "Medicine", price: 35.00, stock: 4 },
  { serial: 252, barcode: "PDR.00232", name: "Inj. Asta Vet -10ml", category: "Medicine", price: 16.00, stock: 0 },
  { serial: 253, barcode: "PDR.00231", name: "Inj. Cidaflox vet -10ml", category: "Medicine", price: 35.00, stock: 7 },
  { serial: 254, barcode: "PDR.00230", name: "Inf. Normal Saline ( NS ) - 500ML", category: "Medicine", price: 67.00, stock: 0 },
  { serial: 255, barcode: "PDR.00229", name: "Inf. Dextrose 5% - 500ml", category: "Medicine", price: 71.00, stock: 22 },
  { serial: 256, barcode: "PDR.00228", name: "Inf. Glucosal 5% DNS - 500ML", category: "Medicine", price: 75.00, stock: -1 },
  { serial: 257, barcode: "PDR.00227", name: "Inf. Hartmann Solution ( HS) - 500ML", category: "Medicine", price: 71.00, stock: 0 },
  { serial: 258, barcode: "PDR.00221", name: "Aminovit Plus vet Inj -20ml", category: "Medicine", price: 100.00, stock: -2 },
  { serial: 259, barcode: "PDR.00220", name: "Eye drop Eyemox D - 5ml", category: "Medicine", price: 200.00, stock: 0 },
  { serial: 260, barcode: "PDR.00219", name: "E/E drop Cipro A - 5ml", category: "Medicine", price: 50.00, stock: 6 },
  { serial: 261, barcode: "PDR.00218", name: "Ear drop Otoxin - 10ml", category: "Medicine", price: 150.00, stock: 10 },
  { serial: 262, barcode: "PDR.00217", name: "E/E drop Civodex vet - 5ml", category: "Medicine", price: 80.00, stock: 0 },
  { serial: 263, barcode: "PDR.00216", name: "Susp. Orcalmin Pet Susp - 200ml", category: "Medicine", price: 360.00, stock: 20 },
  { serial: 264, barcode: "PDR.00215", name: "Syp. Pet Utkid - 200ml", category: "Medicine", price: 920.00, stock: 3 },
  { serial: 265, barcode: "PDR.00213", name: "Inf. Dirozyl IV - 100ml", category: "Medicine", price: 85.00, stock: 16 },
  { serial: 266, barcode: "PDR.00212", name: "Sol. Viodin Vet-10 - 100ml", category: "Medicine", price: 93.00, stock: 5 },
  { serial: 267, barcode: "PDR.00211", name: "Inj. Bipilin - 1g", category: "Medicine", price: 37.00, stock: 14 },
  { serial: 268, barcode: "PDR.00210", name: "Inj. Tracid", category: "Medicine", price: 65.00, stock: 10 },
  { serial: 269, barcode: "PDR.00209", name: "Inj. Periset - 4ml", category: "Medicine", price: 30.00, stock: 21 },
  { serial: 270, barcode: "PDR.00208", name: "Inj. Filin - 125ml/5ml", category: "Medicine", price: 5.00, stock: 30 },
  { serial: 271, barcode: "PDR.00207", name: "Inj. Combipen Vet - 40Lacs", category: "Medicine", price: 54.00, stock: 9 },
  { serial: 272, barcode: "PDR.00206", name: "Inj. Omenix IV - 40mg", category: "Medicine", price: 90.00, stock: 34 },
  { serial: 273, barcode: "PDR.00205", name: "Inj. Moxilin Vet -1g", category: "Medicine", price: 103.00, stock: 2 },
  { serial: 274, barcode: "PDR.00204", name: "Inj. Taxovet - 1g", category: "Medicine", price: 150.00, stock: 0 },
  { serial: 275, barcode: "PDR.00203", name: "Inj. Topcef - 0.5g", category: "Medicine", price: 98.00, stock: -3 },
  { serial: 276, barcode: "PDR.00202", name: "Inj. Eracef -500mg", category: "Medicine", price: 98.00, stock: 46 },
  { serial: 277, barcode: "PDR.00201", name: "Oral gel Oroconazol - 15g", category: "Medicine", price: 60.00, stock: 7 },
  { serial: 278, barcode: "PDR.00200", name: "Oint. Lucazol - 10gm", category: "Medicine", price: 100.00, stock: 3 },
  { serial: 279, barcode: "PDR.00199", name: "Oint. Terbikill - 15g", category: "Medicine", price: 100.00, stock: 8 },
  { serial: 280, barcode: "PDR.00198", name: "Oint. Dressgel FR Vet - 20g", category: "Medicine", price: 70.00, stock: 0 },
  { serial: 281, barcode: "PDR.00197", name: "Oint. Trego - 10gm", category: "Medicine", price: 145.00, stock: 5 },
  { serial: 282, barcode: "PDR.00196", name: "Oint. Dermomix - 15gm", category: "Medicine", price: 200.00, stock: 0 },
  { serial: 283, barcode: "PDR.00195", name: "Tab. Mycocure - 250mg", category: "Medicine", price: 40.00, stock: 16 },
  { serial: 284, barcode: "PDR.00194", name: "Tab. Sedil - 5mg", category: "Medicine", price: 2.00, stock: 388 },
  { serial: 285, barcode: "PDR.00193", name: "Tab. Decason - 0.5mg", category: "Medicine", price: 2.00, stock: 92 },
  { serial: 286, barcode: "PDR.00192", name: "Cap. Anadol - 50mg", category: "Medicine", price: 8.00, stock: 10 },
  { serial: 287, barcode: "PDR.00191", name: "Tab. Alatrol - 10mg", category: "Medicine", price: 4.00, stock: 63 },
  { serial: 288, barcode: "PDR.00190", name: "Tab. Filin - 100mg", category: "Medicine", price: 4.00, stock: 0 },
  { serial: 289, barcode: "PDR.00189", name: "Tab. Migrex - 200mg", category: "Medicine", price: 10.00, stock: 3 },
  { serial: 290, barcode: "PDR.00188", name: "Tab. Cortisol - 5mg", category: "Medicine", price: 5.00, stock: 140 },
  { serial: 291, barcode: "PDR.00187", name: "Tab. Mitaprex - 7.5mg", category: "Medicine", price: 10.00, stock: 39 },
  { serial: 292, barcode: "PDR.00186", name: "Tab. Vitabion", category: "Medicine", price: 12.00, stock: 136 },
  { serial: 293, barcode: "PDR.00185", name: "Susp. Emixef PD - 21ML", category: "Medicine", price: 100.00, stock: 7 },
  { serial: 294, barcode: "PDR.00184", name: "Liq. Fenazol Vet - 100ml", category: "Medicine", price: 170.00, stock: 8 },
  { serial: 295, barcode: "PDR.00183", name: "Susp. Omastin - 35ml", category: "Medicine", price: 78.00, stock: 0 },
  { serial: 296, barcode: "PDR.00182", name: "Sol. Tulos - 100ml", category: "Medicine", price: 140.00, stock: 0 },
  { serial: 297, barcode: "PDR.00181", name: "Susp. Moxilin- 100ml", category: "Medicine", price: 70.00, stock: 0 },
  { serial: 298, barcode: "PDR.00180", name: "Syp. Nutrum Kids - 100ml", category: "Medicine", price: 90.00, stock: 0 },
  { serial: 299, barcode: "8941100353288", name: "Susp. Neofloxin -60ml", category: "Medicine", price: 100.00, stock: 0 },
  { serial: 300, barcode: "PDR.00178", name: "Sol. Periset Oral - 50ml", category: "Medicine", price: 45.00, stock: 19 },
  { serial: 301, barcode: "PDR.00177", name: "Sol. Cat star - Multivitamin & Coat Tonic", category: "Accessories", price: 490.00, stock: 0 },
  { serial: 302, barcode: "PDR.00176", name: "Syp. Dirozyl - 60ml", category: "Medicine", price: 35.00, stock: 11 },
  { serial: 303, barcode: "PDR.00175", name: "Syp. PA Flu Nil - 30ml", category: "Medicine", price: 145.00, stock: 0 },
  { serial: 304, barcode: "PDR.00174", name: "Susp. Reducid - 50ml", category: "Medicine", price: 50.00, stock: 8 },
  { serial: 305, barcode: "PDR.00173", name: "Susp. Azin - 15ml", category: "Medicine", price: 95.00, stock: 0 },
  { serial: 306, barcode: "PDR.00172", name: "Liq. Enrovet - 100ml", category: "Medicine", price: 220.00, stock: 5 },
  { serial: 307, barcode: "PDR.00171", name: "Syp. Aritone Z - 100ml", category: "Medicine", price: 55.00, stock: 0 },
  { serial: 308, barcode: "PDR.00170", name: "Susp. Ximeprox PD - 15ML", category: "Medicine", price: 60.00, stock: 0 },
  { serial: 309, barcode: "PDR.00169", name: "Sol. Cortan - 50 ml", category: "Medicine", price: 65.00, stock: 42 },
  { serial: 310, barcode: "PDR.00168", name: "Susp. Fenofex - 50ml", category: "Medicine", price: 60.00, stock: 0 },
  { serial: 311, barcode: "PDR.00167", name: "Susp. Clindacin - 100ml", category: "Medicine", price: 280.00, stock: 6 },
  { serial: 312, barcode: "PDR.00165", name: "Susp. Fix A - 21ML", category: "Medicine", price: 100.00, stock: 25 },
  { serial: 313, barcode: "PDR.00135", name: "FIP Test", category: "Diagnostic Test", price: 1000.00, stock: 8 },
  { serial: 314, barcode: "PDR.00134", name: "FPV Test - Rapid Test", category: "Diagnostic Test", price: 500.00, stock: 11 }
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
async function uploadSegment3() {
  try {
    console.log('🚀 Starting Segment 3 Upload...');
    console.log(`📦 Total products to upload: ${segment3Data.length}`);

    if (segment3Data.length === 0) {
      console.log('⚠️  No data found. Please add Segment 3 data to this file.');
      return;
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pet-care');
    console.log('✅ Connected to MongoDB');

    // Transform all products
    const products = segment3Data.map(transformProductData);

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
    
    const serials = segment3Data.map(p => p.serial);
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
  uploadSegment3()
    .then(() => {
      console.log('\n✅ Segment 3 upload completed successfully!');
      console.log('📝 Ready for Segment 4');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Upload failed:', error.message);
      process.exit(1);
    });
}

module.exports = { uploadSegment3, segment3Data };
