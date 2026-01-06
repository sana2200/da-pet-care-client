const products = [
  // Dog Food
  {
    name: "Royal Canin Adult Dog Food",
    description: "Complete and balanced nutrition for adult dogs. High-quality protein sources, optimal fiber content, and essential nutrients for healthy digestion and coat.",
    price: 2500,
    originalPrice: 3000,
    category: "food",
    subCategory: "dog-food",
    brand: "Royal Canin",
    images: [
      "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500",
      "https://images.unsplash.com/photo-1591768793355-74d04bb6608f?w=500"
    ],
    stock: 50,
    featured: true,
    rating: 4.5,
    numReviews: 0,
    reviews: [],
    specifications: {
      "Weight": "10 kg",
      "Age": "Adult (1-7 years)",
      "Breed Size": "Medium to Large",
      "Ingredients": "Chicken, Rice, Corn, Vitamins",
      "Protein": "24%",
      "Fat": "14%"
    },
    tags: ["dog", "food", "premium", "adult"],
    discount: 17,
    isActive: true
  },
  {
    name: "Pedigree Puppy Complete Food",
    description: "Specially formulated for growing puppies with DHA for brain development, calcium for strong bones, and high-quality protein for muscle growth.",
    price: 1800,
    originalPrice: 2200,
    category: "food",
    subCategory: "dog-food",
    brand: "Pedigree",
    images: [
      "https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?w=500",
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500"
    ],
    stock: 75,
    featured: true,
    rating: 4.3,
    numReviews: 0,
    reviews: [],
    specifications: {
      "Weight": "5 kg",
      "Age": "Puppy (2-12 months)",
      "Breed Size": "All Sizes",
      "Ingredients": "Chicken, Milk, Cereals",
      "Protein": "28%",
      "Fat": "16%"
    },
    tags: ["dog", "food", "puppy", "growth"],
    discount: 18,
    isActive: true
  },

  // Cat Food
  {
    name: "Whiskas Adult Cat Food",
    description: "Delicious tuna flavor with essential nutrients for healthy skin, shiny coat, and strong immunity. Perfect for adult cats.",
    price: 1200,
    originalPrice: 1500,
    category: "food",
    subCategory: "cat-food",
    brand: "Whiskas",
    images: [
      "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500",
      "https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=500"
    ],
    stock: 100,
    featured: true,
    rating: 4.4,
    numReviews: 0,
    reviews: [],
    specifications: {
      "Weight": "3 kg",
      "Age": "Adult (1+ years)",
      "Flavor": "Tuna",
      "Ingredients": "Tuna, Rice, Vitamins",
      "Protein": "30%",
      "Fat": "12%"
    },
    tags: ["cat", "food", "tuna", "adult"],
    discount: 20,
    isActive: true
  },
  {
    name: "Me-O Kitten Food",
    description: "Premium kitten food with DHA, taurine, and essential nutrients for healthy growth and development. Ocean fish flavor.",
    price: 800,
    originalPrice: 1000,
    category: "food",
    subCategory: "cat-food",
    brand: "Me-O",
    images: [
      "https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=500",
      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=500"
    ],
    stock: 80,
    featured: false,
    rating: 4.2,
    numReviews: 0,
    reviews: [],
    specifications: {
      "Weight": "1.2 kg",
      "Age": "Kitten (2-12 months)",
      "Flavor": "Ocean Fish",
      "Protein": "32%",
      "Fat": "15%"
    },
    tags: ["cat", "food", "kitten", "fish"],
    discount: 20,
    isActive: true
  },

  // Dog Toys
  {
    name: "Kong Classic Dog Toy",
    description: "Durable rubber toy perfect for stuffing with treats. Helps satisfy natural chewing instincts and provides mental stimulation.",
    price: 650,
    originalPrice: 800,
    category: "toys",
    subCategory: "dog-toys",
    brand: "Kong",
    images: [
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500",
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500"
    ],
    stock: 60,
    featured: true,
    rating: 4.8,
    numReviews: 0,
    reviews: [],
    specifications: {
      "Material": "Natural Rubber",
      "Size": "Medium",
      "Color": "Red",
      "Suitable For": "All breeds"
    },
    tags: ["dog", "toy", "chew", "durable"],
    discount: 19,
    isActive: true
  },
  {
    name: "Tennis Ball Pack for Dogs",
    description: "Set of 3 premium tennis balls perfect for fetch games. Durable and pet-safe materials.",
    price: 350,
    originalPrice: 450,
    category: "toys",
    subCategory: "dog-toys",
    brand: "PetSafe",
    images: [
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500"
    ],
    stock: 120,
    featured: false,
    rating: 4.5,
    numReviews: 0,
    reviews: [],
    specifications: {
      "Material": "Rubber",
      "Quantity": "3 balls",
      "Size": "Standard",
      "Color": "Yellow/Green"
    },
    tags: ["dog", "toy", "ball", "fetch"],
    discount: 22,
    isActive: true
  },

  // Cat Toys
  {
    name: "Interactive Feather Wand",
    description: "Engaging toy with colorful feathers that mimics prey movement. Perfect for exercise and bonding with your cat.",
    price: 250,
    originalPrice: 350,
    category: "toys",
    subCategory: "cat-toys",
    brand: "Cat Dancer",
    images: [
      "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=500"
    ],
    stock: 90,
    featured: false,
    rating: 4.6,
    numReviews: 0,
    reviews: [],
    specifications: {
      "Material": "Feather, Plastic",
      "Length": "40 cm",
      "Features": "Retractable"
    },
    tags: ["cat", "toy", "interactive", "feather"],
    discount: 29,
    isActive: true
  },
  {
    name: "Cat Scratching Post with Toy",
    description: "Multi-level scratching post with hanging toys. Helps maintain healthy claws and provides entertainment.",
    price: 1500,
    originalPrice: 2000,
    category: "toys",
    subCategory: "cat-toys",
    brand: "Petmate",
    images: [
      "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=500"
    ],
    stock: 30,
    featured: true,
    rating: 4.7,
    numReviews: 0,
    reviews: [],
    specifications: {
      "Material": "Sisal, Wood",
      "Height": "60 cm",
      "Levels": "3",
      "Features": "Hanging toys included"
    },
    tags: ["cat", "scratching", "post", "furniture"],
    discount: 25,
    isActive: true
  },

  // Accessories
  {
    name: "Adjustable Dog Collar - Premium Leather",
    description: "High-quality leather collar with adjustable sizing. Comfortable, durable, and stylish.",
    price: 450,
    originalPrice: 600,
    category: "accessories",
    subCategory: "collars",
    brand: "LeatherPaws",
    images: [
      "https://images.unsplash.com/photo-1615751072497-5f5169febe17?w=500"
    ],
    stock: 70,
    featured: false,
    rating: 4.4,
    numReviews: 0,
    reviews: [],
    specifications: {
      "Material": "Genuine Leather",
      "Size": "Medium (30-45cm)",
      "Color": "Brown",
      "Features": "D-ring for leash"
    },
    tags: ["dog", "collar", "leather", "accessory"],
    discount: 25,
    isActive: true
  },
  {
    name: "Retractable Dog Leash - 5M",
    description: "Durable retractable leash with comfortable grip handle. One-button brake and lock system.",
    price: 850,
    originalPrice: 1100,
    category: "accessories",
    subCategory: "leashes",
    brand: "Flexi",
    images: [
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500"
    ],
    stock: 50,
    featured: true,
    rating: 4.6,
    numReviews: 0,
    reviews: [],
    specifications: {
      "Length": "5 meters",
      "Weight Capacity": "Up to 25kg",
      "Color": "Black/Blue",
      "Features": "One-button control"
    },
    tags: ["dog", "leash", "retractable", "walking"],
    discount: 23,
    isActive: true
  },
  {
    name: "Cat Litter Box with Hood",
    description: "Covered litter box for privacy and odor control. Easy to clean with removable hood.",
    price: 1200,
    originalPrice: 1500,
    category: "accessories",
    subCategory: "litter",
    brand: "Catit",
    images: [
      "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=500"
    ],
    stock: 40,
    featured: false,
    rating: 4.3,
    numReviews: 0,
    reviews: [],
    specifications: {
      "Size": "Large (50x40x38cm)",
      "Material": "Plastic",
      "Color": "Gray",
      "Features": "Carbon filter, Swing door"
    },
    tags: ["cat", "litter", "box", "hygiene"],
    discount: 20,
    isActive: true
  },

  // Healthcare
  {
    name: "Pet Multivitamin Supplement",
    description: "Complete multivitamin supplement for dogs and cats. Supports immune system, coat health, and overall wellness.",
    price: 950,
    originalPrice: 1200,
    category: "healthcare",
    subCategory: "supplements",
    brand: "VetriScience",
    images: [
      "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=500"
    ],
    stock: 60,
    featured: false,
    rating: 4.5,
    numReviews: 0,
    reviews: [],
    specifications: {
      "Quantity": "60 tablets",
      "For": "Dogs & Cats",
      "Benefits": "Immunity, Coat, Energy",
      "Dosage": "As per weight"
    },
    tags: ["health", "vitamins", "supplement", "wellness"],
    discount: 21,
    isActive: true
  },
  {
    name: "Dental Care Kit for Dogs",
    description: "Complete dental care kit with toothbrush, toothpaste, and finger brush. Chicken flavor.",
    price: 550,
    originalPrice: 700,
    category: "healthcare",
    subCategory: "dental",
    brand: "Petrodex",
    images: [
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500"
    ],
    stock: 45,
    featured: false,
    rating: 4.2,
    numReviews: 0,
    reviews: [],
    specifications: {
      "Contents": "Toothbrush, Paste, Finger Brush",
      "Flavor": "Chicken",
      "Size": "Complete Kit"
    },
    tags: ["dog", "dental", "health", "hygiene"],
    discount: 21,
    isActive: true
  },

  // Grooming
  {
    name: "Professional Pet Grooming Kit",
    description: "Complete grooming set with slicker brush, comb, nail clipper, and scissors. Perfect for home grooming.",
    price: 1800,
    originalPrice: 2400,
    category: "grooming",
    subCategory: "tools",
    brand: "Hertzko",
    images: [
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500"
    ],
    stock: 35,
    featured: true,
    rating: 4.7,
    numReviews: 0,
    reviews: [],
    specifications: {
      "Items": "5 pieces",
      "Includes": "Brush, Comb, Clipper, Scissors",
      "For": "Dogs & Cats",
      "Case": "Included"
    },
    tags: ["grooming", "brush", "tools", "kit"],
    discount: 25,
    isActive: true
  },
  {
    name: "Pet Shampoo - Oatmeal & Aloe",
    description: "Gentle, hypoallergenic shampoo with natural oatmeal and aloe vera. Soothes sensitive skin.",
    price: 650,
    originalPrice: 850,
    category: "grooming",
    subCategory: "shampoo",
    brand: "Earthbath",
    images: [
      "https://images.unsplash.com/photo-1616012689778-62a189d8d106?w=500"
    ],
    stock: 80,
    featured: false,
    rating: 4.5,
    numReviews: 0,
    reviews: [],
    specifications: {
      "Volume": "500 ml",
      "Type": "Hypoallergenic",
      "Ingredients": "Oatmeal, Aloe Vera",
      "pH": "Balanced"
    },
    tags: ["grooming", "shampoo", "bath", "sensitive"],
    discount: 24,
    isActive: true
  },

  // Bedding
  {
    name: "Orthopedic Pet Bed - Large",
    description: "Premium memory foam bed for maximum comfort. Removable, washable cover. Perfect for senior dogs.",
    price: 2500,
    originalPrice: 3200,
    category: "accessories",
    subCategory: "beds",
    brand: "PetFusion",
    images: [
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500"
    ],
    stock: 25,
    featured: true,
    rating: 4.8,
    numReviews: 0,
    reviews: [],
    specifications: {
      "Size": "Large (90x70cm)",
      "Material": "Memory Foam",
      "Cover": "Removable & Washable",
      "Color": "Gray"
    },
    tags: ["bed", "comfort", "orthopedic", "senior"],
    discount: 22,
    isActive: true
  },
  {
    name: "Cozy Cat Bed Cave",
    description: "Soft, enclosed bed providing warmth and security. Machine washable and easy to maintain.",
    price: 1200,
    originalPrice: 1600,
    category: "accessories",
    subCategory: "beds",
    brand: "Best Pet Supplies",
    images: [
      "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=500"
    ],
    stock: 40,
    featured: false,
    rating: 4.6,
    numReviews: 0,
    reviews: [],
    specifications: {
      "Size": "Medium",
      "Material": "Soft Fabric",
      "Design": "Enclosed Cave",
      "Color": "Beige"
    },
    tags: ["cat", "bed", "cave", "cozy"],
    discount: 25,
    isActive: true
  },

  // Feeding Accessories
  {
    name: "Stainless Steel Dog Bowl Set",
    description: "Durable stainless steel bowls with non-slip rubber base. Set of 2 for food and water.",
    price: 750,
    originalPrice: 950,
    category: "accessories",
    subCategory: "bowls",
    brand: "AmazonBasics",
    images: [
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500"
    ],
    stock: 70,
    featured: false,
    rating: 4.4,
    numReviews: 0,
    reviews: [],
    specifications: {
      "Material": "Stainless Steel",
      "Quantity": "2 bowls",
      "Capacity": "1 liter each",
      "Base": "Non-slip rubber"
    },
    tags: ["bowl", "feeding", "stainless", "set"],
    discount: 21,
    isActive: true
  },
  {
    name: "Automatic Pet Feeder",
    description: "Programmable automatic feeder with portion control. Ideal for maintaining feeding schedule.",
    price: 3500,
    originalPrice: 4500,
    category: "accessories",
    subCategory: "feeders",
    brand: "PetSafe",
    images: [
      "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500"
    ],
    stock: 20,
    featured: true,
    rating: 4.5,
    numReviews: 0,
    reviews: [],
    specifications: {
      "Capacity": "2.5 kg",
      "Meals": "Up to 12/day",
      "Power": "Battery/AC",
      "Features": "LCD display, Voice recorder"
    },
    tags: ["feeder", "automatic", "smart", "convenience"],
    discount: 22,
    isActive: true
  },

  // Carriers & Crates
  {
    name: "Pet Travel Carrier - Medium",
    description: "Airline-approved pet carrier with ventilation windows and comfortable shoulder strap.",
    price: 2200,
    originalPrice: 2800,
    category: "accessories",
    subCategory: "carriers",
    brand: "Sherpa",
    images: [
      "https://images.unsplash.com/photo-1541599468348-e96984315921?w=500"
    ],
    stock: 30,
    featured: false,
    rating: 4.5,
    numReviews: 0,
    reviews: [],
    specifications: {
      "Size": "Medium (45x30x30cm)",
      "Material": "Durable Fabric",
      "Weight": "Up to 8kg pet",
      "Features": "Airline approved, Ventilated"
    },
    tags: ["carrier", "travel", "transport", "airline"],
    discount: 21,
    isActive: true
  }
];

module.exports = products;
