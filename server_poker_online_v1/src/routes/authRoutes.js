// src/routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authController.registerPlayer);
router.post('/login', authController.loginPlayer);
router.post('/check-email', authController.checkEmailExits);
router.post('/verify-otp', authController.verifyOTP);

module.exports = router;
