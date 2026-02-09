const express = require('express');
const router = express.Router();
const conexao = require('../db'); // ajuste se seu caminho for diferente

// LISTAR FILMES
router.get('/', (req, res) => {

    const sql = `
        SELECT filme.id,
               filme.titulo,
               filme.ano,
               filme.rating,
               filme.comentario,
               categoria.nome_categoria AS categoria
        FROM filme
        LEFT JOIN categoria
        ON filme.id_categoria = categoria.id
    `;

    conexao.query(sql, (erro, resultados) => {
        if (erro) throw erro;
        res.render('index', { filmes: resultados });
    });
});


// FORMULÁRIO NOVO FILME
router.get('/novo', (req, res) => {

    conexao.query('SELECT * FROM categoria', (erro, categorias) => {
        if (erro) throw erro;

        res.render('novo-filme', { categorias });
    });
});


// INSERIR FILME
router.post('/novo', (req, res) => {

    const { titulo, ano, id_categoria, rating, comentario } = req.body;

    const sql = `
        INSERT INTO filme
        (titulo, ano, id_categoria, rating, comentario)
        VALUES (?, ?, ?, ?, ?)
    `;

    conexao.query(sql,
        [titulo, ano, id_categoria, rating, comentario],
        (erro) => {
            if (erro) throw erro;
            res.redirect('/filmes');
        }
    );
});


// DELETAR FILME
router.get('/delete/:id', (req, res) => {

    const sql = 'DELETE FROM filme WHERE id = ?';

    conexao.query(sql, [req.params.id], (erro) => {
        if (erro) throw erro;
        res.redirect('/filmes');
    });
});

module.exports = router;

