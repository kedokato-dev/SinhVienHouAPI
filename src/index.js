const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // Import path module

// Cấu hình phục vụ file tĩnh

// Import các service
const { login } = require('./services/houCasService');
const { getProfile } = require('./services/sinhvienService');
const { getInfoStudent } = require('./services/infoStudentService');
const { getScore } = require('./services/scoreService');
const { getTrainingScoreDetails } = require('./services/trainingScoreService');
const { getWeekSchoolSchedule } = require('./services/weekSchoolScheduleService');
const { getExamSchedule } = require('./services/examScheduleService');
const { getListScore } = require('./services/listScoreService');
const { getDetailScore } = require('./services/detailScoreService');
const feedbackRouter = require('./routes/feedbackRouter');
const authRouter = require('./routes/authRouter');


const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// Routes
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

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});


app.use('/api/auth', authRouter);

app.use('/api/feedbacks', feedbackRouter);


module.exports = app;
