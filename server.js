const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');  // ✅ fixed import

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Firebase
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/data', require('./routes/data'));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
