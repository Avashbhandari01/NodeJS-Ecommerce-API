const { User } = require('../database/dbConfig')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register User
const registerUser = async (req, res) => {
    const { FullName, Email, Password, PhotoURL } = req.body;

    if (!FullName || !Email || !Password || !PhotoURL) {
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
            PhotoURL
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

        const isPasswordValid = await bcrypt.compare(
            Password,
            userExists.Password
        );

        if (isPasswordValid) {
            const token = jwt.sign(
                { id: userExists.Id, email: userExists.Email, fullName: userExists.FullName, photoURL: userExists.PhotoURL },
                process.env.JWT_SECRET,
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

module.exports = {
    registerUser,
    loginUser
}
