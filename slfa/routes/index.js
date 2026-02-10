var express = require('express');
var router = express.Router();

const bcrypt = require("bcrypt");   // ⭐ ADICIONE ISSO
const db = require('../bd');



function verificarLogin(req,res,next){

  if(!req.session.usuario){
    return res.send(`
    <h2>🔒 Você precisa fazer login</h2>
    <a href="/login">Ir para login</a>
    `);
  }

  next();
}


// HOME
router.get('/', function(req, res) {
  res.render('index');
});

// PAGINA CADASTRO
router.get('/cadastro', function(req, res) {
  res.render('login');
});


// =============================
// CADASTRAR USUÁRIO
// =============================
router.post("/cadastro", async (req,res)=>{

  const { nome, email, senha } = req.body;

  const hash = await bcrypt.hash(senha, 10);

  db.query(
    "INSERT INTO usuarios (nome,email,senha) VALUES (?,?,?)",
    [nome,email,hash],
    (err)=>{
      if(err) return res.send("Erro ao cadastrar");

      req.session.msg = "Login criado com sucesso!";
      res.redirect("/filmes");
    }
  );
});



router.post("/login",(req,res)=>{

  const { email, senha } = req.body;

  db.query(
    "SELECT * FROM usuarios WHERE email=?",
    [email],
    async (err,results)=>{

      if(results.length === 0)
        return res.send("Usuário não encontrado");

      const user = results[0];

      const ok = await bcrypt.compare(senha, user.senha);

      if(!ok)
        return res.send("Senha incorreta");

      req.session.usuario = user;
      res.redirect("/filmes");
    }
  );
});

router.get("/filmes", verificarLogin, (req,res)=>{

  let mensagem = req.session.msg || "";
  req.session.msg = null;

  res.send(`
    <h2>Bem-vinda, ${req.session.usuario.nome}</h2>
    <p>${mensagem}</p>
    <p>Aqui ficam os filmes 🎬</p>
  `);
});




module.exports = router;
