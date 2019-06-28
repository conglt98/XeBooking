'use strict';
module.exports = (sequelize, DataTypes) => {
  const KhuyenMai = sequelize.define('KhuyenMai', {
    maKhuyenMai: DataTypes.STRING,
    ngayBatDau: DataTypes.DATE,
    ngayKetThuc: DataTypes.DATE,
    phanTram: DataTypes.INTEGER,
    imagePath: DataTypes.STRING,
    deleted: DataTypes.INTEGER
  }, {});
  KhuyenMai.associate = function(models) {
    // associations can be defined here
    KhuyenMai.hasMany(models.Transaction);
    KhuyenMai.belongsTo(models.Tuyen);
  };
  return KhuyenMai;
};