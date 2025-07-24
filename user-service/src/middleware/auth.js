const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

function auth(req, res, next) {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        logger.error('Authorization header missing or malformed', { authHeader });
        return res.status(401).json({ message: 'No token. Access denied.' });
    }

    const token = authHeader.replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        logger.error('Invalid token', { error: err.message });
        res.status(400).json({ message: 'Invalid token.' });
    }
}

module.exports = auth;