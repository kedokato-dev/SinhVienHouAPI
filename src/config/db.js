const { MongoClient } = require('mongodb');
require('dotenv').config();

let client;

async function connectDB() {
    if (!client) {
        client = new MongoClient(process.env.URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        await client.connect();
    }
    return client.db(); // trả về database mặc định
}

async function closeDB() {
    if (client) {
        await client.close();
        client = null;
    }
}

module.exports = { connectDB, closeDB };