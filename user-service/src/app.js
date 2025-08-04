const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { getChannel } = require('./utils/eventPublisher');
const { startRateLimitCleanup } = require('./middleware/rateLimiter');
startRateLimitCleanup()
const cors = require('cors');
const v1Routes = require('./routes/v1/Users');
const v2Routes = require('./routes/v2/Users');

// Enable CORS
app.use(cors({ origin: 'http://localhost:3000' }));

// Middleware to parse JSON requests
app.use(express.json());

// Health endpoint
app.get('/health', async (_req, res) => {
    try {
        await mongoose.connection.db.admin().ping();
        await getChannel().checkQueue('health-check');
        return res.status(200).json({ status: 'ok', service: process.env.SERVICE_NAME });
    } catch (err) {
        return res.status(503).json({ status: 'error', service: process.env.SERVICE_NAME, details: err.message });
    }
});

// Routes
app.use('/api/v1/users', v1Routes);
app.use('/api/v2/users', v2Routes);

module.exports = app;