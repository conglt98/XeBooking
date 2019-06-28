var express = require('express');
var router = express.Router();

var userController = require('../controllers/users');
var controllerDiaDiem = require('../controllers/diadiem');
var controllerTuyen = require('../controllers/tuyen');
var controllerXe = require('../controllers/xe');
var controllerKhuyenMai = require('../controllers/khuyenmai');
var controllerChuyen = require('../controllers/chuyen');
var controllerTransaction = require('../controllers/transaction');

let allchuyen = require('../controllers/chuyen');

const excel = require('node-excel-export');

function getData(type, results) {
    switch (type) {
        case 'licenseplate': {
            return (results.Xe.bienso)
        }
        case 'minutemove': {
            return (results.Tuyen.soPhutDiChuyen)
        }
        case 'departure': {

            return results.ngayGioKhoiHanh
        }
        case 'busroute': {
            return results.Tuyen.xuatphat.ten + '-' + results.Tuyen.ketthuc.ten;
        }
        case 'price': {
            return results.gia;
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

router.get('/delete/:chuyenId', userController.isAdmin, (req, res) => {
    chuyenId = req.params.chuyenId;

    allchuyen.deleteById(chuyenId, (result) => {
        res.redirect("/users/masterdata");
    });
});

router.get('/create', userController.isAdmin, (req, res) => {
    controllerTuyen.getAll(function (tuyens) {
        controllerXe.getAll(function (xes) {
            res.locals.stations = tuyens;
            res.locals.xes = xes;
            res.render("createDeparture");
        })

    })

});

router.put('/edit/:chuyenId/put', userController.isAdmin, (req, res) => {
    var date = new Date(req.body.timedeparture);
    var tuyenidt = req.body.busrouteid.split("-");
    var tuyenid = parseInt(tuyenidt[0]);
    var chuyen = {
        ngayGioKhoiHanh: date,
        gia: req.body.price,
        deleted: 0,
        TuyenId: tuyenid,
        XeId: parseInt(req.body.busid.split("-")[0])
    }
    chuyenId = req.params.chuyenId;;
    allchuyen.modifyById(chuyenId, chuyen, function (chuyenUpdate) {
        if (!chuyenUpdate)
            res.send("failed to edit");
        res.render("successRespond", {
            info: "Update "
        });
    });
});

router.get('/edit/:chuyenId', userController.isAdmin, (req, res) => {
    controllerTuyen.getAll(function (tuyens) {
        controllerXe.getAll(function (xes) {
            res.locals.stations = tuyens;
            res.locals.xes = xes;
            res.locals.chuyenId = req.params.chuyenId;

            allchuyen.getById(res.locals.chuyenId, (result) => {
                res.locals.result = result;
                res.render("editDeparture");
            })

        })

    })

});

router.post('/create/post', userController.isAdmin, (req, res) => {

    var date = new Date(req.body.timedeparture);
    var tuyenidt = req.body.busrouteid.split("-");
    var tuyenid = parseInt(tuyenidt[0]);
    var chuyen = {
        ngayGioKhoiHanh: date,
        gia: req.body.price,
        deleted: 0,
        TuyenId: tuyenid,
        XeId: parseInt(req.body.busid.split("-")[0])
    }
    allchuyen.createChuyen(chuyen, (result) => {
        if (!result)
            res.send("failed to create");
        res.render("successRespond", {
            info: "Create "
        });
    });
});

router.get('/', userController.isAdmin, (req, res) => {
    allchuyen.getAllForMasterdata(results => {

        var order = req.query.order;
        if (!order) {
            order = "departure_desc";
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
            res.render('masterdata');
        })
    });
});



router.get('/export', userController.isAdmin, (req, res) => {
    allchuyen.getAllForMasterdata(results => {
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
            ngayGioKhoiHanh: { // <- the key should match the actual data key
                displayName: 'Time departure', // <- Here you specify the column header
                headerStyle: styles.headerDark, // <- Header style
                cellStyle: styles.cellPink,
                width: 150 // <- width in pixels
            },
            gia: {
                displayName: 'Price',
                headerStyle: styles.headerDark,
                cellStyle: styles.cellPink, // <- Cell style
                width: 120 // <- width in pixels
            },
            TuyenId: {
                displayName: 'Bus route ID',
                headerStyle: styles.headerDark,
                cellStyle: styles.cellPink, // <- Cell style
                width: 120 // <- width in pixels
            },
            XeId: {
                displayName: 'Bus ID',
                headerStyle: styles.headerDark,
                cellStyle: styles.cellPink, // <- Cell style
                width: 120 // <- width in pixels
            },
            id: {
                displayName: 'Departure ID',
                headerStyle: styles.headerDark,
                cellStyle: styles.cellGreen, // <- Cell style
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
            },
            minutemove: {
                displayName: 'Minute move',
                headerStyle: styles.headerDark,
                cellStyle: styles.cellPink, // <- Cell style
                width: 120 // <- width in pixels
            },
            busType: {
                displayName: 'Bus type',
                headerStyle: styles.headerDark,
                cellStyle: styles.cellPink, // <- Cell style
                width: 120 // <- width in pixels
            },
            numSlot: {
                displayName: 'Num slots',
                headerStyle: styles.headerDark,
                cellStyle: styles.cellPink, // <- Cell style
                width: 120 // <- width in pixels
            }
        }

        var dataset = []
        var n = results.length
        for(var i=0;i<n;i++){
            var chuyen = {
                id:results[i].id,
                ngayGioKhoiHanh:results[i].ngayGioKhoiHanh.toString(),
                gia:results[i].gia,
                TuyenId:results[i].TuyenId,
                XeId:results[i].XeId,
                xuatphat:results[i].Tuyen.xuatphat.ten,
                ketthuc:results[i].Tuyen.ketthuc.ten,
                minutemove:results[i].Tuyen.soPhutDiChuyen,
                busType:results[i].Xe.LoaiXe.ten,
                numSlot:results[i].Xe.LoaiXe.socho
            }  
            dataset.push(chuyen);
        }
        

        // Create the excel report.
        // This function will return Buffer
        const report = excel.buildExport(
            [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
                {
                    name: 'Report', // <- Specify sheet name (optional)
                    specification: specification, // <- Report specification
                    data: dataset // <-- Report data
                }
            ]
        );

        // You can then return this straight
        res.attachment('report.xlsx'); // This is sails.js specific (in general you need to set headers)
        return res.send(report);

    });
});


// var hbs = require('handlebars');

function filterFunc(req, res, Chuyens) {
    let departureRange = [req.query.departure_min, req.query.departure_max];
    let palaceLiscene = req.query.palaceLiscene;
    let xuatphat = req.query.from;
    let ketthuc = req.query.to;


    let foundEr = true;
    while (foundEr) {
        foundEr = false;
        Chuyens.forEach((item, index, object) => {
            departureRange = [req.query.departure_min, req.query.departure_max];
            if (!filerChuyen(departureRange, palaceLiscene, xuatphat, ketthuc, item)) {
                object.splice(index, 1);
                foundEr = true;
            }
        });
    }
}

function filterDeparture(departureRange, Chuyen) {
    let date = Chuyen.ngayGioKhoiHanh;
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

function filterPalaceLiscene(palaceLiscene, Chuyen) {
    if (!palaceLiscene) return true;
    palaceLiscene = palaceLiscene.trim();
    let tphone = Chuyen.Xe.bienso.trim();
    return tphone.search(palaceLiscene) >= 0;
}

function filterXuatphat(ten, Chuyen) {
    if (!ten) return true;
    ten = ten.trim();
    let tphone = Chuyen.Tuyen.xuatphat.ten.trim();
    return tphone.search(ten) >= 0;
}

function filterKetthuc(ten, Chuyen) {
    if (!ten) return true;
    ten = ten.trim();
    let tphone = Chuyen.Tuyen.ketthuc.ten.trim();
    return tphone.search(ten) >= 0;
}



function filerChuyen(departureRange, palaceLiscene, xuatphat, ketthuc, Chuyen) {
    return filterDeparture(departureRange, Chuyen) &&
        filterKetthuc(ketthuc, Chuyen) &&
        filterXuatphat(xuatphat, Chuyen) &&
        filterPalaceLiscene(palaceLiscene, Chuyen);
}



module.exports = router;