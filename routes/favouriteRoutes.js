const express = require('express');
const router = express.Router();
const { getFavourites, addFavourite, removeFavourite } = require('../controllers/favouriteController');
const { verifyUser } = require('../middleware/verifyToken');

/**
 * @swagger
 * /api//get-favourites:
 *   get:
 *     summary: Get all favourites for a user.
 *     tags:
 *       - Favourites
 *     description: Retrieve all favourites associated with the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns an array of user's favourites.
 */
router.get('/get-favourites', verifyUser, getFavourites);

/**
 * @swagger
 * /api/add-favourite/{productId}:
 *   post:
 *     summary: Add a product to favourites.
 *     tags:
 *       - Favourites
 *     description: Add a product to favourites for the authenticated user.
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product to add to favourites.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the newly added favourite.
 */
router.post('/add-favourite/:productId', verifyUser, addFavourite);

/**
 * @swagger
 * /api/remove-favourite/{favouriteId}:
 *   delete:
 *     summary: Remove a product from favourites
 *     tags: 
 *       - Favourites
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: favouriteId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the favourite item to be removed
 *     responses:
 *       '200':
 *         description: OK. Indicates the item has been successfully removed from favourites.
 */
router.delete('/remove-favourite/:favouriteId', verifyUser, removeFavourite);

module.exports = router;