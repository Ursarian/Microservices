const express = require('express');
const app = express();
const userRoutes = require('./routes/Users');
const cors = require('cors');

// Enable CORS
app.use(cors({
    origin: 'http://localhost:3000'
}));

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

module.exports = app;