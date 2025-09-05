const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/", async (req, res) => {
  const input = req.body;

  try {
    // Send input to your model API
    const response = await axios.post("https://crop-fertilizer-api.onrender.com/predict", input);

    // Forward the model's response back to the client
    res.json(response.data);
  } catch (error) {
    console.error("Error calling model API:", error.message);

    res.status(500).json({
      error: "Failed to fetch prediction from model API",
      details: error.message,
    });
  }
});

module.exports = router;
