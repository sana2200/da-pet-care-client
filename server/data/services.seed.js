const services = [
  {
    name: "Professional Dog Grooming",
    description: "Complete grooming package including bath, haircut, nail trimming, ear cleaning, and teeth brushing. Our professional groomers ensure your dog looks and feels great.",
    category: "grooming",
    price: 800,
    duration: 90,
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500",
    images: [
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500",
      "https://images.unsplash.com/photo-1616012689778-62a189d8d106?w=500"
    ],
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false
    },
    timeSlots: [
      { startTime: "09:00", endTime: "10:30", maxBookings: 2 },
      { startTime: "10:30", endTime: "12:00", maxBookings: 2 },
      { startTime: "14:00", endTime: "15:30", maxBookings: 2 },
      { startTime: "15:30", endTime: "17:00", maxBookings: 2 }
    ],
    featured: true,
    rating: 4.8,
    numReviews: 0,
    reviews: [],
    requirements: [
      "Dogs should be up-to-date on vaccinations",
      "Please inform us of any health conditions",
      "Aggressive dogs require special handling"
    ],
    tags: ["grooming", "bath", "haircut", "dog"],
    isActive: true
  },
  {
    name: "Cat Grooming & Spa",
    description: "Gentle grooming service for cats including bath, brushing, nail trimming, and ear cleaning. Special care for sensitive felines.",
    category: "grooming",
    price: 650,
    duration: 60,
    image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=500",
    images: [
      "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=500"
    ],
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false
    },
    timeSlots: [
      { startTime: "09:00", endTime: "10:00", maxBookings: 1 },
      { startTime: "10:00", endTime: "11:00", maxBookings: 1 },
      { startTime: "11:00", endTime: "12:00", maxBookings: 1 },
      { startTime: "14:00", endTime: "15:00", maxBookings: 1 },
      { startTime: "15:00", endTime: "16:00", maxBookings: 1 }
    ],
    featured: true,
    rating: 4.7,
    numReviews: 0,
    reviews: [],
    requirements: [
      "Cats should be in a carrier",
      "Vaccination records required",
      "Sedation may be needed for anxious cats"
    ],
    tags: ["grooming", "cat", "spa", "bath"],
    isActive: true
  },
  {
    name: "Veterinary Health Checkup",
    description: "Comprehensive health examination by certified veterinarians. Includes physical examination, vaccination updates, and health consultation.",
    category: "veterinary",
    price: 1200,
    duration: 45,
    image: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=500",
    images: [
      "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=500"
    ],
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true
    },
    timeSlots: [
      { startTime: "09:00", endTime: "09:45", maxBookings: 1 },
      { startTime: "10:00", endTime: "10:45", maxBookings: 1 },
      { startTime: "11:00", endTime: "11:45", maxBookings: 1 },
      { startTime: "14:00", endTime: "14:45", maxBookings: 1 },
      { startTime: "15:00", endTime: "15:45", maxBookings: 1 },
      { startTime: "16:00", endTime: "16:45", maxBookings: 1 }
    ],
    featured: true,
    rating: 4.9,
    numReviews: 0,
    reviews: [],
    requirements: [
      "Bring previous medical records if available",
      "Fast your pet 6 hours before checkup if blood work needed",
      "Keep pet calm before appointment"
    ],
    tags: ["veterinary", "health", "checkup", "doctor"],
    isActive: true
  },
  {
    name: "Pet Vaccination Service",
    description: "Essential vaccinations for dogs and cats including rabies, distemper, parvovirus, and more. Protect your pet's health.",
    category: "veterinary",
    price: 800,
    duration: 30,
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500",
    images: [
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500"
    ],
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false
    },
    timeSlots: [
      { startTime: "09:00", endTime: "09:30", maxBookings: 2 },
      { startTime: "09:30", endTime: "10:00", maxBookings: 2 },
      { startTime: "10:00", endTime: "10:30", maxBookings: 2 },
      { startTime: "14:00", endTime: "14:30", maxBookings: 2 },
      { startTime: "14:30", endTime: "15:00", maxBookings: 2 },
      { startTime: "15:00", endTime: "15:30", maxBookings: 2 }
    ],
    featured: false,
    rating: 4.8,
    numReviews: 0,
    reviews: [],
    requirements: [
      "Pet should be healthy and not showing illness",
      "Bring vaccination card if available",
      "Puppies/kittens must be at least 6 weeks old"
    ],
    tags: ["veterinary", "vaccination", "health", "prevention"],
    isActive: true
  },
  {
    name: "Dog Training - Basic Obedience",
    description: "4-week basic obedience training program covering sit, stay, come, leash walking, and socialization. Professional certified trainers.",
    category: "training",
    price: 3500,
    duration: 60,
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500",
    images: [
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500"
    ],
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false
    },
    timeSlots: [
      { startTime: "08:00", endTime: "09:00", maxBookings: 3 },
      { startTime: "09:00", endTime: "10:00", maxBookings: 3 },
      { startTime: "16:00", endTime: "17:00", maxBookings: 3 },
      { startTime: "17:00", endTime: "18:00", maxBookings: 3 }
    ],
    featured: true,
    rating: 4.9,
    numReviews: 0,
    reviews: [],
    requirements: [
      "Dogs must be at least 4 months old",
      "Up-to-date vaccination required",
      "Owner must attend sessions",
      "4-week commitment required"
    ],
    tags: ["training", "obedience", "behavior", "dog"],
    isActive: true
  },
  {
    name: "Pet Boarding - Daily",
    description: "Safe and comfortable boarding facility with individual kennels, regular feeding, exercise, and 24/7 supervision. Perfect for when you're away.",
    category: "boarding",
    price: 500,
    duration: 1440, // 24 hours in minutes
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500",
    images: [
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500"
    ],
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true
    },
    timeSlots: [
      { startTime: "10:00", endTime: "10:00", maxBookings: 10 }
    ],
    featured: false,
    rating: 4.6,
    numReviews: 0,
    reviews: [],
    requirements: [
      "All vaccinations must be current",
      "Provide own food if special diet",
      "Booking required 24 hours in advance",
      "Flea and tick free"
    ],
    tags: ["boarding", "daycare", "accommodation", "care"],
    isActive: true
  },
  {
    name: "Dog Walking Service",
    description: "Professional dog walking service for 30 minutes. Perfect for busy owners or additional exercise for your dog.",
    category: "walking",
    price: 300,
    duration: 30,
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500",
    images: [
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500"
    ],
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true
    },
    timeSlots: [
      { startTime: "07:00", endTime: "07:30", maxBookings: 5 },
      { startTime: "08:00", endTime: "08:30", maxBookings: 5 },
      { startTime: "09:00", endTime: "09:30", maxBookings: 5 },
      { startTime: "16:00", endTime: "16:30", maxBookings: 5 },
      { startTime: "17:00", endTime: "17:30", maxBookings: 5 },
      { startTime: "18:00", endTime: "18:30", maxBookings: 5 }
    ],
    featured: false,
    rating: 4.5,
    numReviews: 0,
    reviews: [],
    requirements: [
      "Dog must be leash trained",
      "Non-aggressive behavior required",
      "Provide own leash and collar"
    ],
    tags: ["walking", "exercise", "outdoor", "dog"],
    isActive: true
  },
  {
    name: "Pet Daycare - Full Day",
    description: "Full day supervision and playtime for your pet. Includes meals, exercise, and socialization with other pets in a safe environment.",
    category: "daycare",
    price: 600,
    duration: 480, // 8 hours
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500",
    images: [
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500"
    ],
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false
    },
    timeSlots: [
      { startTime: "08:00", endTime: "16:00", maxBookings: 15 }
    ],
    featured: true,
    rating: 4.7,
    numReviews: 0,
    reviews: [],
    requirements: [
      "Must be social with other pets",
      "All vaccinations current",
      "Advance booking required",
      "Health certificate for first visit"
    ],
    tags: ["daycare", "socialization", "play", "care"],
    isActive: true
  }
];

module.exports = services;
