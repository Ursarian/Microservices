const mongoose = require('mongoose');
const logger = require('./utils/logger');

// MongoDB Connection
function connectToDatabase() {
    return mongoose.connect(process.env.MONGO_URI)
        .then(() => logger.info('Connected to MongoDB'))
        .catch(err => logger.error('MongoDB connection error:', { error: err.message }));
}

module.exports = connectToDatabase;