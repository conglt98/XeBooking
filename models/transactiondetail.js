'use strict';
module.exports = (sequelize, DataTypes) => {
  const TransactionDetail = sequelize.define('TransactionDetail', {
    ten: DataTypes.STRING,
    namSinh: DataTypes.INTEGER,
    viTriGheDat: DataTypes.STRING
  }, {  });
  TransactionDetail.associate = function(models) {
    // associations can be defined here
    TransactionDetail.belongsTo(models.GioiTinh);
    TransactionDetail.belongsTo(models.Transaction);
  };
  return TransactionDetail;
};