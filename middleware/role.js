const ExpressError = require('../utils/ExpressError');

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Ensure req.user is available
    if (!req.user) {
      console.log('Error: No user information found in request.');
      return next(new ExpressError(401, 'User not authenticated')); // Unauthorized
    }

    // Check if the user's role is among the allowed roles
    if (!roles.includes(req.user.role)) {
      console.log('Error: Access denied');
      console.log('Authenticated user role:', req.user.role);
      console.log('Required roles:', roles);
      return next(new ExpressError(403, 'Access denied')); // Forbidden
    }

    // Continue to the next middleware or route handler
    next();
  };
};

module.exports = authorizeRoles;
