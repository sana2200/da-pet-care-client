# Quick Start Guide - Pet Care Backend

## 🚀 Fast Setup (5 minutes)

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your values
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### 3. Start Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will run at `http://localhost:5000`

## 📋 Quick Test

Test if server is running:

```bash
curl http://localhost:5000/api/health
```

Expected response:

```json
{
  "status": "OK",
  "message": "Server is running"
}
```

## 🔑 Create Your First Admin User

### Method 1: Register then update in MongoDB

```bash
# 1. Register a user via API
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@petcare.com",
    "password": "admin123",
    "name": "Admin User"
  }'

# 2. Update role in MongoDB
mongo
use da-pet-care
db.users.updateOne(
  { email: "admin@petcare.com" },
  { $set: { role: "admin" } }
)
```

### Method 2: Direct MongoDB Insert

```javascript
db.users.insertOne({
  email: "admin@petcare.com",
  password: "$2b$10$...", // Hash 'admin123' using bcrypt
  name: "Admin User",
  role: "admin",
  authProvider: "local",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
});
```

## 📦 Sample Data (Optional)

### Add Sample Products

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Premium Dog Food",
    "description": "Nutritious food for adult dogs",
    "price": 1500,
    "category": "food",
    "stock": 100,
    "images": ["https://example.com/dog-food.jpg"]
  }'
```

### Add Sample Service

```bash
curl -X POST http://localhost:5000/api/services \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Dog Grooming",
    "description": "Professional grooming service",
    "price": 800,
    "duration": 60,
    "category": "grooming"
  }'
```

## 🧪 Test Payment (Sandbox)

```bash
node test-payment.js
```

This will:

1. Initialize a test payment
2. Get payment gateway URL
3. Check payment status
4. Test health endpoint

## 🔗 Essential Endpoints

### User Registration

```bash
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

### User Login

```bash
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Get Products

```bash
GET /api/products?category=food&page=1&limit=10
```

### Get Services

```bash
GET /api/services?featured=true
```

### Add to Cart

```bash
POST /api/cart/items
Authorization: Bearer YOUR_TOKEN
{
  "productId": "PRODUCT_ID",
  "quantity": 2
}
```

### Create Order

```bash
POST /api/orders
Authorization: Bearer YOUR_TOKEN
{
  "items": [...],
  "shippingAddress": {...}
}
```

### Create Booking

```bash
POST /api/bookings
Authorization: Bearer YOUR_TOKEN
{
  "service": "SERVICE_ID",
  "bookingDate": "2026-01-15",
  "timeSlot": { "startTime": "10:00", "endTime": "11:00" },
  "petDetails": {...}
}
```

## 🔐 Authentication Flow

1. **Register/Login** → Get JWT token
2. **Include token** in all protected requests:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## 📱 Firebase Setup (Optional)

For Google Sign-In:

1. Create Firebase project at https://console.firebase.google.com
2. Generate service account key
3. Save as `serviceAccountKey.json` in server root
4. Frontend uses Firebase client SDK
5. Backend verifies tokens automatically

## 🛠️ Development Tools

### VS Code Extensions (Recommended)

- REST Client
- MongoDB for VS Code
- ESLint
- Prettier

### Test API with REST Client

Create `test.http` file:

```http
### Health Check
GET http://localhost:5000/api/health

### Register User
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "test123",
  "name": "Test User"
}
```

## 🐛 Common Issues

### Port already in use

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### MongoDB connection error

- Check MONGODB_URI in .env
- Ensure MongoDB is running
- Check network/firewall settings

### JWT token expired

- Tokens expire after 30 days
- Login again to get new token

## 📚 Documentation

- [API Documentation](./API_DOCUMENTATION.md) - Full API reference
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md) - Backend overview
- [Payment Setup](./README.md) - SSLCommerz guide

## 💡 Pro Tips

1. **Use environment-specific .env files**

   - `.env.development`
   - `.env.production`

2. **Enable logging**

   ```javascript
   // Add to app.js
   app.use(morgan("dev"));
   ```

3. **Database indexes**
   Already configured for optimal performance

4. **Rate limiting** (Add if needed)
   ```bash
   npm install express-rate-limit
   ```

## 🎯 Next Actions

- [ ] Update .env with your credentials
- [ ] Create admin user
- [ ] Test all endpoints
- [ ] Add sample data
- [ ] Connect frontend
- [ ] Configure SSLCommerz
- [ ] Deploy to production

## 📞 Support

Check these files for detailed information:

- `API_DOCUMENTATION.md` - API details
- `IMPLEMENTATION_SUMMARY.md` - Architecture
- `README.md` - Payment setup

---

**Ready to go!** 🚀 Start the server with `npm run dev`
