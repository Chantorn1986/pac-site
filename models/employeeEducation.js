const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const EmployeeEducations = sequelize.define('employeeEducations', {
  // Model attributes are defined here
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  empID: {
    type: DataTypes.STRING,
  },
  educationLevel: {
    type: DataTypes.STRING,
  },
  university: {
    type: DataTypes.STRING,
  },
  registrationDate: {
    type: DataTypes.DATE,
  },
  graduationDate: {
    type: DataTypes.DATE,
  },
  studyPeriod: {
    type: DataTypes.STRING,
  },
  major: {
    type: DataTypes.STRING,
  },
  addressUniversity	: {
    type: DataTypes.STRING,
  },
  yearGraduation	: {
    type: DataTypes.STRING,
  },
  other	: {
    type: DataTypes.STRING,
  }
}, {
  // Other model options go here
  createdAt: "createdAt",
  updatedAt: "updatedAt"
});

// `sequelize.sync()` will create the table if it doesn't exist
// await User.sync(); 

module.exports = EmployeeEducations;