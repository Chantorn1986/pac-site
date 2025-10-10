const { DataTypes } = require('sequelize');
const sequelize = require('../../db/sequelize');

const ECatalogProductsImages = sequelize.define('eCatalogProductsImages', {

  id: { type: DataTypes.STRING, allowNull: false, unique: true, primaryKey: true },
  no: { type: DataTypes.INTEGER, allowNull: true },
  img: { type: DataTypes.STRING, allowNull: true },
  eCatalogProductsId : { type: DataTypes.STRING, allowNull: true },
}, { createdAt: "createdAt", updatedAt: "updatedAt" });

module.exports = ECatalogProductsImages;