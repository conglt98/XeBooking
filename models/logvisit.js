'use strict';
module.exports = (sequelize, DataTypes) => {
  const Logvisit = sequelize.define('Logvisit', {
    visit: DataTypes.DATE
  }, {});
  Logvisit.associate = function(models) {
    // associations can be defined here
  };
  return Logvisit;
};