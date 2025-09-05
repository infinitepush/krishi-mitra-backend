const admin = require("firebase-admin");

const connectDB = () => {
  if (!admin.apps.length) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });

      console.log("✅ Firebase connected successfully!");
    } catch (error) {
      console.error("❌ Failed to connect Firebase:", error.message);
    }
  }
};

module.exports = connectDB;
