'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    sdt: DataTypes.STRING,
    email: DataTypes.STRING
  }, {});
  Transaction.associate = function(models) {
    // associations can be defined here
    Transaction.belongsTo(models.Chuyen);
    Transaction.belongsTo(models.KhuyenMai);
    Transaction.belongsTo(models.User);
    Transaction.hasMany(models.TransactionDetail);
    Transaction.belongsTo(models.PaymentDetail);

  };
  return Transaction;
};