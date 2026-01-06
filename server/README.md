# 🐾 Dr. Anwar's Pet Care - Backend API

Node.js/Express backend API for the Pet Care management system. Handles authentication, bookings, orders, payments, and email notifications.

## ✨ Features

- **🔐 Authentication**: Firebase Admin SDK + JWT authentication
- **📅 Booking Management**: CRUD operations for appointments
- **🛒 Order Processing**: Product orders and payment integration
- **💳 Payment Gateway**: SSLCommerz integration
- **📧 Email Notifications**: Nodemailer with PDF attachments
- **📄 PDF Generation**: PDFKit for booking confirmations
- **👥 User Management**: Profile and role management
- **🔒 Admin Controls**: Protected admin routes
- **📊 Dashboard Statistics**: Real-time analytics

## 🚀 Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Firebase Admin** - Authentication
- **SSLCommerz** - Payment gateway
- **Nodemailer** - Email service
- **PDFKit** - PDF generation

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- Firebase project with Admin SDK
- Gmail account for email service
- SSLCommerz merchant account (optional, for payments)

## ⚙️ Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables**

   Create `.env` file in the server directory:

   ```env
   # Server
   PORT=5000
   NODE_ENV=development

   # Database
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

   # JWT
   JWT_SECRET=your-super-secret-jwt-key-change-in-production

   # Firebase Admin
   # Place serviceAccountKey.json in server directory

   # Email Service
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password

   # SSLCommerz (Optional - for payments)
   SSLCOMMERZ_STORE_ID=your-store-id
   SSLCOMMERZ_STORE_PASSWORD=your-store-password
   SSLCOMMERZ_IS_LIVE=false

   # URLs
   BASE_URL=http://localhost:5000
   FRONTEND_URL=http://localhost:5173
   ```

3. **Configure Firebase Admin**

   - Go to Firebase Console → Project Settings → Service Accounts
   - Click "Generate new private key"
   - Save as `serviceAccountKey.json` in server directory
   - **Never commit this file to Git!**

4. **Set up Gmail App Password**

   - Go to Google Account Settings
   - Enable 2-Factor Authentication
   - Generate App Password
   - Use this as `EMAIL_PASSWORD` in .env

## 🏃‍♂️ Development

```bash
npm start
```

or with nodemon:

```bash
npm run dev
```

Server runs on `http://localhost:5000`

## 📁 Project Structure

```
server/
├── config/
│   ├── db.js                    # MongoDB connection
│   └── sslcommerz.config.js     # Payment config
├── controllers/
│   ├── admin.controller.js      # Admin operations
│   ├── auth.controller.js       # Authentication
│   ├── booking.controller.js    # Booking management
│   ├── cart.controller.js       # Shopping cart
│   ├── order.controller.js      # Order processing
│   ├── payment.controller.js    # Payment handling
│   ├── product.controller.js    # Product management
│   ├── service.controller.js    # Service management
│   └── user.controller.js       # User management
├── middlewares/
│   ├── auth.middleware.js       # Authentication middleware
│   └── validation.middleware.js # Input validation
├── models/
│   ├── Booking.model.js
│   ├── Cart.model.js
│   ├── Order.model.js
│   ├── Payment.model.js
│   ├── Product.model.js
│   ├── Service.model.js
│   └── User.model.js
├── routes/
│   ├── admin.routes.js
│   ├── auth.routes.js
│   ├── booking.routes.js
│   ├── cart.routes.js
│   ├── order.routes.js
│   ├── payment.routes.js
│   ├── product.routes.js
│   ├── service.routes.js
│   └── user.routes.js
├── utils/
│   └── emailService.js          # Email utilities
├── data/
│   ├── products.seed.js
│   └── services.seed.js
├── app.js                        # Express app setup
├── server.js                     # Server entry point
└── .env                          # Environment variables
```

## 🔌 API Endpoints

### Authentication

```
POST   /api/auth/register       # Register new user
POST   /api/auth/login          # Login with email/password
POST   /api/auth/google         # Google Sign-In
POST   /api/auth/logout         # Logout
GET    /api/auth/me             # Get current user
```

### Bookings

```
GET    /api/bookings            # Get all bookings (admin)
GET    /api/bookings/my-bookings # Get user bookings
GET    /api/bookings/:id        # Get booking by ID
POST   /api/bookings            # Create booking (auth)
POST   /api/bookings/guest      # Create guest booking
PUT    /api/bookings/:id        # Update booking (admin)
PUT    /api/bookings/:id/cancel # Cancel booking
DELETE /api/bookings/:id        # Delete booking
```

### Orders

```
GET    /api/orders              # Get all orders (admin)
GET    /api/orders/my-orders    # Get user orders
GET    /api/orders/:id          # Get order by ID
POST   /api/orders              # Create order
PUT    /api/orders/:id          # Update order (admin)
PUT    /api/orders/:id/cancel   # Cancel order
DELETE /api/orders/:id          # Delete order (admin)
```

### Products

```
GET    /api/products            # Get all products
GET    /api/products/:id        # Get product by ID
POST   /api/products            # Create product (admin)
PUT    /api/products/:id        # Update product (admin)
DELETE /api/products/:id        # Delete product (admin)
```

### Services

```
GET    /api/services            # Get all services
GET    /api/services/:id        # Get service by ID
POST   /api/services            # Create service (admin)
PUT    /api/services/:id        # Update service (admin)
DELETE /api/services/:id        # Delete service (admin)
```

### Admin

```
GET    /api/admin/dashboard     # Get dashboard statistics
GET    /api/admin/appointments  # Get all appointments
GET    /api/admin/users         # Get all users
PUT    /api/admin/users/:id/role # Update user role
PUT    /api/admin/settings/revenue # Update revenue
DELETE /api/admin/users/:id    # Delete user
DELETE /api/admin/bookings/:id # Delete booking
```

## 🌐 Deployment

### Render (Recommended)

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Set environment variables
5. Deploy

### Railway

1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Init: `railway init`
4. Add environment variables
5. Deploy: `railway up`

### Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set env vars: `heroku config:set KEY=value`
5. Deploy: `git push heroku main`

## 🔒 Security Checklist

- ✅ `.env` file is in `.gitignore`
- ✅ `serviceAccountKey.json` is in `.gitignore`
- ✅ JWT secret is strong and unique
- ✅ MongoDB connection string uses environment variable
- ✅ CORS configured properly
- ✅ Rate limiting implemented (if needed)
- ✅ Input validation on all endpoints
- ✅ Admin routes protected with middleware

## 📧 Email Configuration

The server uses Gmail for sending emails (booking confirmations, order updates).

**Setup:**

1. Enable 2FA on your Gmail account
2. Generate App Password (Google Account → Security → App Passwords)
3. Use App Password in `.env` as `EMAIL_PASSWORD`
4. **Never use your actual Gmail password!**

## 💳 Payment Integration (SSLCommerz)

**Sandbox Testing:**

1. Register at https://developer.sslcommerz.com/
2. Get sandbox credentials
3. Add to `.env` file
4. Set `SSLCOMMERZ_IS_LIVE=false`

**Production:**

1. Contact SSLCommerz for merchant account
2. Get live credentials
3. Set `SSLCOMMERZ_IS_LIVE=true`

## 🔧 Database Seeding

Seed initial products and services:

```bash
node scripts/seed.js
```

## 📝 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start with nodemon
- `node scripts/seed.js` - Seed database
- `node scripts/make-superadmin.js` - Create admin user

## 🐛 Troubleshooting

**Issue**: MongoDB connection failed

- Check `MONGODB_URI` in `.env`
- Verify MongoDB Atlas IP whitelist
- Check network connectivity

**Issue**: Firebase authentication error

- Verify `serviceAccountKey.json` exists
- Check Firebase project configuration
- Ensure file is not corrupted

**Issue**: Email not sending

- Check Gmail App Password is correct
- Verify 2FA is enabled on Gmail
- Check `EMAIL_USER` and `EMAIL_PASSWORD`
- Look for blocked sign-in attempts in Gmail

**Issue**: Port already in use

- Change `PORT` in `.env`
- Kill process using port: `npx kill-port 5000`

## 📄 License

Private project for Dr. Anwar's Pet Care

## 👨‍💻 Author

Da Pet Care Development Team

---

For frontend documentation, see `../Client/README.md`
