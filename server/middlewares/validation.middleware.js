const { body, param, validationResult } = require('express-validator');

// Validation handler
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  return next();
};

// User registration validation
exports.registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').trim().notEmpty().withMessage('Name is required'),
];

// User login validation
exports.loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Product validation
exports.productValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be positive'),
  body('category').notEmpty().withMessage('Category is required'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
];

// Service validation
exports.serviceValidation = [
  body('name').trim().notEmpty().withMessage('Service name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be positive'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be positive integer'),
  body('category').notEmpty().withMessage('Category is required'),
];

// Booking validation
exports.bookingValidation = [
  body('service').notEmpty().withMessage('Service ID is required'),
  body('bookingDate').isISO8601().withMessage('Valid booking date is required'),
  body('petDetails.petName').trim().notEmpty().withMessage('Pet name is required'),
  body('petDetails.petType').notEmpty().withMessage('Pet type is required'),
  body('customerInfo.name').trim().notEmpty().withMessage('Customer name is required'),
  body('customerInfo.email').isEmail().withMessage('Valid email is required'),
  body('customerInfo.phone').notEmpty().withMessage('Phone number is required'),
];

// Order validation - simplified
exports.orderValidation = [
  body('items').isArray({ min: 1 }).withMessage('Order must have at least one item'),
  body('shippingAddress.name').trim().notEmpty().withMessage('Name is required'),
  body('shippingAddress.phone').notEmpty().withMessage('Phone is required'),
  body('shippingAddress.address').trim().notEmpty().withMessage('Address is required'),
];

// MongoDB ObjectId validation
exports.mongoIdValidation = (paramName = 'id') => [
  param(paramName).isMongoId().withMessage('Invalid ID format'),
];
