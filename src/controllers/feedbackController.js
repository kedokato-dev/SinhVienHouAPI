const Feedback = require('../models/feedback');
const feedbackService = require('../services/feedbacksService');

exports.createFeedback = async (req, res) => {
    const { email, message } = req.body;
    if (!email || !message) {
        return res.status(400).json({ success: false, message: 'Email and message are required.' });
    }
    const feedback = new Feedback({ email, message });
    const result = await feedbackService.saveFeedback(feedback);
    if (result.success) {
        res.status(201).json(result);
    } else {
        res.status(500).json(result);
    }
};

exports.getFeedbacksByEmail = async (req, res) => {
    const { email } = req.params;
    const result = await feedbackService.getFeedbacksByEmail(email);
    if (result.success) {
        res.json(result);
    } else {
        res.status(500).json(result);
    }
};

exports.getAllFeedbacks = async (req, res) => {
    const result = await feedbackService.getAllFeedbacks();
    if (result.success) {
        res.json(result);
    } else {
        res.status(500).json(result);
    }
};

exports.deleteFeedbackById = async (req, res) => {
    const { id } = req.params;
    const result = await feedbackService.deleteFeedbackById(id);
    if (result.success) {
        res.json(result);
    } else {
        res.status(500).json(result);
    }
};

exports.updateFeedbackById = async (req, res) => {
    const { id } = req.params;
    const newMessage = req.body;
    const result = await feedbackService.updateFeedbackById(id, newMessage);
    if (result.success) {
        res.json(result);
    } else {
        res.status(500).json(result);
    }
};