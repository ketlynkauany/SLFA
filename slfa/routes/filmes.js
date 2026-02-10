const express = require('express');
const router = express.Router();
const db = require('../bd');


function verificarLogin(req, res, next) {
  if (!req.session.usuario) {
    return res.redirect('/');
  }
  next();
}


router.get('/', verificarLogin, (req, res) => {
  const sql = `
    SELECT filme.id_filme, filme.titulo, filme.ano, filme.estrelas, categoria.nome_categoria
    FROM filme
    JOIN categoria ON filme.id_categoria = categoria.id_categoria
  `;

  db.query(sql, (err, results) => {
    res.render('filmes', {
      filmes: results,
      usuario: req.session.usuario
    });
  });
});


router.get('/novo', verificarLogin, (req, res) => {
  db.query('SELECT * FROM categoria', (err, categorias) => {
    res.render('novo-filme', { categorias });
  });
});


router.post('/novo', verificarLogin, (req, res) => {
  const { titulo, ano, id_categoria, estrelas, comentario } = req.body;

  const sql = `
    INSERT INTO filme (titulo, ano, id_categoria, estrelas, comentario)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [titulo, ano, id_categoria, estrelas, comentario], () => {
    res.redirect('/filmes');
  });
});


router.get('/delete/:id', verificarLogin, (req, res) => {
  db.query(
    'DELETE FROM filme WHERE id_filme = ?',
    [req.params.id],
    () => res.redirect('/filmes')
  );
});

module.exports = router;
