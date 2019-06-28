var controller = {};

var models = require('../models');
var TransactionDetails = models.TransactionDetail;



controller.add = (transationDetail,callback)=>{
    TransactionDetails
    .create(transationDetail)
    .then(callback);
}

controller.detele = (transactionId,callback)=>{
    TransactionDetails
    .detele({
        where: {TransactionID: transactionId}
    })
    .then(callback);
}


module.exports = controller;