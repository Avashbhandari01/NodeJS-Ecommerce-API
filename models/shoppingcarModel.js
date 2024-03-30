module.exports = (sequelize, DataTypes) => {
    const ShoppingCart = sequelize.define(
        "ShoppingCart",
        {
            Id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            Quantity: {
                type: DataTypes.INTEGER,
                defaultValue: 1,
            },
        },
        {
            tableName: "tbl_ShoppingCart",
            timestamps: true,
        }
    );

    const User = require('../models/userModel')(sequelize, DataTypes);
    const Product = require('../models/productModel')(sequelize, DataTypes);

    ShoppingCart.belongsTo(User, { foreignKey: 'UserId' });
    ShoppingCart.belongsTo(Product, { foreignKey: 'ProductId' });

    return ShoppingCart;
}