const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const VERIFY_TOKEN = 'whatsappmakefinanzas_v2'; // debe ser EXACTAMENTE igual al de Meta
const MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/tu_webhook'; // tu URL real de Make

app.get('/webhook', (req, res) => {
  const { 'hub.mode': mode, 'hub.verify_token': token, 'hub.challenge': challenge } = req.query;

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('🟢 Webhook verificado correctamente');
    return res.status(200).send(challenge);
  }

  console.log('🔴 Verificación fallida');
  res.sendStatus(403);
});

app.post('/webhook', async (req, res) => {
  try {
    await axios.post(MAKE_WEBHOOK_URL, req.body);
    res.sendStatus(200);
  } catch (err) {
    console.error('Error al enviar a Make:', err);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Proxy server listening on port ${PORT}`));
