const mongoose = require('mongoose');
const logger = require('./utils/logger');

// MongoDB Connection
async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await mongoose.connection.asPromise();
        logger.info('Connected to MongoDB');
        return mongoose;
    } catch (err) {
        logger.error('MongoDB connection error:', { error: err.message });
        throw err;
    }
}

module.exports = connectToDatabase;