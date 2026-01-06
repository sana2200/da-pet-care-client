const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const {
  registerValidation,
  loginValidation,
  validate
} = require('../middlewares/validation.middleware');

/**
 * =========================
 * PUBLIC ROUTES
 * =========================
 */

// @route   POST /api/auth/register
// @desc    Register a new user (email & password)
// @access  Public
router.post(
  '/register',
  registerValidation,
  validate,
  authController.register
);

// @route   POST /api/auth/login
// @desc    Login user & return JWT
// @access  Public
router.post(
  '/login',
  loginValidation,
  validate,
  authController.login
);

// @route   POST /api/auth/firebase
// @desc    Firebase login → issue JWT
// @access  Public
router.post(
  '/firebase',
  authController.firebaseAuth
);

/**
 * =========================
 * PROTECTED ROUTES (JWT)
 * =========================
 */

// @route   GET /api/auth/me
// @desc    Get logged-in user profile
// @access  Private
router.get(
  '/me',
  protect,
  authController.getMe
);

// @route   GET /api/auth/verify
// @desc    Verify JWT token
// @access  Private
router.get(
  '/verify',
  protect,
  authController.verifyToken
);

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put(
  '/profile',
  protect,
  authController.updateProfile
);

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put(
  '/change-password',
  protect,
  authController.changePassword
);

module.exports = router;
