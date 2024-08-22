const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../../middleware/auth');
const reviewController = require('../../controllers/reviewController');
const wrapAsync = require('../../utils/wrapAsync');

router.post(
  '/:courseId',
  [
    auth,
    [
      check('rating', 'Rating is required and must be between 1 and 5').isInt({ min: 1, max: 5 }),
      check('comment', 'Comment is required').not().isEmpty(),
    ],
  ],
  reviewController.createReview
);

router.get('/:courseId', reviewController.getAllReviewsForCourse);

router.put(
  '/:reviewId',
  [
    auth,
    [
      check('rating', 'Rating must be between 1 and 5').optional().isInt({ min: 1, max: 5 }),
      check('comment', 'Comment cannot be empty').optional().not().isEmpty(),
    ],
  ],
  reviewController.updateReview
);

router.delete('/:reviewId', auth, reviewController.deleteReview);

module.exports = router;
