const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('../../models/user');
const { buildServiceUri } = require('../../utils/buildServiceUri');
const logger = require('../../utils/logger');
const auth = require('../../middleware/auth');
const authorize = require('../../middleware/authorize');
const {
    loginRateLimiter,
    usersRateLimiter,
    rateLimiterFallback
} = require('../../middleware/rateLimiter');

const router = express.Router();

const PRODUCT_SERVICE_URI = buildServiceUri('PRODUCT');

// ROUTE - Registration
router.post('/register', usersRateLimiter, async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Simulate an error for testing purposes
        // if (email === 'error') {
        //     logger.error('Registration failed', { email });
        //     throw new Error("Intentional crash!");
        // }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            logger.error(process.env.E400_USER_EXISTS, { email });
            return res.status(400).json({
                code: 'E400_USER_EXISTS',
                message: process.env.E400_CLIENT_USER_EXISTS
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user to database
        const newUser = new User({ email, password: hashedPassword, role: role || 'user' });
        await newUser.save();

        logger.info('User registered', { email });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        logger.error(process.env.E500_SERVER_ERROR, { error: err.message, stack: err.stack });
        res.status(500).json({
            code: 'E500_SERVER_ERROR',
            message: process.env.E500_CLIENT_SERVER_ERROR
        });
    }
});

// ROUTE - Login
router.post('/login', loginRateLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Simulate an error for testing purposes
        // if (email === 'error') {
        //     logger.error('Login failed', { email });
        //     throw new Error("Intentional crash!");
        // }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            logger.error(process.env.E400_INVALID_EMAIL, { email });
            return res.status(400).json({
                code: 'E400_INVALID_CREDENTIALS',
                message: process.env.E400_CLIENT_INVALID_EMAIL
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            logger.error(process.env.E400_INVALID_PASSWORD, { email });
            return res.status(400).json({
                code: 'E400_INVALID_CREDENTIALS',
                message: process.env.E400_CLIENT_INVALID_PASSWORD
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        logger.info('User login successful', { email });
        res.status(201).json({ message: 'Login successful!', token });
    } catch (err) {
        logger.error(process.env.E500_SERVER_ERROR, { error: err.message, stack: err.stack });
        res.status(500).json({
            code: 'E500_SERVER_ERROR',
            message: process.env.E500_CLIENT_SERVER_ERROR
        });
    }
});

// ROUTE - Profile (protected)
router.get('/profile', auth, usersRateLimiter, (req, res) => {
    // res.set({
    //   'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    //   Pragma: 'no-cache',
    //   Expires: '0',
    //   'Surrogate-Control': 'no-store'
    // });

    res.status(200).json({
        message: `Welcome back, user ${req.user.email}`,
        email: req.user.email
    });
});

// GET - Get All Users ID and Email
router.get('/all', auth, authorize('manager'), usersRateLimiter, async (req, res) => {
    try {
        const users = await User.find({}, '_id email');

        res.status(200).json(users);
    } catch (err) {
        logger.error('Failed to fetch users', { error: err.message });
        res.status(500).json({ message: 'Server error' });
    }
});

// GET - Get User by ID
router.get('/:id([0-9a-fA-F]{24})', /*auth, authorize('user'),*/ usersRateLimiter, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            logger.error(process.env.E404_USER_NOT_FOUND, { userId: req.params.id });
            return res.status(404).json({
                code: 'E404_USER_NOT_FOUND',
                message: process.env.E404_CLIENT_USER_NOT_FOUND
            });
        }

        res.status(200).json({ _id: user._id, email: user.email });
    } catch (err) {
        if (err.name === 'CastError') {
            logger.error(process.env.E400_INVALID_ID, { error: err.message, stack: err.stack });
            return res.status(400).json({
                code: 'E400_INVALID_ID',
                message: process.env.E400_CLIENT_INVALID_ID
            });
        };

        logger.error(process.env.E500_SERVER_ERROR, { error: err.message, stack: err.stack });
        res.status(500).json({
            code: 'E500_SERVER_ERROR',
            message: process.env.E500_CLIENT_SERVER_ERROR
        });
    }
});

// DELETE - Delete Me (protected)
router.delete('/me', auth, authorize('user'), usersRateLimiter, async (req, res) => {
    try {
        const userId = req.user.userId;

        // Delete the user
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            logger.error(process.env.E404_USER_NOT_FOUND, { userId: userId });
            return res.status(404).json({
                code: 'E404_USER_NOT_FOUND',
                message: process.env.E404_CLIENT_USER_NOT_FOUND
            });
        }

        logger.info('User deleted account', { userId: userId });

        // Request product-service to delete their products
        try {
            await axios.delete(`${PRODUCT_SERVICE_URI}/by-owner/${userId}`);
            logger.info('User deleted all their products', { userId: userId });
        } catch (err) {
            logger.error(process.env.E400_DELETE_PRODUCTS_FAIL, { userId: userId, error: err.message, stack: err.stack });
        }

        res.status(200).json({ message: 'User deleted successfully (products attempted)' });
    } catch (err) {
        logger.error(process.env.E500_SERVER_ERROR, { error: err.message, stack: err.stack });
        res.status(500).json({
            code: 'E500_SERVER_ERROR',
            message: process.env.E500_CLIENT_SERVER_ERROR
        });
    }
});



// TEST
router.get('/testAPI', auth, usersRateLimiter, async (req, res) => {
    res.status(200).json({
        Status: 'Succeeded!',
        UserId: req.user.userId,
        Role: req.user.role,
    });
});



// TEST
router.get('/testAuthorization', auth, authorize('manager'), async (req, res) => {
    res.status(200).json({
        Status: 'Succeeded!',
        UserId: req.user.userId,
        Role: req.user.role,
    });
});



// TEST
router.get('/testBoth', auth, authorize('manager'), usersRateLimiter, async (req, res) => {
    res.status(200).json({
        Status: 'Succeeded!',
        UserId: req.user.userId,
        Role: req.user.role,
    });
});



// TEST
router.get('/testAll', auth, authorize('manager'), usersRateLimiter, async (req, res) => {
    res.status(200).json({
        Status: 'Succeeded!',
        UserId: req.user.userId,
        Role: req.user.role,
    });
});



// Fallback limiter for everything else
router.use(rateLimiterFallback);

module.exports = router;