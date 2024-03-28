const { Product } = require('../database/dbConfig');

// Get all products
const getProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.status(200).json({ status: "ok", data: products });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// Create a product
const createProduct = async (req, res) => {
    try {
        // Check if user is admin
        if (req.User.Roles !== 'admin') {
            return res.status(403).json({ error: "Only admin users can create products." });
        }

        const { Images, Colors, Title, Price, Description } = req.body;

        if (!Images || !Colors || !Title || !Price || !Description) {
            return res.status(400).json({ error: "Please enter all the textfields!" });
        }

        const data = await Product.create({
            Images,
            Colors,
            Title,
            Price,
            Description
        });

        res.status(200).json({ status: "ok", data: data, message: "Product created successfully!" });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// Update a product
const updateProduct = async (req, res) => {
    try {
        // Check if user is admin
        if (req.User.Roles !== 'admin') {
            return res.status(403).json({ error: "Only admin users can update products." });
        }

        const productId = req.params.productId; // Assuming productId is passed in the URL params

        // Retrieve existing product
        const existingProduct = await Product.findById(productId);

        if (!existingProduct) {
            return res.status(404).json({ error: "Product not found." });
        }

        // Extract updated fields from request body
        const { Images, Colors, Title, Price, Description } = req.body;

        // Update product fields if provided
        if (Images) existingProduct.Images = Images;
        if (Colors) existingProduct.Colors = Colors;
        if (Title) existingProduct.Title = Title;
        if (Price) existingProduct.Price = Price;
        if (Description) existingProduct.Description = Description;

        // Save updated product
        const updatedProduct = await existingProduct.save();

        res.status(200).json({ status: "ok", data: updatedProduct, message: "Product updated successfully!" });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// Delete a product
const deleteProduct = async (req, res) => {
    try {
        // Check if user is admin
        if (req.User.Roles !== 'admin') {
            return res.status(403).json({ error: "Only admin users can delete products." });
        }

        await Product.destory({ where: { id: req.params.productId } });
        return res.status(200).json({ status: "ok", message: "Product deleted successfully!" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { getProducts, createProduct, updateProduct, deleteProduct }