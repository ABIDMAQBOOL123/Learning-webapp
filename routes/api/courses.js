const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const courseController = require('../../controllers/courseController');
// const wrapAsync = require("../../utils/wrapAsync");


router.post(
  '/',
  auth,
  courseController.validateCourse,
  courseController.createCourse
);


router.get('/', courseController.getAllCourses);


router.get('/:id', courseController.getCourseById);


router.put(
  '/:id',
  auth,
  courseController.validateCourse,
  courseController.updateCourse
);


router.delete('/:id', auth, courseController.deleteCourse);

module.exports = router;

