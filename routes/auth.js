const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers');

// @route   POST /api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', authController.register);

// @route   POST /api/auth/login
// @desc    Authenticate user & get custom token
// @access  Public
router.post('/login', authController.login);

module.exports = router;