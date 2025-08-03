const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const auth = require('../../middleware/auth');
const logger = require('../../utils/logger');

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

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
        const newUser = new User({ email, password: hashedPassword });
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

// Login user
router.post('/login', async (req, res) => {
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
            logger.error(process.env.E400_USER_NOT_FOUND, { email });
            return res.status(400).json({
                code: 'E400_INVALID_CREDENTIALS',
                message: process.env.E400_CLIENT_INVALID_CREDENTIALS
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            logger.error(process.env.E400_INVALID_PASSWORD, { email });
            return res.status(400).json({
                code: 'E400_INVALID_CREDENTIALS',
                message: process.env.E400_CLIENT_INVALID_CREDENTIALS
            });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

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

// Protected route
router.get('/profile', auth, (req, res) => {
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

module.exports = router;