// routes/scheduleRoutes.js
const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

router.get('/daily-schedule', scheduleController.getDailySchedule);
router.get('/next-class', scheduleController.getNextClass);

module.exports = router;
