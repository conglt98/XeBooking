var controller = {};

var models = require('../models');
var Transactions = models.Transaction;
var TransactionDetails = models.TransactionDetail;
var Chuyens=models.Chuyen;
var Tuyens=models.Tuyen;
var Xes=models.Xe;
var KhuyenMais = models.KhuyenMai;
var DiaDiems = models.DiaDiem;
var Users = models.User;
var LoaiXes = models.LoaiXe;
var GioiTinh = models.GioiTinh;
var PaymentDetails = models.PaymentDetail;




const Op = require('../models').Sequelize.Op;

controller.getAll = (callback) => {
    Transactions
        .findAll()
        .then(result => {
            callback(result);
        });
}

controller.getOne = (id, callback) => {
    Transactions
        .findAll({
            where: {
                id: id
            },
            include: [{
                model: TransactionDetails,
                required: true,
                attributes: ['ten','viTriGheDat']
            }, {
                model: Chuyens,
                attributes: ['ngayGioKhoiHanh', 'gia'],
                include: [
                    {
                        model: Tuyens,
                        attributes: ['soPhutDiChuyen'],
                        include: [{ model: DiaDiems, as: "xuatphat", attributes: ['ten'] }
                            , { model: DiaDiems, as: "ketthuc", attributes: ['ten'] }
                        ]
                    },
                    {
                        model: Xes, attributes: ['id', 'bienso'], include: {
                            model: LoaiXes,
                            attributes: ['ten']
                        }
                    },
                ]
            }, {
                model: PaymentDetails
            }]
        })
        .then(result => {
            callback(result);
        });
}

controller.getAllBetweenDate = (datefrom, dateto, callback) => {
    Transactions
        .findAll({
            where: {
                createdAt: {
                    [Op.between]: [datefrom, dateto]
                }
            }
        })
        .then(result => {
            callback(result);
        });
}

controller.getAllWithSortDate = (callback) => {
    Transactions
        .findAll({
            order: [
                ['createdAt', 'ASC']
            ]
        })
        .then(result => {
            callback(result);
        });
}

controller.getAllWithSortDateAndRevenue = (callback) => {
    Transactions
        .findAll({
            order: [
                ['createdAt', 'ASC']
            ],
            include: [{
                model: Chuyens,
                attributes: ['id', 'gia']
            },
            {
                model: TransactionDetails,
                attributes: ['ten', 'namSinh', 'viTriGheDat'],
                include: [{ model: GioiTinh, attributes: ['ten'] }]
            },
            { model: KhuyenMais, attributes: ['maKhuyenMai', 'phanTram'] }]
        })
        .then(result => {
            callback(result);
        });
}

controller.searchChuyen = function (chuyen_ID, callback) {
    Transactions.findAll({
            attributes: ['id','ChuyenId'],
            where: {
                ChuyenId: chuyen_ID
            },
            include: [{
                model: TransactionDetails,
                required: true,
                attributes: ['viTriGheDat']
            },
            {
                model: PaymentDetails,
                required: true
            }
        ],
        })
        .then((Transactions) => {
            callback(Transactions);
        });
}

controller.searchUser = function (user_ID, callback) {
    Transactions.findAll({
        attributes: ['id', 'createdAt','PaymentDetailId'],
        include: [
            { model: Users, attributes: ['id'], where: { id: user_ID } },
            {
                model: Chuyens,
                attributes: ['ngayGioKhoiHanh', 'gia'],
                required: true,
                include: [
                    {
                        model: Tuyens,
                        required: true,
                        include: [{ model: DiaDiems, as: "xuatphat", attributes: ['ten'] }
                            , { model: DiaDiems, as: "ketthuc", attributes: ['ten'] }
                        ]
                    },
                    { model: Xes, attributes: ['bienso'] },
                ]
            },
            { model: TransactionDetails, required: true, attributes: ['viTriGheDat'] },
            { model: KhuyenMais, attributes: ['phanTram'] }
        ]
    })
        .then((Transactions) => {
            callback(Transactions);
        });
}


controller.getTransactions = function (callback) {
    Transactions.findAll({
        attributes: ['id', 'createdAt', 'sdt', 'email','PaymentDetailId'],
        include: [
            { model: Users, attributes: ['id'] },
            {
                model: Chuyens,
                attributes: ['ngayGioKhoiHanh', 'gia'],
                include: [
                    {
                        model: Tuyens,
                        attributes: ['soPhutDiChuyen'],
                        include: [{ model: DiaDiems, as: "xuatphat", attributes: ['ten'] }
                            , { model: DiaDiems, as: "ketthuc", attributes: ['ten'] }
                        ]
                    },
                    {
                        model: Xes, attributes: ['id', 'bienso'], include: {
                            model: LoaiXes,
                            attributes: ['ten']
                        }
                    },
                ]
            },
            {
                model: TransactionDetails,
                required: true,
                attributes: ['ten', 'namSinh', 'viTriGheDat'],
                include: [{ model: GioiTinh, attributes: ['ten'] }]
            },
            { model: KhuyenMais, attributes: ['maKhuyenMai', 'phanTram'] },
            { model: PaymentDetails}
        ]
    })
        .then((Transactions) => {
            callback(Transactions);
        });
}


controller.getAllMoney = function (callback) {
    Transactions.findAll({
            attributes: ['id', 'sdt', 'email', 'ChuyenId', 'UserId'],
            include: [{
                model: Chuyens,
                attributes: ['id', 'gia']
            },
            {
                model: TransactionDetails,
                attributes: ['ten', 'namSinh', 'viTriGheDat'],
                include: [{ model: GioiTinh, attributes: ['ten'] }]
            },
            { model: KhuyenMais, attributes: ['maKhuyenMai', 'phanTram'] }
        ]
        })
        .then((Transactions) => {
            callback(Transactions);
        });
}

controller.getAllMoneyBetweenDate = function (datefrom, dateto, callback) {
    Transactions.findAll({
            where: {
                createdAt: {
                    [Op.between]: [datefrom, dateto]
                }
            },
            include: [{
                model: Chuyens,
                required: true,
                attributes: ['id', 'gia']
            },
            {
                model: TransactionDetails,
                attributes: ['ten', 'namSinh', 'viTriGheDat'],
                include: [{ model: GioiTinh, attributes: ['ten'] }]
            },
            { model: KhuyenMais, attributes: ['maKhuyenMai', 'phanTram'] }]
        })
        .then((Transactions) => {
            callback(Transactions);
        });
}

controller.getAllBusTypeBooked = function (callback) {
    Transactions.findAll({
            attributes: ['id', 'ChuyenId'],
            include: [{
                model: Chuyens,
                require: true,
                attributes: ['id', 'XeId'],
                include: [{
                    model: models.Xe,
                    require: true,
                    attributes: ['id', 'LoaiXeId']
                }]
            }]
        })
        .then((Transactions) => {
            callback(Transactions);
        });
}

controller.getAllBusRouteBooked = function (callback) {
    Transactions.findAll({
            attributes: ['id', 'ChuyenId'],
            include: [{
                model: Chuyens,
                require: true,
                attributes: ['id', 'XeId'],
                include: [{
                    model: models.Tuyen,
                    require: true,
                    attributes: ['id', 'xuatphatId', 'ketthucId'],
                    include: [{
                        model: models.DiaDiem,
                        as: "xuatphat",
                        required: true,
                        attributes: ['ten']
                    }, {
                        model: models.DiaDiem,
                        as: "ketthuc",
                        required: true,
                        attributes: ['ten']
                    }]
                }]
            }]
        })
        .then((Transactions) => {
            callback(Transactions);
        });
}

//----------------date chart between
controller.getAllBusRouteBookedBetweenDate = function (datefrom, dateto, callback) {
    Transactions.findAll({
            attributes: ['id', 'ChuyenId', 'createdAt'],
            where: {
                createdAt: {
                    [Op.between]: [datefrom, dateto]
                }
            },
            include: [{
                model: Chuyens,
                require: true,
                attributes: ['id', 'XeId'],
                include: [{
                    model: models.Tuyen,
                    require: true,
                    attributes: ['id', 'xuatphatId', 'ketthucId'],
                    include: [{
                        model: models.DiaDiem,
                        as: "xuatphat",
                        required: true,
                        attributes: ['ten']
                    }, {
                        model: models.DiaDiem,
                        as: "ketthuc",
                        required: true,
                        attributes: ['ten']
                    }]
                }]
            }]
        })
        .then((Transactions) => {
            callback(Transactions);
        });
}

controller.getAllBusTypeBookedBetweenDate = function (datefrom, dateto, callback) {
    Transactions.findAll({
            attributes: ['id', 'ChuyenId', 'createdAt'],
            where: {
                createdAt: {
                    [Op.between]: [datefrom, dateto]
                }
            },
            include: [{
                model: Chuyens,
                require: true,
                attributes: ['id', 'XeId'],
                include: [{
                    model: models.Xe,
                    require: true,
                    attributes: ['id', 'LoaiXeId']
                }]
            }]
        })
        .then((Transactions) => {
            callback(Transactions);
        });
}

controller.getAllWithSortDateBetweenDate = (datefrom, dateto, callback) => {
    Transactions
        .findAll({
            where: {
                createdAt: {
                    [Op.between]: [datefrom, dateto]
                }
            },
            order: [
                ['createdAt', 'ASC']
            ]
        })
        .then(result => {
            callback(result);
        });
}

controller.getAllWithSortDateAndRevenueBetweenDate = (datefrom, dateto, callback) => {
    Transactions
        .findAll({
            where: {
                createdAt: {
                    [Op.between]: [datefrom, dateto]
                }
            },
            order: [
                ['createdAt', 'ASC']
            ],
            include: [{
                model: Chuyens,
                required: true,
                attributes: ['id', 'gia']
            },
            {
                model: TransactionDetails,
                attributes: ['ten', 'namSinh', 'viTriGheDat'],
                include: [{ model: GioiTinh, attributes: ['ten'] }]
            },
            { model: KhuyenMais, attributes: ['maKhuyenMai', 'phanTram'] }]
        })
        .then(result => {
            callback(result);
        });
}

controller.add = function (transation,callback) {
    Transactions
    .create(transation)
    .then(callback);
    // return new Promise((resolve,reject)=>{
    //     Transactions
    //         .create(transation) 
    //         .then(newTransaction=> resolve(newTransaction)); 
    // });
};

controller.update = (transactionId,paymentDetailId,callback)=>{
    Transactions
    .update({
        PaymentDetailId:paymentDetailId
    },{
        where: {id: transactionId}
    })
    .then(callback);
}

controller.detele = (transactionId,callback)=>{
    Transactions
    .detele({
        where: {id: transactionId}
    })
    .then(callback);
}


module.exports = controller;