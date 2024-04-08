const express = require('express');
const router = express.Router();
const { getAllNotifications, postNotification } = require('../controllers/notificationController');
const { verifyUser } = require('../middleware/verifyToken');

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Retrieve all notifications
 *     description: Retrieve a list of all notifications.
 *     responses:
 *       200:
 *         description: A list of all notifications.
 *     tags:
 *       - Notifications
 */
router.get('/notifications', getAllNotifications);

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Create a new notification
 *     description: Create a new notification with provided title and body.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Title:
 *                 type: string
 *                 description: Title of the notification.
 *               Body:
 *                 type: string
 *                 description: Body of the notification.
 *     responses:
 *       200:
 *         description: New notification created successfully.
 *     tags:
 *       - Notifications
 */
router.post('/notifications', postNotification);

module.exports = router;