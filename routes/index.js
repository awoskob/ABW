var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/homecoming3000', function(req, res, next) {
  res.render('Homecoming3000');
});

router.get('/dice/generator', function(req, res, next) {
  res.render('diceAbout');
});

router.get('/dice/column', function(req, res, next) {
  res.render('diceC');
});

router.get('/dice/boxandwhisker', function(req, res, next) {
  res.render('diceBW2');
});

module.exports = router;
