const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../database/dbConfig');

// Route to handle email verification
router.get('/verify-email', async (req, res) => {
    const token = req.query.token;

    if (!token) {
        return res.status(400).json({ error: "Token is required for email verification." });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userEmail = decoded.email;

        // Update user record to mark email as verified
        const user = await User.findOne({ where: { Email: userEmail } });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        user.EmailConfirmed = true;
        await user.save();

        res.status(200).json({ message: "Email verification successful." });
    } catch (error) {
        return res.status(401).json({ error: "Invalid or expired token." });
    }
});

module.exports = router;