const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { authenticateUser, getUserByToken } = require('../../controllers/authController');

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public
router.post('/', authenticateUser);

// @route    GET api/auth
// @desc     Get user by token
// @access   Private
router.get('/', auth, getUserByToken);

module.exports = router;
