const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
  let errors = {};

  // CHECK FIELDS ARE NOT EMPTY IF EMPTY TURN TO EMPTY STRING FOR VALIDATOR
  data.text = !isEmpty(data.text) ? data.text : '';

  // TEXT AT LEAST 3 CHAR AND MAX 200
  if (!Validator.isLength(data.text, { min: 3, max: 200 })) {
    errors.text = 'Please ensure text is between 3 and 200 characters ';
  }

  // CHECK IF VALID TEXT
  if (Validator.isEmpty(data.text)) {
    errors.text = 'Text field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
