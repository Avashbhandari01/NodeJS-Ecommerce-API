const { User } = require('../database/dbConfig');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

// Register User
const registerUser = async (req, res) => {
    const { FullName, Email, Password, PhotoURL, Address, PhoneNumber } = req.body;

    if (!FullName || !Email || !Password) {
        return res.status(400).json({ error: "Please enter all the textfields!" });
    }

    try {
        const existingUser = await User.findOne({ where: { Email } });

        if (existingUser) {
            return res.status(409).json({ error: "User already exists!" });
        }

        const encryptedPassword = await bcrypt.hash(Password, 10);

        const data = await User.create({
            FullName,
            Email,
            Password: encryptedPassword,
            PhotoURL,
            Address,
            PhoneNumber
        });

        res.status(200).json({ status: "ok", data: data, message: "User created successfully!" });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// Login User
const loginUser = async (req, res) => {
    const { Email, Password } = req.body;

    if (!Email || !Password) {
        return res.status(400).send({ error: "Please enter all the textfields!" });
    }

    try {
        const userExists = await User.findOne({ where: { Email } });

        if (!userExists) {
            return res.status(404).json({ error: "User does not exist!" });
        }

        // if (!userExists.EmailConfirmed) {
        //     return res.status(401).json({ error: "Please confirm your email address!" });
        // }

        const isPasswordValid = await bcrypt.compare(
            Password,
            userExists.Password
        );

        if (isPasswordValid) {
            const token = jwt.sign(
                { id: userExists.Id, email: userExists.Email, fullName: userExists.FullName, photoURL: userExists.PhotoURL, role: userExists.Roles, address: userExists.Address, phoneNumber: userExists.PhoneNumber },
                jwtSecret,
                { expiresIn: 3600 }
            );
            return res.status(200).json({
                status: "ok",
                data: {
                    token: token
                }
            });
        } else {
            return res.status(401).json({ error: "Invalid password!" });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// Get User
const getUser = async (req, res) => {
    try {
        // Check if Authorization header exists
        if (!req.headers.authorization) {
            return res.status(401).json({ error: "Authorization header is missing" });
        }

        const token = req.headers['authorization'].replace("Bearer ", "");

        const decodedToken = jwt.verify(token, jwtSecret);
        const userId = decodedToken.id;

        const user = await User.findOne({ where: { Id: userId } });
        res.status(200).json({ status: "ok", data: user });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = {
    registerUser,
    loginUser,
    getUser
}
