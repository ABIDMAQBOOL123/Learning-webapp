const { check, validationResult } = require('express-validator');
const Quiz = require('../models/Quiz');
const ExpressError = require('../utils/ExpressError');
const wrapAsync = require('../utils/wrapAsync');

exports.validateQuiz = [
  check('title', 'Title is required').not().isEmpty(),
  check('course', 'Course ID is required').not().isEmpty(),
];

exports.createQuiz = wrapAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ExpressError(400, 'Validation errors', errors.array());
  }

  const { title, course } = req.body;

  const newQuiz = new Quiz({
    title,
    course,
  });

  const quiz = await newQuiz.save();
  res.json(quiz);
});

exports.getQuizzesByCourse = wrapAsync(async (req, res) => {
  const quizzes = await Quiz.find({ course: req.params.courseId }).populate('questions');
  res.json(quizzes);
});

exports.getQuizById = wrapAsync(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id).populate('questions');
  if (!quiz) {
    throw new ExpressError(404, 'Quiz not found');
  }
  res.json(quiz);
});

exports.updateQuiz = wrapAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ExpressError(400, 'Validation errors', errors.array());
  }

  const { title, course } = req.body;

  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) {
    throw new ExpressError(404, 'Quiz not found');
  }

  quiz.title = title || quiz.title;
  quiz.course = course || quiz.course;

  const updatedQuiz = await quiz.save();
  res.json(updatedQuiz);
});

exports.deleteQuiz = wrapAsync(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.id);

  if (!quiz) {
    throw new ExpressError(404, 'Quiz not found');
  }

  await quiz.remove();
  res.json({ msg: 'Quiz removed' });
});
