module.exports = (sequelize, DataTypes) => {
    const ConfirmationCode = sequelize.define(
        "ConfirmationCode",
        {
            Id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            Code: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            tableName: "tbl_ConfirmationCodes",
            timestamps: true,
        }
    );

    const User = require('../models/userModel')(sequelize, DataTypes);

    ConfirmationCode.belongsTo(User, { foreignKey: 'UserId' });

    return ConfirmationCode;
};