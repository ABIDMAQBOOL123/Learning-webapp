// controllers/lessonController.js
const { validationResult } = require('express-validator');
const Lesson = require('../models/lesson');
const ExpressError = require('../utils/ExpressError');
const wrapAsync = require('../utils/wrapAsync');

exports.addLesson = wrapAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ExpressError(400, 'Validation errors', errors.array());
  }
 const { title, content, videoUrl,  videoDuration, course } = req.body;

  const newLesson = new Lesson({
    title,
    content,
    videoUrl,
    videoDuration,
    course,
    
  });

  const lesson = await newLesson.save();
  res.status(201).json(lesson);
});

exports.updateLesson = wrapAsync(async (req, res) => {
  const { title, content, videoUrl, videoDuration,course } = req.body;

  let lesson = await Lesson.findById(req.params.id);
  if (!lesson) {
    throw new ExpressError(404, 'Lesson not found');
  }

  lesson = await Lesson.findByIdAndUpdate(
    req.params.id,
    { $set: { title, content, videoUrl, videoDuration,course } },
    { new: true }
  );

  res.json(lesson);
});
