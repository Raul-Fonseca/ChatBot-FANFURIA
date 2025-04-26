const chatBox = document.getElementById('chatBox');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') sendMessage();
});

function appendMessage(sender, message) {
  const div = document.createElement('div');
  div.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const message = messageInput.value.trim();
  if (!message) return;

  appendMessage('Você', message);
  messageInput.value = '';

  try {
    const response = await fetch('http://localhost:3000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    if (!response.ok) throw new Error('Erro na resposta do servidor');

    const data = await response.json();
    appendMessage('Bot', data.response);
  } catch (error) {
    console.error(error);
    appendMessage('Erro', 'Não foi possível se comunicar com o servidor.');
  }
}

function sendQuickMessage(message) {
  messageInput.value = message;
  sendMessage();
}
