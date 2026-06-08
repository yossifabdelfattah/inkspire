const User = require('../models/User');

// GET /api/users/me — returns the MongoDB profile (incl. role) for the authenticated Firebase user
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.mongoId).select('name email role firebaseUid');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
};

module.exports = { getMe };
