const { DataTypes } = require('sequelize');
const sequelize = require('../../db/sequelize');

const ECatalogTypeProducts = sequelize.define('eCatalogTypeProducts', {
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
  nameTH: {
    type: DataTypes.STRING,
    allowNull: true
  },
  nameEN: {
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

module.exports = ECatalogTypeProducts;