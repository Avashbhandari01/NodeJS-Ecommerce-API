const { User } = require('../database/dbConfig');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;
const nodemailer = require('nodemailer');

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

module.exports = {
    registerUser,
    loginUser,
    getUser
}
