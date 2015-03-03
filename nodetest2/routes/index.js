var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET react frontend. */
router.get('/react', function(req, res, next) {
  res.render('react');
});

module.exports = router;
