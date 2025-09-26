const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const Users = sequelize.define('users', {
  // Model attributes are defined here
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
  },
  role: {
    type: DataTypes.STRING,
    }
}, {
  // Other model options go here
    createdAt : "createdAt",
    updatedAt : "updatedAt"
});

// `sequelize.sync()` will create the table if it doesn't exist
// await User.sync(); 

module.exports = Users;