require("dotenv").config();
const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

let db;

async function connectDB() {
    try {
        await client.connect();
        db = client.db("MatchathonDB"); // Change this if your database has a different name
        console.log("Connected to MongoDB Atlas");
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
}

function getDB() {
    if (!db) {
        throw new Error("Database not initialized. Call connectDB first.");
    }
    return db;
}

module.exports = { connectDB, getDB };
