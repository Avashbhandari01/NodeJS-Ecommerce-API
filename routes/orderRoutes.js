const express = require('express');
const router = express.Router();
const { placeOrder, getOrders } = require('../controllers/orderController');
const { verifyUser } = require('../middleware/verifyToken');

/**
 * @swagger
 * /api/placeOrder:
 *   post:
 *     summary: Place an order
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful operation
 */
router.post('/placeOrder', verifyUser, placeOrder);

/**
 * @swagger
 * /api/getOrders:
 *   get:
 *     summary: Get all orders for a user
 *     tags:
 *       - Orders
 *     description: Retrieve all orders associated with the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of orders for the authenticated user
 */
router.get('/getOrders', verifyUser, getOrders);

module.exports = router;