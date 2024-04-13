const express = require('express');
const router = express.Router();
const { placeOrder, getOrders, getAllOrders, updateOrder, getOrderCount } = require('../controllers/orderController');
const { verifyUser, verifyAdmin } = require('../middleware/verifyToken');

/**
 * @swagger
 * /api/placeOrder:
 *   post:
 *     summary: Place an order
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shippingAddress:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Order placed successfully
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

/**
 * @swagger
 * /api/getAllOrders:
 *   get:
 *     summary: Get all orders for a admin panel
 *     tags:
 *       - Orders
 *     description: Retrieve all orders associated with the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of orders for the authenticated user
 */
router.get('/getAllOrders', verifyAdmin, getAllOrders);

/**
 * @swagger
 * /api/updateOrder/{orderId}:
 *   put:
 *     summary: Update an existing order
 *     description: Update an existing order by providing orderId
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the order to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ShippingAddress:
 *                 type: string
 *               Status:
 *                  type: string
 *     responses:
 *       '200':
 *         description: Successful operation
 */
router.put('/updateOrder/:orderId', verifyAdmin, updateOrder);

/**
 * @swagger
 * /api/getOrderCount:
 *   get:
 *     summary: Retrieve total orders count
 *     description: Retrieve a count of total orders.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A count of total orders.
 *     tags:
 *       - Orders
 */
router.get('/getOrderCount', verifyAdmin, getOrderCount);

module.exports = router;