const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Firebase
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Auth Routes (Register + Login)
app.use("/api/auth", require("./routes/auth"));

app.use("/api/model", require("./routes/model"));
app.use('/api/chatbot', require('./routes/chatbot'));
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
