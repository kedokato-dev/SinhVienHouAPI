const express = require('express');
const bodyParser = require('body-parser');
const { login } = require('./services/houCasService');
const { getProfile } = require('./services/sinhvienService');
const { getInfoStudent } = require('./services/infoStudentService');
const { getScore } = require('./services/ScoreService');
const { getTrainingScoreDetails } = require('./services/trainingScoreService');
const { getWeekSchoolSchedule } = require('./services/weekSchoolScheduleService');
const { getExamSchedule } = require('./services/examScheduleService');
const { getListScore } = require('./services/ListScoreService');
const { getDetailScore } = require('./services/detailScoreService');

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

app.get('/api/info-student', async (req, res) => {
  const { sessionId } = req.query;
  const result = await getInfoStudent(sessionId);
  res.json(result);
});

app.get('/api/score', async (req, res) => {
  const { sessionId } = req.query;
  const result = await getScore(sessionId);
  res.json(result);
});

app.get('/api/training-score', async (req, res) => {
  const { sessionId } = req.query;
  const result = await getTrainingScoreDetails(sessionId);
  res.json(result);
});

app.get('/api/week-school-schedule', async (req, res) => {
  const { sessionId, weekValue } = req.query;
  const result = await getWeekSchoolSchedule(sessionId, weekValue);
  res.json(result);
});

app.get('/api/exam-schedule', async (req, res) => {
  const { sessionId } = req.query;
  const result = await getExamSchedule(sessionId);
  res.json(result);
});

app.get('/api/list-score', async (req, res) => {
  const { sessionId } = req.query;
  const result = await getListScore(sessionId);
  res.json(result);
});

app.get('/api/detail-score', async (req, res) => {
  const { sessionId, subjectId } = req.query;
  const result = await getDetailScore(sessionId, subjectId);
  res.json(result);
});

// app.listen(PORT, () => {
//   console.log(`✅ Server chạy tại http://localhost:${PORT}`);
// });

module.exports = app; 
