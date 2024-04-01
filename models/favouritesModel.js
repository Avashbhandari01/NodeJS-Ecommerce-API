module.exports = (sequelize, DataTypes) => {
    const Favourite = sequelize.define(
        "Favourite",
        {
            Id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            IsFavourite: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: false,
            },
        },
        {
            tableName: "tbl_Favourites",
            timestamps: true,
        }
    );

    const User = require('../models/userModel')(sequelize, DataTypes);
    const Product = require('../models/productModel')(sequelize, DataTypes);

    Favourite.belongsTo(User, { foreignKey: 'UserId' });
    Favourite.belongsTo(Product, { foreignKey: 'ProductId' });

    return Favourite;
};