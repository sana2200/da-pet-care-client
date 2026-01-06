const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const authController = require('../controllers/auth.controller');
const bookingController = require('../controllers/booking.controller');
const orderController = require('../controllers/order.controller');

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, authController.getMe);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, authController.updateProfile);

// @route   GET /api/users/bookings
// @desc    Get user's bookings
// @access  Private
router.get('/bookings', protect, bookingController.getMyBookings);

// @route   GET /api/users/orders
// @desc    Get user's orders
// @access  Private
router.get('/orders', protect, orderController.getMyOrders);

module.exports = router;
