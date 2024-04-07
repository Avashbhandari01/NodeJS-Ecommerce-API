const express = require('express');
const router = express.Router();
const { placeOrder } = require('../controllers/orderController');
const { verifyUser } = require('../middleware/verifyToken');

/**
 * @swagger
 * /api/placeOrder:
 *   get:
 *     summary: Place an order
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful operation
 */
router.get('/placeOrder', verifyUser, placeOrder);

module.exports = router;