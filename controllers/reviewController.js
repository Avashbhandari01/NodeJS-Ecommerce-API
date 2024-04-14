const { Review, User } = require('../database/dbConfig');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

// Get all reviews
const getReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll({ include: [{ model: User, attributes: ['FullName'] }] });
        res.status(200).json({ status: "ok", data: reviews });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// Get reviews by product Id
const getReviewByProductId = async (req, res) => {
    const ProductId = req.params.productId;
    if (!ProductId) {
        return res.status(400).json({ error: "Please enter all the textfields!" });
    } else {
        try {
            const reviews = await Review.findAll({
                where: {
                    ProductId
                },
                include: [{ model: User, attributes: ['FullName'] }]
            });
            res.status(200).json({ status: "ok", data: reviews });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

// Create a review
const createReview = async (req, res) => {
    try {
        // Check if Authorization header exists
        if (!req.headers.authorization) {
            return res.status(401).json({ error: "Authorization header is missing" });
        }

        const token = req.headers['authorization'].replace("Bearer ", "");
        const decodedToken = jwt.verify(token, jwtSecret);
        const UserId = decodedToken.id;

        const { ProductId } = req.body;

        const { Reviews } = req.body;

        const data = await Review.create({
            UserId,
            ProductId,
            Reviews
        });

        res.status(200).json({ status: "ok", data: data, message: "Review created successfully!" });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// Update a review
const updateReview = async (req, res) => {
    try {
        const reviewId = req.params.reviewId; // Assuming reviewId is passed in the URL params

        // Retrieve existing review
        const existingReview = await Review.findByPk(reviewId);

        if (!existingReview) {
            return res.status(404).json({ error: "Review not found." });
        }

        // Extract updated fields from request body
        const { Reviews } = req.body;

        // Update the review
        await existingReview.update({
            Reviews
        });

        res.status(200).json({ status: "ok", data: existingReview, message: "Review updated successfully!" });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// Delete a review
const deleteReview = async (req, res) => {
    try {
        const reviewId = req.params.reviewId;

        // Retrieve existing review
        const existingReview = await Review.findByPk(reviewId);

        if (!existingReview) {
            return res.status(404).json({ error: "Review not found." });
        }

        // Delete the review
        await existingReview.destroy({ where: { Id: reviewId } });

        res.status(200).json({ status: "ok", message: "Review deleted successfully!" });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { getReviews, getReviewByProductId, createReview, updateReview, deleteReview };