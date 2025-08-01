const Product = require('../models/product');
const ROLE_LEVELS = require('../utils/roleLevels');

function authorizeOwnershipOrMinRole(minRole) {
    return async (req, res, next) => {
        try {
            const product = await Product.findById(req.params.id);
            if (!product) {
                return res.status(404).json({ code: 'E404_PRODUCT_NOT_FOUND', message: 'Product not found' });
            }

            const userId = req.user.userId;
            const userRole = req.user.role;

            const isOwner = userId && product.ownerId.toString() === userId;
            const hasElevatedRole = userRole && ROLE_LEVELS[userRole] >= ROLE_LEVELS[minRole];

            if (!isOwner && !hasElevatedRole) {
                return res.status(403).json({ code: 'E403_FORBIDDEN', message: process.env.E403_CLIENT_FORBIDDEN });
            }

            // Attach product to request if needed
            req.product = product;
            next();
        } catch (err) {
            return res.status(500).json({ message: 'Server error', error: err.message });
        }
    };
}

module.exports = authorizeOwnershipOrMinRole;