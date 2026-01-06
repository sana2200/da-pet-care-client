# Pet Care Backend API Documentation

## Overview

This is a comprehensive Node.js/Express backend for a Pet Care application with features for:

- User authentication (Local & Firebase)
- Product management (Pet shop)
- Service booking (Pet care services)
- Order management
- Shopping cart
- Payment integration (SSLCommerz)
- Admin dashboard

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Firebase Admin** - Firebase authentication
- **bcrypt** - Password hashing
- **SSLCommerz** - Payment gateway

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development

# SSLCommerz Configuration
SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASSWORD=your_store_password
BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
```

## Running the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint           | Description             | Access  |
| ------ | ------------------ | ----------------------- | ------- |
| POST   | `/register`        | Register new user       | Public  |
| POST   | `/login`           | Login user              | Public  |
| POST   | `/firebase`        | Firebase authentication | Public  |
| GET    | `/me`              | Get current user        | Private |
| GET    | `/verify`          | Verify token            | Private |
| PUT    | `/profile`         | Update profile          | Private |
| PUT    | `/change-password` | Change password         | Private |

### Product Routes (`/api/products`)

| Method | Endpoint          | Description                     | Access  |
| ------ | ----------------- | ------------------------------- | ------- |
| GET    | `/`               | Get all products (with filters) | Public  |
| GET    | `/categories/all` | Get all categories              | Public  |
| GET    | `/featured/all`   | Get featured products           | Public  |
| GET    | `/:id`            | Get product by ID               | Public  |
| POST   | `/:id/reviews`    | Add product review              | Private |
| POST   | `/`               | Create product                  | Admin   |
| PUT    | `/:id`            | Update product                  | Admin   |
| DELETE | `/:id`            | Delete product                  | Admin   |

### Service Routes (`/api/services`)

| Method | Endpoint            | Description                     | Access  |
| ------ | ------------------- | ------------------------------- | ------- |
| GET    | `/`                 | Get all services (with filters) | Public  |
| GET    | `/categories/all`   | Get all categories              | Public  |
| GET    | `/featured/all`     | Get featured services           | Public  |
| GET    | `/:id`              | Get service by ID               | Public  |
| GET    | `/:id/availability` | Check availability              | Public  |
| POST   | `/:id/reviews`      | Add service review              | Private |
| POST   | `/`                 | Create service                  | Admin   |
| PUT    | `/:id`              | Update service                  | Admin   |
| DELETE | `/:id`              | Delete service                  | Admin   |

### Booking Routes (`/api/bookings`)

| Method | Endpoint       | Description           | Access  |
| ------ | -------------- | --------------------- | ------- |
| POST   | `/`            | Create booking        | Private |
| GET    | `/my-bookings` | Get user's bookings   | Private |
| GET    | `/:id`         | Get booking by ID     | Private |
| PUT    | `/:id/cancel`  | Cancel booking        | Private |
| GET    | `/`            | Get all bookings      | Admin   |
| PUT    | `/:id`         | Update booking status | Admin   |

### Cart Routes (`/api/cart`)

| Method | Endpoint            | Description           | Access  |
| ------ | ------------------- | --------------------- | ------- |
| GET    | `/`                 | Get user's cart       | Private |
| POST   | `/items`            | Add item to cart      | Private |
| PUT    | `/items/:productId` | Update cart item      | Private |
| DELETE | `/items/:productId` | Remove item from cart | Private |
| DELETE | `/`                 | Clear cart            | Private |

### Order Routes (`/api/orders`)

| Method | Endpoint      | Description         | Access  |
| ------ | ------------- | ------------------- | ------- |
| POST   | `/`           | Create order        | Private |
| GET    | `/my-orders`  | Get user's orders   | Private |
| GET    | `/:id`        | Get order by ID     | Private |
| PUT    | `/:id/cancel` | Cancel order        | Private |
| GET    | `/`           | Get all orders      | Admin   |
| PUT    | `/:id`        | Update order status | Admin   |

### Payment Routes (`/api/payment`)

| Method | Endpoint                 | Description              | Access  |
| ------ | ------------------------ | ------------------------ | ------- |
| POST   | `/init`                  | Initialize payment       | Public  |
| POST   | `/success`               | Payment success callback | Public  |
| POST   | `/fail`                  | Payment fail callback    | Public  |
| POST   | `/cancel`                | Payment cancel callback  | Public  |
| POST   | `/ipn`                   | IPN listener             | Public  |
| GET    | `/status/:transactionId` | Get payment status       | Public  |
| GET    | `/user/:userId`          | Get user payments        | Private |

### Admin Routes (`/api/admin`)

| Method | Endpoint           | Description         | Access |
| ------ | ------------------ | ------------------- | ------ |
| GET    | `/dashboard`       | Get dashboard stats | Admin  |
| GET    | `/users`           | Get all users       | Admin  |
| GET    | `/users/:id`       | Get user by ID      | Admin  |
| PUT    | `/users/:id`       | Update user         | Admin  |
| DELETE | `/users/:id`       | Delete user         | Admin  |
| GET    | `/analytics/sales` | Get sales analytics | Admin  |

### Public Routes (`/api`)

| Method | Endpoint  | Description  | Access |
| ------ | --------- | ------------ | ------ |
| GET    | `/health` | Health check | Public |

## Models

### User

- Email, password, name, phone, role, address
- Firebase integration support
- Password hashing

### Product

- Name, description, price, category, stock
- Images, reviews, ratings
- Featured flag

### Service

- Name, description, price, duration, category
- Availability schedule, time slots
- Reviews, ratings

### Booking

- User, service, date, time slot
- Pet details, customer info
- Status tracking (pending, confirmed, completed, cancelled)

### Order

- User, items, shipping address
- Payment status, order status
- Tracking number

### Cart

- User, items with quantities
- Auto-calculated subtotal

### Payment

- Transaction details from SSLCommerz
- Payment status tracking
- Customer and product info

## Authentication

The API supports two authentication methods:

1. **Local Authentication**: Email/password with JWT tokens
2. **Firebase Authentication**: Google sign-in via Firebase

All protected routes require a Bearer token:

```
Authorization: Bearer <token>
```

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [] // Optional validation errors
}
```

## Validation

Request validation is handled using `express-validator`. Invalid requests return 400 status with error details.

## Firebase Setup

1. Create a Firebase project
2. Generate service account key
3. Save as `serviceAccountKey.json` in the root directory
4. The backend will auto-initialize Firebase Admin SDK

## Payment Integration

The app uses SSLCommerz for payment processing. See [README.md](README.md) for detailed setup instructions.

## Admin Access

To create an admin user, update the user's role in the database:

```javascript
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } });
```

## Development

The server uses `nodemon` for hot reloading during development:

```bash
npm run dev
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use live SSLCommerz credentials
3. Configure proper CORS settings
4. Set up SSL/HTTPS
5. Use a process manager (PM2)

## API Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (dev only)"
}
```

### Paginated Response

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "hasMore": true
  }
}
```

## License

MIT
