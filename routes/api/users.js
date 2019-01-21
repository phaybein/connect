const express = require('express');
const router = express.Router();

// @ROUTE GET API/USER/TEST
// @DESC TESTS USER ROUTE
// @ACCESS PUBLIC
router.get('/test', (req, res) => {
  res.json({
    msg: 'Users works'
  });
});

module.exports = router;
