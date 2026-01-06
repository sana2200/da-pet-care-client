# Production Deployment Checklist ✅

## 🔒 Security & Environment

### ✅ Completed

- [x] `.env` files are in `.gitignore`
- [x] `serviceAccountKey.json` files are in `.gitignore`
- [x] Firebase Admin SDK keys secured
- [x] JWT_SECRET is set in environment variables
- [x] MONGODB_URI is set in environment variables

### ⚠️ Action Required

- [ ] **CRITICAL**: Delete `Client/serviceAccountKey.json` from repository
- [ ] **CRITICAL**: Delete `server/serviceAccountKey.json` from repository
- [ ] Remove `Client/Postman (x64).exe` from repository
- [ ] Generate new Firebase service account keys for production
- [ ] Update MongoDB connection string for production database
- [ ] Set strong JWT_SECRET for production
- [ ] Configure CORS origins for production domains only
- [ ] Enable rate limiting on API endpoints
- [ ] Review and update SSL/TLS certificates

## 🧹 Code Cleanup

### ✅ Completed

- [x] Removed debugging console.logs from `Shop.jsx`
- [x] Removed debugging console.logs from `Services.jsx`
- [x] Removed TODO comment from `About.jsx`
- [x] Replaced emojis with Font Awesome icons

### ⚠️ Files to Review/Remove Before Deployment

- [ ] Delete `test-connection.js` (root)
- [ ] Delete `server/test-api.js`
- [ ] Delete `server/test-endpoints.js`
- [ ] Delete `server/test-payment.js`
- [ ] Delete `server/scripts/test-create-user.js`
- [ ] Delete `server/scripts/remove-duplicates.js` (one-time script)
- [ ] Delete `server/scripts/upload-*.js` (seeding scripts)
- [ ] Keep only essential documentation, remove development guides

## 📦 Build & Dependencies

### Frontend (Client)

- [ ] Run `npm audit fix` to fix vulnerabilities
- [ ] Update outdated dependencies: `npm outdated`
- [ ] Run production build: `npm run build`
- [ ] Test production build locally: `npm run preview`
- [ ] Optimize images in `public/` and `src/Images/`
- [ ] Enable compression in Vite config
- [ ] Configure proper meta tags for SEO

### Backend (Server)

- [ ] Run `npm audit fix` to fix vulnerabilities
- [ ] Update outdated dependencies
- [ ] Set `NODE_ENV=production`
- [ ] Configure proper error handling middleware
- [ ] Set up logging service (Winston, Morgan)
- [ ] Configure database connection pooling
- [ ] Set up backup strategy for MongoDB

## 🌐 Deployment Configuration

### Environment Variables

Create production `.env` files with:

**Client/.env.production**

```
VITE_API_URL=https://your-api-domain.com
VITE_FIREBASE_API_KEY=your_production_key
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**server/.env.production**

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://production_user:password@cluster.mongodb.net/production_db
JWT_SECRET=your_very_strong_production_secret_min_32_chars
FIREBASE_PROJECT_ID=your-project-id
CLIENT_URL=https://your-frontend-domain.com
SSLCOMMERZ_STORE_ID=your_production_store_id
SSLCOMMERZ_STORE_PASSWORD=your_production_password
SSLCOMMERZ_IS_LIVE=true
```

### Recommended Deployment Platforms

- **Frontend**: Vercel, Netlify, or Cloudflare Pages
- **Backend**: Railway, Render, Fly.io, or DigitalOcean
- **Database**: MongoDB Atlas (already configured)

## 🚀 Performance Optimization

- [ ] Enable CDN for static assets
- [ ] Configure caching headers
- [ ] Minify CSS/JS (Vite does this automatically)
- [ ] Lazy load images
- [ ] Implement pagination for all list views (products, orders, etc.)
- [ ] Add database indexes for frequently queried fields
- [ ] Configure reverse proxy (nginx) if using VPS

## 📊 Monitoring & Analytics

- [ ] Set up error tracking (Sentry, Rollbar)
- [ ] Configure uptime monitoring
- [ ] Set up Google Analytics or similar
- [ ] Configure server logs aggregation
- [ ] Set up database backup alerts
- [ ] Monitor API response times

## 🔍 Testing

- [ ] Test all user flows (registration, login, booking, shopping)
- [ ] Test payment gateway integration thoroughly
- [ ] Test admin dashboard functions
- [ ] Load test API endpoints
- [ ] Test on multiple browsers and devices
- [ ] Test error scenarios and edge cases

## 📱 Final Checks

- [ ] All forms validate properly
- [ ] Error messages are user-friendly
- [ ] Loading states work correctly
- [ ] Mobile responsiveness verified
- [ ] Accessibility (ARIA labels, keyboard navigation)
- [ ] All images have alt text
- [ ] Favicon and app icons configured
- [ ] Terms of Service & Privacy Policy pages added
- [ ] Contact information is accurate

## 🔐 Security Hardening

- [ ] Enable HTTPS only
- [ ] Configure security headers (helmet.js)
- [ ] Implement CSRF protection
- [ ] Sanitize user inputs
- [ ] Rate limit authentication endpoints
- [ ] Set up DDoS protection (Cloudflare)
- [ ] Regular security audits
- [ ] Keep all dependencies updated

## 📝 Documentation

- [ ] API documentation is up to date
- [ ] README has deployment instructions
- [ ] Environment variables documented
- [ ] Create runbook for common issues
- [ ] Document backup and restore procedures

---

## ⚠️ CRITICAL ACTIONS BEFORE FIRST DEPLOYMENT

1. **Remove sensitive files from git history:**

   ```bash
   # If serviceAccountKey.json was committed
   git filter-branch --force --index-filter \
   "git rm --cached --ignore-unmatch */serviceAccountKey.json" \
   --prune-empty --tag-name-filter cat -- --all

   git push origin --force --all
   ```

2. **Delete test and development files:**

   ```bash
   rm test-connection.js
   rm server/test-*.js
   rm server/scripts/remove-duplicates.js
   rm server/scripts/upload-*.js
   rm server/scripts/test-create-user.js
   rm Client/Postman*.exe
   ```

3. **Secure sensitive files:**

   ```bash
   # Add to .gitignore if not already
   echo "serviceAccountKey.json" >> .gitignore
   echo "**/*.exe" >> .gitignore

   # Remove from git cache
   git rm --cached Client/serviceAccountKey.json
   git rm --cached server/serviceAccountKey.json
   git rm --cached "Client/Postman (x64).exe"
   git commit -m "Remove sensitive files"
   ```

---

## 🎯 Post-Deployment Tasks

- [ ] Monitor server logs for errors
- [ ] Check database connections
- [ ] Test payment processing with real transactions
- [ ] Verify email notifications work
- [ ] Test all API endpoints in production
- [ ] Monitor server resource usage
- [ ] Set up automated backups
- [ ] Create incident response plan

---

**Last Updated:** January 5, 2026
**Status:** Pre-Production - Action Required
