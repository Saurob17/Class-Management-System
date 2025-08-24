// routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

router.get('/batch-courses', courseController.getBatchCourses);

module.exports = router;
