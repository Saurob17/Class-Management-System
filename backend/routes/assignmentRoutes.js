// routes/assignmentRoutes.js
const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');

router.post('/', assignmentController.createAssignment);
router.get('/', assignmentController.getAssignments);
router.delete('/', assignmentController.deleteAssignment);

module.exports = router;
