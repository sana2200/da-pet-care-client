import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Services from './pages/Services'
import Shop from './pages/Shop'
import About from './pages/About'
import FAQ from './pages/FAQ'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import Auth from './pages/Auth'
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'
import Book from './pages/Book'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import OrderDetails from './pages/OrderDetails'
import Bookings from './pages/Bookings'
import { Navigate } from 'react-router-dom'
import AdminDashboard from './pages/AdminDashboard';
import AdminProfile from './pages/AdminProfile';
import AdminLogin from './pages/AdminLogin';

export default function App(){
  return (
    <Routes>
      <Route element={<Layout />}> 
        <Route index element={<Home />} />
    <Route path="/services" element={<Services />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
  <Route path="/book" element={<Book />} />
  <Route path="/cart" element={<Cart />} />
  <Route path="/checkout" element={<Checkout />} />
  <Route path="/orders" element={<Orders />} />
  <Route path="/orders/:id" element={<OrderDetails />} />
  <Route path="/bookings" element={<Bookings />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
          {/* Optional convenience paths */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/login" element={<Navigate to="/auth" replace />} />
        <Route path="/register" element={<Navigate to="/auth" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
