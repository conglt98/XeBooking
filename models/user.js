'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    phone:DataTypes.STRING,
    imagePath:DataTypes.STRING(1000),
    location:DataTypes.STRING,
    profileId:DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Transaction);

  };
  return User;
};