const express = require('express');
const router = express.Router();
const db = require('../bd');
const bcrypt = require('bcrypt');

// LOGIN (página)
router.get('/', (req, res) => {
  res.render('index', { erro: null });
});

// CADASTRO (página)
router.get('/cadastro', (req, res) => {
  res.render('login', { erro: null });
});

// CADASTRO (ação)
router.post('/cadastro', async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.render('login', { erro: 'Preencha todos os campos' });
  }

  try {
    const hash = await bcrypt.hash(senha, 10);

    const sql = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
    db.query(sql, [nome, email, hash], (err) => {
      if (err) {
        return res.render('login', { erro: 'E-mail já cadastrado' });
      }
      res.redirect('/');
    });
  } catch (error) {
    res.status(500).send('Erro interno');
  }
});

// LOGIN (ação)
router.post('/login', (req, res) => {
  const { email, senha } = req.body;

  const sql = 'SELECT * FROM usuarios WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err || results.length === 0) {
      return res.render('index', { erro: 'Usuário não encontrado' });
    }

    const usuario = results[0];
    const ok = await bcrypt.compare(senha, usuario.senha);

    if (!ok) {
      return res.render('index', { erro: 'Senha incorreta' });
    }

    req.session.usuario = {
      id: usuario.id,
      nome: usuario.nome
    };

    res.redirect('/filmes');
  });
});

// LOGOUT
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
