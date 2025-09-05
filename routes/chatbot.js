const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');

// @route   POST /api/chatbot
// @desc    Get a response from the chatbot
// @access  Public
router.post('/', chatbotController.askChatbot);

module.exports = router;