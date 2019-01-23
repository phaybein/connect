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

module.exports = router;
