var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('blog');
});

router.get('/post2', function(req, res, next) {
  res.render('blog2');
});

router.get('/post3', function(req, res, next) {
  res.render('blog3');
});

router.get('/post4', function(req, res, next) {
  res.render('blog4');
});


module.exports = router;
