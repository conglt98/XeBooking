'use strict';
module.exports = (sequelize, DataTypes) => {
  const DiaDiem = sequelize.define('DiaDiem', {
    ten: DataTypes.STRING,
    diachi: DataTypes.STRING,
    sdt: DataTypes.STRING
  }, {});
  DiaDiem.associate = function(models) {
    // associations can be defined here
    DiaDiem.hasMany(models.Tuyen);

  };
  return DiaDiem;
};