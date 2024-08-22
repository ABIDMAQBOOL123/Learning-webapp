const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/user');
const ExpressError = require('../utils/ExpressError'); 
const wrapAsync = require('../utils/wrapAsync'); 

// @desc     Get all users
// @route    GET /api/users
// @access   Private (Admin only)
exports.getAllUsers = wrapAsync(async (req, res) => {
  // Ensure the user making the request is an admin
  if (req.user.role !== 'admin') {
    throw new ExpressError(403, 'Access denied'); // Custom error message
  }

  // Fetch and return all users excluding the password field
  const users = await User.find().select('-password'); 
  res.json(users);
});

// Validation middleware for user registration
exports.validateUser = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  check('role', 'Role is required').not().isEmpty(),
  check('role').isIn(['admin', 'instructor', 'student', 'guest']).withMessage('Invalid role')
];

// @desc     Register a new user
// @route    POST /api/users
// @access   Public
exports.registerUser = wrapAsync(async (req, res) => {
  console.log('POST request received at /api/users');
  
  // Validate the request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ExpressError(400, 'Validation errors', errors.array());
  }

  const { name, email, password, role } = req.body;
  console.log("Processing Registration for Email:", email);

  // Check if the user already exists
  let user = await User.findOne({ email });
  if (user) {
    throw new ExpressError(400, 'User already exists');
  }

  // Create a new user
  user = new User({
    name,
    email,
    password,
    role // Include the role field
  });

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  // Save the user to the database
  await user.save();

  // Create a JWT payload
  const payload = {
    user: {
      id: user.id,
      role: user.role // Include the role in the payload
    }
  };

  // Sign and send the JWT token
  jwt.sign(
    payload,
    config.get('jwtSecret'),
    { expiresIn: '10h' }, 
    (err, token) => {
      if (err) throw err;
      res.cookie("jwt", token, { httpOnly: true }); 
      res.json({ token });
    }
  );
});
