const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const View_employeeFulls = sequelize.define('view_employeeFulls', {
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
  departmentID: {
    type: DataTypes.STRING,
  },
  positionID: {
    type: DataTypes.STRING,
  },
  workLevelID: {
    type: DataTypes.STRING,
  },
  employmentType: {
    type: DataTypes.STRING,
  },
  resignation: {
    type: DataTypes.INTEGER,
  },
  startDate: {
    type: DataTypes.DATE,
  },
  endDate: {
    type: DataTypes.DATE,
  },
  reasonForLeaving : {
    type: DataTypes.STRING,
  },	
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
  userID: {
    type: DataTypes.STRING,
  },
  infoID: {
    type: DataTypes.STRING,
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
  createdAtInfo: {
    type: DataTypes.DATE,
  },
  updatedAtInfo: {
    type: DataTypes.DATE,
  },
  emID: {
    type: DataTypes.STRING,
  },
  eduID: {
    type: DataTypes.STRING,
  },
  eduEmID: {
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
  addressUniversity: {
    type: DataTypes.STRING,
  },
  yearGraduation: {
    type: DataTypes.STRING,
  },
  other: {
    type: DataTypes.STRING,
  },
  createdAtEdu: {
    type: DataTypes.DATE,
  },
  updatedAtEdu: {
    type: DataTypes.DATE,
  },
  depNo: {
    type: DataTypes.INTEGER,
  },
  depCode: {
    type: DataTypes.STRING,
  },
  depTH: {
    type: DataTypes.STRING,
  },
  depEN: {
    type: DataTypes.STRING,
  },
  posNo: {
    type: DataTypes.INTEGER,
  },
  posTH: {
    type: DataTypes.STRING,
  },
  posEN: {
    type: DataTypes.STRING,
  },
  wleNo: {
    type: DataTypes.INTEGER,
  },
  wleCode: {
    type: DataTypes.STRING,
  },
  wleTH: {
    type: DataTypes.STRING,
  },
  wleEN: {
    type: DataTypes.STRING,
  },
  name: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
  },
  role: {
    type: DataTypes.STRING,
  },
  image: {
    type: DataTypes.STRING,
  },
  workPeriod: {
    type: DataTypes.STRING,
  },
  ageEm: {
    type: DataTypes.STRING,
  },
  birthday: {
    type: DataTypes.STRING,
  },
  startDateFM: {
    type: DataTypes.STRING,
  }
});

// `sequelize.sync()` will create the table if it doesn't exist
// await User.sync(); 

module.exports = View_employeeFulls;