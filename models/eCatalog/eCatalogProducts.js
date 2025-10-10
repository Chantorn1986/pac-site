const { DataTypes } = require('sequelize');
const sequelize = require('../../db/sequelize');

const ECatalogProducts = sequelize.define('eCatalogProducts', {
  // Model attributes are defined here
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  no: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  code: {
    type: DataTypes.STRING,
    allowNull: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  series: {
    type: DataTypes.STRING,
    allowNull: true
  },
  shortKeyword: {
    type: DataTypes.STRING,
    allowNull: true
  },
  keyword: {
    type: DataTypes.STRING,
    allowNull: true
  },
  feature: {
    type: DataTypes.STRING,
    allowNull: true
  },
  productTypeID: {
    type: DataTypes.STRING,
    allowNull: true
  },
  brandsID: {
    type: DataTypes.STRING,
    allowNull: true
  },
  boxA: {
    type: DataTypes.STRING,
    allowNull: true
  },
  boxSubA: {
    type: DataTypes.STRING,
    allowNull: true
  },
  boxB: {
    type: DataTypes.STRING,
    allowNull: true
  },
  boxSubB: {
    type: DataTypes.STRING,
    allowNull: true
  },
  boxC: {
    type: DataTypes.STRING,
    allowNull: true
  },
  boxSubC: {
    type: DataTypes.STRING,
    allowNull: true
  },
  img: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  // Other model options go here
  createdAt: "createdAt",
  updatedAt: "updatedAt"
});

// `sequelize.sync()` will create the table if it doesn't exist
// await User.sync(); 

module.exports = ECatalogProducts;