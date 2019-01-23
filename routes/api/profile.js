const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// LOAD PROFILE MODEL
const Profile = require('../../models/Profile');

// LOAD USER PROFILE
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

// @ROUTE POST API/PROFILE
// @DESC CREATE OR EDIT USER PROFILE
// @ACCESS PRIVATE
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
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
    if (req.body.youtube) profileFields.socialyoutube = req.body.youtube;
    if (req.body.twitter) profileFields.socialtwitter = req.body.twitter;
    if (req.body.linkedin) profileFields.sociallinkedin = req.body.linkedin;
    if (req.body.facebook) profileFields.socialyoutube = req.body.youtube;
    if (req.body.instagram) profileFields.socialinstagram = req.body.instagram;

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

module.exports = router;
