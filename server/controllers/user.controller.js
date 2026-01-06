const User = require('../models/User.model');

exports.getProfile = async (req, res) => {
  try {
    console.log('REQ USER:', req.user); // DEBUG

    const user = await User.findOne({ email: req.user.email });

    if (!user) {
      return res.status(404).json({
        message: 'User not found. Register first.'
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('GET PROFILE ERROR:', error);
    res.status(500).json({
      message: 'Failed to load profile'
    });
  }
};
