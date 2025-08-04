const ROLE_LEVELS = require('../utils/roleLevels');

function authorize(minRole) {
    return (req, res, next) => {
        const userRole = req.user.role;

        if (!userRole || ROLE_LEVELS[userRole] < ROLE_LEVELS[minRole]) {
            return res.status(403).json({ code: 'E403_FORBIDDEN', message: process.env.E403_CLIENT_FORBIDDEN });
        }

        next();
    };
}

module.exports = authorize;
