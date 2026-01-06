# Full Stack Connection Guide

## Overview

This guide provides complete instructions for connecting the Pet Care frontend (React + Vite) with the backend API (Node.js + Express + MongoDB).

## Architecture

- **Frontend**: React + Vite (Port 5173)
- **Backend**: Node.js + Express (Port 5000)
- **Database**: MongoDB
- **Authentication**: Firebase Authentication + JWT
- **Payment**: SSLCommerz

---

## Prerequisites

### Required Software

1. **Node.js** (v16 or higher)

   - Download from: https://nodejs.org/

2. **MongoDB**

   - Option A: Install locally from https://www.mongodb.com/try/download/community
   - Option B: Use MongoDB Atlas (Cloud) - Already configured in `.env`

3. **Git** (for version control)
   - Download from: https://git-scm.com/

### Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Authentication (Email/Password and Google Sign-In)
3. Get your Firebase configuration credentials
4. Download the service account key (for server-side operations)

---

## Installation Steps

### 1. Backend Setup

#### Navigate to server directory

```bash
cd server
```

#### Install dependencies

```bash
npm install
```

#### Configure environment variables

The `.env` file is already created with MongoDB Atlas connection. Update if needed:

```env
PORT=5000
MONGODB_URI=mongodb+srv://admin:ekYR8C2UoII7U3UF@da-pet-care.i35s03l.mongodb.net/da-pet-care?retryWrites=true&w=majority
JWT_SECRET=supersecretkey
NODE_ENV=development

# SSLCommerz Configuration
SSLCOMMERZ_STORE_ID=dapet695a88e5724df
SSLCOMMERZ_STORE_PASSWORD=dapet695a88e5724df@ssl
SSLC_PAYMENT_URL=https://sandbox.sslcommerz.com/gwprocess/v4/api.php
SSLC_VALIDATION_URL=https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php
BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
```

#### Seed the database (optional but recommended)

```bash
npm run seed
```

This will populate your database with:

- Sample products
- Sample services
- Admin user (if configured)

#### Start the backend server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server should start on http://localhost:5000

---

### 2. Frontend Setup

#### Navigate to Client directory

```bash
cd Client
```

#### Install dependencies

```bash
npm install
```

#### Configure environment variables

Update the `.env` file with your Firebase credentials:

```env
# Backend API Configuration
VITE_API_URL=http://localhost:5000

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

To get Firebase credentials:

1. Go to Firebase Console
2. Select your project
3. Go to Project Settings (gear icon)
4. Scroll down to "Your apps"
5. Copy the configuration values

#### Start the frontend development server

```bash
npm run dev
```

The frontend should start on http://localhost:5173

---

## API Endpoints Reference

### Authentication (`/api/auth`)

- `POST /register` - Register new user
- `POST /login` - Login with email/password
- `POST /firebase` - Authenticate with Firebase token
- `GET /me` - Get current user profile
- `GET /verify` - Verify JWT token
- `PUT /profile` - Update user profile
- `PUT /change-password` - Change password

### Products (`/api/products`)

- `GET /products` - Get all products (with filters)
- `GET /products/categories/all` - Get all categories
- `GET /products/featured/all` - Get featured products
- `GET /products/:id` - Get single product
- `POST /products/:id/reviews` - Add product review (Protected)
- `POST /products` - Create product (Admin)
- `PUT /products/:id` - Update product (Admin)
- `DELETE /products/:id` - Delete product (Admin)

### Services (`/api/services`)

- `GET /services` - Get all services
- `GET /services/categories/all` - Get all categories
- `GET /services/featured/all` - Get featured services
- `GET /services/:id` - Get single service
- `GET /services/:id/availability` - Check availability
- `POST /services/:id/reviews` - Add review (Protected)
- `POST /services` - Create service (Admin)
- `PUT /services/:id` - Update service (Admin)
- `DELETE /services/:id` - Delete service (Admin)

### Bookings (`/api/bookings`)

- `POST /bookings` - Create booking (Protected)
- `GET /bookings/my-bookings` - Get user's bookings (Protected)
- `GET /bookings/:id` - Get booking by ID (Protected)
- `PUT /bookings/:id/cancel` - Cancel booking (Protected)
- `GET /bookings` - Get all bookings (Admin)
- `PUT /bookings/:id` - Update booking (Admin)

### Cart (`/api/cart`)

- `GET /cart` - Get cart (Protected)
- `POST /cart/items` - Add item to cart (Protected)
- `PUT /cart/items/:productId` - Update cart item (Protected)
- `DELETE /cart/items/:productId` - Remove from cart (Protected)
- `DELETE /cart` - Clear cart (Protected)

### Orders (`/api/orders`)

- `POST /orders` - Create order (Protected)
- `GET /orders/my-orders` - Get user's orders (Protected)
- `GET /orders/:id` - Get order by ID (Protected)
- `PUT /orders/:id/cancel` - Cancel order (Protected)
- `GET /orders` - Get all orders (Admin)
- `PUT /orders/:id` - Update order status (Admin)

### Payment (`/api/payment`)

- `POST /payment/initiate` - Initiate payment (Protected)
- `GET /payment/verify/:transactionId` - Verify payment
- `POST /payment/success` - Payment success callback
- `POST /payment/fail` - Payment failure callback
- `POST /payment/cancel` - Payment cancellation callback

### Admin (`/api/admin`)

- `GET /admin/dashboard` - Get dashboard stats (Admin)
- `GET /admin/users` - Get all users (Admin)
- `GET /admin/users/:id` - Get user by ID (Admin)
- Plus various admin endpoints for managing products, services, bookings, etc.

---

## Frontend API Service Usage

### Using the API Service

The frontend has two API service files:

1. **`src/services/api.js`** - Main API service for public and user features
2. **`src/api/admin.js`** - Admin-specific API service

#### Example: Using the API Service in Components

```javascript
import { api } from "../services/api";

// Get all products
const products = await api.products.getAll();

// Create a booking
const booking = await api.bookings.create({
  serviceId: "123",
  date: "2026-01-10",
  time: "10:00",
  petName: "Buddy",
  petType: "Dog",
});

// Add to cart
await api.cart.addItem(productId, quantity);

// Get user's orders
const orders = await api.orders.getAll();
```

#### Example: Using Admin API

```javascript
import { getAllProducts, addProduct, updateProduct } from "../api/admin";

// Get all products (admin view)
const products = await getAllProducts({ page: 1, limit: 10 });

// Add new product
const newProduct = await addProduct({
  name: "Pet Food",
  price: 29.99,
  category: "Food",
  stock: 100,
});

// Update product
await updateProduct(productId, { stock: 150 });
```

---

## Authentication Flow

### User Authentication

1. User signs up/logs in via Firebase Authentication
2. Frontend receives Firebase ID token
3. Frontend sends token to backend (`POST /api/auth/firebase`)
4. Backend verifies Firebase token
5. Backend creates/finds user in MongoDB
6. Backend returns JWT token
7. Frontend stores JWT token in memory/localStorage
8. Frontend includes JWT in Authorization header for protected routes

### Protected Routes

All protected API calls automatically include the JWT token:

```javascript
// The API client automatically adds the token
const profile = await api.auth.getMe();
```

### Admin Routes

Admin routes require:

1. Valid JWT token
2. User must have admin role/claim

To set admin role, use the Firebase Admin SDK script:

```bash
cd Client/scripts
node setAdminClaim.js user@email.com
```

---

## CORS Configuration

The backend is configured to accept requests from the frontend:

```javascript
// server/app.js
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
```

If you change ports or deploy to production, update:

- `FRONTEND_URL` in `server/.env`
- `VITE_API_URL` in `Client/.env`

---

## Testing the Connection

### 1. Test Backend API

```bash
# In a new terminal
curl http://localhost:5000/api/products
# Should return products list
```

### 2. Test Frontend Connection

1. Open http://localhost:5173
2. Open browser DevTools (F12)
3. Check Network tab
4. Navigate to Products or Services page
5. You should see API calls to http://localhost:5000/api/...

### 3. Test Authentication

1. Sign up for a new account
2. Check browser DevTools Console for any errors
3. Check Network tab for API calls
4. Verify token is being sent in Authorization header

---

## Common Issues & Solutions

### Issue: Cannot connect to MongoDB

**Solution**:

- Check if MongoDB is running (if using local installation)
- Verify `MONGODB_URI` in `server/.env`
- If using MongoDB Atlas, check network access settings

### Issue: CORS errors

**Solution**:

- Verify `FRONTEND_URL` in `server/.env` matches your frontend URL
- Clear browser cache
- Check CORS middleware in `server/app.js`

### Issue: Firebase authentication not working

**Solution**:

- Verify all Firebase credentials in `Client/.env`
- Check Firebase console for enabled authentication methods
- Ensure Firebase project is active

### Issue: API returns 401 Unauthorized

**Solution**:

- Check if JWT token is being sent in Authorization header
- Verify token hasn't expired
- Check if user has required permissions (admin routes)

### Issue: Products/Services not loading

**Solution**:

- Run database seeding: `cd server && npm run seed`
- Check if backend is running
- Check browser console for errors
- Verify API_URL in frontend .env

---

## Production Deployment

### Backend Deployment

1. Choose hosting platform (Heroku, Railway, DigitalOcean, AWS, etc.)
2. Set environment variables on hosting platform
3. Update `FRONTEND_URL` to your frontend domain
4. Deploy code
5. Run database migrations/seeding if needed

### Frontend Deployment

1. Update `VITE_API_URL` to your backend API URL
2. Build the frontend: `npm run build`
3. Deploy `dist` folder to hosting (Vercel, Netlify, etc.)

### Environment Variables for Production

- Use strong, unique values for `JWT_SECRET`
- Use production MongoDB database
- Enable SSLCommerz live mode for payments
- Use HTTPS for all endpoints

---

## Additional Resources

- [API Documentation](server/API_DOCUMENTATION.md)
- [Authentication Guide](Client/AUTHENTICATION_GUIDE.md)
- [Backend Setup Guide](server/QUICKSTART.md)
- [Seeding Guide](server/SEEDING_GUIDE.md)

---

## Support

If you encounter issues:

1. Check the error messages in browser console
2. Check backend server logs
3. Verify all environment variables are set correctly
4. Ensure all dependencies are installed
5. Make sure both frontend and backend servers are running

---

## Summary

✅ **Backend**: Runs on http://localhost:5000
✅ **Frontend**: Runs on http://localhost:5173
✅ **API Base URL**: http://localhost:5000/api
✅ **Database**: MongoDB (Atlas or Local)
✅ **Authentication**: Firebase + JWT
✅ **Payment**: SSLCommerz

Your frontend and backend are now fully connected and ready to use! 🎉
