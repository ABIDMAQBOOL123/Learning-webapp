const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../../middleware/auth');
const quizController = require('../../controllers/quizController');
const wrapAsync = require('../../utils/wrapAsync');

router.post(
  '/',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('course', 'Course ID is required').not().isEmpty(),
    ],
  ],
  quizController.createQuiz
);

router.get('/course/:courseId', quizController.getQuizzesByCourse);
router.put(
  '/:id',
  auth,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('course', 'Course ID is required').not().isEmpty(),
  ],
  quizController.updateQuiz
);
router.get('/:id', quizController.getQuizById);

router.delete('/:id', auth, quizController.deleteQuiz);

module.exports = router;
