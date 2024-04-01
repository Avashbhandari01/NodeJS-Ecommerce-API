const express = require('express');
const router = express.Router();
const { getReviews, getReviewByProductId, createReview, updateReview, deleteReview } = require('../controllers/reviewController');
const { verifyUser } = require('../middleware/verifyToken');

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Retrieve all reviews
 *     tags: [Reviews]
 *     description: Retrieve a list of all reviews.
 *     responses:
 *       200:
 *         description: A list of reviews.
 */
router.get("/reviews", getReviews);

/**
 * @swagger
 * /api/reviews/{productId}:
 *   get:
 *     summary: Retrieve reviews by product ID
 *     description: Retrieve a list of reviews for a specific product based on its ID.
 *     security:
 *       - bearerAuth: []
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the product to get reviews for.
 *     responses:
 *       200:
 *         description: A list of reviews for the specified product.
 */
router.get("/reviews/:productId", verifyUser, getReviewByProductId);

/**
 * @swagger
 * /api/reviews/{productId}:
 *   post:
 *     summary: Create a review for a product by a user
 *     description: Create a review for a specific product by a user identified by userId.
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product in which the review is written.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Reviews:
 *                 type: string
 *                 description: The review content.
 *     responses:
 *       '200':
 *         description: Item successfully added to the cart.
 */
router.post("/reviews/:productId", createReview);

/**
 * @swagger
 * /api/update-review/{reviewId}:
 *   put:
 *     summary: Update a review
 *     description: Endpoint to update an existing review.
 *     tags:
 *       - Reviews
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the review to be updated.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Reviews:
 *                 type: string
 *                 description: The updated review content.
 *     responses:
 *       '200':
 *         description: Review updated successfully
 */
router.put("/update-review/:reviewId", verifyUser, updateReview);

/**
 * @swagger
 * /api/delete-review/{reviewId}:
 *   delete:
 *     summary: Delete a review
 *     description: Deletes a review by its ID.
 *     tags:
 *       - Reviews
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the review to delete.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A successful response indicating the review was deleted.
 */
router.delete("/delete-review/:reviewId", verifyUser, deleteReview);

module.exports = router;