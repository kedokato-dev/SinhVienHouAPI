const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

async function saveFeedback(feedback) {
    const client = new MongoClient(process.env.URI);
    try {
        await client.connect();
        const database = client.db();
        const feedbacks = database.collection('feedbacks');

        
        const result = await feedbacks.insertOne(feedback);
        return { success: true, insertedId: result.insertedId };
    } catch (error) {
        console.error('Error saving feedback:', error);
        return { success: false, message: error.message };
    } finally {
        await client.close();
    }
}

async function getFeedbacksByEmail(email) {
    const client = new MongoClient(process.env.URI);
    try {
        await client.connect();
        const database = client.db(); 
        const feedbacks = database.collection('feedbacks');

       
        const result = await feedbacks.find({ email }).toArray();
        return { success: true, data: result };
    } catch (error) {
        console.error('Error fetching feedbacks by email:', error);
        return { success: false, message: error.message };
    } finally {
        await client.close();
    }
}

async function deleteFeedbackById(id) {
    const client = new MongoClient(process.env.URI);
    try {
        await client.connect();
        const database = client.db();
        const feedbacks = database.collection('feedbacks');

        // Chuyển đổi id sang ObjectId
        const result = await feedbacks.deleteOne({ _id: new ObjectId(id) });
        return { success: true, deletedCount: result.deletedCount };
    } catch (error) {
        console.error('Error deleting feedback by id:', error);
        return { success: false, message: error.message };
    } finally {
        await client.close();
    }
}

async function updateFeedbackById(id, newMessage) {
    const client = new MongoClient(process.env.URI);
    try {
        await client.connect();
        const database = client.db();
        const feedbacks = database.collection('feedbacks');

        // Chuyển đổi id sang ObjectId
        const result = await feedbacks.updateOne({ _id: new ObjectId(id) }, { $set: newMessage });
        return { success: true, modifiedCount: result.modifiedCount };
    } catch (error) {
        console.error('Error updating feedback by id:', error);
        return { success: false, message: error.message };
    } finally {
        await client.close();
    }
}
module.exports = { 
    saveFeedback, 
    getFeedbacksByEmail, 
    deleteFeedbackById, 
    updateFeedbackById 
};