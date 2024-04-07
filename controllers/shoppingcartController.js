const { ShoppingCart } = require('../database/dbConfig');
const { Product } = require('../database/dbConfig');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

// Get all shopping cart items
const getShoppingCartItems = async (req, res) => {
    try {
        // Check if Authorization header exists
        if (!req.headers.authorization) {
            return res.status(401).json({ error: "Authorization header is missing" });
        }

        const token = req.headers['authorization'].replace("Bearer ", "");
        const decodedToken = jwt.verify(token, jwtSecret);
        const userId = decodedToken.id;

        const shoppingCartItems = await ShoppingCart.findAll({ where: { UserId: userId }, include: [{ model: Product }] });

        // Calculate total price
        let totalPrice = 0;
        shoppingCartItems.forEach(item => {
            totalPrice += item.Quantity * item.Product.Price;
        });

        res.status(200).json({ status: "ok", data: shoppingCartItems, TotalPrice: totalPrice });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// Add items to cart
const addToCart = async (req, res) => {
    try {
        // Check if Authorization header exists
        if (!req.headers.authorization) {
            return res.status(401).json({ error: "Authorization header is missing" });
        }

        const token = req.headers['authorization'].replace("Bearer ", "");
        const decodedToken = jwt.verify(token, jwtSecret);
        const UserId = decodedToken.id;

        let ProductId = req.params.productId

        const { Quantity } = req.body;

        if (!ProductId || !Quantity || !UserId) {
            return res.status(400).json({ error: "Please enter all the textfields!" });
        }

        // Check if the product already exists in the user's cart
        let existingCartItem = await ShoppingCart.findOne({
            where: {
                UserId,
                ProductId
            }
        });

        if (existingCartItem) {
            // If the product already exists, update the quantity
            existingCartItem.Quantity += Quantity;
            await existingCartItem.save();
            return res.status(200).json({ status: "ok", data: existingCartItem, message: "Item quantity updated in cart successfully!" });
        } else {
            // If the product doesn't exist, create a new entry
            const data = await ShoppingCart.create({
                ProductId,
                Quantity,
                UserId
            });

            res.status(200).json({ status: "ok", data: data, message: "Item added to cart successfully!" });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// Update item in cart
const updateInCart = async (req, res) => {
    try {
        const cartItemId = req.params.cartItemId; // Assuming cartItemId is passed in the URL params

        // Retrieve existing cart item
        const existingCartItem = await ShoppingCart.findByPk(cartItemId);

        if (!existingCartItem) {
            return res.status(404).json({ error: "Item not found." });
        }

        // Extract updated fields from request body
        const { ProductId, Quantity } = req.body;

        // Update cart item
        existingCartItem.ProductId = ProductId;
        existingCartItem.Quantity = Quantity;
        await existingCartItem.save();

        res.status(200).json({ status: "ok", data: existingCartItem, message: "Item updated successfully!" });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const cartItemId = req.params.cartItemId; // Assuming cartItemId is passed in the URL params

        // Retrieve existing cart item
        const existingCartItem = await ShoppingCart.findByPk(cartItemId);

        if (!existingCartItem) {
            return res.status(404).json({ error: "Item not found." });
        }

        // Delete cart item
        await existingCartItem.destroy();

        res.status(200).json({ status: "ok", message: "Item removed from cart successfully!" });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { getShoppingCartItems, addToCart, updateInCart, removeFromCart };