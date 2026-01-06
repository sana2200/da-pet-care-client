const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { protect } = require('../middlewares/auth.middleware');

// All cart routes require authentication
// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', protect, cartController.getCart);

// @route   POST /api/cart/items
// @desc    Add item to cart
// @access  Private
router.post('/items', protect, cartController.addToCart);

// @route   PUT /api/cart/items/:productId
// @desc    Update cart item quantity
// @access  Private
router.put('/items/:productId', protect, cartController.updateCartItem);

// @route   DELETE /api/cart/items/:productId
// @desc    Remove item from cart
// @access  Private
router.delete('/items/:productId', protect, cartController.removeFromCart);

// @route   DELETE /api/cart
// @desc    Clear cart
// @access  Private
router.delete('/', protect, cartController.clearCart);

module.exports = router;
