module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define(
        "Review",
        {
            Id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            Reviews: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
        },
        {
            tableName: "tbl_Review",
            timestamps: true,
        }
    );

    const User = require('../models/userModel')(sequelize, DataTypes);
    const Product = require('../models/productModel')(sequelize, DataTypes);

    Review.belongsTo(User, { foreignKey: 'UserId' });
    Review.belongsTo(Product, { foreignKey: 'ProductId' });

    return Review;
};