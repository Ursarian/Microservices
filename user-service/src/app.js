const express = require('express');
const app = express();
const cors = require('cors');
const { startRateLimitCleanup } = require('./middleware/rateLimiter');
startRateLimitCleanup()
const v1Routes = require('./routes/v1/Users');
const v2Routes = require('./routes/v2/Users');

// Enable CORS
app.use(cors({
    origin: 'http://localhost:3000'
}));

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use('/api/v1/users', v1Routes);
app.use('/api/v2/users', v2Routes);

module.exports = app;