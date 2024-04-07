const { ShoppingCart, Order, Product } = require('../database/dbConfig');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

// Checkout and place order
const placeOrder = async (req, res) => {
    try {
        // Check if Authorization header exists
        if (!req.headers.authorization) {
            return res.status(401).json({ error: "Authorization header is missing" });
        }

        const token = req.headers['authorization'].replace("Bearer ", "");
        const decodedToken = jwt.verify(token, jwtSecret);
        const userId = decodedToken.id;
        const shippingAddress = decodedToken.address;

        // Find all shopping cart items for the user
        const shoppingCartItems = await ShoppingCart.findAll({ where: { UserId: userId }, include: [{ model: Product }] });

        // Calculate total price
        let totalPrice = 0;
        shoppingCartItems.forEach(item => {
            totalPrice += item.Product.Price * item.Quantity;
        });

        // Create a new order
        const order = await Order.create({
            UserId: userId,
            TotalPrice: totalPrice,
            ShippingAddress: shippingAddress,
            Status: "Completed"
        });

        // Transfer items from shopping cart to order details
        await Promise.all(shoppingCartItems.map(async (item) => {
            // Ensure that Quantity exists in ShoppingCart model and it's correctly associated with Product model
            await order.addProduct(item.Product.Id, { through: { quantity: item.Quantity } });
        }));

        // Clear the shopping cart
        await ShoppingCart.destroy({ where: { UserId: userId } });

        res.status(200).json({ status: "ok", message: "Order placed successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = { placeOrder };