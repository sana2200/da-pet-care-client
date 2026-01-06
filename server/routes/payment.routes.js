const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

// @route   POST /api/payment/init
// @desc    Initialize payment with SSLCommerz
// @access  Public
router.post('/init', paymentController.initPayment);

// @route   POST /api/payment/success
// @desc    Payment success callback from SSLCommerz
// @access  Public
router.post('/success', paymentController.paymentSuccess);

// @route   POST /api/payment/fail
// @desc    Payment fail callback from SSLCommerz
// @access  Public
router.post('/fail', paymentController.paymentFail);

// @route   POST /api/payment/cancel
// @desc    Payment cancel callback from SSLCommerz
// @access  Public
router.post('/cancel', paymentController.paymentCancel);

// @route   POST /api/payment/ipn
// @desc    IPN (Instant Payment Notification) listener
// @access  Public
router.post('/ipn', paymentController.paymentIPN);

// @route   GET /api/payment/status/:transactionId
// @desc    Get payment status by transaction ID
// @access  Public
router.get('/status/:transactionId', paymentController.getPaymentStatus);

// @route   GET /api/payment/user/:userId
// @desc    Get all payments for a user
// @access  Private
router.get('/user/:userId', paymentController.getUserPayments);

module.exports = router;
