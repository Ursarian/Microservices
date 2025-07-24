const express = require('express');
const Product = require('../models/product');
const logger = require('../utils/logger');

const router = express.Router();

// GET all products
router.get('/all', async (req, res) => {
    try {
        const products = await Product.find();
        logger.info('Fetched all products', { count: products.length });
        res.status(200).json(products);
    } catch (err) {
        logger.error('Failed to fetch all products', { error: err.message });
        res.status(500).json({ error: 'Server error while fetching products' });
    }
});

// GET product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            logger.warn('Product not found', { productId: req.params.id });
            return res.status(404).json({ error: 'Product not found' });
        }
        logger.info('Fetched product by ID', { productId: req.params.id });
        res.status(200).json(product);
    } catch (err) {
        logger.error('Failed to fetch product by ID', { productId: req.params.id, error: err.message });
        res.status(400).json({ error: 'Invalid product ID' });
    }
});

// POST create product
router.post('/', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const saved = await newProduct.save();
        logger.info('Product created', { productId: saved._id });
        res.status(201).json(saved);
    } catch (err) {
        logger.error('Failed to create product', { error: err.message });
        res.status(400).json({ error: 'Bad Request: ' + err.message });
    }
});

// PUT update product
router.put('/:id', async (req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updated) {
            logger.warn('Product to update not found', { productId: req.params.id });
            return res.status(404).json({ error: 'Product not found' });
        }
        logger.info('Product updated', { productId: req.params.id });
        res.status(200).json(updated);
    } catch (err) {
        logger.error('Failed to update product', { productId: req.params.id, error: err.message });
        res.status(400).json({ error: 'Bad Request: ' + err.message });
    }
});

// DELETE product
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.id);
        if (!deleted) {
            logger.warn('Product to delete not found', { productId: req.params.id });
            return res.status(404).json({ error: 'Product not found' });
        }
        logger.info('Product deleted', { productId: req.params.id });
        res.status(200).json({ message: 'Product deleted' });
    } catch (err) {
        logger.error('Failed to delete product', { productId: req.params.id, error: err.message });
        res.status(400).json({ error: 'Invalid product ID' });
    }
});

module.exports = router;