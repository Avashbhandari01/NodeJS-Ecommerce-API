const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUser, updateUser, uploadProfilePic, forgotPassword, resetPassword } = require('../controllers/userController');
const { verifyUser } = require('../middleware/verifyToken');
const multer = require('multer');

/**
 * @swagger
 * /api/register-user:
 *   post:
 *     summary: Register a new user
 *     tags: 
 *       - User
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               FullName:
 *                 type: string
 *               Email:
 *                 type: string
 *                 format: email
 *               Password:
 *                 type: string
 *               Address:
 *                 type: string
 *               PhoneNumber:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: User registered successfully.
 */
router.post('/register-user', registerUser);

/**
 * @swagger
 * /api/login-user:
 *   post:
 *     summary: Login a user
 *     tags: 
 *       - User
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Email:
 *                 type: string
 *                 description: User's email
 *               Password:
 *                 type: string
 *                 description: User's password
 *     responses:
 *       '200':
 *         description: User logged in successfully.
 */
router.post('/login-user', loginUser);

/**
 * @swagger
 * /api/get-user:
 *   get:
 *     summary: Retrieve a user by ID
 *     tags:
 *      - User
 *     security:
 *      - bearerAuth: []
 *     description: Retrieve a user from the database by their ID.
 *     responses:
 *       '200':
 *         description: A user object
 */
router.get('/get-user', verifyUser, getUser);

/**
 * @swagger
 * /api/update-user:
 *   put:
 *     summary: Update user profile
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               FullName:
 *                 type: string
 *               Address:
 *                 type: string
 *               PhoneNumber:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: User profile updated successfully
 */
router.put('/update-user', verifyUser, updateUser);

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/profile-pics'); // Specify the destination folder for profile pictures
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use the original filename for profile pictures
    }
});
const upload = multer({ storage: storage });

// Route for uploading profile picture
router.post('/uploadProfilePic', upload.single('profilePic'), uploadProfilePic);

router.post('/forgot-password', forgotPassword);

router.get('/reset-password', (req, res) => {
    // Extract the token from the query parameters
    const token = req.query.token;
    const email = req.query.email;

    // Render the reset password form
    res.send(`
        <html>
            <head>
                <title>Reset Password</title>
            </head>
            <body>
                <h1>Reset Password</h1>
                <form action="/api/reset-password?token=${token}&email=${email}" method="post" enctype="application/x-www-form-urlencoded"> <!-- Pass token as query parameter -->
                    <label for="password">New Password:</label>
                    <input type="password" id="password" name="password" required>
                    <br>
                    <button type="submit">Reset Password</button>
                </form>
            </body>
        </html>
    `);
});

router.post('/reset-password', (req, res) => {
    const token = req.query.token; // Retrieve token from query parameters
    const email = req.query.email; // Retrieve email from query parameters
    const password = req.body.password; // Retrieve password from request body

    // Pass token and password to the resetPassword controller function
    resetPassword(token, password, email, res);
});

module.exports = router;