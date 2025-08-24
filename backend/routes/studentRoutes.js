// routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.get('/batch-info', studentController.getBatchInfo);
router.get('/course-count', studentController.getCourseCount);
router.get('/courses', studentController.getCourses);
router.get('/marks', studentController.getMarks);

module.exports = router;
