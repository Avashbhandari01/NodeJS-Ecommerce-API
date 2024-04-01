const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUser } = require('../controllers/userController');
const { verifyUser } = require('../middleware/verifyToken');

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
 * /api/get-user/{userId}:
 *   get:
 *     summary: Retrieve a user by ID
 *     tags:
 *      - User
 *     security:
 *      - bearerAuth: []
 *     description: Retrieve a user from the database by their ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user to retrieve
 *     responses:
 *       '200':
 *         description: A user object
 */
router.get('/get-user/:userId', verifyUser, getUser);

module.exports = router;