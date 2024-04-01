const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('EcommerceDB', 'postgres', 'admin', {
    host: 'localhost',
    logging: false,
    dialect: 'postgres',
});

// Define models
const User = require('../models/userModel')(sequelize, DataTypes);
const Product = require('../models/productModel')(sequelize, DataTypes);
const ShoppingCart = require('../models/shoppingcarModel')(sequelize, DataTypes);
const Review = require('../models/reviewModel')(sequelize, DataTypes);
const Favourite = require('../models/favouritesModel')(sequelize, DataTypes);

// Synchronize models with the database
async function synchronizeModels() {
    try {
        await sequelize.sync({ force: false });
        console.log('Models synchronized with database.');
    } catch (error) {
        console.error('Error synchronizing models:', error);
        throw error;
    }
}

module.exports = { sequelize, User, Product, ShoppingCart, Review, Favourite, synchronizeModels };