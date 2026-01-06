const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const bookingController = require('../controllers/booking.controller');
const { protect, adminOnly, superAdminOnly } = require('../middlewares/auth.middleware');
const { mongoIdValidation, validate } = require('../middlewares/validation.middleware');

// All admin routes require authentication and admin role
router.use(protect, adminOnly);

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard data
// @access  Private/Admin
router.get('/dashboard', adminController.getDashboard);

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', adminController.getUsers);

// @route   GET /api/admin/users/:id
// @desc    Get single user by ID
// @access  Private/Admin
router.get('/users/:id', mongoIdValidation('id'), validate, adminController.getUserById);

// @route   PUT /api/admin/users/:id
// @desc    Update user
// @access  Private/Admin
router.put('/users/:id', mongoIdValidation('id'), validate, adminController.updateUser);

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete('/users/:id', mongoIdValidation('id'), validate, adminController.deleteUser);

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role (Super Admin only)
// @access  Private/SuperAdmin
router.put('/users/:id/role', protect, superAdminOnly, mongoIdValidation('id'), validate, adminController.updateUserRole);

// @route   GET /api/admin/analytics/sales
// @desc    Get sales analytics
// @access  Private/Admin
router.get('/analytics/sales', adminController.getSalesAnalytics);

// @route   GET /api/admin/products
// @desc    Get all products (admin view)
// @access  Private/Admin
router.get('/products', adminController.getAllProducts);

// @route   GET /api/admin/products/:id
// @desc    Get single product (admin view)
// @access  Private/Admin
router.get('/products/:id', mongoIdValidation('id'), validate, adminController.getProductById);

// @route   POST /api/admin/products
// @desc    Create new product
// @access  Private/Admin
router.post('/products', adminController.createProduct);

// @route   PUT /api/admin/products/:id
// @desc    Update product
// @access  Private/Admin
router.put('/products/:id', mongoIdValidation('id'), validate, adminController.updateProduct);

// @route   PATCH /api/admin/products/:id/stock
// @desc    Update product stock
// @access  Private/Admin
router.patch('/products/:id/stock', mongoIdValidation('id'), validate, adminController.updateProductStock);

// @route   DELETE /api/admin/products/:id
// @desc    Delete product
// @access  Private/Admin
router.delete('/products/:id', mongoIdValidation('id'), validate, adminController.deleteProduct);

// @route   GET /api/admin/services
// @desc    Get all services (admin view)
// @access  Private/Admin
router.get('/services', adminController.getAllServices);

// @route   GET /api/admin/services/:id
// @desc    Get single service (admin view)
// @access  Private/Admin
router.get('/services/:id', mongoIdValidation('id'), validate, adminController.getServiceById);

// @route   POST /api/admin/services
// @desc    Create new service
// @access  Private/Admin
router.post('/services', adminController.createService);

// @route   PUT /api/admin/services/:id
// @desc    Update service
// @access  Private/Admin
router.put('/services/:id', mongoIdValidation('id'), validate, adminController.updateService);

// @route   DELETE /api/admin/services/:id
// @desc    Delete service
// @access  Private/Admin
router.delete('/services/:id', mongoIdValidation('id'), validate, adminController.deleteService);

// ================== APPOINTMENTS / BOOKINGS ==================

// @route   GET /api/admin/appointments
// @desc    Get all appointments (bookings) for admin
// @access  Private/Admin
router.get('/appointments', bookingController.getAllBookings);

// @route   GET /api/admin/appointments/:id
// @desc    Get single appointment details
// @access  Private/Admin
router.get('/appointments/:id', mongoIdValidation('id'), validate, bookingController.getBookingById);

// @route   PATCH /api/admin/appointments/:id/status
// @desc    Update appointment status
// @access  Private/Admin
router.patch('/appointments/:id/status', mongoIdValidation('id'), validate, bookingController.updateBooking);

// @route   PUT /api/admin/bookings/:id
// @desc    Update booking status and time, send email notification
// @access  Private/Admin
router.put('/bookings/:id', mongoIdValidation('id'), validate, bookingController.updateBookingAndNotify);

// @route   DELETE /api/admin/bookings/:id
// @desc    Delete booking
// @access  Private/Admin
router.delete('/bookings/:id', mongoIdValidation('id'), validate, bookingController.deleteBooking);

// @route   PUT /api/admin/settings/revenue
// @desc    Update total revenue
// @access  Private/Admin
router.put('/settings/revenue', adminController.updateRevenue);

// @route   POST /api/admin/appointments/:id/send-confirmation
// @desc    Send confirmation notification (stubbed)
// @access  Private/Admin
router.post('/appointments/:id/send-confirmation', mongoIdValidation('id'), validate, bookingController.sendConfirmationEmail);

module.exports = router;
