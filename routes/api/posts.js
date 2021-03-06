const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//  BRING IN MODELS
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

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

// @ROUTE GET API/POSTS
// @DESC GET ALL POSTS
// @ACCESS PUBLIC
router.get('/', (req, res) => {
  Post.find()
    .sort({
      date: -1
    })
    .then(posts => res.json(posts))
    .catch(err =>
      res.status(404).json({ posts: 'Could not locate any posts' })
    );
});

// @ROUTE GET API/POSTS/:ID
// @DESC GET SINGLE POSTS BY ID
// @ACCESS PUBLIC
router.get('/:id', (req, res) => {
  const errors = {};
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ post: 'Could not locate post with that ID' })
    );
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

// @ROUTE DELETE API/POSTS/:ID
// @DESC DELETE SPECIFIC POSTS
// @ACCESS PRIVATE
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({
      user: req.user.id
    }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // CHECK FOR POST OWNER
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notAuthorized: 'User is not authorized' });
          }

          // DELETE
          post.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ postNotFound: 'No post found' }));
    });
  }
);

// @ROUTE POST API/POSTS/LIKE/:ID
// @DESC LIKE POST
// @ACCESS PRIVATE
router.post(
  '/like/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({
      user: req.user.id
    }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // CHECK IF USER ALREADY LIKED POST
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyLiked: 'User already liked this post' });
          }

          // ADD USER ID TO LIKES ARRAY
          post.likes.push({ user: req.user.id });

          // SAVE
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postNotFound: 'No post found' }));
    });
  }
);

// @ROUTE POST API/POSTS/UNLIKE/:ID
// @DESC UNLIKE POST
// @ACCESS PRIVATE
router.post(
  '/unlike/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({
      user: req.user.id
    }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // CHECK IF USER ALREADY LIKED POST
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notLiked: 'You have not yet liked this post' });
          }

          // GET INDEX TO REMOVE
          const removeIndex = post.likes
            .map(like => like.user.toString())
            .indexOf(req.user.id);

          // SPLICE OUT INDEX OF ARRAY
          post.likes.splice(removeIndex, 1);

          // SAVE
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postNotFound: 'No post found' }));
    });
  }
);

// @ROUTE POST API/POSTS/COMMENT/:ID
// @DESC ADD A COMMENT TO POST
// @ACCESS PRIVATE
router.post(
  '/comment/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // RUN INFORMATION THROUGH VALIDATION
    const { errors, isValid } = validatePostInput(req.body);

    // CHECK VALIDATION
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        // ADD TO COMMENTS ARRAY
        post.comments.push(newComment);

        // SAVE
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postNotFound: 'No post found' }));
  }
);

// @ROUTE DELETE API/POSTS/COMMENT/:ID/:COMMENT_ID
// @DESC DELETE A COMMENT FROM POST
// @ACCESS PRIVATE
router.delete(
  '/comment/:id/:comment_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        // VERIFY COMMENT EXISTS
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentDoesNotExist: 'Comment does not exist' });
        }

        // GET REMOVE INDEX
        const removeIndex = post.comments
          .map(comment => comment._id.toString())
          .indexOf(req.params.comment_id);

        // SPLICE COMMENT OUT OF ARRAY
        post.comments.splice(removeIndex, 1);

        // SAVE
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postNotFound: 'No post found' }));
  }
);

module.exports = router;
