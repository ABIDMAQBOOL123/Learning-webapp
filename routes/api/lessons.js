const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const lessonController = require('../../controllers/lessonController');

// Route to add a lesson, requires authentication
router.post(
  '/:course_id',
  auth,  
  lessonController.addLesson  
);

// Route to get lessons by course ID
router.get(
  '/:course_id',
  lessonController.updateLesson 
);

module.exports = router;
