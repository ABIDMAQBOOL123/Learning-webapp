const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const ExpressError = require('../utils/ExpressError');
const wrapAsync = require('../utils/wrapAsync');
const { sendNotification } = require('../services/notificationService');

// @desc     Enroll in a course
// @route    POST /api/enrollments
// @access   Private
exports.enrollInCourse = wrapAsync(async (req, res) => {
  const { courseId } = req.body;

  // Check if courseId is provided
  if (!courseId) {
    throw new ExpressError(400, 'Course ID is required');
  }

  const course = await Course.findById(courseId);
  if (!course) {
    throw new ExpressError(404, 'Course not found');
  }

  let enrollment = await Enrollment.findOne({ user: req.user.id, course: courseId });
  console.log(enrollment)
  if (enrollment) {
    throw new ExpressError(400, 'Already enrolled in this course');
  }

  enrollment = new Enrollment({
    user: req.user.id,
    course: courseId
  });

  await enrollment.save();
  await sendNotification(course.instructor, `A new student has enrolled in your course "${course.title}".`);

  res.json(enrollment);
});

// @desc     Get all enrollments for the current user
// @route    GET /api/enrollments
// @access   Private
exports.getAllEnrollments = wrapAsync(async (req, res) => {
  const enrollments = await Enrollment.find({ user: req.user.id })
    .populate('course', ['title', 'description', 'price'])
    .populate('user', ['name', 'email']);
  res.json(enrollments);
});

// @desc     Get enrollment by ID
// @route    GET /api/enrollments/:id
// @access   Private
exports.getEnrollmentById = wrapAsync(async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.id)
    .populate('course', ['title', 'description', 'price'])
    .populate('user', ['name', 'email']);

  if (!enrollment) {
    throw new ExpressError(404, 'Enrollment not found');
  }

  res.json(enrollment);
});

// @desc     Delete enrollment by ID
// @route    DELETE /api/enrollments/:id
// @access   Private
exports.deleteEnrollment = wrapAsync(async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.id);

  if (!enrollment) {
    throw new ExpressError(404, 'Enrollment not found');
  }

  if (enrollment.user.toString() !== req.user.id) {
    throw new ExpressError(401, 'User not authorized');
  }

  await Enrollment.deleteOne({ _id: req.params.id });

  res.json({ msg: 'Enrollment removed' });
});
