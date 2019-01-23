const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
  let errors = {};

  // CHECK FIELDS ARE NOT EMPTY IF EMPTY TURN TO EMPTY STRING
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  // CHECK IF VALID EMAIL
  if (!Validator.isEmail(data.email)) {
    errors.email = 'Please enter a valid email';

    // CHECK IF EMAIL FIELD IS EMPTY
    if (Validator.isEmpty(data.email)) {
      errors.email = 'Email field is required';
    }
  }

  // CHECK IF PASSWORD FIELD IS EMPTY
  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
