var express = require('express');
var router = express.Router();

var userController = require('../controllers/users');
var controllerDiaDiem = require('../controllers/diadiem');
var controllerTuyen = require('../controllers/tuyen');
var controllerXe = require('../controllers/xe');
var controllerKhuyenMai = require('../controllers/khuyenmai');
let allchuyen = require('../controllers/chuyen');
const excel = require('node-excel-export');



//Khai báo biến
let models = require('../models');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './public/img/A1/',
    filename: function (req, file, cb) {
        cb(null, req.session.user.email + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024
    },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('myFile');

// Check File Type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) return cb(null, true);
}



function getData(type, results) {
    switch (type) {
        case 'voucher': {
            return (results.maKhuyenMai)
        }
        case 'timestart': {
            return (results.ngayBatDau)
        }
        case 'timeend': {

            return results.ngayKetThuc
        }
        case 'busroute': {
            return results.Tuyen.xuatphat.ten + '-' + results.Tuyen.ketthuc.ten;
        }
        case 'discount': {
            return results.phanTram;
        }

        default:
            break;
    }
}


function sort(type, isAsc, res) {
    let n = res.length;

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < i; j++) {
            let xi = getData(type, res[i]);
            let xj = getData(type, res[j]);
            if (!isAsc ? xi > xj : xi < xj) {
                let tmp = res[i];
                res[i] = res[j];
                res[j] = tmp;
            }
        }
    }
}

router.get('/delete/:voucherId', userController.isAdmin, (req, res) => {
    voucherId = req.params.voucherId;

    controllerKhuyenMai.deleteById(voucherId, (result) => {
        res.redirect("/users/voucherdata");
    });
});

router.get('/create', userController.isAdmin, (req, res) => {
    controllerTuyen.getAll(function (tuyens) {

        res.locals.stations = tuyens;
        res.render("createVoucher");
    })

});

router.post('/create/post', userController.isAdmin, (req, res) => {

    var timestart = new Date(req.body.timestart);
    var timeend = new Date(req.body.timeend);
    var tuyenidt = req.body.busrouteid.split("-");
    var tuyenid = parseInt(tuyenidt[0]);
    var voucher = {
        maKhuyenMai: req.body.voucher,
        ngayBatDau: timestart,
        deleted: 0,
        TuyenId: tuyenid,
        ngayKetThuc: timeend,
        phanTram: req.body.discount,
        imagePath: '/img/A1/noImage.jpg'
    }

    controllerKhuyenMai.createVoucher(voucher, (result) => {
        if (!result)
            res.send("failed to create");
        else {
            res.render("successRespond", {
                info: "Create "
            });
        }
    });
});



router.get('/edit/:voucherId', userController.isAdmin, (req, res) => {
    controllerTuyen.getAll(function (tuyens) {

        res.locals.stations = tuyens;
        res.locals.voucherId = req.params.voucherId;

        controllerKhuyenMai.getById(res.locals.voucherId, (result) => {
            res.locals.result = result;
            res.render("editVoucher");
        })

    })

});

router.put('/edit/:voucherId/put', userController.isAdmin, (req, res) => {
    var timestart = new Date(req.body.timestart);
    var timeend = new Date(req.body.timeend);
    var tuyenidt = req.body.busrouteid.split("-");
    var tuyenid = parseInt(tuyenidt[0]);
    var voucher = {
        maKhuyenMai: req.body.voucher,
        ngayBatDau: timestart,
        TuyenId: tuyenid,
        ngayKetThuc: timeend,
        phanTram: req.body.discount
    }
    voucherId = req.params.voucherId;;
    controllerKhuyenMai.modifyById(voucherId, voucher, function (voucherUpdate) {
        if (!voucherUpdate)
            res.send("failed to edit");
        res.render("successRespond", {
            info: "Update "
        });
    });
});

router.post('/edit/:voucherId/upload', userController.isAdmin, (req, res) => {
    voucherId = req.params.voucherId;
    upload(req, res, (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                
                controllerTuyen.getAll(function (tuyens) {

                    res.locals.stations = tuyens;
                    res.locals.voucherId = req.params.voucherId;
            
                    controllerKhuyenMai.getById(res.locals.voucherId, (result) => {
                        res.locals.result = result;
                        res.render("editVoucher",{error : "Kích thước ảnh vượt quá 2MB!"});
                    })
            
                })
            }
        } else {
            if (req.file == undefined) {
                
                controllerTuyen.getAll(function (tuyens) {

                    res.locals.stations = tuyens;
                    res.locals.voucherId = req.params.voucherId;
            
                    controllerKhuyenMai.getById(res.locals.voucherId, (result) => {
                        res.locals.result = result;
                        res.render("editVoucher",{error : "Không chọn ảnh nên không đổi ảnh!"});
                    })
            
                })
            } else {
                //Sau khi có ảnh RAW, ta tiến hành tạo ảnh kích thước nhỏ hơn vào buffer. 
                //Kích thước mới ở đây là width: 400px, height: 400px
                //Sau đó, ta ghi đè ảnh mới này lên ảnh RAW.
                sharp('./public/img/A1/' + `${req.file.filename}`)
                    .resize(500, 675)
                    .toBuffer(function (err, buffer) {
                        fs.writeFileSync('./public/img/A1/' + `${req.file.filename}`, buffer);
                    });
                sharp.cache(false);

                //Tiến hành lưu đường dẫn của ảnh xuống CSDL
                let filename = `/img/A1/${req.file.filename}`;
                controllerKhuyenMai.getById(voucherId, (result) => {
                    var oldfilename = "";
                    if (result.imagePath) {
                        oldfilename = path.basename(result.imagePath);
                    }
                    models.KhuyenMai
                        .update({
                            imagePath: filename
                        }, {
                            where: {
                                id: voucherId
                            }
                        })
                        .then(function () {
                            //Xóa ảnh (ảnh không xài nữa) => Tiết kiệm bộ nhớ

                            if (oldfilename !== "" && oldfilename!=="noImage.jpg") {
                                var oldpath = './public/img/A1/' + oldfilename;
                                fs.stat(oldpath, function (err, stats) {
                                    if (!err) fs.unlinkSync(oldpath);
                                });
                            }
                            controllerTuyen.getAll(function (tuyens) {

                                res.locals.stations = tuyens;
                                res.locals.voucherId = req.params.voucherId;
                        
                                controllerKhuyenMai.getById(res.locals.voucherId, (result) => {
                                    res.locals.result = result;
                                    res.render("editVoucher",{success : "Thay đổi ảnh thành công"});
                                })
                        
                            })
                        });

                })
            }
        }
    });

});

router.get('/', userController.isAdmin, (req, res) => {
    controllerKhuyenMai.getSumary(results => {

        var order = req.query.order;
        if (!order) {
            order = "voucher_desc";
        }
        let tmp = order.split('_');

        filterFunc(req, res, results);
        sort(tmp[0], tmp[1] == 'asc', results);

        var page = parseInt(req.query.page);
        var limit = 9;
        page = isNaN(page) ? 1 : page;
        let numPage = Math.ceil(results.length / limit);
        page = (page <= numPage && page >= 1) ? page : numPage;
        var pagination = {
            limit: limit,
            page: page,
            totalRows: results.length
        }
        var offset = (page - 1) * limit;


        res.locals.results = results.slice(offset, offset + limit);;

        res.locals.pagination = pagination;
        res.locals.hasPagination = (pagination.totalRows / limit > 1);

        controllerDiaDiem.getAll(function (stations) {
            res.locals.stations = stations;
            res.render('voucherdata');
        })
    });
});



router.get('/export', userController.isAdmin, (req, res) => {
    controllerKhuyenMai.getSumary(results => {
        // console.log(new Date(results[0].ngayGioKhoiHanh)+" "+
        // results[0].gia+" "+results[0].TuyenId+" "+results[0].XeId);
        // console.log(results[0].ngayGioKhoiHanh);

        const styles = {
            headerDark: {
                fill: {
                    fgColor: {
                        rgb: 'FF000000'
                    }
                },
                font: {
                    color: {
                        rgb: 'FFFFFFFF'
                    },
                    sz: 14,
                    bold: true,
                    underline: true
                }
            },
            cellPink: {
                fill: {
                    fgColor: {
                        rgb: 'FFFFCCFF'
                    }
                }
            },
            cellGreen: {
                fill: {
                    fgColor: {
                        rgb: 'FF00FF00'
                    }
                }
            }
        };

        //Here you specify the export structure
        const specification = {
            id: { // <- the key should match the actual data key
                displayName: 'ID', // <- Here you specify the column header
                headerStyle: styles.headerDark, // <- Header style
                cellStyle: styles.cellPink,
                width: 100 // <- width in pixels
            },
            maKhuyenMai: {
                displayName: 'Voucher',
                headerStyle: styles.headerDark,
                cellStyle: styles.cellPink, // <- Cell style
                width: 120 // <- width in pixels
            },
            ngayBatDau: {
                displayName: 'Time start',
                headerStyle: styles.headerDark,
                cellStyle: styles.cellPink, // <- Cell style
                width: 120 // <- width in pixels
            },
            ngayKetThuc: {
                displayName: 'Time end',
                headerStyle: styles.headerDark,
                cellStyle: styles.cellPink, // <- Cell style
                width: 120 // <- width in pixels
            },
            phanTram: {
                displayName: 'Discount',
                headerStyle: styles.headerDark,
                cellStyle: styles.cellPink, // <- Cell style
                width: 100 // <- width in pixels
            },
            xuatphat: {
                displayName: 'Departure station',
                headerStyle: styles.headerDark,
                cellStyle: styles.cellPink, // <- Cell style
                width: 120 // <- width in pixels
            },
            ketthuc: {
                displayName: 'Arrival station',
                headerStyle: styles.headerDark,
                cellStyle: styles.cellPink, // <- Cell style
                width: 120 // <- width in pixels
            }
        }

        var dataset = []
        var n = results.length
        for (var i = 0; i < n; i++) {
            var voucher = {
                id: results[i].id,
                maKhuyenMai: results[i].maKhuyenMai,
                ngayBatDau: results[i].ngayBatDau.toString(),
                ngayKetThuc: results[i].ngayKetThuc.toString(),
                phanTram: results[i].phanTram,
                xuatphat: results[i].Tuyen.xuatphat.ten,
                ketthuc: results[i].Tuyen.ketthuc.ten
            }
            dataset.push(voucher);
        }


        // Create the excel report.
        // This function will return Buffer
        const report = excel.buildExport(
            [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
                {
                    name: 'Voucher', // <- Specify sheet name (optional)
                    specification: specification, // <- Report specification
                    data: dataset // <-- Report data
                }
            ]
        );

        // You can then return this straight
        res.attachment('voucher.xlsx'); // This is sails.js specific (in general you need to set headers)
        return res.send(report);

    });
});


// var hbs = require('handlebars');

function filterFunc(req, res, vouchers) {
    let departureRange = [req.query.departure_min, req.query.departure_max];
    let xuatphat = req.query.from;
    let ketthuc = req.query.to;
    let voucherQ = req.query.voucher;

    let foundEr = true;
    while (foundEr) {
        foundEr = false;
        vouchers.forEach((item, index, object) => {
            departureRange = [req.query.departure_min, req.query.departure_max];
            if (!filerVoucher(departureRange,voucherQ, xuatphat, ketthuc, item)) {
                object.splice(index, 1);
                foundEr = true;
            }
        });
    }
}

function filterDeparture(departureRange, voucher) {
    let date = voucher.ngayBatDau;
    if (departureRange[0]) {
        departureRange[0] = new Date(departureRange[0]);
        if (date < departureRange[0]) return false;
    }
    if (departureRange[1]) {
        departureRange[1] = new Date(departureRange[1]);
        if (date > departureRange[1]) return false;
    }
    return true;
}

function filterVoucher(voucherQ, voucher) {
    if (!voucherQ) return true;
    voucherQ = voucherQ.trim();
    let tphone = voucher.maKhuyenMai.trim();
    return tphone.search(voucherQ) >= 0;
}

function filterXuatphat(ten, voucher) {
    if (!ten) return true;
    ten = ten.trim();
    let tphone = voucher.Tuyen.xuatphat.ten.trim();
    return tphone.search(ten) >= 0;
}

function filterKetthuc(ten, voucher) {
    if (!ten) return true;
    ten = ten.trim();
    let tphone = voucher.Tuyen.ketthuc.ten.trim();
    return tphone.search(ten) >= 0;
}



function filerVoucher(departureRange,voucherQ, xuatphat, ketthuc, voucher) {
    return filterDeparture(departureRange, voucher) &&
        filterKetthuc(ketthuc, voucher) &&
        filterXuatphat(xuatphat, voucher)&&
        filterVoucher(voucherQ, voucher);
}



module.exports = router;