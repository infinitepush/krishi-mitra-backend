const express = require("express");
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Register user
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if email already exists in Firebase
    const userRecord = await admin.auth().getUserByEmail(email).catch(() => null);
    if (userRecord) {
      return res.status(400).json({ msg: "User with this email already exists" });
    }

    // Create new user in Firebase
    const newUser = await admin.auth().createUser({
      email,
      password,
    });

    // Generate JWT (for your app sessions)
    const token = jwt.sign(
      { uid: newUser.uid, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      msg: "User registered successfully",
      uid: newUser.uid,
      email: newUser.email,
      token,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ msg: "Error registering user", error: err.message });
  }
});

// Login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verify user via Firebase signInWithPassword REST API
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_WEB_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ msg: "Invalid credentials", error: data.error.message });
    }

    // Generate JWT (custom for your app)
    const token = jwt.sign(
      { uid: data.localId, email: data.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      msg: "Login successful",
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Error logging in", error: err.message });
  }
});

module.exports = router;
