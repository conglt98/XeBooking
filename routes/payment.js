var express = require('express');
var router = express.Router();
var nodeMailer = require('nodemailer');
var paypal = require('paypal-rest-sdk');

var waitSecond = 60;


var transactionController = require('../controllers/transaction');
var transactionDetailController = require('../controllers/transactiondetail');
var paymentdetailController = require('../controllers/paymentdetail');

var return_url="/payment/success";
var cancel_url="/payment/error";

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'ARnNOLC0vuF61RsM-blJP5kJbjAfn-hf3dLAH-5j5TcI4SIfjkWURx5oUwEsbVYd35GtDcH_9n6jfUm_',
    'client_secret': 'EHhkR41jpZfCctkKm0jmmYAmPpLljaGmjrsY0kFJJT6TTQULhQBlWNLWSA2_7q7GMS0rHGjgdX4RYuJ2'
});


router.post('/', (req, res) => {
    var fullUrl = req.protocol + '://' + req.get('host');
    return_url = fullUrl + "/payment/success";
    cancel_url = fullUrl + "/payment/error";

    let Chuyen = JSON.parse(decodeURI(req.body.Chuyen));
    let Transaction = JSON.parse(decodeURI(req.body.Transaction));
    let UserId = req.body.UserId;   
    let count = Transaction.TransactionDetails.length;
    let newTransaction = getNewTransaction(Chuyen, Transaction, UserId);
    let newTransactionDetails = getNewTransactionDetails(Transaction);
    // console.log(Transaction);
    PostTransaction(res, count, newTransaction, newTransactionDetails,
        () =>{
            let paypalItems = getPayPalItem(Chuyen,Transaction);
            let create_payment_json = getcreate_payment_json(Transaction, paypalItems);
            
            paypal.payment.create(create_payment_json, function (error, payment) {
                if (error) {
                    console.log(error.response);
                    deleteWaitQueue(newTransaction.ChuyenId,getViTris(newTransactionDetails));
                    res.render('paymentError');
                } else {
                    for (let i = 0; i < payment.links.length; i++) {
                        if (payment.links[i].rel === 'approval_url') {
                            res.redirect(payment.links[i].href);
                        }
                    }
                }
            });
        });
});

function getEmail(transaction,paymentID){
    return `
    <div>
        <h3>XEBOOKING</h3>
        <hr>
        <p>From: `+transaction.Chuyen.Tuyen.xuatphat.ten+`</p>
        <p>To:`+transaction.Chuyen.Tuyen.ketthuc.ten+` </p>
        <hr>
        <p>Departure:`+getDate(transaction.Chuyen.ngayGioKhoiHanh)+`</p>
        <p>Bus:`+ transaction.Chuyen.Xe.LoaiXe.ten + ' - ' +transaction.Chuyen.Xe.bienso+`</p>
        <p>Seats:`+getSeatsString(transaction)+`</p>
        <p>Payment ID:`+paymentID+`</p>
    </div>`;
}

function getSeatsString (transaction){
    let res='';
    transaction.TransactionDetails.forEach(transactionDetail => {
        res += transactionDetail.viTriGheDat +' ';
    });
    return res;
}

function senEmail(transaction, paymentdetail){
    console.log(transaction.Chuyen.ngayGioKhoiHanh)
    let email = transaction.email;
    let sdt = transaction.sdt;
    let ten = transaction.TransactionDetails[0].ten;
    let ngayGioKhoiHanh = getDate (transaction.Chuyen.ngayGioKhoiHanh);
    let xe = transaction.Chuyen.Xe.LoaiXe.ten + ' - ' +transaction.Chuyen.Xe.bienso;
    let PaymentID = paymentdetail.PaymentId;

    let htmlEmailContail = getEmail(transaction,PaymentID)

    console.log(htmlEmailContail);

    let transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'lecongpr98@gmail.com',
            pass: '11081998'
        }
    }); 

    let mailOptions = {
        from: 'CNTN2016@XeBooking.com', // sender address
        to: email, // list of receivers
        subject: "[XeBooking] Booking Complete", // Subject line
        html: htmlEmailContail // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s -sent- %s', info.messageId, info.response);

        res.render("successRespond", {
            info: "Email was sent "
        });
    });
}

router.get('/success', function (req, res) {
    res.locals.note = "Payment Error";
    if (!req.query.ID){
        res.render('paymentSuccess');
        return;
    }
    let TransactionId = req.query.ID;
    let PaymentId = req.query.paymentId;
    let PayerId = req.query.PayerID;
    let Token = req.query.token;
    let newPaymentDetail = {
        "PaymentId":PaymentId,
        "PayerId":PayerId,
        "Token":Token
    }

    paymentdetailController.find(PaymentId, (Payment)=>{
        if (Payment) {
            res.render('paymentSuccess');
            return;
        }
        transactionController.getOne(parseInt(TransactionId), transaction =>{
            senEmail(transaction[0], newPaymentDetail);
            
            let email = transaction.email;
    
        });
        paymentdetailController
            .add(newPaymentDetail ,paymentdetail => {
                transactionController
                .update(TransactionId,paymentdetail.id,()=>{
                    res.render('paymentSuccess');
                });
                
            });
    })
    

    
});

router.get('/error', function (req, res) {
    res.render('paymentError');
});

function getViTris(newTransactionDetails){
    let  vitris = [];
    newTransactionDetails.forEach(element => {
        vitris.push(element.viTriGheDat);
    });
    return vitris;
}

var TransactionIsBeingPaid = [];

function addToWaitQueue(chuyenId, vitris) {
    for (let i = 0; i < TransactionIsBeingPaid.length; i++) {
        if (TransactionIsBeingPaid[i].ChuyenId == chuyenId) {
            vitris.forEach(vitri => {
                TransactionIsBeingPaid[i].vitris.push(vitri);
            });
        }
    }
    console.log(chuyenId,vitris);
    setTimeOutWaitQueueElement(chuyenId, vitris);
}

function setTimeOutWaitQueueElement(chuyenId, vitris){
    setTimeout(function(){
        for (let i = 0; i < TransactionIsBeingPaid.length; i++) {
            if (TransactionIsBeingPaid[i].ChuyenId == chuyenId) {
                vitris.forEach(vitri => {
                    let indexOfVitri = TransactionIsBeingPaid[i].vitris.indexOf(vitri);
                    if (indexOfVitri>=0){
                        TransactionIsBeingPaid[i].vitris.splice(indexOfVitri,1);
                    }
                });
            }
        }
        console.log('TIME OUT '+ chuyenId + vitris);
    }, waitSecond);
}

function checkEmtyWaitQueue(ChuyenId, vitris){
    console.log(ChuyenId,vitris);
    let checkExistBooking = false;
    let checkExistChuyenId = false;

    for (let indexBeingPaid = 0; indexBeingPaid< TransactionIsBeingPaid.length; indexBeingPaid++){
        if (TransactionIsBeingPaid[indexBeingPaid].ChuyenId == ChuyenId){
            for (let indexViTri =0; indexViTri< vitris.length;indexViTri++){
                if (TransactionIsBeingPaid[indexBeingPaid].vitris.indexOf(vitris[indexViTri])>=0){
                    checkExistBooking = true;
                    break;
                }
            }
            checkExistChuyenId = true;
            if (!checkExistBooking){
                addToWaitQueue(ChuyenId,vitris);
            }
        }
    }
    if (!checkExistChuyenId){
        let item = {
            'ChuyenId':ChuyenId,
            'vitris':[]

        }
        TransactionIsBeingPaid.push(item);
        addToWaitQueue(ChuyenId,vitris);
    }
    return !checkExistBooking;
}


function deleteWaitQueue(ChuyenId, vitris){
    for (let i = 0; i< TransactionIsBeingPaid.length; i++){
        if (TransactionIsBeingPaid[i].ChuyenId == ChuyenId){
            for (let j =0; j< vitris.length;j++){
                if (TransactionIsBeingPaid[i].vitris.indexOf(vitris[j])>=0){
                    TransactionIsBeingPaid[i].vitris.splice(TransactionIsBeingPaid[i].vitris.indexOf(vitris[j]), 1);
                }

            }
        }
    }
}

function PostTransaction(res, count, newTransaction, newTransactionDetails,callback){

    if (checkEmtyWaitQueue(newTransaction.ChuyenId,getViTris(newTransactionDetails))){
        transactionController
        .add(newTransaction ,transaction => {
            return_url += "?ID="+transaction.id;
            for (let i = 0; i < count; i++) {
                newTransactionDetails[i].TransactionId = transaction.id;
                transactionDetailController
                    .add(newTransactionDetails[i], transactionDetail => {
                        if (i == count - 1) {
                            console.log("complete Write To Server");
                            callback();
                        }
                    });
            }
        });
    }
    else{
        res.locals.note =":( You are a little bit late! Please try again!"
        res.render('paymentError');
    }

}


function getDate(value){
    let date = new Date(value);
    var options = {
        hour12: false,
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    };
    return date.toLocaleString('en-US', options);
}

function getDay(value){
    let date = new Date(value);
    var options = {
        hour12: false,
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    };
    return date.toLocaleString('en-US', options);
}

function getHour(value){
    let date = new Date(value);
    var options = {
        hour12: false,
        hour: 'numeric',
        minute: 'numeric'
    };
    return date.toLocaleString('en-US', options);
}

function getNewTransaction(Chuyen, Transaction, UserId){
    let newTransaction = {
        'sdt': Transaction.sdt,
        'email': Transaction.email,
        'ChuyenId': Chuyen.id,
        'KhuyenMaiId': Chuyen.Tuyen.KhuyenMais.length>0?Chuyen.Tuyen.KhuyenMais[0].id:null,
        'UserId': UserId,
        'createAt': Date.now(),
        'updateAt': Date.now()
    };
    return newTransaction;
}

function getNewTransactionDetails(Transaction){
    let count = Transaction.TransactionDetails.length;
    let newTransactionDetails = [];
    for (let i = 0; i < count; i++) {
        let tmp = {
            'viTriGheDat': Transaction.TransactionDetails[i].viTriGheDat,
            'ten': Transaction.TransactionDetails[i].ten,
            'namSinh': parseInt(Transaction.TransactionDetails[i].namSinh),
            'GioiTinhId': parseInt(Transaction.TransactionDetails[i].GioiTinhId),
            'TransactionId': null,
            'createAt': Date.now(),
            'updateAt': Date.now()
        }
        newTransactionDetails.push(tmp);
    }
    return newTransactionDetails;
}

function getPayPalItem(Chuyen, Transaction){
    let count = Transaction.TransactionDetails.length;
    let paypalItems = [];
    let item ;
    let itemDescription = "Departure: " + getDate(Chuyen.ngayGioKhoiHanh);

    item = {
        "name": count + " " + Chuyen.Xe.LoaiXe.ten + ": " + Chuyen.Tuyen.xuatphat.ten + " - " + Chuyen.Tuyen.ketthuc.ten,
        "price": parseInt(Chuyen.gia),
        "currency": "USD",
        "quantity": count,
        "description": itemDescription
    };
    if (Chuyen.Tuyen.KhuyenMais.length > 0) {
        let voucher = Chuyen.Tuyen.KhuyenMais[0];
        let discountVal = Math.ceil((100 - parseInt(voucher.phanTram) )* parseInt(Chuyen.gia) / 100);
        item.description += "\nDiscount: " + voucher.phanTram + "%";
        item.price = discountVal;
    }
    paypalItems.push(item);
    return paypalItems;
}

function getcreate_payment_json(Transaction, paypalItems){
    var create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": return_url,
            "cancel_url": cancel_url
        },
        "application_context": {
            "shipping_preference": 'NO_SHIPPING'
        },
        "transactions": [{
            "item_list": {
                "items": paypalItems
            },
            "amount": {
                "currency": "USD",
                "total": Transaction.total
            }
        }]
    };
    return create_payment_json;
}

module.exports = router;