const validator = require('validator');

// Custom validation middleware for user registration
const validateRegistration = (req, res, next) => {
  const { firstName,lastName, email, password } = req.body;
  const errors = [];

  if (!firstName) {
    errors.push('First Name is required.');
  }
  if (!lastName) {
    errors.push('Last Name is required.');
  }

  if (!validator.isEmail(email)) {
    errors.push('Email is Invalid Format.');
  }

  if (!validator.isLength(password, { min: 6 })) {
    errors.push('Password must be at least 6 characters long.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next(); // Proceed to the next middleware or route handler
};

module.exports = { validateRegistration };
