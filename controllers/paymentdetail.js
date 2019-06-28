let controller = {};

let PaymentDetail = require('../models').PaymentDetail;

controller.add = (paymentDetail,callback)=>{
    PaymentDetail
    .create(paymentDetail)
    .then(callback);
}

controller.find = (paymentId, callback)=>{
    PaymentDetail.findOne({
        where: {
            PaymentId: paymentId
        }
    }).then((result)=>{
        callback(result);
    });
}


module.exports = controller;