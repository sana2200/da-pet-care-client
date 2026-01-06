# 🚀 Quick Deployment Guide

## Prerequisites

- Git installed
- Node.js 16+ installed
- Accounts created on:
  - Vercel (frontend)
  - Railway/Render (backend)
  - MongoDB Atlas (database - already set up)

---

## Step 1: Critical Cleanup (REQUIRED)

```bash
# Navigate to project root
cd d:\da-pet-care

# Run cleanup script
.\cleanup-for-production.ps1

# Or manually remove sensitive files
rm Client\serviceAccountKey.json
rm server\serviceAccountKey.json
rm "Client\Postman (x64).exe"

# Remove test files
rm test-connection.js
rm server\test-*.js
rm server\scripts\remove-duplicates.js
rm server\scripts\upload-*.js
rm server\scripts\test-create-user.js
```

---

## Step 2: Update Dependencies

```bash
# Client
cd Client
npm audit fix
npm update

# Server
cd ..\server
npm audit fix
npm update
```

---

## Step 3: Build & Test Locally

```bash
# Test frontend build
cd ..\Client
npm run build
npm run preview

# Open browser to http://localhost:4173 and test
```

---

## Step 4: Deploy Frontend (Vercel)

### Option A: Via Vercel Website

1. Go to https://vercel.com
2. Click "New Project"
3. Import your Git repository
4. Set root directory to `Client`
5. Framework: Vite
6. Build command: `npm run build`
7. Output directory: `dist`
8. Add environment variables:
   ```
   VITE_API_URL=https://your-backend-domain.com
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project
   VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
9. Click "Deploy"

### Option B: Via Vercel CLI

```bash
cd Client
npm i -g vercel
vercel login
vercel
# Follow prompts and add environment variables
```

---

## Step 5: Deploy Backend (Railway)

### Option A: Via Railway Website

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Select your repository
5. Click "Add variables" and add:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_strong_secret_min_32_chars
   FIREBASE_PROJECT_ID=your-project-id
   CLIENT_URL=https://your-vercel-domain.vercel.app
   SSLCOMMERZ_STORE_ID=your_store_id
   SSLCOMMERZ_STORE_PASSWORD=your_password
   SSLCOMMERZ_IS_LIVE=true
   ```
6. Set root directory to `server`
7. Start command: `node server.js`
8. Click "Deploy"

### Option B: Via Railway CLI

```bash
cd server
npm i -g @railway/cli
railway login
railway init
railway up
railway variables set NODE_ENV=production
# Add other variables...
```

---

## Step 6: Update Frontend with Backend URL

1. After backend deploys, copy the Railway URL (e.g., `https://your-app.railway.app`)
2. Go back to Vercel dashboard
3. Update `VITE_API_URL` environment variable
4. Redeploy frontend

---

## Step 7: Configure CORS

Update `server/app.js` CORS configuration:

```javascript
const corsOptions = {
  origin: [
    "https://your-vercel-domain.vercel.app",
    "https://your-custom-domain.com", // if you have one
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};
```

Commit and push changes.

---

## Step 8: Test Production Deployment

### Test Checklist:

- [ ] Visit your Vercel URL
- [ ] Test user registration
- [ ] Test login
- [ ] Browse products
- [ ] Add items to cart
- [ ] Test checkout flow
- [ ] **Test payment with small amount (৳10)**
- [ ] Book a service
- [ ] Access admin dashboard
- [ ] Test admin functions

---

## Step 9: Set Up Custom Domain (Optional)

### Vercel:

1. Go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### Railway:

1. Go to project settings
2. Click "Networking"
3. Add custom domain
4. Update DNS CNAME record

---

## Step 10: Enable Monitoring

### Error Tracking (Sentry - Free Tier)

```bash
npm install --save @sentry/react @sentry/node

# In Client/src/main.jsx - Add:
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production"
});

# In server/app.js - Add:
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production"
});
```

### Uptime Monitoring

- Sign up for UptimeRobot (free): https://uptimerobot.com
- Add your Vercel and Railway URLs
- Set up email alerts

---

## Step 11: Database Backup

1. Go to MongoDB Atlas dashboard
2. Navigate to your cluster
3. Click "Backup" tab
4. Enable Cloud Backup (or continuous backup)
5. Set retention policy

---

## Troubleshooting

### Frontend can't connect to backend

- Check `VITE_API_URL` is correct
- Verify CORS is configured correctly
- Check Railway/Render logs for errors

### Database connection failed

- Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0) for Railway
- Check `MONGODB_URI` is correct
- Verify database user has proper permissions

### Payment not working

- Verify `SSLCOMMERZ_IS_LIVE=true`
- Check store credentials are correct
- Review SSLCommerz dashboard logs

### Images not loading

- Check image URLs in database
- Verify images are accessible
- Consider using Cloudinary for image hosting

---

## Post-Deployment Checklist

- [ ] All features tested in production
- [ ] Error tracking configured
- [ ] Uptime monitoring active
- [ ] Database backups enabled
- [ ] Custom domain configured (if applicable)
- [ ] SSL/HTTPS enabled (automatic with Vercel/Railway)
- [ ] API keys secured and not in git
- [ ] Team members have access to dashboards
- [ ] Documentation updated with production URLs

---

## Environment URLs (Update after deployment)

```
Frontend: https://your-app.vercel.app
Backend API: https://your-app.railway.app
Admin Dashboard: https://your-app.vercel.app/admin-dashboard
API Documentation: https://your-app.railway.app/api

MongoDB Atlas: https://cloud.mongodb.com
Vercel Dashboard: https://vercel.com/dashboard
Railway Dashboard: https://railway.app/dashboard
```

---

## Support Resources

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- SSLCommerz Docs: https://developer.sslcommerz.com

---

## Emergency Rollback

If something goes wrong:

### Vercel:

1. Go to deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

### Railway:

1. Go to deployments
2. Click on previous deployment
3. Click "Redeploy"

---

**Estimated Deployment Time: 1-2 hours**

**Cost Estimate (Monthly):**

- Vercel: Free (Hobby tier)
- Railway: $5-20 (usage-based)
- MongoDB Atlas: Free (current tier)
- **Total: $5-20/month**

**Good luck! 🎉**
