// middleware/auth.js
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/user');

module.exports = async function (req, res, next) {
  const token = req.header('x-auth-token') || req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    
    // Optionally fetch the full user data from the database
    req.user = await User.findById(decoded.user.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ msg: 'User not found' });
    }

    console.log('Authenticated user:', req.user);
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
