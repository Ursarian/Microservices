const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

function serviceAuth(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        logger.error('Missing or malformed internal service token');
        return res.status(403).json({
            code: 'E403_FORBIDDEN',
            message: process.env.E403_CLIENT_FORBIDDEN
        });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const payload = jwt.verify(token, process.env.SERVICE_JWT_SECRET);

        req.service = payload.from;
        next();
    } catch (err) {
        logger.error('Failed to verify service token', { error: err.message });
        return res.status(403).json({
            code: 'E403_FORBIDDEN',
            message: 'Invalid or expired service token'
        });
    }
}

module.exports = serviceAuth;