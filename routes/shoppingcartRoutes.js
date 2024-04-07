const express = require('express');
const router = express.Router();
const { getShoppingCartItems, addToCart, updateInCart, removeFromCart } = require('../controllers/shoppingcartController');
const { verifyUser } = require('../middleware/verifyToken');

/**
 * @swagger
 * /api/shopping-cart:
 *   get:
 *     summary: Get all shopping cart items
 *     tags:
 *       - Shopping Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully Displayed
 */
router.get('/shopping-cart', verifyUser, getShoppingCartItems);

/**
 * @swagger
 * /api/add-to-cart:
 *   post:
 *     summary: Add an item to the user's shopping cart.
 *     description: Add a product to the shopping cart of the specified user.
 *     tags:
 *       - Shopping Cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ProductId:
 *                  type: integer
 *               Quantity:
 *                 type: integer
 *                 description: The quantity of the product to add to the cart.
 *                 example: 1
 *     responses:
 *       '200':
 *         description: Item successfully added to the cart.
 */
router.post('/add-to-cart', verifyUser, addToCart);

/**
 * @swagger
 * /api/update-in-cart/{cartItemId}:
 *   put:
 *     summary: Update an item in the shopping cart
 *     tags:
 *       - Shopping Cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: cartItemId
 *         in: path
 *         required: true
 *         type: integer
 *         description: ID of the item to update in the shopping cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ProductId:
 *                 type: integer
 *                 description: ID of the product to update
 *               Quantity:
 *                 type: integer
 *                 description: Updated quantity of the product
 *     responses:
 *       '200':
 *         description: Item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 data:
 *                   $ref: '#/components/schemas/ShoppingCartItem'
 *                 message:
 *                   type: string
 *                   example: Item updated successfully!
 *       '400':
 *         description: Bad Request - Missing fields or invalid input
 *       '404':
 *         description: Item not found
 *       '500':
 *         description: Internal Server Error
 */
router.put('/update-in-cart/:cartItemId', verifyUser, updateInCart);

/**
 * @swagger
 * /api/remove-from-cart/{cartItemId}:
 *   delete:
 *     summary: Remove an item from the shopping cart
 *     tags:
 *       - Shopping Cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: cartItemId
 *         in: path
 *         required: true
 *         type: integer
 *         description: ID of the item to remove from the shopping cart
 *     responses:
 *       '200':
 *         description: Item removed successfully
 */
router.delete('/remove-from-cart/:cartItemId', verifyUser, removeFromCart);

module.exports = router;