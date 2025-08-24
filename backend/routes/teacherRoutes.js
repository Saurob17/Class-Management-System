// routes/teacherRoutes.js
const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');

router.post('/login', teacherController.teacherLogin);

module.exports = router;
