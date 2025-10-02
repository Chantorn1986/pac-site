const { DataTypes } = require('sequelize');
const sequelize = require('../../db/sequelize');

const ECatalogBrands = sequelize.define('eCatalogBrands', {
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
  nameTH: {
    type: DataTypes.STRING,
  },
  nameEN: {
    type: DataTypes.STRING,
  },
  shortKeyword: {
    type: DataTypes.STRING,
  },
  keyword: {
    type: DataTypes.STRING,
  },
  img: {
    type: DataTypes.STRING,
  },
    year: {
    type: DataTypes.DATE,
  },
    linkMain: {
    type: DataTypes.STRING,
  }
}, {
  // Other model options go here
    createdAt : "createdAt",
    updatedAt : "updatedAt"
});

// `sequelize.sync()` will create the table if it doesn't exist
// await User.sync(); 

module.exports = ECatalogBrands;