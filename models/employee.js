const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const Employees = sequelize.define('employees', {
  // Model attributes are defined here
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  code: {
    type: DataTypes.STRING,
  },
  serialNumber: {
    type: DataTypes.STRING,
  },
  mobile: {
    type: DataTypes.STRING,
  },
  InternalTelephone: {
    type: DataTypes.STRING,
  },
  nameTH: {
    type: DataTypes.STRING,
  },
  nameEN: {
    type: DataTypes.STRING,
  },
  nickname: {
    type: DataTypes.STRING,
  },
  departmentID	: {
    type: DataTypes.STRING,
  },
  positionID	: {
    type: DataTypes.STRING,
  },
  workLevelID	: {
    type: DataTypes.STRING,
  },
  employmentType: {
    type: DataTypes.STRING,
  },
  startDate: {
    type: DataTypes.STRING,
  },
  endDate: {
    type: DataTypes.STRING,
  },
  reasonForLeaving: {
    type: DataTypes.STRING,
  },
  userID: {
    type: DataTypes.STRING,
  },
  image	: {
    type: DataTypes.STRING,
  },
  resignation: {
    type: DataTypes.STRING,
  }
}, {
  // Other model options go here
  createdAt: "createdAt",
  updatedAt: "updatedAt"
});

// `sequelize.sync()` will create the table if it doesn't exist
// await User.sync(); 

module.exports = Employees;