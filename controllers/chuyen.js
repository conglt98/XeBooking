var controller = {};

var models = require('../models');
var Chuyens = models.Chuyen;
var Tuyens = models.Tuyen;
var DiaDiems = models.DiaDiem;
var Xes = models.Xe;
var LoaiXes = models.LoaiXe;
var KhuyenMais = models.KhuyenMai;

controller.getAll = function (callback) {
    voucher.findAll()
        .then(function (voucher) {
            callback(voucher);
        });
};


controller.search = function (xuatphatTen, ketthucTen, ngayKhoiHanh, callback) {
    Chuyens.findAll({
            where: {
                deleted: 0
            },
            attributes: ['id', 'ngayGioKhoiHanh', 'gia'],
            include: [{
                    model: Tuyens,
                    required: true,
                    include: [{
                        model: DiaDiems,
                        as: "xuatphat",
                        attributes: ['ten'],
                        where: {
                            ten: xuatphatTen
                        }
                    }, {
                        model: DiaDiems,
                        as: "ketthuc",
                        attributes: ['ten'],
                        where: {
                            ten: ketthucTen
                        }
                    }, {
                        model: KhuyenMais,
                        attributes: ['maKhuyenMai', 'phanTram', 'ngayBatDau', 'ngayKetThuc'],
                    }]
                },
                {
                    model: Xes,
                    include: {
                        model: LoaiXes,
                        attributes: ['ten']
                    }
                }
            ],

        })
        .then((Chuyens) => {
            callback(Chuyens);
        });
}

controller.searchWithVoucher = function (xuatphatTen, ketthucTen, maKhuyenMai, callback) {
    Chuyens.findAll({
            where: {
                deleted: 0
            },
            attributes: ['id', 'ngayGioKhoiHanh', 'gia'],
            include: [{
                    model: Tuyens,
                    required: true,
                    include: [{
                        model: DiaDiems,
                        as: "xuatphat",
                        required: true,
                        attributes: ['ten'],
                        where: {
                            ten: xuatphatTen
                        }
                    }, {
                        model: DiaDiems,
                        as: "ketthuc",
                        required: true,
                        attributes: ['ten'],
                        where: {
                            ten: ketthucTen
                        }
                    }, {
                        model: KhuyenMais,
                        required: true,
                        attributes: ['maKhuyenMai', 'phanTram', 'ngayBatDau', 'ngayKetThuc'],
                        where: {
                            maKhuyenMai: maKhuyenMai
                        }
                    }]
                },
                {
                    model: Xes,
                    include: {
                        model: LoaiXes
                    }
                }
            ],

        })
        .then((Chuyens) => {
            callback(Chuyens);
        });
}

//------------------------------------------------------------------------------
controller.getAllForMasterdata = function (callback) {
    Chuyens.findAll({
            where: {
                deleted: 0
            },
            include: [{
                    model: Tuyens,
                    include: [{
                        model: DiaDiems,
                        as: "xuatphat",
                        attributes: ['ten', 'diachi', 'sdt'],
                    }, {
                        model: DiaDiems,
                        as: "ketthuc",
                        attributes: ['ten', 'diachi', 'sdt'],
                    }, {
                        model: KhuyenMais,
                        attributes: ['maKhuyenMai', 'phanTram', 'ngayBatDau', 'ngayKetThuc'],
                    }]
                },
                {
                    model: Xes,
                    include: {
                        model: LoaiXes,
                        attributes: ['ten', 'socho']
                    }
                }
            ],

        })
        .then((Chuyens) => {
            //console.log(Chuyens[0].Tuyen.KhuyenMais);
            callback(Chuyens);
        });
}

controller.deleteById = (chuyenId, callback) => {
    Chuyens.findOne({
        where: {
            id: chuyenId
        }
    }).then((result) => {
        result.update({
            deleted: 1
        }).then(() => {
            callback(result)
        })
    })
}

controller.getById = (chuyenId, callback) => {
    Chuyens.findOne({
        where: {
            id: chuyenId
        }
    }).then((result) => {
        callback(result)
    })
}

controller.modifyById = (chuyenId, chuyen, callback) => {
    models.Chuyen
        .findOne({
            where: {
                id: chuyenId
            }
        }).then(function (result) {
            result.update({
                gia: chuyen.gia || result.gia,
                ngayGioKhoiHanh: chuyen.ngayGioKhoiHanh || result.ngayGioKhoiHanh,
                TuyenId: chuyen.TuyenId || result.TuyenId,
                XeId: chuyen.XeId || result.XeId,
            }).then(() => {
                callback(result);
            });
        })
}
controller.createChuyen = function (chuyen, callback) {
    models.Chuyen
        .create(chuyen)
        .then(function (result) {
            callback(result);
        });
}


module.exports = controller;