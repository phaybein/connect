const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const zxcvbn = require('zxcvbn');
const bcrypt = require('bcryptjs');

// BRING IN USER MODEL
const User = require('../../models/User');

// @ROUTE GET API/USER/TEST
// @DESC TESTS USER ROUTE
// @ACCESS PUBLIC
router.get('/test', (req, res) => {
  res.json({
    msg: 'Users works'
  });
});

// @ROUTE GET API/USER/REGISTER
// @DESC REGISTER USER
// @ACCESS PUBLIC
router.post('/register', (req, res) => {
  // HAVE MONGOOSE FIND IF EXISTING USER
  User.findOne({
    email: req.body.email
  }).then(user => {
    if (user) {
      // INFORM USER OF EXISTING EMAIL
      return res.status(400).json({ email: 'Email already exists' });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: '200', // SIZE
        r: 'pg', // RATING
        d: 'mm' // DEFAULT IMAGE
      });

      // CREATE NEW USER
      const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      // CHECK PASSWORD STRENGTH
      const passwordStrength = zxcvbn(
        req.body.password,
        (user_inputs = [req.body.firstName, req.body.lastName, req.body.email])
      );

      const passwordScore = passwordStrength.score;
      const passwordSuggestions = passwordStrength.feedback.suggestions;
      const passwordWarning = passwordStrength.feedback.warning;
      // console.log(
      //   `This is the score: ${passwordScore}, here is suggestions: ${passwordSuggestions} and here are the warnings: ${passwordWarning}`
      // );

      // GENERATE SALT
      bcrypt.genSalt(11, (err, salt) => {
        // HASH PASSWORD
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

module.exports = router;
