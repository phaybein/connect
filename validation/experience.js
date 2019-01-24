const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data) {
  let errors = {};

  // CHECK FIELDS ARE NOT EMPTY IF EMPTY TURN TO EMPTY STRING FOR VALIDATOR
  data.title = !isEmpty(data.title) ? data.title : '';
  data.company = !isEmpty(data.company) ? data.company : '';
  data.from = !isEmpty(data.from) ? data.from : '';

  // CHECK IF TITLE FIELD IS EMPTY
  if (Validator.isEmpty(data.title)) {
    errors.title = 'Job Title field is required';
  }

  // CHECK IF COMPANY FIELD IS EMPTY
  if (Validator.isEmpty(data.company)) {
    errors.company = 'Company field is required';
  }

  // CHECK IF FROM FIELD IS EMPTY
  if (Validator.isEmpty(data.from)) {
    errors.from = 'From date field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
