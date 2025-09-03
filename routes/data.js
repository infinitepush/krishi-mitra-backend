const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const dataController = require('../controllers/dataController');

// @route   POST /api/data/submit
// @desc    Submit soil data for recommendation
// @access  Private
router.post('/submit', auth, dataController.submitData);

// @route   GET /api/data/history
// @desc    Get user's past recommendations
// @access  Private
router.get('/history', auth, dataController.getHistory);

module.exports = router;
