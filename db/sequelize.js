// db.js
const { Sequelize } = require('sequelize');

const sequelizetest = new Sequelize('pac_system', 'root', 'admin', {
  host: '127.0.0.1',
  dialect: 'mysql' // 'postgres' | 'sqlite' | 'mssql'
});

const sequelize = new Sequelize('pac_system', 'premier_sa', 'Premier@021812299', {
  host: '103.30.127.30',
  dialect: 'mysql' // 'postgres' | 'sqlite' | 'mssql'
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testConnection();

module.exports = sequelize;