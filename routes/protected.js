const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

// Middleware to verify Firebase token
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    res.status(401).json({ msg: "Invalid or expired token" });
  }
};

// Example protected route
router.get("/protected", verifyToken, (req, res) => {
  res.json({
    msg: "You have accessed a protected route!",
    user: req.user,
  });
});

module.exports = router;
