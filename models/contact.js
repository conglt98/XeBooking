'use strict';
module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define('Contact', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    submited: DataTypes.DATE,
    message: DataTypes.TEXT,
    checkStatus: DataTypes.BOOLEAN
  }, {});
  Contact.associate = function(models) {
    // associations can be defined here
  };
  return Contact;
};