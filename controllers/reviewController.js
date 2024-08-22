const Review = require('../models/Review');
const Course = require('../models/Course');
const { validationResult } = require('express-validator');
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');

exports.createReview = wrapAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ExpressError(400, 'Validation errors', errors.array());
  }

  const { rating, comment } = req.body;
  const { courseId } = req.params;

  const course = await Course.findById(courseId);
  if (!course) {
    throw new ExpressError(404, 'Course not found');
  }

  const review = new Review({
    course: courseId,
    user: req.user.id, // Ensure req.user.id is set by authentication middleware
    rating,
    comment,
  });

  await review.save();

  course.reviews.push(review._id);
  await course.save();

  res.status(201).json(review); // Use status 201 for created resources
});

exports.getAllReviewsForCourse = wrapAsync(async (req, res) => {
  const { courseId } = req.params;
  const reviews = await Review.find({ course: courseId }).populate('user', 'name');
  if (reviews.length === 0) {
    throw new ExpressError(404, 'No reviews found');
  }
  res.json(reviews);
});

exports.updateReview = wrapAsync(async (req, res) => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;

  const review = await Review.findById(reviewId);
  if (!review) {
    throw new ExpressError(404, 'Review not found');
  }

  if (review.user.toString() !== req.user.id) {
    throw new ExpressError(403, 'Not authorized');
  }

  review.rating = rating || review.rating;
  review.comment = comment || review.comment;

  await review.save();

  res.json(review);
});

exports.deleteReview = wrapAsync(async (req, res) => {
  const { reviewId } = req.params;

  const review = await Review.findById(reviewId);
  if (!review) {
    throw new ExpressError(404, 'Review not found');
  }

  if (review.user.toString() !== req.user.id) {
    throw new ExpressError(403, 'Not authorized');
  }


await Review.findByIdAndDelete(reviewId );

  res.json({ msg: 'Review removed' });
});
