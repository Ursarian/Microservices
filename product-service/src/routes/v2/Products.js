const express = require('express');
const axios = require('axios');
const Product = require('../../models/product');
const { buildServiceUri } = require('../../utils/buildServiceUri');
const logger = require('../../utils/logger');
const auth = require('../../middleware/auth');
const authorizeOwnershipOrMinRole = require('../../middleware/authorizeOwnershipOrRole');
const {
    productRateLimiter,
    rateLimiterFallback
} = require('../../middleware/rateLimiter');

const router = express.Router();

const USER_SERVICE_URI = buildServiceUri('USER');

// GET - Get All Products
router.get('/all', productRateLimiter, async (req, res) => {
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

// GET - Get Product by ID
router.get('/:id([0-9a-fA-F]{24})', productRateLimiter, async (req, res) => {
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

// GET - Get Product by Owner ID
router.get('/by-owner/:userId', productRateLimiter, async (req, res) => {
    try {
        const products = await Product.find({ ownerId: req.params.userId });
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST - Create Product
router.post('/', auth, productRateLimiter, async (req, res) => {
    try {
        const userId = req.user.userId;

        // Request user-service to verify product owner
        const userResponse = await axios.get(`${USER_SERVICE_URI}/${userId}`);
        const user = userResponse.data;

        if (!user) {
            logger.error(process.env.E404_USER_NOT_FOUND, { userId });
            return res.status(404).json({
                code: 'E404_USER_NOT_FOUND',
                message: process.env.E404_CLIENT_USER_NOT_FOUND
            });
        }

        // Create new product
        const newProduct = new Product({ ...req.body, ownerId: userId });
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

// PUT - Update Product by ID
router.put('/:id([0-9a-fA-F]{24})', auth, authorizeOwnershipOrMinRole('manager'), productRateLimiter, async (req, res) => {
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

// DELETE - Delete Product
router.delete('/:id', auth, authorizeOwnershipOrMinRole('admin'), productRateLimiter, async (req, res) => {
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

// DELETE - Delete Product by User ID
router.delete('/by-owner/:userId', /*auth, authorizeOwnershipOrMinRole('internal'),*/ productRateLimiter, async (req, res) => {
    try {
        const result = await Product.deleteMany({ ownerId: req.params.userId });

        logger.info('Deleted products for user', { userId: req.params.userId, count: result.deletedCount });
        res.status(200).json({ message: 'Products deleted', count: result.deletedCount });
    } catch (err) {
        logger.error(process.env.E400_DELETE_PRODUCTS_FAIL, { productId: req.params.id, error: err.message, stack: err.stack });
        res.status(400).json({
            code: 'E400_DELETE_PRODUCTS_FAIL',
            message: process.env.E400_CLIENT_DELETE_PRODUCTS_FAIL
        });
    }
});

// Fallback limiter for everything else
router.use(rateLimiterFallback);

module.exports = router;