const { Review } = require('../database/dbConfig');

// Get all reviews
const getReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll();
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
                }
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
        const UserId = req.params.userId;
        const ProductId = req.params.productId;

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