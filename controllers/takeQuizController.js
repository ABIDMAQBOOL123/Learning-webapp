// controllers/takeQuizController.js
const Quiz = require('../models/Quiz');
const Question = require('../models/Quiz');
const ExpressError = require('../utils/ExpressError');
const wrapAsync = require('../utils/wrapAsync');

exports.submitQuiz = wrapAsync(async (req, res) => {
  const { answers } = req.body;

  const quiz = await Quiz.findById(req.params.quizId).populate('questions');
  if (!quiz) {
    throw new ExpressError(404, 'Quiz not found');
  }

  let score = 0;
  quiz.questions.forEach((question, index) => {
    const correctOption = question.options.find(option => option.isCorrect);
    if (correctOption && correctOption.text === answers[index]) {
      score++;
    }
  });

  res.json({ score, total: quiz.questions.length });
});
