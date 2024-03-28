module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        "User",
        {
            Id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            FullName: {
                type: DataTypes.STRING,
            },
            Email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            Password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            PhotoURL: {
                type: DataTypes.STRING,
            },
            Roles: {
                type: DataTypes.ENUM('user', 'admin'),
                allowNull: false,
                defaultValue: 'user'
            }
        },
        {
            tableName: "tbl_Users",
        }
    );
    return User;
};