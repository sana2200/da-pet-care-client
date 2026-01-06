# 🐾 Pet Care Full Stack Application

A complete pet care management system with e-commerce, booking, and admin features.

> **✅ Frontend and Backend are fully connected!** See [CONNECTION_COMPLETE.md](CONNECTION_COMPLETE.md) for details.

---

## 📋 Quick Links

- ⚡ **[5-Minute Setup](QUICK_START.md)** - Fastest way to get started
- 🚀 **[Quick Start](#-quick-start)** - Get started in 5 minutes
- 📖 **[Full Connection Guide](FULL_STACK_CONNECTION_GUIDE.md)** - Detailed setup instructions
- 📚 **[API Reference](API_QUICK_REFERENCE.md)** - All API endpoints
- 🔧 **[Troubleshooting](TROUBLESHOOTING.md)** - Common issues and solutions
- 🏗️ **[Architecture](ARCHITECTURE.md)** - System design and flow diagrams
- ✅ **[What's Connected](CONNECTION_COMPLETE.md)** - Summary of completed integration

---

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- Firebase Account

### Installation & Setup

1. **Clone and Install**

   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../Client
   npm install
   ```

2. **Configure Environment Variables**

   **Backend** (`server/.env`):

   - Already configured with MongoDB Atlas
   - Update if you want to use local MongoDB

   **Frontend** (`Client/.env`):

   - Add your Firebase credentials
   - See `.env.example` for reference

3. **Seed Database (Optional)**

   ```bash
   cd server
   npm run seed
   ```

4. **Start Development Servers**

   **Option A: Use the start script**

   ```bash
   # Windows
   start-dev.bat

   # Linux/Mac
   chmod +x start-dev.sh
   ./start-dev.sh
   ```

   **Option B: Manual start**

   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev

   # Terminal 2 - Frontend
   cd Client
   npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - API Docs: http://localhost:5000/api

## 📁 Project Structure

```
da-pet-care/
├── Client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── api/           # Admin API services
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React Context (Cart, Notifications)
│   │   ├── pages/         # Page components
│   │   ├── services/      # API client services
│   │   └── styles/        # CSS/Tailwind styles
│   ├── .env               # Environment variables
│   └── package.json
│
├── server/                # Node.js Backend (Express)
│   ├── config/           # Database & config files
│   ├── controllers/      # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middlewares/      # Auth & validation middleware
│   ├── scripts/          # Utility scripts (seeding)
│   ├── .env             # Environment variables
│   └── package.json
│
├── FULL_STACK_CONNECTION_GUIDE.md  # Detailed setup guide
├── start-dev.bat         # Windows start script
└── start-dev.sh          # Linux/Mac start script
```

## 🔑 Key Features

### Customer Features

- 🛒 Product shopping with cart functionality
- 📅 Service booking system
- 👤 User authentication (Firebase + JWT)
- 💳 Payment integration (SSLCommerz)
- 📦 Order tracking
- ⭐ Product & service reviews
- 📱 Responsive design

### Admin Features

- 📊 Dashboard with analytics
- 📦 Product management (CRUD)
- 🏥 Service management
- 📅 Booking management
- 👥 User management
- 📈 Order tracking & status updates

## 🛠️ Technology Stack

### Frontend

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: React Context API
- **HTTP Client**: Axios & Fetch API
- **Authentication**: Firebase Authentication

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Firebase Admin + JWT
- **Payment**: SSLCommerz
- **Validation**: Express Validator

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `POST /api/auth/firebase` - Firebase auth
- `GET /api/auth/me` - Get profile

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Services

- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID
- `POST /api/services` - Create service (Admin)

### Bookings

- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user bookings
- `GET /api/bookings` - Get all bookings (Admin)

### Cart

- `GET /api/cart` - Get cart
- `POST /api/cart/items` - Add to cart
- `PUT /api/cart/items/:id` - Update cart item
- `DELETE /api/cart/items/:id` - Remove from cart

### Orders

- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders` - Get all orders (Admin)

### Payment

- `POST /api/payment/initiate` - Initiate payment
- `GET /api/payment/verify/:id` - Verify payment

### Admin

- `GET /api/admin/dashboard` - Get dashboard stats
- `GET /api/admin/users` - Get all users
- _See API documentation for complete list_

## 🔐 Authentication Flow

1. User signs up/logs in via Firebase
2. Frontend receives Firebase ID token
3. Token sent to backend for verification
4. Backend creates user in MongoDB
5. Backend returns JWT token
6. Frontend uses JWT for protected routes

### Setting Admin Role

```bash
cd Client/scripts
node setAdminClaim.js user@email.com
```

## 🎨 Frontend API Usage

### Regular API Service

```javascript
import { api } from "./services/api";

// Get products
const products = await api.products.getAll();

// Create booking
await api.bookings.create(bookingData);

// Add to cart
await api.cart.addItem(productId, quantity);
```

### Admin API Service

```javascript
import { getAllProducts, addProduct } from "./api/admin";

// Get all products (admin)
const products = await getAllProducts();

// Add product
await addProduct(productData);
```

## 📝 Environment Variables

### Frontend (Client/.env)

```env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
# ... other Firebase configs
```

### Backend (server/.env)

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret
SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASSWORD=your_password
FRONTEND_URL=http://localhost:5173
```

## 🐛 Troubleshooting

### Cannot connect to backend

- Ensure backend server is running on port 5000
- Check `VITE_API_URL` in Client/.env
- Check CORS settings in server/app.js

### Firebase authentication issues

- Verify Firebase credentials in Client/.env
- Check Firebase console for enabled auth methods
- Ensure Firebase project is active

### Database connection issues

- Check MongoDB is running (if local)
- Verify `MONGODB_URI` in server/.env
- Check MongoDB Atlas network settings (if cloud)

### Products not showing

- Run database seeding: `cd server && npm run seed`
- Check backend logs for errors
- Verify API endpoints in browser DevTools

## 📚 Documentation

- [Full Stack Connection Guide](FULL_STACK_CONNECTION_GUIDE.md) - Detailed setup and connection guide
- [API Documentation](server/API_DOCUMENTATION.md) - Complete API reference
- [Authentication Guide](Client/AUTHENTICATION_GUIDE.md) - Auth flow details
- [Backend Quickstart](server/QUICKSTART.md) - Backend setup guide
- [Seeding Guide](server/SEEDING_GUIDE.md) - Database seeding instructions

## 🚢 Deployment

### Backend

1. Deploy to Heroku/Railway/DigitalOcean
2. Set environment variables
3. Update `FRONTEND_URL`
4. Run migrations/seeding

### Frontend

1. Update `VITE_API_URL` to production API
2. Build: `npm run build`
3. Deploy `dist` folder to Vercel/Netlify

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## 💬 Support

For issues and questions:

1. Check troubleshooting section
2. Review documentation
3. Check browser console for errors
4. Check backend logs

---

**Built with ❤️ for pet lovers**

🐶 🐱 🐰 🦎 🐦 🐠
