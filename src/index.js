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
const { saveFeedback } = require('./services/feedBacksService');
const { getFeedbacksByEmail, deleteFeedbackById, updateFeedbackById } = require('./services/feedBacksService');
const { addProduct, updateProduct, deleteProduct, getProductById, getAllProducts } = require('./services/productService');


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


// Feedback route

app.post('/api/feedback', async (req, res) => {
  const { name, email, message } = req.body;

  const feedback = {
    name,
    email,
    message,
    createdAt: new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
  };

  const result = await saveFeedback(feedback);
  if (result.success) {
    res.status(201).json({ success: true, message: 'Feedback submitted successfully', id: result.insertedId });
  } else {
    res.status(500).json({ success: false, message: 'Failed to save feedback' });
  }
});


app.get('/api/feedback', async (req, res) => {
  const { email } = req.query;
  const result = await getFeedbacksByEmail(email);
  if (result.success) {
    res.status(200).json({ success: true, data: result.data });
  } else {
    res.status(500).json({ success: false, message: 'Failed to fetch feedbacks' });
  }
});

app.delete('/api/feedback', async (req, res) => {
  const { id } = req.query;

  // if (!id) {
  //   return res.status(400).json({ success: false, message: 'Feedback ID is required' });
  // }

  try {
    const result = await deleteFeedbackById(id);

    if (result.deletedCount > 0) {
      res.status(200).json({ success: true, message: 'Feedback deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Feedback not found' });
    }
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ success: false, message: 'Failed to delete feedback', error: error.message });
  }
});

app.put('/api/feedback', async (req, res) => {
  const { id, newMessage } = req.body;

  if (!id || !newMessage) {
    return res.status(400).json({ success: false, message: 'Feedback ID and new message are required' });
  }

  try {
    const result = await updateFeedbackById(id, { message: newMessage });

    if (result.modifiedCount > 0) {
      res.status(200).json({ success: true, message: 'Feedback updated successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Feedback not found or no changes made' });
    }
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).json({ success: false, message: 'Failed to update feedback', error: error.message });
  }
});


module.exports = app;
