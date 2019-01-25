const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//  BRING IN POST MODEL
const Post = require('../../models/Post');

// BRING IN VALIDATION
const validatePostInput = require('../../validation/post');

// @ROUTE GET API/POSTS/TEST
// @DESC TESTS POST ROUTE
// @ACCESS PUBLIC
router.get('/test', (req, res) => {
  res.json({
    msg: 'Posts works'
  });
});

// @ROUTE POST API/POSTS
// @DESC CREATE POSTS
// @ACCESS PRIVATE
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // RUN INFORMATION THROUGH VALIDATION
    const { errors, isValid } = validatePostInput(req.body);

    // CHECK VALIDATION
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      avatar: req.body.avatar,
      user: req.user.id
    });

    // SAVE POST
    newPost.save().then(post => res.json(post));
  }
);

module.exports = router;
