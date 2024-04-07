const { Favourite } = require('../database/dbConfig');
const { Product } = require('../database/dbConfig');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

// Get all favourites for a user.
const getFavourites = async (req, res) => {
    try {
        // Check if Authorization header exists
        if (!req.headers.authorization) {
            return res.status(401).json({ error: "Authorization header is missing" });
        }

        const token = req.headers['authorization'].replace("Bearer ", "");

        const decodedToken = jwt.verify(token, jwtSecret);
        const userId = decodedToken.id;

        const favourites = await Favourite.findAll({ where: { UserId: userId }, include: [{ model: Product }] });
        res.status(200).json({ status: "ok", data: favourites });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// Add a product to favourites
const addFavourite = async (req, res) => {
    try {
        // Check if Authorization header exists
        if (!req.headers.authorization) {
            return res.status(401).json({ error: "Authorization header is missing" });
        }

        const token = req.headers['authorization'].replace("Bearer ", "");

        const decodedToken = jwt.verify(token, jwtSecret);
        const UserId = decodedToken.id;

        const { ProductId } = req.body;

        // Check if the product already exists in the user's favorites
        const existingFavourite = await Favourite.findOne({
            where: {
                UserId,
                ProductId
            }
        });

        if (existingFavourite) {
            return res.status(400).json({ error: "Product already exists in favorites" });
        }

        const favourite = await Favourite.create({
            UserId,
            ProductId,
            IsFavourite: true
        });
        res.status(200).json({ status: "ok", data: favourite });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// Remove a product from favourites
const removeFavourite = async (req, res) => {
    try {
        const favouriteItemId = req.params.favouriteId;

        // Retrieve existing favourite item
        const existingFavouriteItem = await Favourite.findByPk(favouriteItemId);

        if (!existingFavouriteItem) {
            return res.status(404).json({ error: "Item not found." });
        }

        // Remove favourite item
        await existingFavouriteItem.destroy();

        res.status(200).json({ status: "ok", message: "Item removed from favourites successfully!" });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { getFavourites, addFavourite, removeFavourite }