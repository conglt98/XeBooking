'use strict';
module.exports = (sequelize, DataTypes) => {
  const LoaiXe = sequelize.define('LoaiXe', {
    ten: DataTypes.STRING,
    socho: DataTypes.INTEGER
  }, {});
  LoaiXe.associate = function(models) {
    // associations can be defined here
    LoaiXe.hasMany(models.Xe);
  };
  return LoaiXe;
};