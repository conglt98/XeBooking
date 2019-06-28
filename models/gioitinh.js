'use strict';
module.exports = (sequelize, DataTypes) => {
  const GioiTinh = sequelize.define('GioiTinh', {
    ten: DataTypes.STRING
  }, {});
  GioiTinh.associate = function(models) {
    // associations can be defined here
    GioiTinh.hasMany(models.TransactionDetail);
  };
  return GioiTinh;
};