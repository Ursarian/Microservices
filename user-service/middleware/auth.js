const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  // Get the token from the Authorization header
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token. Access denied.' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to the request
    next(); // Move to the next middleware/route
  } catch (err) {
    res.status(400).json({ message: 'Invalid token.' });
  }
}

module.exports = auth;