const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUser, updateUser, uploadProfilePic } = require('../controllers/userController');
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

module.exports = router;