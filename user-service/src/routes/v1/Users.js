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

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user to database
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        logger.info('User registered', { email });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        logger.error('Registration failed', { error: err.message });
        res.status(500).json({ message: 'Server error' });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            logger.error('Login failed: user not found', { email });
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            logger.error('Login failed: incorrect password', { email });
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        logger.info('User login successful', { email });
        res.status(201).json({ message: 'Login successful!', token });
    } catch (err) {
        logger.error('Login failed', { error: err.message });
        res.status(500).json({ message: 'Server error' });
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