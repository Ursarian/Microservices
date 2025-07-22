const express = require('express');
const Product = require('../models/product'); // Import the model

const router = express.Router();

// GET all products
router.get('/all', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// GET product by ID
router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
});

// POST create product
router.post('/', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const saved = await newProduct.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
