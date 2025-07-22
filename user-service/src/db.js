const mongoose = require('mongoose');

// MongoDB Connection
function connectToDatabase() {
    return mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.error('MongoDB connection error:', err));
}

module.exports = connectToDatabase;