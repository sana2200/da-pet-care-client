# 🐕 Pet Care Client Application

A comprehensive pet care management application built with React, Vite, and Firebase. This client-side application provides a modern, responsive interface for pet owners to manage appointments, shop for products, and access veterinary services.

## 🚀 Features

### 🏠 **User Dashboard**

- **Statistics Overview**: Track total bookings, upcoming appointments, orders, and spending
- **Quick Actions**: Fast navigation to key features (booking, shopping, profile management)
- **Recent Activity**: View latest bookings and orders
- **Service Showcase**: Browse available veterinary services

### 📅 **Appointment Management**

- **Book Appointments**: Easy booking for vet consultancy, surgery, vaccination, grooming, and lab work
- **Appointment History**: View all past and upcoming appointments
- **Status Tracking**: Real-time appointment status updates (confirmed, pending, completed, cancelled)
- **Cancellation**: Cancel appointments with proper validation
- **Rebook Services**: Quick rebooking for repeat services

### 🛒 **E-commerce Features**

- **Product Catalog**: Browse pet care products with categories and filtering
- **Shopping Cart**: Add, remove, and update product quantities
- **Secure Checkout**: Complete order placement with address and payment management
- **Order Tracking**: View order history and track delivery status
- **Order Details**: Comprehensive order information with itemized receipts

### 👤 **User Profile Management**

- **Profile Information**: Manage personal details, contact information, and address
- **Firebase Authentication**: Secure login with Google Sign-In integration
- **Database Sync**: Profile synchronization between Firebase Auth and backend database

### 🔔 **Notification System**

- **Toast Notifications**: Real-time feedback for all user actions
- **Success/Error Alerts**: Clear communication of operation results
- **Auto-dismiss**: Configurable notification duration
- **Multiple Types**: Info, success, warning, and error notifications

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Authentication**: Firebase Auth
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Styling**: CSS-in-JS with modern design patterns

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd pet-care-client
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🌐 Routes

- `/` - Home page
- `/services` - Service catalog and booking
- `/shop` - Product catalog
- `/cart` - Shopping cart
- `/checkout` - Order checkout
- `/orders` - Order history
- `/orders/:id` - Order details
- `/bookings` - Appointment management
- `/book` - Appointment booking
- `/profile` - User profile
- `/dashboard` - User dashboard
- `/about` - About page
- `/faq` - FAQ page
- `/contact` - Contact page
- `/auth` - Authentication

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
├── context/             # React Context providers
├── data/                # Static data and mock data
├── pages/               # Route components
├── services/            # API integration
├── styles/              # CSS files
├── App.jsx             # Main application component
└── main.jsx            # Application entry point
```

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
```

## 🔄 State Management

- **Context API**: Global state management for cart and notifications
- **Local State**: Component-level state for forms and UI interactions
- **Persistent Storage**: LocalStorage integration for cart persistence

## 📱 Responsive Design

The application is fully responsive and optimized for:

- **Desktop**: Full-featured interface with multi-column layouts
- **Tablet**: Adaptive layouts with touch-friendly interactions
- **Mobile**: Single-column layouts with optimized navigation

---

**Made with ❤️ for pet lovers everywhere** 🐾
