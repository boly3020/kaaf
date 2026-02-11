const mongoose = require('mongoose');

const getMongoURI = () => {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URL || process.env.DATABASE_URL;
    if (!uri) {
        console.error('No MongoDB connection string found. Set MONGODB_URI, MONGO_URL, or DATABASE_URL.');
        process.exit(1);
    }
    return uri;
};

const connectDB = async () => {
    try {
        const uri = getMongoURI();
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`MongoDB connection error: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
