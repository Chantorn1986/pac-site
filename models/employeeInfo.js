const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const EmployeeInfos = sequelize.define('employeeInfos', {
  // Model attributes are defined here
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  address: {
    type: DataTypes.STRING,
  },
  subdistrict: {
    type: DataTypes.STRING,
  },
  district: {
    type: DataTypes.STRING,
  },
  province: {
    type: DataTypes.STRING,
  },
  postcode: {
    type: DataTypes.STRING,
  },
  dateOfBirth: {
    type: DataTypes.DATE,
  },
  nameTitle: {
    type: DataTypes.STRING,
  },
  gender: {
    type: DataTypes.STRING,
  },
  bloodGroup: {
    type: DataTypes.STRING,
  },
  maritalStatus: {
    type: DataTypes.STRING,
  },
  religion: {
    type: DataTypes.STRING,
  },
  nationality: {
    type: DataTypes.STRING,
  },
  ethnicity: {
    type: DataTypes.STRING,
  },
  taxID: {
    type: DataTypes.STRING,
  },
  bank: {
    type: DataTypes.STRING,
  },
  bankNumber: {
    type: DataTypes.STRING,
  },
  emID: {
    type: DataTypes.STRING,
  }
}, {
  // Other model options go here
  createdAt: "createdAt",
  updatedAt: "updatedAt"
});

// `sequelize.sync()` will create the table if it doesn't exist
// await User.sync(); 

module.exports = EmployeeInfos;