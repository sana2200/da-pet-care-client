# 🎯 5-Minute Setup Guide

Get your full-stack Pet Care application running in 5 minutes!

---

## 🆕 **NEW FEATURES ADDED!** (Jan 5, 2026)

### Order Management & Email Notifications

**What's New:**

- ✅ **Online Payment option** with "Coming Soon" badge
- ✅ **Automated emails to superadmins** when orders are placed
- ✅ **PDF invoices** attached to order emails
- ✅ **Enhanced order validation** (name, phone, address required)

**Quick Setup for New Features:**

1. **Configure Email (2 minutes):**

   ```bash
   # Edit server/.env and add:
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-gmail-app-password
   ```

   Get App Password: https://myaccount.google.com/security → App passwords

2. **Create SuperAdmin:**

   ```bash
   cd server
   node scripts/make-superadmin.js your-email@gmail.com
   ```

3. **Test It:**
   - Place an order → Check your email for notification with PDF!

📚 **Detailed Documentation:**

- Email Setup: `server/EMAIL_SETUP.md`
- Features Overview: `ORDER_MANAGEMENT_FEATURES.md`
- Testing Guide: `TESTING_CHECKLIST.md`

---

## ⚡ Super Quick Start

### 1️⃣ Install Everything (1 minute)

```bash
npm run install-all
```

This installs dependencies for root, backend, and frontend.

---

### 2️⃣ Add Firebase Config (1 minute)

Edit `Client/.env` and add your Firebase credentials:

```env
VITE_API_URL=http://localhost:5000

# Get these from Firebase Console → Project Settings
VITE_FIREBASE_API_KEY=your_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Don't have Firebase?** Get free credentials at https://console.firebase.google.com/

---

### 3️⃣ Seed Database (30 seconds)

```bash
cd server
npm run seed
```

This adds sample products and services to your database.

---

### 4️⃣ Start Everything (30 seconds)

**Windows:**

```bash
start-dev.bat
```

**Mac/Linux:**

```bash
chmod +x start-dev.sh
./start-dev.sh
```

**Or manually in 2 terminals:**

```bash
# Terminal 1
cd server
npm run dev

# Terminal 2
cd Client
npm run dev
```

---

### 5️⃣ Open and Test (1 minute)

1. **Open your browser**: http://localhost:5173

2. **You should see**: The Pet Care home page

3. **Test it works**:
   - Click "Shop" → Products should load
   - Click "Services" → Services should load
   - Sign up for an account
   - Try adding items to cart

---

## ✅ Success Checklist

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:5173
- [ ] Products page shows items
- [ ] Services page shows items
- [ ] Can sign up/login
- [ ] Can add items to cart
- [ ] No errors in browser console

---

## 🎊 That's It!

You now have a fully working full-stack Pet Care application!

### What's Running:

```
┌─────────────────────────────────────┐
│  Frontend (React + Vite)            │
│  http://localhost:5173              │
│  • User Interface                   │
│  • Authentication                   │
│  • Shopping & Booking               │
└──────────────┬──────────────────────┘
               │
               │ REST API Calls
               │
┌──────────────▼──────────────────────┐
│  Backend (Node.js + Express)        │
│  http://localhost:5000              │
│  • Business Logic                   │
│  • Authentication                   │
│  • Data Management                  │
└──────────────┬──────────────────────┘
               │
               │ MongoDB Connection
               │
┌──────────────▼──────────────────────┐
│  Database (MongoDB Atlas)           │
│  • Products                         │
│  • Services                         │
│  • Users, Orders, Bookings          │
└─────────────────────────────────────┘
```

---

## 🚀 Next Steps

### For Users:

1. **Browse Products**: Click "Shop" in navigation
2. **View Services**: Click "Services"
3. **Sign Up**: Create an account
4. **Add to Cart**: Add products and checkout
5. **Book Service**: Schedule an appointment

### For Admins:

1. **Set Admin Role**:
   ```bash
   cd Client/scripts
   node setAdminClaim.js your-email@example.com
   ```
2. **Re-login** to get admin token
3. **Access Admin Panel**: http://localhost:5173/admin
4. **Manage Products/Services/Bookings**

### For Developers:

1. **Read Docs**: [FULL_STACK_CONNECTION_GUIDE.md](FULL_STACK_CONNECTION_GUIDE.md)
2. **Explore API**: [API_QUICK_REFERENCE.md](API_QUICK_REFERENCE.md)
3. **Understand Architecture**: [ARCHITECTURE.md](ARCHITECTURE.md)
4. **Start Coding**: Customize and extend!

---

## 🆘 Need Help?

### Something Not Working?

1. **Check Troubleshooting Guide**: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. **Verify Both Servers Running**:
   - Backend: http://localhost:5000/api/products (should return JSON)
   - Frontend: http://localhost:5173 (should show website)
3. **Check Browser Console**: Press F12, look for errors
4. **Check Backend Terminal**: Look for error messages

### Common Quick Fixes:

**Products not showing?**

```bash
cd server
npm run seed
```

**CORS errors?**

- Check `server/.env` has `FRONTEND_URL=http://localhost:5173`
- Restart backend server

**Authentication not working?**

- Add Firebase credentials to `Client/.env`
- Restart frontend server

**"Cannot connect" errors?**

- Make sure both servers are running
- Check ports 5000 and 5173 are not in use

---

## 📱 Test Your Setup

Run the connection test:

```bash
npm run test-connection
```

This verifies your backend is running and accessible.

---

## 🎨 Customize Your App

### Change Colors/Styling:

- Edit `Client/tailwind.config.js`
- Modify components in `Client/src/components/`
- Update styles in `Client/src/styles/`

### Add New Features:

- **Backend**: Add routes → controllers → models
- **Frontend**: Add pages → components → API calls
- Follow existing patterns in the code

### Modify Products/Services:

- **Option 1**: Use admin panel (after setting admin role)
- **Option 2**: Modify `server/data/products.seed.js` and re-seed
- **Option 3**: Use MongoDB Compass or Atlas UI

---

## 🚢 Deploy to Production

When ready to deploy:

### Backend:

1. Choose hosting: Heroku, Railway, Render, DigitalOcean
2. Set environment variables
3. Deploy backend code
4. Update frontend API URL

### Frontend:

1. Update `Client/.env` with production API URL
2. Build: `cd Client && npm run build`
3. Deploy `dist` folder to Vercel, Netlify, or similar
4. Configure domain

### Database:

- Already using MongoDB Atlas (cloud)
- For production: Create separate cluster
- Update `MONGODB_URI` in backend

---

## 💡 Pro Tips

1. **Use the start scripts**: `start-dev.bat` or `start-dev.sh` to start both servers at once
2. **Keep terminals visible**: Watch for errors in both backend and frontend
3. **Use browser DevTools**: Network tab shows all API calls
4. **Seed frequently**: Run `npm run seed` when database gets messy
5. **Read the docs**: Comprehensive guides available for everything

---

## 📊 What You Have Now

✅ **Complete E-commerce System**

- Product catalog with categories
- Shopping cart functionality
- Checkout and payment integration

✅ **Booking System**

- Service listings
- Appointment scheduling
- Booking management

✅ **User System**

- Authentication (Email + Google)
- User profiles
- Order history
- Booking history

✅ **Admin Panel**

- Dashboard with analytics
- Product management
- Service management
- Order & booking management
- User management

✅ **Technical Features**

- RESTful API
- JWT authentication
- MongoDB database
- Payment gateway integration
- Responsive design
- Protected routes

---

## 🎉 Congratulations!

You have successfully set up a complete full-stack Pet Care application!

**Time spent**: ~5 minutes
**Result**: Professional full-stack web application
**Next step**: Start customizing and building amazing features!

---

## 📚 Learn More

| Topic             | Document                                                         | Description           |
| ----------------- | ---------------------------------------------------------------- | --------------------- |
| Setup Details     | [FULL_STACK_CONNECTION_GUIDE.md](FULL_STACK_CONNECTION_GUIDE.md) | Complete setup guide  |
| API Reference     | [API_QUICK_REFERENCE.md](API_QUICK_REFERENCE.md)                 | All endpoints         |
| Fix Issues        | [TROUBLESHOOTING.md](TROUBLESHOOTING.md)                         | Solutions to problems |
| Understand System | [ARCHITECTURE.md](ARCHITECTURE.md)                               | How it works          |
| What's Done       | [CONNECTION_COMPLETE.md](CONNECTION_COMPLETE.md)                 | Integration summary   |

---

**Happy Coding!** 🚀

Made with ❤️ for pet lovers everywhere 🐶 🐱 🐰 🦎 🐦 🐠
