const jwt = require('jsonwebtoken');

function signServiceToken(serviceName) {
    return jwt.sign(
        {
            from: serviceName || process.env.SERVICE_NAME || 'unknown-service'
        },
        process.env.SERVICE_JWT_SECRET,
        {
            expiresIn: '2m'
        }
    );
}

module.exports = signServiceToken;