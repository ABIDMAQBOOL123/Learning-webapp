// middleware/authorize.js
const ExpressError = require('../utils/ExpressError');

const authorize = (roles) => {
  return (req, res, next) => {
    const userRole = req.user.role; // Ensure `req.user` is set by authentication middleware

    if (!roles.includes(userRole)) {
      return next(new ExpressError(403, 'Forbidden'));
    }

    next();
  };
};

module.exports = authorize;
