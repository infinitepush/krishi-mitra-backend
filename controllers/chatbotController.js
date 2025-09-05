const axios = require('axios');

// @desc    Get a response from the chatbot
// @route   POST /api/chatbot
// @access  Public
exports.askChatbot = async (req, res) => {
    try {
        const userQuery = req.body.query;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [{ parts: [{ text: userQuery }] }]
            }
        );

        const chatbotResponse = response.data.candidates[0].content.parts[0].text;
        res.status(200).json({ response: chatbotResponse });

    } catch (error) {
        console.error('Chatbot API Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to get a response from the chatbot.' });
    }
};