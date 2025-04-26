const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

// "Banco de dados" simples em memória
let usuarios = {};

// Cadastrar novo usuário
app.post('/cadastrar', (req, res) => {
  const { usuario, senha } = req.body;
  if (!usuario || !senha) return res.status(400).send('Dados inválidos.');

  if (usuarios[usuario]) {
    return res.status(400).send('Usuário já existe.');
  }

  usuarios[usuario] = {
    senha,
    pontuacao: 0,
    album: []
  };

  res.send('Usuário cadastrado com sucesso!');
});

// Fazer login
app.post('/login', (req, res) => {
  const { usuario, senha } = req.body;
  if (!usuario || !senha) return res.status(400).send('Dados inválidos.');

  const dados = usuarios[usuario];
  if (!dados || dados.senha !== senha) {
    return res.status(401).send('Usuário ou senha incorretos.');
  }

  res.send('Login efetuado com sucesso!');
});

// Salvar pontuação e figurinha
app.post('/salvar-pontuacao', (req, res) => {
  const { usuario, pontos, figurinha } = req.body;
  if (!usuario || pontos == null) return res.status(400).send('Dados inválidos.');

  if (usuarios[usuario]) {
    usuarios[usuario].pontuacao = pontos;
    if (figurinha) {
      usuarios[usuario].album.push(figurinha);
    }
    res.send('Pontuação e álbum atualizados!');
  } else {
    res.status(404).send('Usuário não encontrado.');
  }
});

// Ver álbum
app.get('/album/:usuario', (req, res) => {
  const usuario = req.params.usuario;
  if (usuarios[usuario]) {
    res.json(usuarios[usuario].album);
  } else {
    res.status(404).send('Usuário não encontrado.');
  }
});

// Ver ranking
app.get('/ranking', (req, res) => {
  const ranking = Object.keys(usuarios)
    .map(usuario => ({
      usuario,
      pontuacao: usuarios[usuario].pontuacao
    }))
    .sort((a, b) => b.pontuacao - a.pontuacao);

  res.json(ranking);
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor rodando em: http://localhost:${port}`);
});