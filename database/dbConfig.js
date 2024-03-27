const { Sequelize } = require('sequelize');

const connection = async () => {
    const sequelize = new Sequelize('EcommerceDB', 'postgres', 'admin', {
        host: 'localhost',
        dialect: 'postgres',
    });

    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.log('Unable to connect to the database:', error);
        throw error;
    }
}

module.exports = { connection };