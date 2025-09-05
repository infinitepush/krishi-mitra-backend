const admin = require("firebase-admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = admin.firestore();
const JWT_SECRET = process.env.JWT_SECRET;

// Register
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const usersRef = db.collection("users");
    const existingUser = await usersRef.where("email", "==", email).get();

    if (!existingUser.empty) {
      return res.status(400).json({ msg: "User with this email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user in Firestore
    const newUserRef = usersRef.doc();
    await newUserRef.set({
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    const uid = newUserRef.id;

    // Generate JWT
    const token = jwt.sign({ uid, email }, JWT_SECRET, { expiresIn: "1h" });

    res.json({
      msg: "User registered successfully",
      uid,
      email,
      token,
    });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Get user by email
    const usersRef = db.collection("users");
    const userSnap = await usersRef.where("email", "==", email).limit(1).get();

    if (userSnap.empty) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const userDoc = userSnap.docs[0];
    const userData = userDoc.data();

    // Compare password
    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign({ uid: userDoc.id, email }, JWT_SECRET, { expiresIn: "1h" });

    res.json({
      msg: "Login successful",
      token,
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};
