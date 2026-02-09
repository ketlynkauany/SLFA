var express = require('express');
var router = express.Router();

/* Rota principal usando a view index.ejs. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Rota “sobre” sem usar uma view. */
router.get('/meu-endpoint', function(req, res) {
  let msg = '<h2>Meu primeiro endpoint...</h2>';
  res.send(msg);
});

module.exports = router;
