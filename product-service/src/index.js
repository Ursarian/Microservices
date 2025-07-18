require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('./db');

const productRoutes = require('./routes/products');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/products', productRoutes);

const PORT = process.env.PORT || 2901;
app.listen(PORT, () => {
    console.log(`Product service running on port ${PORT}`);
});