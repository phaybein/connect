const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// LOAD VALIDATION
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

// LOAD PROFILE MODEL
const Profile = require('../../models/Profile');

// LOAD USER MODEL
const User = require('../../models/User');

// @ROUTE GET API/PROFILE/TEST
// @DESC TESTS PROFILE ROUTE
// @ACCESS PUBLIC
router.get('/test', (req, res) => {
  res.json({
    msg: 'Profile works'
  });
});

// @ROUTE GET API/PROFILE
// @DESC GET CURRENT USER PROFILE
// @ACCESS PRIVATE
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // INITIALIZE ERRORS
    const errors = {};

    Profile.findOne({
      user: req.user.id
    })
      .populate('user', ['firstName', 'lastName', 'avatar'])
      .then(profile => {
        if (!profile) {
          errors.noProfile = 'No profile has been found for this user';
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @ROUTE GET API/PROFILE/ALL
// @DESC GET ALL PROFILES
// @ACCESS PUBLIC
router.get('/all', (req, res) => {
  const errors = {};
  Profile.find()
    .populate('user', ['firstName', 'lastName', 'avatar'])
    .then(profiles => {
      if (!profiles) {
        errors.noProfiles = 'Could not locate any profiles';
        res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err =>
      res.status(404).json({ profile: 'Could not locate any profiles' })
    );
});

// @ROUTE GET API/PROFILE/HANDLE/:HANDLE
// @DESC GET PROFILE BY HANDLE
// @ACCESS PUBLIC
router.get('/handle/:handle', (req, res) => {
  // INITIALIZE ERRORS
  const errors = {};

  Profile.findOne({
    handle: req.params.handle
  })
    .populate('user', ['firstName', 'lastName', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noProfile = 'Could not locate a profile for this user';
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err =>
      res
        .status(404)
        .json({ profile: 'Could not locate a profile for this user' })
    );
});

// @ROUTE GET API/PROFILE/USER/:USER_ID
// @DESC GET PROFILE BY USER ID
// @ACCESS PUBLIC
router.get('/user/:user_id', (req, res) => {
  // INITIALIZE ERRORS
  const errors = {};

  Profile.findOne({
    user: req.params.user_id
  })
    .populate('user', ['firstName', 'lastName', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noProfile = 'Could not locate a profile for this user';
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err =>
      res
        .status(404)
        .json({ profile: 'Could not locate a profile for this user' })
    );
});

// @ROUTE POST API/PROFILE
// @DESC CREATE OR EDIT USER PROFILE
// @ACCESS PRIVATE
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // RUN INFORMATION THROUGH VALIDATION
    const { errors, isValid } = validateProfileInput(req.body);

    // CHECK VALIDATION
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // GET FILEDS
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubUsername)
      profileFields.githubUsername = req.body.githubUsername;

    // SKILLS - SPLIT INTO ARRAY
    if (typeof req.body.skills !== 'undefined') {
      profileFields.skills = req.body.skills.split(',');
    }

    // SOCIAL
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({
      user: req.user.id
    }).then(profile => {
      if (profile) {
        // UPDATE PROFILE
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // CREATE PROFILE

        // CHECK IF HANDLE EXISTS
        Profile.findOne({
          handle: profileFields.handle
        }).then(profile => {
          if (profile) {
            errors.handle = 'Handle already exists';
            res.status(400).json(errors);
          }

          // SAVE PROFILE
          new Profile(profileFields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);

// @ROUTE POST API/PROFILE/EXPERIENCE
// @DESC ADD EXPERIENCE TO PROFILE
// @ACCESS PRIVATE
router.post(
  '/experience',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // RUN INFORMATION THROUGH VALIDATION
    const { errors, isValid } = validateExperienceInput(req.body);

    // CHECK VALIDATION
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Profile.findOne({
      user: req.user.id
    }).then(profile => {
      const newExperience = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      // ADD TO EXPERIENCE ARRAY
      profile.experience.unshift(newExperience);

      profile.save().then(profile => res.json(profile));
    });
  }
);

// @ROUTE POST API/PROFILE/EDUCATION
// @DESC ADD EDUCATION TO PROFILE
// @ACCESS PRIVATE
router.post(
  '/education',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // RUN INFORMATION THROUGH VALIDATION
    const { errors, isValid } = validateEducationInput(req.body);

    // CHECK VALIDATION
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Profile.findOne({
      user: req.user.id
    }).then(profile => {
      const newEducation = {
        school: req.body.school,
        degree: req.body.degree,
        fieldOfStudy: req.body.fieldOfStudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      // ADD TO EDUCATION ARRAY
      profile.education.unshift(newEducation);

      profile.save().then(profile => res.json(profile));
    });
  }
);

// @ROUTE DELETE API/PROFILE/EXPERIENCE/:EXPERIENCE_ID
// @DESC DELETE EXPERIENCE FROM PROFILE
// @ACCESS PRIVATE
router.delete(
  '/experience/:experience_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({
      user: req.user.id
    }).then(profile => {
      // GET REMOVE INDEX
      const removeIndex = profile.experience
        .map(item => item.id) // CREATE A LIST OF IDS
        .indexOf(req.params.experience_id); // GRAB ID

      // SPLICE OUT OF ARRAY
      profile.experience.splice(removeIndex, 1);

      // SAVE
      profile
        .save()
        .then(profile => res.json(profile))
        .catch(err => res.status(404).json(err));
    });
  }
);

// @ROUTE DELETE API/PROFILE/EDUCATION/:EDUCATION_ID
// @DESC DELETE EDUCATION FROM PROFILE
// @ACCESS PRIVATE
router.delete(
  '/education/:education_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({
      user: req.user.id
    }).then(profile => {
      // GET REMOVE INDEX
      const removeIndex = profile.education
        .map(item => item.id) // CREATE A LIST OF IDS
        .indexOf(req.params.education_id); // GRAB ID

      // SPLICE OUT OF ARRAY
      profile.education.splice(removeIndex, 1);

      // SAVE
      profile
        .save()
        .then(profile => res.json(profile))
        .catch(err => res.status(404).json(err));
    });
  }
);

// @ROUTE DELETE API/PROFILE
// @DESC DELETE USER AND PROFILE
// @ACCESS PRIVATE
router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({
      user: req.user.id
    }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json({ success: true })
      );
    });
  }
);

module.exports = router;
