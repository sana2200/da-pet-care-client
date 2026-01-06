# 🏗️ System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Frontend)                        │
│                    React + Vite + Tailwind                       │
│                    Port: 5173                                    │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Pages      │  │  Components  │  │   Context    │         │
│  │              │  │              │  │              │         │
│  │ • Home       │  │ • Navbar     │  │ • CartCtx    │         │
│  │ • Shop       │  │ • Footer     │  │ • NotifyCtx  │         │
│  │ • Services   │  │ • Protected  │  │              │         │
│  │ • Cart       │  │   Route      │  └──────────────┘         │
│  │ • Checkout   │  └──────────────┘                            │
│  │ • Dashboard  │                                               │
│  └──────────────┘                                               │
│         │                                                        │
│         │  ┌─────────────────────────────────────┐             │
│         └─►│        API Services                 │             │
│            │                                     │             │
│            │  • api.js (User API)               │             │
│            │  • admin.js (Admin API)            │             │
│            │  • Firebase Auth Helper            │             │
│            └─────────────────────────────────────┘             │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         │ HTTP REST API
                         │ Authorization: Bearer <JWT>
                         │
┌────────────────────────▼─────────────────────────────────────────┐
│                        SERVER (Backend)                           │
│                    Node.js + Express.js                          │
│                         Port: 5000                               │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │                    Routes                             │      │
│  │                                                       │      │
│  │  /api/auth      /api/products    /api/services       │      │
│  │  /api/cart      /api/orders      /api/bookings       │      │
│  │  /api/payment   /api/admin                           │      │
│  └──────────────────────┬────────────────────────────────┘      │
│                         │                                        │
│  ┌──────────────────────▼────────────────────────────────┐      │
│  │                 Controllers                            │      │
│  │                                                        │      │
│  │  • Auth         • Product      • Service              │      │
│  │  • Cart         • Order        • Booking              │      │
│  │  • Payment      • Admin                               │      │
│  └──────────────────────┬────────────────────────────────┘      │
│                         │                                        │
│  ┌──────────────────────▼────────────────────────────────┐      │
│  │                 Middlewares                            │      │
│  │                                                        │      │
│  │  • protect (JWT Auth)                                 │      │
│  │  • adminOnly (Role Check)                            │      │
│  │  • validate (Input Validation)                        │      │
│  └──────────────────────┬────────────────────────────────┘      │
│                         │                                        │
│  ┌──────────────────────▼────────────────────────────────┐      │
│  │                   Models                               │      │
│  │                                                        │      │
│  │  • User         • Product      • Service              │      │
│  │  • Cart         • Order        • Booking              │      │
│  │  • Payment                                            │      │
│  └────────────────────────────────────────────────────────┘      │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         │ MongoDB Driver
                         │
┌────────────────────────▼─────────────────────────────────────────┐
│                      MongoDB Database                             │
│                                                                   │
│  ┌───────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │   Users   │  │ Products │  │ Services │  │ Bookings │      │
│  └───────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                                                                   │
│  ┌───────────┐  ┌──────────┐  ┌──────────┐                     │
│  │   Carts   │  │  Orders  │  │ Payments │                     │
│  └───────────┘  └──────────┘  └──────────┘                     │
└───────────────────────────────────────────────────────────────────┘
```

---

## Authentication Flow

```
┌─────────────┐                                    ┌─────────────┐
│   Browser   │                                    │   Firebase  │
│             │                                    │    Auth     │
└──────┬──────┘                                    └──────┬──────┘
       │                                                  │
       │ 1. User signs up/logs in                       │
       ├────────────────────────────────────────────────►│
       │                                                  │
       │ 2. Firebase ID Token                            │
       │◄────────────────────────────────────────────────┤
       │                                                  │
       │                                                  │
┌──────▼──────┐                                    ┌─────▼───────┐
│   Client    │                                    │   Server    │
│  React App  │                                    │  Express    │
└──────┬──────┘                                    └──────┬──────┘
       │                                                  │
       │ 3. POST /api/auth/firebase                      │
       │     { firebaseToken }                           │
       ├────────────────────────────────────────────────►│
       │                                                  │
       │                          4. Verify Firebase token│
       │                             with Firebase Admin │
       │                                                  │
       │                          5. Create/find user in │
       │                             MongoDB              │
       │                                                  │
       │ 6. JWT Token                                    │
       │◄────────────────────────────────────────────────┤
       │                                                  │
       │ 7. Store JWT in memory/localStorage             │
       │                                                  │
       │ 8. Include JWT in all API requests              │
       │    Authorization: Bearer <JWT>                  │
       ├────────────────────────────────────────────────►│
       │                                                  │
       │ 9. Verify JWT + Check permissions               │
       │                                                  │
       │ 10. Protected data                              │
       │◄────────────────────────────────────────────────┤
       │                                                  │
```

---

## Data Flow Examples

### 1. Viewing Products (Public)

```
User → Browse Shop Page
  ↓
Client calls api.products.getAll()
  ↓
GET /api/products
  ↓
Server → Product Controller
  ↓
Query MongoDB Products Collection
  ↓
Return products array
  ↓
Client renders product grid
  ↓
User sees products
```

### 2. Adding to Cart (Protected)

```
User → Click "Add to Cart"
  ↓
Client gets JWT token from Firebase
  ↓
POST /api/cart/items { productId, quantity }
Authorization: Bearer <JWT>
  ↓
Server → Auth Middleware (verify JWT)
  ↓
Cart Controller → Find/Create user cart
  ↓
Update cart in MongoDB
  ↓
Return updated cart
  ↓
Client updates CartContext
  ↓
UI shows updated cart count
```

### 3. Admin: Managing Products

```
Admin logs in → Gets JWT with admin role
  ↓
Client calls getAllProducts() from admin.js
  ↓
GET /api/admin/products
Authorization: Bearer <JWT>
  ↓
Server → Auth Middleware (verify JWT)
  ↓
Server → Admin Middleware (check admin role)
  ↓
Admin Controller → Get all products with extra details
  ↓
Return products with stock, sales data, etc.
  ↓
Admin dashboard displays products
  ↓
Admin edits product
  ↓
PUT /api/admin/products/:id { updated data }
  ↓
Server validates and updates MongoDB
  ↓
Return success
  ↓
Admin UI updates
```

### 4. Booking a Service

```
User → Select service + date/time
  ↓
Client calls api.bookings.create(data)
  ↓
POST /api/bookings
Authorization: Bearer <JWT>
{ serviceId, date, time, petInfo }
  ↓
Server → Auth Middleware
  ↓
Booking Controller → Validate availability
  ↓
Create booking in MongoDB
  ↓
Send confirmation (optional)
  ↓
Return booking details
  ↓
Client shows confirmation
  ↓
User receives booking info
```

### 5. Payment Flow

```
User → Complete checkout
  ↓
POST /api/payment/initiate
{ orderData, amount }
  ↓
Server → Payment Controller
  ↓
Create payment record in MongoDB
  ↓
Call SSLCommerz API
  ↓
Return payment gateway URL
  ↓
Redirect user to SSLCommerz
  ↓
User completes payment
  ↓
SSLCommerz redirects back
  ↓
POST /api/payment/success
  ↓
Server verifies with SSLCommerz
  ↓
Update payment status
  ↓
Update order status
  ↓
Redirect to success page
  ↓
User sees confirmation
```

---

## Technology Stack

### Frontend Stack

```
┌──────────────────────────────────────┐
│        React 18                      │
│  • Component-based UI                │
│  • Hooks (useState, useEffect, etc.) │
│  • Context API for state             │
└──────────────────┬───────────────────┘
                   │
┌──────────────────▼───────────────────┐
│        Vite                          │
│  • Fast development server           │
│  • Hot Module Replacement (HMR)      │
│  • Optimized production builds       │
└──────────────────┬───────────────────┘
                   │
┌──────────────────▼───────────────────┐
│     Tailwind CSS                     │
│  • Utility-first styling             │
│  • Responsive design                 │
│  • Custom components                 │
└──────────────────┬───────────────────┘
                   │
┌──────────────────▼───────────────────┐
│  React Router v6                     │
│  • Client-side routing               │
│  • Protected routes                  │
│  • Dynamic routes                    │
└──────────────────┬───────────────────┘
                   │
┌──────────────────▼───────────────────┐
│  Firebase Auth                       │
│  • Email/password auth               │
│  • Google sign-in                    │
│  • Token management                  │
└──────────────────────────────────────┘
```

### Backend Stack

```
┌──────────────────────────────────────┐
│      Express.js                      │
│  • REST API framework                │
│  • Middleware support                │
│  • Route handling                    │
└──────────────────┬───────────────────┘
                   │
┌──────────────────▼───────────────────┐
│      Mongoose                        │
│  • MongoDB ODM                       │
│  • Schema validation                 │
│  • Query building                    │
└──────────────────┬───────────────────┘
                   │
┌──────────────────▼───────────────────┐
│   Firebase Admin SDK                 │
│  • Token verification                │
│  • User management                   │
│  • Custom claims                     │
└──────────────────┬───────────────────┘
                   │
┌──────────────────▼───────────────────┐
│   JWT (jsonwebtoken)                 │
│  • Token generation                  │
│  • Token verification                │
│  • Stateless auth                    │
└──────────────────┬───────────────────┘
                   │
┌──────────────────▼───────────────────┐
│   SSLCommerz                         │
│  • Payment gateway                   │
│  • Transaction handling              │
│  • Payment verification              │
└──────────────────────────────────────┘
```

---

## API Request Flow

```
┌────────────┐
│   Client   │
└─────┬──────┘
      │
      │ 1. HTTP Request
      │    Method: GET/POST/PUT/DELETE
      │    Headers: Authorization, Content-Type
      │    Body: JSON data (if POST/PUT)
      ▼
┌─────────────┐
│  Express    │
│  Middleware │
│  Pipeline   │
└─────┬───────┘
      │
      │ 2. CORS Middleware
      │    Check origin allowed
      ▼
      │ 3. Body Parser
      │    Parse JSON body
      ▼
      │ 4. Route Matching
      │    Find matching route
      ▼
      │ 5. Auth Middleware (if protected)
      │    • Extract JWT from header
      │    • Verify token
      │    • Attach user to request
      ▼
      │ 6. Admin Middleware (if admin route)
      │    • Check user role
      │    • Verify admin permissions
      ▼
      │ 7. Validation Middleware
      │    • Validate request data
      │    • Check required fields
      ▼
┌─────▼───────┐
│ Controller  │
│  Function   │
└─────┬───────┘
      │
      │ 8. Business Logic
      │    • Process request
      │    • Query database
      │    • Transform data
      ▼
┌─────────────┐
│  MongoDB    │
└─────┬───────┘
      │
      │ 9. Database Response
      ▼
┌─────────────┐
│ Controller  │
│  Response   │
└─────┬───────┘
      │
      │ 10. Format Response
      │     { success, data, message }
      ▼
┌─────────────┐
│   Client    │
│  Receives   │
│  Response   │
└─────────────┘
```

---

## File Structure Map

```
da-pet-care/
│
├── Client/                         Frontend Application
│   ├── src/
│   │   ├── App.jsx                Main App Component
│   │   ├── main.jsx               Entry Point
│   │   │
│   │   ├── api/
│   │   │   └── admin.js           Admin API Service (Axios)
│   │   │
│   │   ├── services/
│   │   │   └── api.js             User API Service (Fetch)
│   │   │
│   │   ├── components/
│   │   │   ├── firebase.js        Firebase Config
│   │   │   ├── Navbar.jsx         Navigation
│   │   │   ├── Footer.jsx         Footer
│   │   │   ├── Layout.jsx         Page Layout
│   │   │   ├── ProtectedRoute.jsx Auth Guard
│   │   │   └── ProtectedAdminRoute.jsx Admin Guard
│   │   │
│   │   ├── context/
│   │   │   ├── CartContext.jsx    Cart State Management
│   │   │   └── NotificationContext.jsx Notifications
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx           Home Page
│   │   │   ├── Shop.jsx           Products Page
│   │   │   ├── Services.jsx       Services Page
│   │   │   ├── Cart.jsx           Cart Page
│   │   │   ├── Checkout.jsx       Checkout Page
│   │   │   ├── Book.jsx           Booking Page
│   │   │   ├── Dashboard.jsx      User Dashboard
│   │   │   ├── AdminDashboard.jsx Admin Dashboard
│   │   │   └── ... more pages
│   │   │
│   │   └── data/
│   │       └── products.js        Sample Product Data
│   │
│   └── .env                       Frontend Config
│
├── server/                        Backend Application
│   ├── server.js                  Entry Point
│   ├── app.js                     Express App Setup
│   │
│   ├── config/
│   │   ├── db.js                  MongoDB Connection
│   │   └── sslcommerz.config.js   Payment Config
│   │
│   ├── routes/
│   │   ├── auth.routes.js         Auth Endpoints
│   │   ├── product.routes.js      Product Endpoints
│   │   ├── service.routes.js      Service Endpoints
│   │   ├── booking.routes.js      Booking Endpoints
│   │   ├── cart.routes.js         Cart Endpoints
│   │   ├── order.routes.js        Order Endpoints
│   │   ├── payment.routes.js      Payment Endpoints
│   │   └── admin.routes.js        Admin Endpoints
│   │
│   ├── controllers/
│   │   ├── auth.controller.js     Auth Logic
│   │   ├── product.controller.js  Product Logic
│   │   └── ... more controllers
│   │
│   ├── models/
│   │   ├── User.model.js          User Schema
│   │   ├── Product.model.js       Product Schema
│   │   ├── Service.model.js       Service Schema
│   │   ├── Booking.model.js       Booking Schema
│   │   ├── Cart.model.js          Cart Schema
│   │   ├── Order.model.js         Order Schema
│   │   └── Payment.model.js       Payment Schema
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js     JWT Auth & Admin Check
│   │   └── validation.middleware.js Input Validation
│   │
│   ├── scripts/
│   │   └── seed.js                Database Seeding
│   │
│   └── .env                       Backend Config
│
└── Documentation Files
    ├── README.md
    ├── FULL_STACK_CONNECTION_GUIDE.md
    ├── API_QUICK_REFERENCE.md
    ├── TROUBLESHOOTING.md
    └── ARCHITECTURE.md (this file)
```

---

## Security Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Security Layers                        │
└──────────────────────────────────────────────────────────┘

Layer 1: CORS Protection
  ├─ Origin validation
  ├─ Allowed methods control
  └─ Credentials handling

Layer 2: Authentication
  ├─ Firebase Authentication (Frontend)
  ├─ JWT Token Generation (Backend)
  ├─ Token Verification Middleware
  └─ Token Expiration Handling

Layer 3: Authorization
  ├─ User role checking
  ├─ Admin role verification
  ├─ Resource ownership validation
  └─ Route-level protection

Layer 4: Input Validation
  ├─ Express Validator middleware
  ├─ Schema validation (Mongoose)
  ├─ Sanitization
  └─ Type checking

Layer 5: Database Security
  ├─ MongoDB connection encryption
  ├─ Credential management (.env)
  ├─ Query injection prevention (Mongoose)
  └─ Data encryption (sensitive fields)

Layer 6: Payment Security
  ├─ SSLCommerz secure gateway
  ├─ Transaction verification
  ├─ Callback validation
  └─ Amount tampering prevention
```

---

## Deployment Architecture

### Development

```
Localhost:5173 (Frontend) ←→ Localhost:5000 (Backend) ←→ MongoDB Atlas/Local
```

### Production

```
┌─────────────────┐
│   Vercel/       │
│   Netlify       │  Frontend (Static)
│   (Frontend)    │
└────────┬────────┘
         │ HTTPS
         │
    ┌────▼────────────────┐
    │   CDN (Optional)    │
    └────┬────────────────┘
         │
         │ API Calls
         │
┌────────▼────────┐
│   Heroku/       │
│   Railway/      │  Backend (Node.js)
│   DigitalOcean  │
└────────┬────────┘
         │
         │ MongoDB Connection
         │
┌────────▼────────┐
│   MongoDB       │
│   Atlas         │  Database (Cloud)
└─────────────────┘
```

---

This architecture provides a scalable, secure, and maintainable full-stack application structure.
