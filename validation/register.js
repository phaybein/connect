const Validator = require('validator');
const isEmpty = require('./is-empty');
const zxcvbn = require('zxcvbn');

module.exports = function validateRegisterInput(data) {
  let errors = {};

  // CHECK FIELDS ARE NOT EMPTY IF EMPTY TURN TO EMPTY STRING FOR VALIDATOR
  data.firstName = !isEmpty(data.firstName) ? data.firstName : '';
  data.lastName = !isEmpty(data.lastName) ? data.lastName : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';

  // FIRST NAME AT LEAST 2 CHAR AND MAX 30
  if (!Validator.isLength(data.firstName, { min: 2, max: 30 })) {
    errors.firstName =
      'Please ensure first name is between 2 and 30 characters';
  }

  // CHECK IF FIRST NAME FIELD IS EMPTY
  if (Validator.isEmpty(data.firstName)) {
    errors.firstName = 'First name field is required';
  }

  // LAST NAME AT LEAST 2 CHAR AND MAX 30
  if (!Validator.isLength(data.lastName, { min: 2, max: 30 })) {
    errors.lastName = 'Please ensure last name is between 2 and 30 characters';
  }

  // CHECK IF LAST NAME FIELD IS EMPTY
  if (Validator.isEmpty(data.lastName)) {
    errors.lastName = 'Last name field is required';
  }

  // CHECK IF EMAIL FIELD IS EMPTY
  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  // CHECK IF VALID EMAIL
  if (!Validator.isEmail(data.email)) {
    errors.email = 'Please enter a valid email';
  }

  // CHECK IF PASSWORD FIELD IS EMPTY
  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  // CHECK PASSWORD STRENGTH
  const passwordStrength = zxcvbn(
    data.password,
    (user_inputs = [data.firstName, data.lastName, data.email])
  );

  // GRAB KEY ITEMS FOR PASSWORD VALIDATION
  const passwordScore = passwordStrength.score;
  const passwordSuggestions = passwordStrength.feedback.suggestions;
  const passwordWarnings = passwordStrength.feedback.warning;

  if (passwordScore <= 2) {
    // IF SUGG ARE NOT EMPTY PUSH TO ERRORS
    if (passwordSuggestions) {
      errors.passwordSuggestions = passwordSuggestions;
    }

    // IF SUGG ARE NOT EMPTY PUSH TO ERRORS
    if (passwordWarnings) {
      errors.passwordWarnings = passwordWarnings;
    }
  }

  // CHECK IF PASSWORD2 FIELD IS EMPTY
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = 'Confirm password field is required';
  }

  // CHECK IF PASSWORD2 FIELD IS EMPTY
  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = 'Please ensure password fields match';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
