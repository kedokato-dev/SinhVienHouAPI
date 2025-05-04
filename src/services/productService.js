const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

async function addProduct(data) {
    const client = new MongoClient(process.env.URI);
    try {
        await client.connect();
        const database = client.db();
        const products = database.collection('products');

        const result = await products.insertOne(data);
        return { success: true, insertedId: result.insertedId };
    } catch (error) {
        console.error('Error adding product:', error);
        return { success: false, message: error.message };
    } finally {
        await client.close();
    }
}

async function updateProduct(id, data) {
    const client = new MongoClient(process.env.URI);
    try {
        await client.connect();
        const database = client.db();
        const products = database.collection('products');

        const result = await products.updateOne({ _id: new ObjectId(id) }, { $set: data });
        return { success: true, modifiedCount: result.modifiedCount };
    } catch (error) {
        console.error('Error updating product:', error);
        return { success: false, message: error.message };
    } finally {
        await client.close();
    }
}

async function deleteProduct(id) {
    const client = new MongoClient(process.env.URI);
    try {
        await client.connect();
        const database = client.db();
        const products = database.collection('products');

        const result = await products.deleteOne({ _id: new ObjectId(id) });
        return { success: true, deletedCount: result.deletedCount };
    } catch (error) {
        console.error('Error deleting product:', error);
        return { success: false, message: error.message };
    } finally {
        await client.close();
    }
}

async function getProductById(id) {
    const client = new MongoClient(process.env.URI);
    try {
        await client.connect();
        const database = client.db();
        const products = database.collection('products');

        const product = await products.findOne({ _id: new ObjectId(id) });
        return { success: true, data: product };
    } catch (error) {
        console.error('Error fetching product by id:', error);
        return { success: false, message: error.message };
    } finally {
        await client.close();
    }
}

module.exports = {
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
};