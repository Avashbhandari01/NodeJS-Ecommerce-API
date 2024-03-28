module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define(
        "Product",
        {
            Id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            Images: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                allowNull: false,
            },
            Colors: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                allowNull: false,
            },
            Title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            Price: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            Description: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            Rating: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            IsFavourite: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            IsPopular: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            }
        },
        {
            tableName: "tbl_Products",
        }
    );
    return Product;
};