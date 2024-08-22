const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../../middleware/auth');
const questionController = require('../../controllers/questionController');
const wrapAsync = require('../../utils/wrapAsync');

router.post(
  '/:quizId',
  [
    auth,
    [
      check('text', 'Question text is required').not().isEmpty(),
      check('options', 'Options are required').isArray(),
    ],
  ],
  questionController.addQuestion
);

module.exports = router;
