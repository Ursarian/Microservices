const express = require('express');
const app = express();
const cors = require('cors');
const { startRateLimitCleanup } = require('./middleware/rateLimiter');
startRateLimitCleanup()
const v1Routes = require('./routes/v1/Products');
const v2Routes = require('./routes/v2/Products');

// Enable CORS
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use('/api/v1/products', v1Routes);
app.use('/api/v2/products', v2Routes);

// Fallback limiter for everything else
app.use(rateLimiterFallback);

module.exports = app;
