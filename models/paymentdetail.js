'use strict';
module.exports = (sequelize, DataTypes) => {
  const PaymentDetail = sequelize.define('PaymentDetail', {
    PaymentId: DataTypes.STRING,
    PayerId: DataTypes.STRING,
    Token: DataTypes.STRING

  }, {});
  PaymentDetail.associate = function(models) {
    // associations can be defined here
    
    PaymentDetail.hasMany(models.Transaction);

  };
  return PaymentDetail;
};