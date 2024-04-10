const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;
const User = require('../models/userModel');

// Middleware to verify user token
const verifyUser = (req, res, next) => {
    const token = req.headers['authorization'].replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ error: "Access denied. Token not provided." });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        console.log(decoded, decoded.role);
        if (decoded.role !== 'user') {
            return res.status(403).json({ error: "Access denied. User role required." });
        }
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid user token!" });
    }
}

// Middleware to verify admin token
const verifyAdmin = (req, res, next) => {
    const token = req.headers['authorization'].replace("Bearer ", "");

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
        return res.status(401).json({ error: "Invalid admin token!" });
    }
}

const verifyConfirmCode = async (req, res, next) => {
    const token = req.params.token;

    try {
        // Verify the token
        const decodedToken = jwt.verify(token, jwtSecret);

        // Find the user associated with the token
        const user = await User.findOne({ where: { Email: decodedToken.email } });

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Check if the user's email is already confirmed
        if (user.EmailConfirmed) {
            return res.status(400).json({ error: "Email is already confirmed." });
        }

        // Update user's EmailConfirmed field
        await User.update({ EmailConfirmed: true }, { where: { id: user.id } });

        // Respond with a success message
        return res.status(200).json({ message: "Email verified successfully." });

    } catch (error) {
        // Handle token verification errors
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ error: "Token expired. Please request a new verification email." });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({ error: "Invalid token." });
        } else {
            return res.status(500).json({ error: "Error verifying email." });
        }
    }
};

module.exports = {
    verifyUser,
    verifyAdmin,
    verifyConfirmCode
}