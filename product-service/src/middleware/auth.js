const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

function auth(req, res, next) {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        logger.error(process.env.E400_MISSING_TOKEN, { authHeader });
        return res.status(400).json({
            code: 'E400_BAD_TOKEN',
            message: process.env.E400_CLIENT_MISSING_TOKEN
        });
    } else if (!authHeader.startsWith('Bearer ')) {
        logger.error(process.env.E400_MALFORMED_TOKEN, { authHeader });
        return res.status(400).json({
            code: 'E400_BAD_TOKEN',
            message: process.env.E400_CLIENT_MALFORMED_TOKEN
        });
    }

    const token = authHeader.replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            logger.error(process.env.E401_INVALID_TOKEN, { error: err.message, stack: err.stack });
            return res.status(401).json({
                code: 'E401_INVALID_TOKEN',
                message: process.env.E401_CLIENT_INVALID_TOKEN
            });
        };
        if (err.name === 'TokenExpiredError') {
            logger.error(process.env.E401_EXPIRED_TOKEN, { error: err.message, stack: err.stack });
            return res.status(401).json({
                code: 'E401_INVALID_TOKEN',
                message: process.env.E401_CLIENT_INVALID_TOKEN
            });
        }
        logger.error(process.env.E500_SERVER_ERROR, { error: err.message, stack: err.stack });
        return res.status(500).json({
            code: 'E500_SERVER_ERROR',
            message: process.env.E500_CLIENT_SERVER_ERROR
        });
    }
}

module.exports = auth;