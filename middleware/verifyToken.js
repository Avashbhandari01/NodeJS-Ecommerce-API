const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

// Middleware to verify user token
const verifyUser = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: "Access denied. Token not provided." });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        if (decoded.role !== 'user') {
            return res.status(403).json({ error: "Access denied. User role required." });
        }
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token." });
    }
}

// Middleware to verify admin token
const verifyAdmin = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: "Access denied. Token not provided." });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: "Access denied. Admin role required." });
        }
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token." });
    }
}

module.exports = {
    verifyUser,
    verifyAdmin
}