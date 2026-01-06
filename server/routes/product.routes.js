const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { protect, adminOnly } = require('../middlewares/auth.middleware');
const { productValidation, validate, mongoIdValidation } = require('../middlewares/validation.middleware');

// Public routes
// @route   GET /api/products
// @desc    Get all products with filters
// @access  Public
router.get('/', productController.getProducts);

// @route   GET /api/products/categories/all
// @desc    Get all product categories
// @access  Public
router.get('/categories/all', productController.getCategories);

// @route   GET /api/products/featured/all
// @desc    Get featured products
// @access  Public
router.get('/featured/all', productController.getFeaturedProducts);

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', mongoIdValidation('id'), validate, productController.getProductById);

// Protected routes
// @route   POST /api/products/:id/reviews
// @desc    Add product review
// @access  Private
router.post('/:id/reviews', protect, mongoIdValidation('id'), validate, productController.addProductReview);

// Admin routes
// @route   POST /api/products
// @desc    Create a new product
// @access  Private/Admin
router.post('/', protect, adminOnly, productValidation, validate, productController.createProduct);

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private/Admin
router.put('/:id', protect, adminOnly, mongoIdValidation('id'), validate, productController.updateProduct);

// @route   PATCH /api/products/:id/stock
// @desc    Update product stock
// @access  Private/Admin
router.patch('/:id/stock', protect, adminOnly, mongoIdValidation('id'), validate, productController.updateProductStock);

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, mongoIdValidation('id'), validate, productController.deleteProduct);

module.exports = router;
