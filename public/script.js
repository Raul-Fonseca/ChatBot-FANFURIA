// Bot FURIA melhorado por completo

let quizPerguntas = [
  { pergunta: "Em que ano a FURIA foi fundada?", resposta: "2017" },
  { pergunta: "Qual é o nome do coach da equipe de CS:GO?", resposta: "Guerri" },
  { pergunta: "Qual jogador é conhecido como 'KSCERATO'?", resposta: "Kaike Cerato" },
  { pergunta: "Qual time brasileiro é rival direto da FURIA?", resposta: "Imperial" },
  { pergunta: "Qual era a cor original do uniforme da FURIA?", resposta: "Preto" },
  { pergunta: "Qual torneio internacional a FURIA chegou às semifinais em 2022?", resposta: "IEM Rio Major" },
  { pergunta: "Quem é o capitão atual da equipe?", resposta: "Yuurih" },
  { pergunta: "Qual é o animal que representa o mascote da FURIA?", resposta: "Pantera" },
  { pergunta: "Qual jogador da FURIA é conhecido por sua mira precisa?", resposta: "Art" },
  { pergunta: "Qual plataforma transmite os jogos da FURIA?", resposta: "Twitch" }
];

let usuarioAtual = null;
let perguntasSelecionadas = [];
let perguntaAtual = 0;
let acertos = 0;
let album = [];
let pontuacoes = [];

function sendMessage() {
  const input = document.getElementById('userInput');
  const text = input.value.trim();
  if (text !== '') {
    appendMessage(text, 'user');
    input.value = '';
    handleOption(text.toLowerCase());
  }
}

async function fazerLogin() {
  const usuario = prompt("Digite seu usuário:");
  const senha = prompt("Digite sua senha:");

  const res = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario, senha })
  });

  if (res.ok) {
    usuarioAtual = usuario;
    appendMessage("🔓 Login efetuado! Seja bem-vindo, " + usuarioAtual + "!", 'bot');
  } else {
    appendMessage("❌ Falha no login. Verifique usuário e senha.", 'bot');
  }
}

async function cadastrarUsuario() {
  const usuario = prompt("Crie seu usuário:");
  const senha = prompt("Crie sua senha:");

  const res = await fetch('/cadastrar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario, senha })
  });

  if (res.ok) {
    appendMessage("✅ Usuário cadastrado com sucesso! Agora faça login.", 'bot');
  } else {
    appendMessage("❌ Não foi possível cadastrar: " + await res.text(), 'bot');
  }
}


function appendMessage(message, sender) {
  const chat = document.getElementById('chat');
  const msg = document.createElement('div');
  msg.className = 'message ' + sender;
  msg.innerHTML = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

function handleOption(opcao) {
  if (perguntasSelecionadas.length > 0 && perguntaAtual < perguntasSelecionadas.length) {
    const correta = perguntasSelecionadas[perguntaAtual].resposta.toLowerCase();
    if (opcao.trim() === correta) {
      acertos++;
      appendMessage("✅ Acertou!", 'bot');
      new Audio("https://www.fesliyanstudios.com/play-mp3/387").play();
    } else {
      appendMessage(`❌ Errou. A resposta certa era: <strong>${correta}</strong>`, 'bot');
    }
    perguntaAtual++;
    fazerPergunta();
    return;
  }

  if (opcao.includes('notícia')) {
    appendMessage('📰 Mostrando últimas notícias da FURIA... (em breve)', 'bot');
  } else if (opcao.includes('agenda')) {
    appendMessage('📅 Agenda será adicionada em breve!', 'bot');
  } else if (opcao.includes('resultado')) {
    appendMessage('📊 Resultados da FURIA vindo aí!', 'bot');
  } else if (opcao.includes('jogadores')) {
    appendMessage('🧑‍💻 Lineup da FURIA: Yuurih, KSCERATO, Art, Guerri (coach)', 'bot');
  } else if (opcao.includes('quiz')) {
    iniciarQuiz();
  } else if (opcao.includes('álbum') || opcao.includes('figurinha')) {
    mostrarAlbum();
  } else if (opcao.includes('ranking')) {
    mostrarRanking();
  } else {
    handleFallback(opcao);
  }
}

function iniciarQuiz() {
  perguntasSelecionadas = quizPerguntas.sort(() => 0.5 - Math.random()).slice(0, 5);
  perguntaAtual = 0;
  acertos = 0;
  appendMessage("🎮 Quiz iniciado! Responda as perguntas:", 'bot');
  fazerPergunta();
}

function fazerPergunta() {
  if (perguntaAtual < perguntasSelecionadas.length) {
    const q = perguntasSelecionadas[perguntaAtual];
    appendMessage(`❓ Pergunta ${perguntaAtual + 1}: ${q.pergunta}`, 'bot');
  } else {
    finalizarQuiz();
  }
}

function finalizarQuiz() {
  const score = (acertos / perguntasSelecionadas.length) * 100;
  appendMessage(`🏁 Fim do quiz! Você acertou ${acertos} de ${perguntasSelecionadas.length} (${score.toFixed(0)}%)`, 'bot');
  salvarPontuacao(score);

  if (score >= 80) {
    const figurinha = `<div class='figurinha'><img src='figura1.png.png' alt='Figurinha FURIA'></div>`;
    album.push(figurinha);
    appendMessage(`🎉 Figurinha desbloqueada:<br>${figurinha}`, 'bot');
  } else {
    appendMessage("🙁 Você precisa acertar ao menos 80% para ganhar figurinha.", 'bot');
  }

  perguntasSelecionadas = [];
}

function salvarPontuacao(score) {
  if (!usuarioAtual) {
    appendMessage("🔒 Faça login primeiro para salvar pontuação.", 'bot');
    return;
  }

  const desbloqueouFigurinha = score >= 80 ? 'figura1.png.png' : null;

  fetch('/salvar-pontuacao', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      usuario: usuarioAtual,
      pontos: score,
      figurinha: desbloqueouFigurinha
    })
  })
  .then(res => res.text())
  .then(msg => console.log(msg))
  .catch(error => console.error('Erro ao salvar:', error));
}


function mostrarRanking() {
  fetch('/ranking')
    .then(response => response.json())
    .then(ranking => {
      if (ranking.length === 0) {
        appendMessage("📉 Ainda não há rankings salvos.", 'bot');
      } else {
        let rank = "<strong>🏆 Ranking dos jogadores:</strong><br>";
        ranking.forEach((item, index) => {
          rank += `#${index + 1}: ${item.usuario} - ${item.pontos.toFixed(0)}%<br>`;
        });
        appendMessage(rank, 'bot');
      }
    })
    .catch(error => {
      console.error('Erro ao buscar ranking:', error);
      appendMessage("❌ Não consegui carregar o ranking.", 'bot');
    });
}


function mostrarAlbum() {
  if (!usuarioAtual) {
    appendMessage("🔒 Faça login primeiro para ver seu álbum.", 'bot');
    return;
  }

  fetch(`/album/${usuarioAtual}`)
    .then(response => response.json())
    .then(album => {
      if (album.length === 0) {
        appendMessage("📭 Você ainda não desbloqueou nenhuma figurinha.", 'bot');
      } else {
        let figurinhasHTML = album.map(fig => `<div class='figurinha'><img src='${fig}' alt='Figurinha'></div>`).join('');
        appendMessage("<strong>📚 Seu álbum:</strong><br>" + figurinhasHTML, 'bot');
      }
    })
    .catch(error => {
      console.error('Erro ao buscar álbum:', error);
      appendMessage("❌ Não consegui carregar o álbum.", 'bot');
    });
}


async function handleFallback(pergunta) {
  appendMessage('🤖 Pensando...', 'bot');
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Você é um bot da FURIA divertido, responde com emojis, piadas e entusiasmo.' },
          { role: 'user', content: pergunta }
        ]
      })
    });
    const data = await res.json();
    appendMessage(data.choices[0].message.content, 'bot');
  } catch (err) {
    appendMessage("😵 Não consegui me conectar com a OpenAI.", 'bot');
  }
}

function iniciarBot() {
  appendMessage("🐆 Bem-vindo ao Bot FURIA! Digite um comando ou clique nos botões. 😎", 'bot');
}




window.onload = iniciarBot;
