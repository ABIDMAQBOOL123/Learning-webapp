const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../../middleware/auth');
const instructorController = require('../../controllers/InstructorController');
const wrapAsync = require("../../utils/wrapAsync");

router.post(
  '/',
  [
    auth,
    [
      check('name', 'Name is required').not().isEmpty(),
    ],
  ],
  instructorController.createInstructor
);

router.get('/', instructorController.getAllInstructors);

module.exports = router;
