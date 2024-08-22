const { validationResult } = require('express-validator');
const Question = require('../models/Question');
const Quiz = require('../models/Quiz');
const ExpressError = require('../utils/ExpressError');
const wrapAsync = require('../utils/wrapAsync');

exports.addQuestion = wrapAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ExpressError(400, 'Validation errors', errors.array());
  }

  const { text, options } = req.body;

  // Validate 'options' to ensure it's an array of objects with the correct structure
  if (!Array.isArray(options) || options.length === 0) {
    throw new ExpressError(400, 'Options must be a non-empty array');
  }
  if (!options.every(option => 
    option.hasOwnProperty('text') && 
    typeof option.text === 'string' &&
    option.hasOwnProperty('isCorrect') && 
    typeof option.isCorrect === 'boolean'
  )) {
    throw new ExpressError(400, 'Each option must be an object with "text" (string) and "isCorrect" (boolean)');
  }

  // Check if the quiz exists
  const quiz = await Quiz.findById(req.params.quizId);
  if (!quiz) {
    throw new ExpressError(404, 'Quiz not found');
  }

  // Create and save the new question
  const newQuestion = new Question({
    quiz: req.params.quizId,
    text,
    options,
  });

  const question = await newQuestion.save();

  
  quiz.questions.push(question._id);
  await quiz.save();

  res.status(201).json(question);
});
