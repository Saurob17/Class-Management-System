// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/batch-login', authController.batchLogin);

module.exports = router;
