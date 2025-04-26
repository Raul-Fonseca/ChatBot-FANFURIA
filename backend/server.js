import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();
console.log('API KEY carregada:', process.env.OPENAI_API_KEY);


const app = express();
const port = 3000;

// CONFIGURAÇÃO DA API OPENAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Agora usando a variável corretamente
});

// MIDDLEWARES
app.use(cors());
app.use(express.json());

// ROTA PRINCIPAL
app.post('/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
    });

    res.json({ response: response.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao se comunicar com o OpenAI');
  }
});

// INICIA O SERVIDOR
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
