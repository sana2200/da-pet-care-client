const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const { protect, adminOnly } = require('../middlewares/auth.middleware');
const { bookingValidation, validate, mongoIdValidation } = require('../middlewares/validation.middleware');

// Guest booking route - NO authentication required
// @route   POST /api/bookings/guest
// @desc    Create booking as guest (without account)
// @access  Public
router.post('/guest', bookingValidation, validate, bookingController.createGuestBooking);

// Protected routes
// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', protect, bookingValidation, validate, bookingController.createBooking);

// @route   GET /api/bookings/my-bookings
// @desc    Get user's bookings
// @access  Private
router.get('/my-bookings', protect, bookingController.getMyBookings);

// Admin routes - MUST come before :id routes to avoid matching conflicts
// @route   GET /api/bookings
// @desc    Get all bookings (Admin)
// @access  Private/Admin
router.get('/', protect, adminOnly, bookingController.getAllBookings);

// @route   GET /api/bookings/:id
// @desc    Get single booking
// @access  Private
router.get('/:id', protect, mongoIdValidation('id'), validate, bookingController.getBookingById);

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel booking
// @access  Private
router.put('/:id/cancel', protect, mongoIdValidation('id'), validate, bookingController.cancelBooking);

// @route   PUT /api/bookings/:id
// @desc    Update booking status
// @access  Private/Admin
router.put('/:id', protect, adminOnly, mongoIdValidation('id'), validate, bookingController.updateBooking);

// @route   DELETE /api/bookings/:id
// @desc    Delete booking
// @access  Private
router.delete('/:id', protect, mongoIdValidation('id'), validate, bookingController.deleteBooking);

module.exports = router;
