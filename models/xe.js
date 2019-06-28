'use strict';
module.exports = (sequelize, DataTypes) => {
  const Xe = sequelize.define('Xe', {
    bienso: DataTypes.STRING
  }, {});
  Xe.associate = function(models) {
    // associations can be defined here
    Xe.belongsTo(models.LoaiXe);
    Xe.hasMany(models.Chuyen);
  };
  return Xe;
};