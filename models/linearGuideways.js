const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const LinearGuideways = sequelize.define('linearGuideways', {
  // Model attributes are defined here
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  no: {
    type: DataTypes.INTEGER
  },
  code: {
    type: DataTypes.STRING,
  },
  series: {
    type: DataTypes.STRING,
  },
  name: {
    type: DataTypes.STRING,
  },
  shortKeyword: {
    type: DataTypes.STRING,
  },
  Keyword: {
    type: DataTypes.STRING,
  },
  detail: {
    type: DataTypes.STRING,
  }
}, {
  // Other model options go here
    createdAt : "createdAt",
    updatedAt : "updatedAt"
});

// `sequelize.sync()` will create the table if it doesn't exist
// await User.sync(); 

module.exports = LinearGuideways;