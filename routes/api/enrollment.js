const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const enrollmentController = require('../../controllers/enrollmentController');


router.post('/', auth, enrollmentController.enrollInCourse);


router.get('/', auth, enrollmentController.getAllEnrollments);


router.get('/:id', auth, enrollmentController.getEnrollmentById);


router.delete('/:id', auth, enrollmentController.deleteEnrollment);

module.exports = router;
