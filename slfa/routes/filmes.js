const express = require('express');
const router = express.Router();
const conexao = require('../bd');


// ================= LISTAR FILMES =================
router.get('/', (req, res) => {

    const sql = `
        SELECT filme.id_filme,
               filme.titulo,
               filme.ano,
               filme.estrelas,
               filme.comentario,
               categoria.nome_categoria AS categoria
        FROM filme
        LEFT JOIN categoria
        ON filme.id_categoria = categoria.id_categoria
    `;

    conexao.query(sql, (erro, resultados) => {
        if (erro) throw erro;
        res.render('filmes', { filmes: resultados });
    });
});


// ================= FORM NOVO FILME =================
router.get('/novo', (req, res) => {

    conexao.query('SELECT * FROM categoria', (erro, categorias) => {
        if (erro) throw erro;
        res.render('novo-filme', { categorias });
    });
});


// ================= INSERIR FILME =================
router.post('/novo', (req, res) => {

    const { titulo, ano, id_categoria, estrelas, comentario } = req.body;

    const sql = `
        INSERT INTO filme
        (titulo, ano, id_categoria, estrelas, comentario)
        VALUES (?, ?, ?, ?, ?)
    `;

    conexao.query(sql,
        [titulo, ano, id_categoria, estrelas, comentario],
        (erro) => {
            if (erro) throw erro;
            res.redirect('/filmes');
        }
    );
});


// ================= DELETAR FILME =================
router.get('/delete/:id', (req, res) => {

    const sql = 'DELETE FROM filme WHERE id_filme = ?';

    conexao.query(sql, [req.params.id], (erro) => {
        if (erro) throw erro;
        res.redirect('/filmes');
    });
});


module.exports = router;
