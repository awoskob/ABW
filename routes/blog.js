var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('blog');
});

router.get('/post2', function(req, res, next) {
  res.render('blog2');
});

module.exports = router;
