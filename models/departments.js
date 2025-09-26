// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class departments extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   departments.init({
//     id: DataTypes.STRING,
//     no: DataTypes.INTEGER,
//     code: DataTypes.STRING,
//     nameTH: DataTypes.STRING,
//     nameEN: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'departments',
//     underscored: true,
//     freezeTableName: true,
//     underscoreAll : true,
//     createdAt : "createdAt",
//     updatedAt : "updatedAt"
//   });
//   return departments;
// };
// models/User.js

const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const Departments = sequelize.define('departments', {
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
    }
}, {
  // Other model options go here
    createdAt : "createdAt",
    updatedAt : "updatedAt"
});

// `sequelize.sync()` will create the table if it doesn't exist
// await User.sync(); 

module.exports = Departments;