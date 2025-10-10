const { DataTypes } = require('sequelize');
const sequelize = require('../../db/sequelize');

const ECatalogProducts = sequelize.define('eCatalogProducts', {
  id: { type: DataTypes.STRING, allowNull: false, unique: true, primaryKey: true },
  no: { type: DataTypes.INTEGER, allowNull: true },
  code: { type: DataTypes.STRING, allowNull: true },
  name: { type: DataTypes.STRING, allowNull: true },
  series: { type: DataTypes.STRING, allowNull: true },
  shortKeyword: { type: DataTypes.STRING, allowNull: true },
  keyword: { type: DataTypes.STRING, allowNull: true },
  feature: { type: DataTypes.STRING, allowNull: true },
  boxA: { type: DataTypes.STRING, allowNull: true },
  boxSubA: { type: DataTypes.STRING, allowNull: true },
  boxB: { type: DataTypes.STRING, allowNull: true },
  boxSubB: { type: DataTypes.STRING, allowNull: true },
  boxC: { type: DataTypes.STRING, allowNull: true },
  boxSubC: { type: DataTypes.STRING, allowNull: true },
  eCatalogTypeProductsId : { type: DataTypes.STRING, allowNull: true },
  eCatalogBrandsId : { type: DataTypes.STRING, allowNull: true },
}, { createdAt: "createdAt", updatedAt: "updatedAt" });

module.exports = ECatalogProducts;