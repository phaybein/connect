const express = require('express');
const router = express.Router();

// @ROUTE GET API/PROFILE/TEST
// @DESC TESTS PROFILE ROUTE
// @ACCESS PUBLIC
router.get('/test', (req, res) => {
  res.json({
    msg: 'Profile works'
  });
});

module.exports = router;
