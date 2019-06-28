var express = require('express');
var router = express.Router();

var userController = require('../controllers/users');
var controllerDiaDiem = require('../controllers/diadiem');
var controllerKhuyenMai = require('../controllers/khuyenmai');
var controllerChuyen = require('../controllers/chuyen');
var controllerTransaction = require('../controllers/transaction');

var uploadRouter = require('./upload');
router.use('/info/upload',uploadRouter);

function getData(type, transaction){
    switch (type) {
        case 'licensePlate': {
            return (transaction.Chuyen.Xe.bienso)
        }
        case 'time': {
            return (transaction.createdAt)
        }
        case 'departure': {
            // let date = new Date(transaction.Chuyen.ngayGioKhoiHanh);
            return new Date(transaction.Chuyen.ngayGioKhoiHanh);
        }
        case 'information': {
            return transaction.Chuyen.Tuyen.xuatphat.ten + '-' + transaction.Chuyen.Tuyen.ketthuc.ten; 
        }
        case 'price': {
            let km =1;
            if (transaction.KhuyenMai) km =1- transaction.KhuyenMai.phanTram /100;
            return (transaction.Chuyen.gia*km * transaction.TransactionDetails.length);
        }

        default:
            break;
    }
}


function sort(type, isAsc, Transactions){
    let n = Transactions.length;

    for (let i = 0; i<n ; i++){
        for (let j=0; j<i; j++){
            let xi = getData(type,Transactions[i]);
            let xj = getData(type,Transactions[j]);
            if (!isAsc?xi>xj:xi<xj){
                let tmp = Transactions[i];
                Transactions[i] = Transactions[j];
                Transactions[j] = tmp;
            }
        }
    }
}

router.get('/',userController.isLoggedIn,(req,res)=>{
    res.redirect('/users/profile/info');
});

router.get('/info', userController.isLoggedIn, (req, res) => {
    res.locals.isInfo=true;
    res.render('profile');
});


router.get('/history', userController.isLoggedIn, (req, res) => {
    res.locals.isInfo= false
    controllerTransaction.searchUser(res.locals.user.id, (Transactions)=>{

        var page = parseInt(req.query.page);
        var limit = 9;
        page = isNaN(page) ? 1 : page;
        let numPage = Math.ceil(Transactions.length / limit);
        page = (page<=numPage&&page>=1)?page:numPage;
        var pagination = {
            limit: limit,
            page: page,
            totalRows: Transactions.length
        }
        var offset = (page - 1) * limit;
    
        var order = req.query.order;
        if (!order){
            order= "time_desc";
        }
        let tmp = order.split('_');
        sort(tmp[0],tmp[1]=='asc',Transactions);
        res.locals.Transactions = Transactions.slice(offset, offset + limit);;
        // res.locals.Transactions = Transactions;
        res.locals.pagination = pagination;
    res.locals.hasPagination = (pagination.totalRows / limit > 1);
        res.render('profile');
    })
});

var hbs = require('handlebars');


hbs.registerHelper("checkStatus", function (value, options) {
    let date = new Date(value).getTime();
    return date<=(new Date()).getTime();
});

hbs.registerHelper("getTotal", function (price, tds, voucher, options) {
    let pc = 0;
    if (voucher) pc = voucher.phanTram;
    
    return (Math.ceil((1-pc/100)*price))*tds.length;
});

module.exports = router;