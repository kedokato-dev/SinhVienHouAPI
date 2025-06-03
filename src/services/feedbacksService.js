const { ObjectId } = require('mongodb');
const { connectDB } = require('../config/db');

async function saveFeedback(feedback) {
    try {
        const db = await connectDB();
        const result = await db.collection('feedbacks').insertOne(feedback);
        return { success: true, insertedId: result.insertedId };
    } catch (error) {
        console.error('Error saving feedback:', error);
        return { success: false, message: error.message };
    }
}

async function getFeedbacksByEmail(email) {
    try {
        const db = await connectDB();
        const result = await db.collection('feedbacks').find({ email }).toArray();
        return { success: true, data: result };
    } catch (error) {
        console.error('Error fetching feedbacks by email:', error);
        return { success: false, message: error.message };
    }
}

async function getAllFeedbacks() {
    try {
        const db = await connectDB();
        const result = await db.collection('feedbacks').find({}).toArray();
        return { success: true, data: result };
    } catch (error) {
        console.error('Error fetching all feedbacks:', error);
        return { success: false, message: error.message };
    }
}

async function deleteFeedbackById(id) {
    try {
        const db = await connectDB();
        const result = await db.collection('feedbacks').deleteOne({ _id: new ObjectId(id) });
        return { success: true, deletedCount: result.deletedCount };
    } catch (error) {
        console.error('Error deleting feedback by id:', error);
        return { success: false, message: error.message };
    }
}

async function updateFeedbackById(id, newMessage) {
    try {
        const db = await connectDB();
        const result = await db.collection('feedbacks').updateOne(
            { _id: new ObjectId(id) },
            { $set: newMessage }
        );
        return { success: true, modifiedCount: result.modifiedCount };
    } catch (error) {
        console.error('Error updating feedback by id:', error);
        return { success: false, message: error.message };
    }
}

module.exports = {
    saveFeedback,
    getFeedbacksByEmail,
    getAllFeedbacks,
    deleteFeedbackById,
    updateFeedbackById
};