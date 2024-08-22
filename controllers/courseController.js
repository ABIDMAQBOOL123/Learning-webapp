const { check, validationResult } = require('express-validator');
const Instructor = require('../models/Instructor');
const Course = require('../models/Course');
const ExpressError = require('../utils/ExpressError'); 
const wrapAsync = require('../utils/wrapAsync');
const { sendNotification, sendBroadcastNotification } = require('../services/notificationService');

exports.validateCourse = [
  check('title', 'Title is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('price', 'Price is required').isNumeric(),
  check('instructorId', 'Instructor ID is required').not().isEmpty(),
];

exports.createCourse = wrapAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ExpressError(400, 'Validation failed', errors.array());
  }

  const { title, description, price, instructorId } = req.body;

  const instructor = await Instructor.findById(instructorId);
  if (!instructor) {
    throw new ExpressError(404, 'Instructor not found');
  }

  const newCourse = new Course({
    title,
    description,
    price,
    instructor: instructorId,
  });

  const course = await newCourse.save();

  // Update instructor's course list
  instructor.courses.push(course._id);
  await instructor.save();

  // Send notification to instructor
  await sendNotification(instructorId, `A new course "${title}" has been created.`);

  // Send broadcast notification to all users
  await sendBroadcastNotification(`A new course titled "${title}" has been created.`);

  res.json(course);
});

exports.getAllCourses = wrapAsync(async (req, res) => {
  const courses = await Course.find().populate('instructor', ['name', 'bio']).populate({
    path: 'reviews',
    populate: {
      path: 'user',
      select: ['name'] 
    }
  });
  res.json(courses);
});

exports.getCourseById = wrapAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate('instructor', ['name', 'bio']);

  if (!course) {
    throw new ExpressError(404, 'Course not found');
  }

  res.json(course);
});

exports.updateCourse = wrapAsync(async (req, res, next) => {
  const errors = validationResult(req);
  // console.log(errors)
  if (!errors.isEmpty()) {
    throw new ExpressError(400, 'Validation failed', errors.array());
  }

  const { title, description, price ,instructorId } = req.body;

  let course = await Course.findById(req.params.id);

  if (!course) {
    throw new ExpressError(404, 'Course not found');
  }
  console.log('Course Instructor ID:', course.instructor.toString());
  console.log('Authenticated User ID:', req.user.id);

  if (course.instructor.toString() !== req.user.id) {
    throw new ExpressError(401, 'You are not authorized to update this course');
  }

  course = await Course.findByIdAndUpdate(
    req.params.id,
    { $set: { title, description, price } },
    { new: true }
  );

  // Send notification to instructor
  await sendNotification(course.instructor, `Your course "${title}" has been updated.`);

  res.json(course);
});

exports.deleteCourse = wrapAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    throw new ExpressError(404, 'Course not found');
  }

  if (course.instructor.toString() !== req.user.id) {
    throw new ExpressError(401, 'User not authorized');
  }

  await course.remove();

  res.json({ msg: 'Course removed' });
});
