
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const takeQuizController = require('../../controllers/takeQuizController');


router.post('/:quizId/submit', auth, takeQuizController.submitQuiz);

module.exports = router;
