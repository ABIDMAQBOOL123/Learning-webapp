const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/user');
const ExpressError = require('../utils/ExpressError');
const wrapAsync = require("../utils/wrapAsync");

const generateToken = (user, res, next) => {
  const payload = { user: { id: user.id } };

  jwt.sign(
    payload,
    config.get('jwtSecret'),
    { expiresIn: '1h' },
    (err, token) => {
      if (err) {
        return next(new ExpressError(500, 'Token generation error'));
      }
      res.cookie('JWT', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
      });
      res.json({ token });
    }
  );
};

exports.getUserByToken = wrapAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) {
    throw new ExpressError(404, 'User not found');
  }
  res.json(user);
});

exports.authenticateUser = wrapAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ExpressError(400, 'Invalid Credentials');
  }

  generateToken(user, res, next);
});
