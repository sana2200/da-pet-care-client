# 🔧 Troubleshooting Guide

Common issues and solutions when connecting frontend and backend.

---

## 🚫 Connection Issues

### ❌ Error: "Network Error" or "Failed to fetch"

**Symptoms:**

- API calls fail immediately
- Browser console shows network errors
- No response from server

**Solutions:**

1. **Check if backend is running**

   ```bash
   # Should show server running message
   cd server
   npm run dev
   ```

2. **Verify backend port**

   - Backend should be on port 5000
   - Check `server/.env` → `PORT=5000`
   - Try accessing: http://localhost:5000/api/products

3. **Check API URL in frontend**

   ```bash
   # Client/.env should have:
   VITE_API_URL=http://localhost:5000
   ```

4. **Restart both servers**

   ```bash
   # Terminal 1
   cd server
   npm run dev

   # Terminal 2
   cd Client
   npm run dev
   ```

---

## 🔒 Authentication Issues

### ❌ Error: "401 Unauthorized"

**Symptoms:**

- Protected routes return 401
- User is logged in but API calls fail
- Token issues

**Solutions:**

1. **Check if user is logged in**

   ```javascript
   // In browser console
   localStorage.getItem("token"); // Should return a token
   ```

2. **Verify Firebase authentication**

   - Check Firebase console
   - Ensure authentication methods are enabled
   - Verify Firebase config in `Client/.env`

3. **Check token in request headers**

   - Open DevTools → Network tab
   - Click on failed request
   - Check Headers → Should see `Authorization: Bearer <token>`

4. **Re-login**

   - Logout and login again
   - This refreshes the token

5. **Check API service token handling**
   ```javascript
   // Client/src/services/api.js should have:
   const token = await this.getAuthToken();
   headers: {
     Authorization: `Bearer ${token}`;
   }
   ```

### ❌ Error: "403 Forbidden" for Admin Routes

**Symptoms:**

- Admin routes return 403
- User is authenticated but can't access admin features

**Solutions:**

1. **Set admin role**

   ```bash
   cd Client/scripts
   node setAdminClaim.js your-email@example.com
   ```

2. **Verify admin claim**

   - Check Firebase console → Authentication → Users
   - Look for custom claims

3. **Re-login after setting admin claim**
   - Logout completely
   - Login again to get new token with admin claim

---

## 🗄️ Database Issues

### ❌ Error: "MongooseError: Connection failed"

**Symptoms:**

- Backend fails to start
- Database connection errors in console
- Cannot read/write data

**Solutions:**

1. **Using MongoDB Atlas (Cloud)**

   ```bash
   # Check server/.env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   ```

   - Verify username and password are correct
   - Check MongoDB Atlas → Network Access
   - Add your IP address (or allow all: 0.0.0.0/0)

2. **Using Local MongoDB**

   - Install MongoDB Community Edition
   - Start MongoDB service:

     ```bash
     # Windows
     net start MongoDB

     # Mac
     brew services start mongodb-community

     # Linux
     sudo systemctl start mongod
     ```

   - Update `server/.env`:
     ```
     MONGODB_URI=mongodb://localhost:27017/pet-care
     ```

3. **Test database connection**
   ```bash
   cd server
   node -e "require('./config/db')().then(() => console.log('✅ Connected')).catch(e => console.log('❌', e))"
   ```

### ❌ Error: "No data found" / Empty responses

**Symptoms:**

- API works but returns empty arrays
- Products/services not showing
- Database is empty

**Solutions:**

1. **Seed the database**

   ```bash
   cd server
   npm run seed
   ```

2. **Verify seeding worked**
   ```bash
   # Check MongoDB
   # Or test API endpoint
   curl http://localhost:5000/api/products
   ```

---

## 🌐 CORS Issues

### ❌ Error: "CORS policy blocked"

**Symptoms:**

- Browser console shows CORS error
- Requests blocked by browser
- Status shows "CORS error"

**Solutions:**

1. **Check CORS configuration in backend**

   ```javascript
   // server/app.js should have:
   const corsOptions = {
     origin: process.env.FRONTEND_URL || "http://localhost:5173",
     credentials: true,
   };
   app.use(cors(corsOptions));
   ```

2. **Verify FRONTEND_URL**

   ```bash
   # server/.env
   FRONTEND_URL=http://localhost:5173
   ```

3. **Clear browser cache**

   - Hard refresh: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
   - Or clear cache in browser settings

4. **Restart backend server**
   ```bash
   cd server
   # Ctrl+C to stop
   npm run dev
   ```

---

## 🔑 Environment Variable Issues

### ❌ Error: "undefined" for env variables

**Symptoms:**

- Firebase config shows undefined
- API_URL is undefined
- Features not working

**Solutions:**

1. **Check .env file exists**

   ```bash
   # Should exist:
   Client/.env
   server/.env
   ```

2. **Frontend env variables MUST start with VITE\_**

   ```env
   # ✅ Correct
   VITE_API_URL=http://localhost:5000

   # ❌ Wrong
   API_URL=http://localhost:5000
   ```

3. **Restart dev server after .env changes**

   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

4. **Check .env file is not ignored**
   - `.env` should NOT be in `.gitignore` for development
   - `.env.local` is typically ignored

---

## 📦 Dependency Issues

### ❌ Error: "Cannot find module"

**Symptoms:**

- Import errors
- Module not found
- Package errors

**Solutions:**

1. **Install dependencies**

   ```bash
   # Backend
   cd server
   npm install

   # Frontend
   cd Client
   npm install
   ```

2. **Clear node_modules and reinstall**

   ```bash
   # Backend
   cd server
   rm -rf node_modules package-lock.json
   npm install

   # Frontend
   cd Client
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Check Node.js version**
   ```bash
   node --version  # Should be v16 or higher
   ```

---

## 💳 Payment Issues

### ❌ Payment not working

**Symptoms:**

- Payment initiation fails
- SSLCommerz errors
- Payment gateway not loading

**Solutions:**

1. **Check SSLCommerz credentials**

   ```bash
   # server/.env
   SSLCOMMERZ_STORE_ID=your_store_id
   SSLCOMMERZ_STORE_PASSWORD=your_password
   ```

2. **Using sandbox mode**

   ```env
   SSLC_PAYMENT_URL=https://sandbox.sslcommerz.com/gwprocess/v4/api.php
   ```

3. **Test credentials**
   - Get test credentials from SSLCommerz developer portal
   - Use sandbox URL for testing

---

## 🖼️ Frontend Build Issues

### ❌ Error during build

**Symptoms:**

- `npm run build` fails
- Vite build errors
- Cannot create production build

**Solutions:**

1. **Check for TypeScript errors**

   ```bash
   cd Client
   npm run dev  # Check console for errors
   ```

2. **Fix import errors**

   - Ensure all imports are correct
   - Check file paths are correct
   - Case-sensitive on Linux

3. **Clear Vite cache**
   ```bash
   cd Client
   rm -rf node_modules/.vite
   npm run dev
   ```

---

## 🐛 Debugging Tips

### Enable Verbose Logging

**Backend:**

```javascript
// server/app.js - Add before routes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
```

**Frontend:**

```javascript
// Check API calls in browser DevTools
// Network tab → Filter: XHR
// Console tab → Check for errors
```

### Test API with curl

```bash
# Test public endpoint
curl http://localhost:5000/api/products

# Test protected endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:5000/api/cart

# Test with POST data
curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
```

### Check Browser Console

Press F12 in browser:

- **Console tab**: JavaScript errors, API responses
- **Network tab**: API calls, status codes, response data
- **Application tab**: localStorage, session storage, cookies

---

## 📞 Still Having Issues?

### Verification Checklist

- [ ] Backend server is running on port 5000
- [ ] Frontend server is running on port 5173
- [ ] MongoDB is connected and seeded
- [ ] `.env` files exist with correct values
- [ ] Firebase is configured correctly
- [ ] No errors in browser console
- [ ] No errors in backend terminal

### Test Connection

```bash
# From root directory
npm install
npm run test-connection
```

This will test if backend is accessible.

### Check Ports

```bash
# Windows
netstat -ano | findstr :5000
netstat -ano | findstr :5173

# Mac/Linux
lsof -i :5000
lsof -i :5173
```

### Get Help

1. Check error messages carefully
2. Search error in documentation
3. Check browser DevTools console
4. Check backend terminal logs
5. Review [FULL_STACK_CONNECTION_GUIDE.md](FULL_STACK_CONNECTION_GUIDE.md)

---

## 🎯 Quick Fixes Summary

| Issue            | Quick Fix                                |
| ---------------- | ---------------------------------------- |
| Network Error    | Check both servers are running           |
| 401 Unauthorized | Re-login / Check token                   |
| 403 Forbidden    | Set admin role / Re-login                |
| CORS Error       | Check FRONTEND_URL in server/.env        |
| Database Error   | Check MongoDB connection / Seed data     |
| Empty Data       | Run `npm run seed`                       |
| Module Error     | Run `npm install`                        |
| Env Undefined    | Restart dev server / Check VITE\_ prefix |

---

**Remember**: Most issues are solved by:

1. Restarting both servers
2. Checking .env files
3. Re-logging in
4. Clearing cache
