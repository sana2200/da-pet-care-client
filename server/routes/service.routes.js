const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service.controller');
const { protect, adminOnly } = require('../middlewares/auth.middleware');
const { serviceValidation, validate, mongoIdValidation } = require('../middlewares/validation.middleware');

// Public routes
// @route   GET /api/services
// @desc    Get all services with filters
// @access  Public
router.get('/', serviceController.getServices);

// @route   GET /api/services/categories/all
// @desc    Get all service categories
// @access  Public
router.get('/categories/all', serviceController.getCategories);

// @route   GET /api/services/featured/all
// @desc    Get featured services
// @access  Public
router.get('/featured/all', serviceController.getFeaturedServices);

// @route   GET /api/services/:id
// @desc    Get single service by ID
// @access  Public
router.get('/:id', mongoIdValidation('id'), validate, serviceController.getServiceById);

// @route   GET /api/services/:id/availability
// @desc    Check service availability
// @access  Public
router.get('/:id/availability', mongoIdValidation('id'), validate, serviceController.checkAvailability);

// Protected routes
// @route   POST /api/services/:id/reviews
// @desc    Add service review
// @access  Private
router.post('/:id/reviews', protect, mongoIdValidation('id'), validate, serviceController.addServiceReview);

// Admin routes
// @route   POST /api/services
// @desc    Create a new service
// @access  Private/Admin
router.post('/', protect, adminOnly, serviceValidation, validate, serviceController.createService);

// @route   PUT /api/services/:id
// @desc    Update a service
// @access  Private/Admin
router.put('/:id', protect, adminOnly, mongoIdValidation('id'), validate, serviceController.updateService);

// @route   DELETE /api/services/:id
// @desc    Delete a service
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, mongoIdValidation('id'), validate, serviceController.deleteService);

module.exports = router;
