var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/homecoming3000', function(req, res, next) {
  res.render('Homecoming3000');
});


module.exports = router;
