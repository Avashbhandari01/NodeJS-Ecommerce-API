const { User } = require('../database/dbConfig');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Register User
const registerUser = async (req, res) => {
    const { FullName, Email, Password, Address, PhoneNumber } = req.body;

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
            Address,
            PhoneNumber
        });

        // Generate a unique token
        const token = jwt.sign({ email: data.Email }, jwtSecret, { expiresIn: '200d' });

        // Create confirmation link
        const confirmationLink = `${process.env.APP_URL}/verify-email?token=${token}`;

        // Create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.USER, // Sender gmail address
                pass: process.env.APP_PASSWORD, // App password from Gmail account
            }
        });

        const mailOptions = {
            from: {
                name: 'John Doe',
                address: process.env.USER
            }, // Sender address
            to: [data.Email], // List of receivers
            subject: "Email Verification", // Subject Line
            text: `Please click the following link to verify your email: ${confirmationLink}`,
            html: `<p>Please click the following link to verify your email:</p><p><a href="${confirmationLink}">${confirmationLink}</a></p>`
        }

        const sendMail = async (transporter, mailOptions) => {
            try {
                await transporter.sendMail(mailOptions);
            } catch (error) {
                return res.status(500).json({ error: error.message })
            }
        }

        sendMail(transporter, mailOptions);

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

        if (!userExists.EmailConfirmed) {
            return res.status(401).json({ error: "Please confirm your email address!" });
        }

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

// Update User
const updateUser = async (req, res) => {
    try {
        // Check if Authorization header exists
        if (!req.headers.authorization) {
            return res.status(401).json({ error: "Authorization header is missing" });
        }

        const token = req.headers['authorization'].replace("Bearer ", "");

        const decodedToken = jwt.verify(token, jwtSecret);
        const userId = decodedToken.id;

        // Retrieve existing user
        const existingUser = await User.findByPk(userId);

        if (!existingUser) {
            return res.status(404).json({ error: "User not found." });
        }

        // Extract updated fields from request body
        const { FullName, Address, PhoneNumber } = req.body;

        // Update user fields if provided
        if (FullName) existingUser.FullName = FullName;
        if (Address) existingUser.Address = Address;
        if (PhoneNumber) existingUser.PhoneNumber = PhoneNumber;

        // Save updated user
        const updatedUser = await existingUser.save();

        res.status(200).json({ status: "ok", data: updatedUser, message: "User updated successfully!" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// Upload Profile Picture
const uploadProfilePic = async (req, res) => {
    try {
        // Check if Authorization header exists
        if (!req.headers.authorization) {
            return res.status(401).json({ error: "Authorization header is missing" });
        }

        const token = req.headers['authorization'].replace("Bearer ", "");

        const decodedToken = jwt.verify(token, jwtSecret);
        const userId = decodedToken.id;

        // Retrieve existing user
        let existingUser = await User.findByPk(userId);

        if (!existingUser) {
            return res.status(404).json({ error: "User not found." });
        }

        // If there's a file uploaded, handle it
        if (req.file) {
            const photoURL = req.file.path;

            await User.update({ PhotoURL: photoURL }, { where: { Id: userId } });
            existingUser = await User.findByPk(userId);

            return res.status(200).json({ status: "ok", message: "Profile picture updated successfully!", user: existingUser });
        } else {
            return res.status(400).json({ error: "No file uploaded" });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// Forgot Password API endpoint
const forgotPassword = async (req, res) => {
    const userEmail = req.body.userEmail;

    try {
        // Find user by email
        const user = await User.findOne({ where: { Email: userEmail } });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Generate token (e.g., using crypto)
        const token = crypto.randomBytes(20).toString('hex');

        await user.save();

        // Create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.USER, // Sender gmail address
                pass: process.env.APP_PASSWORD, // App password from Gmail account
            }
        });

        // Send email with reset link
        const resetLink = `http://localhost:3000/api/reset-password?token=${token}&email=${userEmail}`;
        const mailOptions = {
            to: userEmail,
            subject: 'Password Reset',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n`
                + `Please click on the following link, or paste this into your browser to complete the process:\n\n`
                + `${resetLink}\n\n`
                + `If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Reset Password API endpoint
const resetPassword = async (token, password, email, res) => {

    if (!token) {
        return res.status(400).json({ error: "Token is missing in the request" });
    }

    try {

        // Find user by primary key
        const user = await User.findOne({ where: { Email: email } });

        if (!user) {
            return res.status(404).json({ error: "Invalid or expired token" });
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        // Update password
        user.Password = encryptedPassword;

        await user.save();

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUser,
    updateUser,
    uploadProfilePic,
    forgotPassword,
    resetPassword
}
