// routes/resultRoutes.js
const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController');

router.get('/internal-marks', resultController.getInternalMarks);

module.exports = router;
