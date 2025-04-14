const express = require('express');
const bodyParser = require('body-parser');
const { login } = require('./services/houCasService');
const { getProfile } = require('./services/sinhvienService');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const result = await login(username, password);
  res.json(result);
});

app.get('/api/profile', async (req, res) => {
    const { sessionId } = req.query;
    const result = await getProfile(sessionId);
    res.json(result);
  });
  

app.listen(PORT, () => {
  console.log(`✅ Server chạy tại http://localhost:${PORT}`);
});
