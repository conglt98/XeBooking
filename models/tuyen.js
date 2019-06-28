'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tuyen = sequelize.define('Tuyen', {
    soPhutDiChuyen: DataTypes.INTEGER
  }, {});
  Tuyen.associate = function(models) {
    // associations can be defined here
    Tuyen.hasMany(models.Chuyen);
    Tuyen.belongsTo(models.DiaDiem, {as: 'xuatphat'});
    Tuyen.belongsTo(models.DiaDiem, {as: 'ketthuc'});
    Tuyen.hasMany(models.KhuyenMai);
  };
  return Tuyen;
};