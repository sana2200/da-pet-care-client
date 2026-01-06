const express = require('express');  
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { protect, adminOnly, optionalAuth } = require('../middlewares/auth.middleware');
const { orderValidation, validate, mongoIdValidation } = require('../middlewares/validation.middleware');

// Unified order creation
router.post('/', optionalAuth, ...orderValidation, validate, orderController.createOrder);

// User routes - specific routes BEFORE parameterized routes
router.get('/my-orders', protect, orderController.getMyOrders);

// Admin routes - specific admin routes BEFORE parameterized
router.get('/', protect, adminOnly, orderController.getAllOrders);

// Admin parameterized routes
router.route('/:id')
  .get(protect, ...mongoIdValidation('id'), validate, orderController.getOrderById)
  .put(protect, adminOnly, ...mongoIdValidation('id'), validate, orderController.updateOrder)
  .delete(protect, adminOnly, ...mongoIdValidation('id'), validate, orderController.deleteOrder);

router.get('/:id/pdf', protect, adminOnly, ...mongoIdValidation('id'), validate, orderController.downloadOrderPDF);
router.put('/:id/cancel', protect, ...mongoIdValidation('id'), validate, orderController.cancelOrder);

module.exports = router;
