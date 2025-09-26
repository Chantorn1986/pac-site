const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const View_profileSessions = sequelize.define('view_profileSessions', {
  // Model attributes are defined here
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  idEM: {
    type: DataTypes.STRING
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
  nameTH: {
    type: DataTypes.STRING,
      },
  depName	: {
    type: DataTypes.STRING,
  }
}, {
  // Other model options go here
});

// `sequelize.sync()` will create the table if it doesn't exist
// await User.sync(); 

module.exports = View_profileSessions;