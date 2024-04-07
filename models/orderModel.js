module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define(
        "Orders",
        {
            Id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            TotalPrice: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            ShippingAddress: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            Status: {
                type: DataTypes.STRING,
                allowNull: false,
            }
        },
        {
            tableName: "tbl_Orders",
            timestamps: true
        }
    );

    const User = require('../models/userModel')(sequelize, DataTypes);
    const Product = require('../models/productModel')(sequelize, DataTypes);

    Order.belongsTo(User, { foreignKey: 'UserId' });
    Order.belongsToMany(Product, { through: 'tbl_OrderProduct' });

    return Order;
}