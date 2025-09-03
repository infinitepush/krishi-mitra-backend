const admin = require('../config/db');

// Get user details by UID
const getUser = async (req, res) => {
  const { uid } = req.params;

  try {
    const user = await admin.auth().getUser(uid);
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(404).json({ error: error.message });
  }
};

module.exports = { getUser };
