const { DataTypes } = require('sequelize');
const sequelize = require('../../db/sequelize');

const ECatalogTypeProducts = sequelize.define('eCatalogTypeProducts', {

  id: { type: DataTypes.STRING, allowNull: false, unique: true, primaryKey: true },
  no: { type: DataTypes.INTEGER, allowNull: true },
  code: { type: DataTypes.STRING, allowNull: true },
  nameTH: { type: DataTypes.STRING, allowNull: true },
  nameEN: { type: DataTypes.STRING, allowNull: true },
  shortKeyword: { type: DataTypes.STRING, allowNull: true },
  keyword: { type: DataTypes.STRING, allowNull: true },
  img: { type: DataTypes.STRING, allowNull: true }
}, { createdAt: "createdAt", updatedAt: "updatedAt" });

module.exports = ECatalogTypeProducts;