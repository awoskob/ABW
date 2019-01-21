var express = require('express');
var router = express.Router();

router.get('/groupwork', function(req, res, next) {
  res.render('groupwork');
});

router.get('/groupwork/undercooked', function(req, res, next) {
  res.render('project');
});
router.get('/groupwork/lemmingsinvr', function(req, res, next) {
  res.render('project');
});
router.get('/groupwork/woowho', function(req, res, next) {
  res.render('woowho');
});
router.get('/groupwork/extraterrestrialclunker', function(req, res, next) {
  res.render('project');
});
router.get('/groupwork/gamejampgh', function(req, res, next) {
  res.render('project');
});
router.get('/groupwork/cookandruin', function(req, res, next) {
  res.render('cookandruin');
});
router.get('/groupwork/pollennation', function(req, res, next) {
  res.render('project');
});
router.get('/groupwork/duckfalls', function(req, res, next) {
  res.render('project');
});
router.get('/groupwork/chroma', function(req, res, next) {
  res.render('project');
});
router.get('/groupwork/band', function(req, res, next) {
  res.render('band');
});
router.get('/groupwork/woodlandwarriors', function(req, res, next) {
  res.render('project');
});
router.get('/groupwork/hanselandgretel', function(req, res, next) {
  res.render('project');
});
router.get('/groupwork/punchbuggy', function(req, res, next) {
  res.render('project');
});

router.get('/solowork', function(req, res, next) {
  res.render('solowork');
});

router.get('/solowork/youresofine', function(req, res, next) {
  res.render('ursofine');
});
router.get('/solowork/proceduralanimation', function(req, res, next) {
  res.render('proceduralanimation');
});
router.get('/solowork/machinelearningunity', function(req, res, next) {
  res.render('project');
});
router.get('/solowork/prokofiev7', function(req, res, next) {
  res.render('prokofiev');
});
router.get('/solowork/gravitysound', function(req, res, next) {
  res.render('gravitysound');
});
router.get('/solowork/birdcycle', function(req, res, next) {
  res.render('project');
});
router.get('/solowork/goldmarkviolin', function(req, res, next) {
  res.render('goldmark');
});

module.exports = router;
