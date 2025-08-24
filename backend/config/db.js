// Sequelize connection to MariaDB
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('class_management_db', 'root', '', {
  host: 'localhost',
  dialect: 'mariadb',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = sequelize;
