const { validationResult } = require('express-validator');
const Instructor = require('../models/Instructor');
const ExpressError = require('../utils/ExpressError');
const wrapAsync = require('../utils/wrapAsync');

exports.createInstructor = wrapAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ExpressError(400, 'Validation errors', errors.array());
  }

  const { name, email, password} = req.body;

  const newInstructor = new Instructor({
    name,
    email,
    password
  });

  const instructor = await newInstructor.save();
  res.json(instructor);
});

exports.getAllInstructors = wrapAsync(async (req, res) => {
  const instructors = await Instructor.find().sort({ createdAt: 1 });

  if (!instructors.length) {
    throw new ExpressError(404, 'No instructors found');
  }

  res.json(instructors);
});
