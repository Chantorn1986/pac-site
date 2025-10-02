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
    type: DataTypes.INTEGER
  },
  code: {
    type: DataTypes.STRING,
  },
  name: {
    type: DataTypes.STRING,
  },
  series: {
    type: DataTypes.STRING,
  },
  shortKeyword: {
    type: DataTypes.STRING,
  },
  keyword: {
    type: DataTypes.STRING,
  },
  feature: {
    type: DataTypes.STRING,
  },
  productTypeID: {
    type: DataTypes.STRING,
  },
  brandsID: {
    type: DataTypes.STRING,
  },
  boxA: {
    type: DataTypes.STRING,
  },
  boxSubA: {
    type: DataTypes.STRING,
  },
  boxB: {
    type: DataTypes.STRING,
  },
  boxSubB: {
    type: DataTypes.STRING,
  },
  boxC: {
    type: DataTypes.STRING,
  },
  boxSubC: {
    type: DataTypes.STRING,
  },
  img: {
    type: DataTypes.STRING,
  }
}, {
  // Other model options go here
    createdAt : "createdAt",
    updatedAt : "updatedAt"
});

// `sequelize.sync()` will create the table if it doesn't exist
// await User.sync(); 

module.exports = ECatalogProducts;