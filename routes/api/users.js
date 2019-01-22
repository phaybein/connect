const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const zxcvbn = require('zxcvbn');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

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
  // CHECK PASSWORD STRENGTH
  const passwordStrength = zxcvbn(
    req.body.password,
    (user_inputs = [req.body.firstName, req.body.lastName, req.body.email])
  );

  // GRAB KEY ITEMS FOR VALIDATION
  const passwordScore = passwordStrength.score;
  const passwordSuggestions = passwordStrength.feedback.suggestions;
  const passwordWarning = passwordStrength.feedback.warning;

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
        firstName: req.body.firstName.toLowerCase(),
        lastName: req.body.lastName.toLowerCase(),
        email: req.body.email.toLowerCase(),
        avatar,
        password: req.body.password
      });

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

// @ROUTE GET API/USER/LOGIN
// @DESC LOGIN USER / RETURNING JWT TOKEN
// @ACCESS PUBLIC
router.post('/login', (req, res) => {
  const email = req.body.email.toLowerCase();
  const password = req.body.password;

  // FIND USER BY EMAIL
  User.findOne({ email }).then(user => {
    // CHECK FOR USER
    if (!user) {
      return res.status(404).json({ email: 'User not found' });
    }

    // CHECK PASSWORD
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // USER MATCHED

        // CREATE JWT PAYLOD
        const payload = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar
        };

        // SIGN TOKEN
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token
            });
          }
        );
      } else {
        return res.status(400).json({ password: 'password incorrect' });
      }
    });
  });
});

// @ROUTE GET API/USER/CURRENT
// @DESC RETURN CURRENT USER
// @ACCESS PRIVATE
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email
    });
  }
);

module.exports = router;
