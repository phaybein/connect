const express = require('express');
const router = express.Router();

// @ROUTE GET API/POSTS/TEST
// @DESC TESTS POST ROUTE
// @ACCESS PUBLIC
router.get('/test', (req, res) => {
  res.json({
    msg: 'Posts works'
  });
});

module.exports = router;
