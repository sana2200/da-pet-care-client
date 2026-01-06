# Database Seeding Guide

## Overview

This guide explains how to populate your Pet Care database with realistic product and service data.

## What Gets Seeded

### Products (20 items)

- **Dog Food** (2 items) - Royal Canin, Pedigree
- **Cat Food** (2 items) - Whiskas, Me-O
- **Dog Toys** (2 items) - Kong, Tennis Balls
- **Cat Toys** (2 items) - Feather Wand, Scratching Post
- **Accessories** (8 items) - Collars, Leashes, Bowls, Beds, Carriers
- **Healthcare** (2 items) - Supplements, Dental Care
- **Grooming** (2 items) - Grooming Kit, Shampoo

### Services (8 items)

- **Grooming** (2 services) - Dog & Cat Grooming
- **Veterinary** (2 services) - Health Checkup, Vaccination
- **Training** (1 service) - Basic Obedience
- **Boarding** (1 service) - Daily Boarding
- **Walking** (1 service) - Dog Walking
- **Daycare** (1 service) - Full Day Daycare

## Quick Start

### 1. Seed the Database

```bash
npm run seed
```

This will:

- ✅ Connect to MongoDB
- 🗑️ Clear existing products and services
- 📦 Add 20 products
- 🛎️ Add 8 services
- 📊 Display summary

### 2. Verify Data

```bash
# Get all products
curl http://localhost:5000/api/products

# Get all services
curl http://localhost:5000/api/services

# Get featured products
curl http://localhost:5000/api/products/featured/all

# Get products by category
curl http://localhost:5000/api/products?category=food

# Get services by category
curl http://localhost:5000/api/services?category=grooming
```

## Product Features

Each product includes:

- ✅ Name, description, price
- ✅ Original price (for discounts)
- ✅ Category and subcategory
- ✅ Brand
- ✅ Images (multiple)
- ✅ Stock quantity
- ✅ Featured flag
- ✅ Rating system
- ✅ Detailed specifications
- ✅ Tags for searching
- ✅ Discount percentage

## Service Features

Each service includes:

- ✅ Name, description, price
- ✅ Duration in minutes
- ✅ Category
- ✅ Images
- ✅ Weekly availability schedule
- ✅ Time slots with capacity
- ✅ Featured flag
- ✅ Rating system
- ✅ Requirements list
- ✅ Tags for searching

## Customization

### Add More Products

Edit `data/products.seed.js` and add items:

```javascript
{
  name: "Your Product",
  description: "Description here",
  price: 1000,
  category: "food",
  // ... other fields
}
```

### Add More Services

Edit `data/services.seed.js` and add services:

```javascript
{
  name: "Your Service",
  description: "Description here",
  price: 500,
  duration: 60,
  category: "grooming",
  // ... other fields
}
```

### Re-seed Database

After making changes:

```bash
npm run seed
```

## Categories

### Product Categories

- `food` - Pet food items
- `toys` - Toys and entertainment
- `accessories` - Collars, leashes, bowls, beds
- `healthcare` - Medical and wellness
- `grooming` - Grooming supplies

### Service Categories

- `grooming` - Grooming and spa services
- `veterinary` - Medical services
- `training` - Behavior and training
- `boarding` - Overnight care
- `walking` - Exercise services
- `daycare` - Daily supervision

## Image Sources

All product images use placeholder URLs from Unsplash. Replace with actual product images for production.

## Notes

- ⚠️ Seeding clears all existing products and services
- ✅ Safe to run multiple times
- 📊 Products have realistic pricing in BDT
- 🎯 Featured items marked for homepage display
- 📦 All items start with adequate stock

## Testing

After seeding, test the endpoints:

```bash
# Test product search
curl "http://localhost:5000/api/products?search=dog"

# Test price filtering
curl "http://localhost:5000/api/products?minPrice=500&maxPrice=2000"

# Test pagination
curl "http://localhost:5000/api/products?page=1&limit=10"

# Test service availability
curl "http://localhost:5000/api/services/[SERVICE_ID]/availability?date=2026-01-10"
```

## Troubleshooting

### Connection Error

If you get connection errors:

1. Check MongoDB is running
2. Verify MONGODB_URI in .env
3. Check network/firewall

### Duplicate Key Error

If items already exist:

- The script automatically clears data first
- If error persists, manually clear collections

### Missing Images

Images are placeholders. For production:

1. Upload actual product images
2. Update image URLs in seed files
3. Consider using cloud storage (AWS S3, Cloudinary)

## Production Deployment

Before deploying:

1. ✅ Replace placeholder images
2. ✅ Review all prices
3. ✅ Update product descriptions
4. ✅ Verify stock quantities
5. ✅ Test all categories
6. ✅ Backup existing data before seeding

---

**Ready!** Your database is now populated with realistic pet care products and services! 🎉
