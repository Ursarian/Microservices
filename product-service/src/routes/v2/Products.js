const express = require('express');
const mongoose = require('mongoose');
const Product = require('../../models/product');
const logger = require('../../utils/logger');

const router = express.Router();

// GET all products
router.get('/all', async (req, res) => {
    try {
        const products = await Product.find();
        logger.info('Fetched all products', { count: products.length });
        res.status(200).json(products);
    } catch (err) {
        logger.error(process.env.E500_SERVER_ERROR, { error: err.message });
        res.status(500).json({
            code: 'E500_SERVER_ERROR',
            message: process.env.E500_CLIENT_SERVER_ERROR
        });
    }
});

// GET product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            logger.error(process.env.E404_PRODUCT_NOT_FOUND, { productId: req.params.id });
            return res.status(404).json({
                code: 'E404_PRODUCT_NOT_FOUND',
                message: process.env.E404_CLIENT_PRODUCT_NOT_FOUND
            });
        }
        logger.info('Fetched product by ID', { productId: req.params.id });
        res.status(200).json(product);
    } catch (err) {
        logger.error(process.env.E400_INVALID_PRODUCT_ID, { productId: req.params.id, error: err.message, stack: err.stack });
        res.status(400).json({
            code: 'E400_INVALID_PRODUCT_ID',
            message: process.env.E400_CLIENT_INVALID_PRODUCT_ID
        });
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
        logger.error(process.env.E400_CREATE_PRODUCT_FAIL, { error: err.message, stack: err.stack });
        res.status(400).json({
            code: 'E400_CREATE_PRODUCT_FAIL',
            message: process.env.E400_CLIENT_CREATE_PRODUCT_FAIL
        });
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
            logger.error(process.env.E404_PRODUCT_NOT_FOUND, { productId: req.params.id });
            return res.status(404).json({
                code: 'E404_PRODUCT_NOT_FOUND',
                message: process.env.E404_CLIENT_PRODUCT_NOT_FOUND
            });
        }
        logger.info('Product updated', { productId: req.params.id });
        res.status(200).json(updated);
    } catch (err) {
        logger.error(process.env.E400_UPDATE_PRODUCT_FAIL, { productId: req.params.id, error: err.message, stack: err.stack });
        res.status(400).json({
            code: 'E400_UPDATE_PRODUCT_FAIL',
            message: process.env.E400_CLIENT_UPDATE_PRODUCT_FAIL
        });
    }
});

// DELETE product
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.id);
        if (!deleted) {
            logger.error(process.env.E404_PRODUCT_NOT_FOUND, { productId: req.params.id });
            return res.status(404).json({
                code: 'E404_PRODUCT_NOT_FOUND',
                message: process.env.E404_CLIENT_PRODUCT_NOT_FOUND
            });
        }
        logger.info('Product deleted', { productId: req.params.id });
        res.status(200).json({ message: 'Product deleted' });
    } catch (err) {
        logger.error(process.env.E400_DELETE_PRODUCT_FAIL, { productId: req.params.id, error: err.message, stack: err.stack });
        res.status(400).json({
            code: 'E400_DELETE_PRODUCT_FAIL',
            message: process.env.E400_CLIENT_DELETE_PRODUCT_FAIL
        });
    }
});

module.exports = router;