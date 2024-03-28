const express = require('express');
const router = express.Router();
const { getProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');

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
 * /api/create-products:
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
 *     responses:
 *       '200':
 *         description: Product created successfully.
 */
router.post('/create-product', createProduct);

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
 *           type: string
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
 *                 message:
 *                   type: string
 *                   example: Product updated successfully!
 */
router.put('/update-product', updateProduct);

/**
 * @swagger
 * /delete-product/{productId}:
 *   delete:
 *     summary: Delete a product
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         description: ID of the product to delete
 *         required: true
 *         type: integer
 *         format: int64
 *     responses:
 *       '200':
 *         description: Product deleted successfully.
 */
router.delete('/delete-product/:productId', deleteProduct);

module.exports = router;