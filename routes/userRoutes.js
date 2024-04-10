const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUser } = require('../controllers/userController');
const { verifyUser, verifyConfirmCode } = require('../middleware/verifyToken');

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
 *               PhotoURL:
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
 * /verify/{token}:
 *   get:
 *     summary: Verify email confirmation token.
 *     tags:
 *      - User
 *     description: |
 *       Verifies the email confirmation token sent to the user's email and marks the user's email as confirmed if the token is valid.
 *     parameters:
 *       - in: path
 *         name: token
 *         description: The token sent to the user's email for verification.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Email verified successfully.
 */
router.get('/verify/:token', verifyConfirmCode)

module.exports = router;