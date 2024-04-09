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
                allowNull: true
            },
            Address: {
                type: DataTypes.STRING,
            },
            PhoneNumber: {
                type: DataTypes.BIGINT,
            },
            Roles: {
                type: DataTypes.ENUM('user', 'admin'),
                allowNull: false,
                defaultValue: 'user'
            },
            EmailConfirmed: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        },
        {
            tableName: "tbl_Users",
        }
    );
    return User;
};