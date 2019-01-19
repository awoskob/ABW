var express = require('express');
var router = express.Router();

router.get('/groupwork', function(req, res, next) {
  res.render('work');
});

router.get('/solowork', function(req, res, next) {
  res.render('work');
});

module.exports = router;
