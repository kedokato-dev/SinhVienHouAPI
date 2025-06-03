const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

router.post('/', authenticateToken, feedbackController.createFeedback);
router.get('/', authenticateToken, isAdmin, feedbackController.getAllFeedbacks);
router.get('/:email', authenticateToken, feedbackController.getFeedbacksByEmail);
router.delete('/:id', authenticateToken, feedbackController.deleteFeedbackById);
router.put('/:id', authenticateToken, feedbackController.updateFeedbackById);

module.exports = router;