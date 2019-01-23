const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data) {
  let errors = {};

  // CHECK FIELDS ARE NOT EMPTY IF EMPTY TURN TO EMPTY STRING FOR VALIDATOR
  data.handle = !isEmpty(data.handle) ? data.handle : '';
  data.status = !isEmpty(data.status) ? data.status : '';
  data.skills = !isEmpty(data.skills) ? data.skills : '';

  // HANDLE AT LEAST 2 CHAR AND MAX 40
  if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = 'Please ensure handle is between 2 and 40 characters ';
  }

  // CHECK IF HANDLE FIELD IS EMPTY
  if (Validator.isEmpty(data.handle)) {
    errors.handle = 'Handle field is required';
  }

  // CHECK IF STATUS FIELD IS EMPTY
  if (Validator.isEmpty(data.status)) {
    errors.status = 'Status field is required';
  }

  // CHECK IF SKILLS FIELD IS EMPTY
  if (Validator.isEmpty(data.skills)) {
    errors.skills = 'Skills field is required';
  }

  // CHECK WEBSITE IS PROVIDED
  if (!isEmpty(data.website)) {
    // VALIDATE WEBSITE
    if (!Validator.isURL(data.website)) {
      errors.website = 'Please ensure website is a valid URL';
    }
  }

  // CHECK YOUTUBE IS PROVIDED
  if (!isEmpty(data.youtube)) {
    // VALIDATE YOUTUBE
    if (!Validator.isURL(data.youtube)) {
      errors.youtube = 'Please ensure Youtube is a valid URL';
    }
  }

  // CHECK TWITTER IS PROVIDED
  if (!isEmpty(data.twitter)) {
    // VALIDATE TWITTER
    if (!Validator.isURL(data.twitter)) {
      errors.twitter = 'Please ensure Twitter is a valid URL';
    }
  }

  // CHECK FACEBOOK IS PROVIDED
  if (!isEmpty(data.facebook)) {
    // VALIDATE FACEBOOK
    if (!Validator.isURL(data.facebook)) {
      errors.facebook = 'Please ensure Facebook is a valid URL';
    }
  }

  // CHECK LINKEDIN IS PROVIDED
  if (!isEmpty(data.linkedin)) {
    // VALIDATE LINKEDIN
    if (!Validator.isURL(data.linkedin)) {
      errors.linkedin = 'Please ensure Linkedin is a valid URL';
    }
  }

  // CHECK INSTAGRAM IS PROVIDED
  if (!isEmpty(data.instagram)) {
    // VALIDATE INSTAGRAM
    if (!Validator.isURL(data.instagram)) {
      errors.instagram = 'Please ensure Instagram is a valid URL';
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
