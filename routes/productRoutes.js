const express = require('express');
const router = express.Router();
const { getProducts, createProduct, updateProduct, deleteProduct, getPopularProducts, getProductsByName, getProductCounts } = require('../controllers/productController');
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
 *               ARImage:
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
 *               ARImage:
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

/**
 * @swagger
 * /api/get-popular-products:
 *   get:
 *     summary: Retrieve popular products
 *     description: Retrieve a list of popular products.
 *     responses:
 *       200:
 *         description: A list of popular products.
 *     tags:
 *       - Products
 */
router.get('/get-popular-products', getPopularProducts);

/**
 * @swagger
 * /api/get-product-by-name/{productName}:
 *   get:
 *     summary: Get all products by name
 *     description: Retrieve all products with a specific name.
 *     parameters:
 *       - in: path
 *         name: productName
 *         schema:
 *           type: string
 *         description: The name of the product to search for.
 *     responses:
 *       200:
 *         description: A list of products matching the provided name
 *     tags:
 *      - Products
 */
router.get('/get-product-by-name/:productName', getProductsByName);

/**
 * @swagger
 * /api/total-count:
 *   get:
 *     summary: Retrieve total count
 *     description: Retrieve a count of total products and orders.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A count of total products and orders.
 *     tags:
 *       - Products
 */
router.get('/total-count', verifyAdmin, getProductCounts);

module.exports = router;