
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const VERIFY_TOKEN = 'whatsappmakefinanzas_v2';
const MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/65j529mz5qikg5b4c1ykhw1jqhuz5vsf';

app.get('/', (req, res) => {
  const { 'hub.mode': mode, 'hub.verify_token': token, 'hub.challenge': challenge } = req.query;
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  res.sendStatus(400);
});

app.post('/', async (req, res) => {
  try {
    await axios.post(MAKE_WEBHOOK_URL, req.body);
    res.sendStatus(200);
  } catch (err) {
    console.error('Error forwarding to Make:', err);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy server listening on port ${PORT}`));
