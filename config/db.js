const admin = require('firebase-admin');
const serviceAccount = require('../krishi-mitra-4baf7-firebase-adminsdk-fbsvc-72d3541825.json');

const connectDB = () => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('Firebase connected successfully!');
};

module.exports = connectDB;
