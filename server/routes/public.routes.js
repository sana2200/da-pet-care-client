const express = require('express');
const router = express.Router();

// @route   GET /api/health
// @desc    Health check
// @access  Public
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

module.exports = router;
