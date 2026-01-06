const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error('JWT verification failed:', err.message);
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'User account is deactivated' });
    }

    req.user = user; // ✅ attach full user object to request
    next(); // ✅ call next properly
  } catch (error) {
    console.error('JWT Auth middleware error:', error);
    return res.status(500).json({ success: false, message: 'Server error in authentication' });
  }
};
