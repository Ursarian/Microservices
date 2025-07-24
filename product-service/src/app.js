const express = require('express');
const app = express();
const productRoutes = require('./routes/Products');
const cors = require('cors');

// Enable CORS
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);

module.exports = app;
