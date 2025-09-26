const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const EmployeeCards = sequelize.define('employeeCards', {
  // Model attributes are defined here
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  emID: {
    type: DataTypes.STRING,
  },
  Card: {
    type: DataTypes.STRING,
  }
}, {
  // Other model options go here
  createdAt: "createdAt",
  updatedAt: "updatedAt"
});

// `sequelize.sync()` will create the table if it doesn't exist
// await User.sync(); 

module.exports = EmployeeCards;