const admin = require("firebase-admin");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "No token provided" });
    }

    const idToken = authHeader.split(" ")[1];

    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Attach user data to request
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    res.status(401).json({ msg: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
