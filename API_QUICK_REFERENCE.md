# API Quick Reference

Base URL: `http://localhost:5000/api`

## 🔓 Public Endpoints (No Authentication Required)

### Products

```
GET    /products                    - Get all products (with filters)
GET    /products/categories/all     - Get categories
GET    /products/featured/all       - Get featured products
GET    /products/:id                - Get product by ID
```

### Services

```
GET    /services                    - Get all services (with filters)
GET    /services/categories/all     - Get categories
GET    /services/featured/all       - Get featured services
GET    /services/:id                - Get service by ID
GET    /services/:id/availability   - Check availability
```

### Authentication

```
POST   /auth/register               - Register new user
POST   /auth/login                  - Login with email/password
POST   /auth/firebase               - Authenticate with Firebase token
```

---

## 🔐 Protected Endpoints (Authentication Required)

**Requires**: `Authorization: Bearer <JWT_TOKEN>`

### User Profile

```
GET    /auth/me                     - Get current user profile
GET    /auth/verify                 - Verify JWT token
PUT    /auth/profile                - Update user profile
PUT    /auth/change-password        - Change password
```

### Bookings

```
POST   /bookings                    - Create new booking
GET    /bookings/my-bookings        - Get user's bookings
GET    /bookings/:id                - Get booking by ID
PUT    /bookings/:id/cancel         - Cancel booking
```

### Cart

```
GET    /cart                        - Get user's cart
POST   /cart/items                  - Add item to cart
PUT    /cart/items/:productId       - Update cart item quantity
DELETE /cart/items/:productId       - Remove item from cart
DELETE /cart                        - Clear entire cart
```

### Orders

```
POST   /orders                      - Create new order
GET    /orders/my-orders            - Get user's orders
GET    /orders/:id                  - Get order by ID
PUT    /orders/:id/cancel           - Cancel order
```

### Payment

```
POST   /payment/initiate            - Initiate payment
GET    /payment/verify/:txnId       - Verify payment
POST   /payment/success             - Payment success callback
POST   /payment/fail                - Payment fail callback
POST   /payment/cancel              - Payment cancel callback
```

### Reviews

```
POST   /products/:id/reviews        - Add product review
POST   /services/:id/reviews        - Add service review
```

---

## 👑 Admin Endpoints (Admin Role Required)

**Requires**: `Authorization: Bearer <JWT_TOKEN>` + Admin role

### Dashboard

```
GET    /admin/dashboard             - Get dashboard statistics
```

### Products (Admin)

```
GET    /admin/products              - Get all products (admin view)
GET    /admin/products/:id          - Get product details
POST   /admin/products              - Create new product
PUT    /admin/products/:id          - Update product
PATCH  /admin/products/:id/stock    - Update product stock
DELETE /admin/products/:id          - Delete product
```

### Services (Admin)

```
GET    /admin/services              - Get all services (admin view)
GET    /admin/services/:id          - Get service details
POST   /admin/services              - Create new service
PUT    /admin/services/:id          - Update service
DELETE /admin/services/:id          - Delete service
```

### Bookings (Admin)

```
GET    /admin/appointments          - Get all appointments
GET    /admin/appointments/:id      - Get appointment details
PATCH  /admin/appointments/:id/status - Update appointment status
POST   /admin/appointments/:id/send-confirmation - Send confirmation email
```

### Orders (Admin)

```
GET    /admin/orders                - Get all orders
PUT    /admin/orders/:id            - Update order status
```

### Users (Admin)

```
GET    /admin/users                 - Get all users
GET    /admin/users/:id             - Get user details
PATCH  /admin/users/:id/role        - Update user role
```

---

## 📋 Common Request/Response Patterns

### Success Response Format

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response Format

```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Validation error 1", "Validation error 2"]
}
```

### Authentication Header

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🔑 Query Parameters

### Products & Services

```
?category=food                 - Filter by category
?search=dog                    - Search by keyword
?minPrice=10&maxPrice=100      - Price range
?sort=price_asc                - Sort (price_asc, price_desc, name, rating)
?page=1&limit=10               - Pagination
?featured=true                 - Only featured items
```

### Bookings & Orders

```
?status=pending                - Filter by status
?startDate=2026-01-01          - Start date
?endDate=2026-12-31            - End date
?page=1&limit=10               - Pagination
```

---

## 📝 Request Body Examples

### Register User

```json
POST /auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "01712345678"
}
```

### Create Booking

```json
POST /bookings
{
  "serviceId": "507f1f77bcf86cd799439011",
  "date": "2026-01-15",
  "time": "10:00",
  "petName": "Buddy",
  "petType": "Dog",
  "petAge": "3 years",
  "specialNotes": "First time visitor"
}
```

### Add to Cart

```json
POST /cart/items
{
  "productId": "507f1f77bcf86cd799439011",
  "quantity": 2
}
```

### Create Order

```json
POST /orders
{
  "items": [
    {
      "product": "507f1f77bcf86cd799439011",
      "quantity": 2,
      "price": 29.99
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Dhaka",
    "postalCode": "1200",
    "country": "Bangladesh"
  },
  "paymentMethod": "sslcommerz"
}
```

### Create Product (Admin)

```json
POST /admin/products
{
  "name": "Premium Dog Food",
  "description": "High quality nutrition for dogs",
  "price": 49.99,
  "category": "Food",
  "stock": 100,
  "images": ["url1", "url2"],
  "featured": true,
  "specifications": {
    "weight": "5kg",
    "brand": "PetCare Pro"
  }
}
```

---

## 🚨 Common Status Codes

- `200` - Success
- `201` - Created successfully
- `400` - Bad request / Validation error
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not found
- `500` - Server error

---

## 💡 Tips

1. **Authentication Flow**:

   - Login/Register → Get JWT token → Store in localStorage/memory
   - Include token in Authorization header for all protected routes

2. **Firebase Integration**:

   - Frontend uses Firebase for user auth
   - Send Firebase token to `/auth/firebase`
   - Backend verifies and returns JWT

3. **Admin Access**:

   - Set admin claim using: `node Client/scripts/setAdminClaim.js user@email.com`
   - Admin token required for all `/admin/*` endpoints

4. **Error Handling**:

   - Always check `response.success` field
   - Display `response.message` to user
   - Handle `401` by redirecting to login

5. **Pagination**:
   - Default: `page=1, limit=10`
   - Response includes: `{ data: [...], pagination: { page, limit, total } }`

---

## 🔗 Frontend Integration Examples

### Using api.js

```javascript
import { api } from "./services/api";

// Get products
const products = await api.products.getAll({ category: "food" });

// Create booking
const booking = await api.bookings.create({
  serviceId: "123",
  date: "2026-01-15",
  time: "10:00",
});
```

### Using admin.js

```javascript
import { getAllProducts, addProduct } from "./api/admin";

// Get all products (admin)
const products = await getAllProducts({ page: 1 });

// Add product
await addProduct(productData);
```

---

**Need more details?** See [FULL_STACK_CONNECTION_GUIDE.md](FULL_STACK_CONNECTION_GUIDE.md)
