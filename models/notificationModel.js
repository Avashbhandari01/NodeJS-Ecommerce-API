module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define(
        "Notification",
        {
            Id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            Title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            Body: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            tableName: "tbl_Notifications",
            timestamps: true,
        }
    );
    return Notification;
};