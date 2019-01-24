const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateEducationInput(data) {
  let errors = {};

  // CHECK FIELDS ARE NOT EMPTY IF EMPTY TURN TO EMPTY STRING FOR VALIDATOR
  data.school = !isEmpty(data.school) ? data.school : '';
  data.degree = !isEmpty(data.degree) ? data.degree : '';
  data.fieldOfStudy = !isEmpty(data.fieldOfStudy) ? data.fieldOfStudy : '';
  data.from = !isEmpty(data.from) ? data.from : '';

  // CHECK IF SCHOOL FIELD IS EMPTY
  if (Validator.isEmpty(data.school)) {
    errors.school = 'School field is required';
  }

  // CHECK IF DEGREE FIELD IS EMPTY
  if (Validator.isEmpty(data.degree)) {
    errors.degree = 'Degree field is required';
  }

  // CHECK IF FIELD OF STUDY FIELD IS EMPTY
  if (Validator.isEmpty(data.fieldOfStudy)) {
    errors.fieldOfStudy = 'Field of Study field is required';
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
