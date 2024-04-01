const express = require('express');
const router = express.Router();
const { getProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { verifyAdmin } = require('../middleware/verifyToken');

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: 
 *       - Products
 *     responses:
 *       '200':
 *         description: Returns all products.
 */
router.get('/products', getProducts);

/**
 * @swagger
 * /api/create-product:
 *   post:
 *     summary: Create a new product
 *     tags: 
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Images:
 *                 type: array
 *                 items:
 *                   type: string
 *               Colors:
 *                 type: array
 *                 items:
 *                   type: string
 *               Title:
 *                 type: string
 *               Price:
 *                 type: number
 *               Description:
 *                 type: string
 *               Quantity:
 *                 type: number
 *               IsPopular:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       '200':
 *         description: Product created successfully.
 */
router.post('/create-product', verifyAdmin, createProduct);

/**
 * @swagger
 * /api/update-product/{productId}:
 *   put:
 *     summary: Update a product
 *     tags: 
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the product to update
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Images:
 *                 type: array
 *                 items:
 *                   type: string
 *               Colors:
 *                 type: array
 *                 items:
 *                   type: string
 *               Title:
 *                 type: string
 *               Price:
 *                 type: number
 *               Description:
 *                 type: string
 *               Quantity:
 *                 type: number
 *               IsPopular:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       '200':
 *         description: Product updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     Images:
 *                       type: array
 *                       items:
 *                         type: string
 *                     Colors:
 *                       type: array
 *                       items:
 *                         type: string
 *                     Title:
 *                       type: string
 *                     Price:
 *                       type: number
 *                     Description:
 *                       type: string
 *                     Quantity:
 *                       type: number
 *                     IsPopular:
 *                       type: boolean   
 *                 message:
 *                   type: string
 *                   example: Product updated successfully!
 */
router.put('/update-product/:productId', verifyAdmin, updateProduct);

/**
 * @swagger
 * /api/delete-product/{productId}:
 *   delete:
 *     summary: Delete a product
 *     tags:
 *       - Products
 *     parameters:
 *       - name: productId
 *         in: path
 *         description: ID of the product to delete
 *         required: true
 *         type: integer
 *         format: int
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Product deleted successfully   
 * securityDefinitions:
 *   BearerAuth:
 *     type: apiKey
 *     name: Authorization
 *     in: header
 *     description: Enter your bearer token
 */
router.delete('/delete-product/:productId', verifyAdmin, deleteProduct);

module.exports = router;