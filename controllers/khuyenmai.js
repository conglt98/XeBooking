var controller = {};

var models = require('../models');
var voucher = models.KhuyenMai;
var Tuyens = models.Tuyen;
var DiaDiems = models.DiaDiem;


controller.getAll = function (callback) {
    voucher.findAll()
        .then(function (voucher) {
            callback(voucher);
        });
};

controller.getSumary = function (callback) {
    voucher.findAll({
        where: {
            deleted: 0
        },
        attributes: ['id','maKhuyenMai', 'phanTram', 'imagePath','ngayBatDau','ngayKetThuc','createdAt'],
            include: {
                model: Tuyens,
                attributes: [['id', 'id']],
                include: [{
                    model: DiaDiems,
                    as: "xuatphat",
                    attributes: ['ten', 'diachi', 'sdt']
                }, {
                    model: DiaDiems,
                    as: "ketthuc",
                    attributes: ['ten', 'diachi', 'sdt']
                }]
            }
    }).then(function (voucher) {
        callback(voucher);
    });
}

controller.deleteById = (voucherId, callback) => {
    voucher.findOne({
        where: {
            id: voucherId
        }
    }).then((result) => {
        result.update({
            deleted: 1
        }).then(() => {
            callback(result)
        })
    })
}

controller.getById = (voucherId, callback) => {
    models.KhuyenMai.findOne({
        where: {
            id: voucherId
        }
    }).then((result) => {
        callback(result)
    })
}

controller.modifyById = (voucherId, voucher, callback) => {
    models.KhuyenMai
        .findOne({
            where: {
                id: voucherId
            }
        }).then(function (result) {
            result.update({
                maKhuyenMai: voucher.maKhuyenMai||result.maKhuyenMai,
                ngayBatDau: voucher.ngayBatDau||result.ngayBatDau,
                TuyenId: voucher.TuyenId||result.TuyenId,
                ngayKetThuc: voucher.ngayKetThuc||result.ngayKetThuc,
                phanTram: voucher.phanTram||result.phanTram
            }).then(() => {
                callback(result);
            });
        })
}

controller.createVoucher = function (voucher, callback) {
    models.KhuyenMai
        .create(voucher)
        .then(function (result) {
            callback(result);
        });
}

module.exports = controller;