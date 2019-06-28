var express = require('express');
var router = express.Router();

var controllerDiaDiem = require('../controllers/diadiem');
var controllerKhuyenMai = require('../controllers/khuyenmai');
var controllerChuyen = require('../controllers/chuyen');
var controllerTransaction = require('../controllers/transaction');


var _stations = null;

router.get('/', function (req, res) {
    if (req.user) {
        req.session.user = req.user;
        res.locals.user = req.user;
        res.locals.isLoggedIn = true;
    }

    let visitController = require('../controllers/logvisit');
    visitController
        .add({
            visit: Date.now()
        });

    controllerDiaDiem.getAll(function (stations) {
        res.locals.stations = stations;
        if (!_stations) _stations = stations;
        controllerKhuyenMai.getSumary(function (vouchers) {
            filterVouchers(vouchers);
            var caroselInfors = {
                numberOfCarousel: Math.ceil(vouchers.length / 3.0),
                carouselVouchers: [],
            }
            let numberOfCarousel = Math.ceil(vouchers.length / 3.0);
            for (let i = 0; i < numberOfCarousel; i++) {
                let vouchersPerCarousel = {
                    idVouchers: []
                };
                vouchersPerCarousel.idVouchers.push(i * 3);
                vouchersPerCarousel.idVouchers.push((i * 3 + 1) % vouchers.length);
                vouchersPerCarousel.idVouchers.push((i * 3 + 2) % vouchers.length);
                caroselInfors.carouselVouchers.push(vouchersPerCarousel);
            }

            res.locals.carouselInfors = caroselInfors;
            res.locals.vouchers = vouchers;

            res.render('index');
        });
    });

});




router.get('/search', function (req, res) {
    var xuatphatId = req.query.xuatphatId;
    var ketthucId = req.query.ketthucId;
    var ngayKhoiHanh = req.query.ngayKhoiHanh;
    var maKhuyenMai = req.query.maKhuyenMai;
    res.locals.isUserSession = req.session.user;
    if (maKhuyenMai) {
        controllerChuyen.searchWithVoucher(xuatphatId, ketthucId, maKhuyenMai, (Chuyens) => {
            filterNgayKhoiHanh(ngayKhoiHanh, Chuyens);
            filterWithMaKhuyenMai(Chuyens);
            res.locals.hasVoucher = true;
            controllerDiaDiem.getAll(function (stations) {
                res.locals.stations = stations;
                let count = 0;
                res.locals.Transactions = [];
                Chuyens.forEach(element => {
                    controllerTransaction.searchChuyen(element.id, (Transactions) => {
                        res.locals.Transactions.push(Transactions);
                        count++;
                        if (count == Chuyens.length) {
                            filterFunc(req, res, Chuyens);
                            pagination(req, res, Chuyens);
                            res.render('detail');
                        }
                    });
                });
            });

        });
    } else
        controllerChuyen.search(xuatphatId, ketthucId, ngayKhoiHanh, (Chuyens) => {
            // res.locals.Chuyens = Chuyens;
            filterNgayKhoiHanh(ngayKhoiHanh, Chuyens);
            console.log("xxx");
            filterMaKhuyenMai(Chuyens);

            controllerDiaDiem.getAll(function (stations) {

                res.locals.stations = stations;
                let count = 0;
                res.locals.Transactions = [];
                if (Chuyens.length == 0) res.render('detail');
                Chuyens.forEach(element => {
                    controllerTransaction.searchChuyen(element.id, (Transactions) => {
                        res.locals.Transactions.push(Transactions);
                        count++;
                        if (count == Chuyens.length) {
                            filterFunc(req, res, Chuyens);
                            pagination(req, res, Chuyens);
                            res.render('detail');
                        }
                    });
                });
            });

        });

});



router.get('/termsConditions', function (req, res) {
    res.render('termsConditions');
});

// });
//contact us
router.post('/message', (req, res) => {
    let contactController = require('../controllers/contact');
    contactController
        .add({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            submited: Date.now(),
            message: req.body.message,
            checkStatus: false
        })
        .then(newContact => {
            res.render('contact', {
                message: 'Thank you for your concern! We will contact you soon.'
            });
        });
});

// __________________________________________
//
// HANDLEBARS HELPER
//
//____________________________________________


var hbs = require('handlebars');
hbs.registerHelper('ifEquals', function (arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

hbs.registerHelper('getVoucherKey', function (arg1, arg2, options) {
    return arg1[parseInt(arg2)].maKhuyenMai;
});

hbs.registerHelper('stringify', function (arg1, options) {
    return JSON.stringify(arg1);
});


hbs.registerHelper('getVoucherImagePath', function (arg1, arg2, options) {
    return arg1[parseInt(arg2)].imagePath;
});

hbs.registerHelper('getVoucherSaleOff', function (arg1, arg2, options) {
    return arg1[parseInt(arg2)].phanTram;
});

hbs.registerHelper('getDateRange', function (arg1, arg2, options) {
    let voucher = arg1[parseInt(arg2)];
    var options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    };
    let strDay = new Date(voucher.ngayBatDau);
    let endDay = new Date(voucher.ngayKetThuc);

    return strDay.toLocaleString('en-US', options) + " - " + endDay.toLocaleString('en-US', options);

});

hbs.registerHelper('getVoucherName', function (arg1, arg2, options) {
    return arg1[parseInt(arg2)].Tuyen.xuatphat.ten + " - " + arg1[parseInt(arg2)].Tuyen.ketthuc.ten;
});

hbs.registerHelper('getHref', function (arg1, arg2, options) {
    let strPl = arg1[parseInt(arg2)].Tuyen.xuatphat.ten;
    let endPl = arg1[parseInt(arg2)].Tuyen.ketthuc.ten;
    let maKM = arg1[parseInt(arg2)].maKhuyenMai;
    return '/search?xuatphatId=' + strPl + '&ketthucId=' + endPl + '&maKhuyenMai=' + maKM;
});


hbs.registerHelper("checkSeater", function (value, options) {
    return value != "Sleeper";
});

hbs.registerHelper("getDate", function (value, options) {
    let date = new Date(value);
    var options = {
        hour12: false,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    };
    return date.toLocaleString('en-US', options);
});

hbs.registerHelper("getDate1", function (value, options) {
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
});


hbs.registerHelper("getArrival1", function (departure, time, options) {
    let date = new Date(departure.getTime() + time * 60000);
    var options = {
        hour12: false,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    };
    return date.toLocaleString('en-US', options);
});

hbs.registerHelper("getTimeDeparture", function (departure, options) {
    let date = new Date(departure);
    var options = {
        hour12: false,
        hour: 'numeric',
        minute: 'numeric'
    };
    return date.toLocaleString('en-US', options);
});

hbs.registerHelper("getTimeArrival", function (departure, time, options) {
    let date = new Date(departure.getTime() + time * 60000);
    var options = {
        hour12: false,
        hour: 'numeric',
        minute: 'numeric'
    };
    return date.toLocaleString('en-US', options);
});

hbs.registerHelper('list', function (transactions, chuyenid, options) {
    let res = "";
    let n = transactions.length;
    for (let i = 0; i < n; i++) {
        if (transactions[i][0]) {
            if (transactions[i][0].ChuyenId == chuyenid) {
                transactions[i].forEach(element => {
                    element.TransactionDetails.forEach(td => {
                        res += td.viTriGheDat + ';';
                    });
                });
            }
        }
    }

    return (res);
});

hbs.registerHelper('caculateNewPrice', function (phantram, gia, options) {
    let price = Math.ceil((100 - parseInt(phantram)) * parseInt(gia) / 100);
    return (price);
});

hbs.registerHelper('HasVoucher', function (chuyen) {
    return (chuyen.Tuyen.KhuyenMais.length > 0)
});


hbs.registerHelper('getPrice', function (chuyen, options) {
    let price;
    let phanTram = 0;
    if (chuyen.Tuyen.KhuyenMais) {
        let kms = chuyen.Tuyen.KhuyenMais;
        kms.forEach(element => {
            if (element.phanTram > phanTram) phanTram = element.phanTram
        });
    }
    price = Math.ceil((100 - parseInt(phanTram)) * parseInt(chuyen.gia) / 100);
    return (price);
});

// ___________________________________
//
// HANDLE FUNCTION
// ___________________________________


function getData(type, chuyen) {
    switch (type) {
        case 'licensePlate': {
            return (chuyen.Xe.bienso)
        }
        case 'type': {
            return (chuyen.Xe.LoaiXe.ten)
        }
        case 'departure': {
            return (chuyen.ngayGioKhoiHanh)
        }
        case 'arrival': {
            let time = chuyen.Tuyen.soPhutDiChuyen;
            return new Date(chuyen.ngayGioKhoiHanh.getTime() + time * 60000);
        }
        case 'price': {
            return (chuyen.gia);
        }

        default:
            break;
    }
}

function sort(type, isAsc, Chuyens) {
    let n = Chuyens.length;

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < i; j++) {
            let xi = getData(type, Chuyens[i]);
            let xj = getData(type, Chuyens[j]);
            if (!isAsc ? xi > xj : xi < xj) {
                let tmp = Chuyens[i];
                Chuyens[i] = Chuyens[j];
                Chuyens[j] = tmp;
            }
        }
    }
}

function samedate(d1, d2) {
    d1 = new Date(d1);
    return d1.getDate() == d2.getDate() && d1.getYear() == d2.getYear() && d1.getMonth() == d2.getMonth();
}

function filterNgayKhoiHanh(ngayKhoiHanh, Chuyens) {
    if (!ngayKhoiHanh) return;
    let foundEr = true;
    while (foundEr) {
        foundEr = false;
        Chuyens.forEach((item, index, object) => {
            if (!samedate(ngayKhoiHanh, item.ngayGioKhoiHanh)) {
                object.splice(index, 1);
                foundEr = true;
            }
        });
    }
}

function inRange(ds, df, d) {
    return ((ds.getTime() <= d.getTime()) && (df.getTime() >= d.getTime()));
}


function filterWithMaKhuyenMai(Chuyens) {
    let foundEr = true;
    while (foundEr) {
        foundEr = false;
        Chuyens.forEach((item, index, object) => {
            let ngayBatDau = new Date(item.Tuyen.KhuyenMais[0].ngayBatDau);
            let ngayKetThuc = new Date(item.Tuyen.KhuyenMais[0].ngayKetThuc);
            ngayKetThuc.setHours(23);
            ngayKetThuc.setMinutes(59);
            ngayKetThuc.setSeconds(59);
            if (!inRange(ngayBatDau, ngayKetThuc, item.ngayGioKhoiHanh)) {
                object.splice(index, 1);
                foundEr = true;
            }
        });
    }

}

function filterKM(item) {
    let foundEr = false;
    item.Tuyen.KhuyenMais.forEach((km, id, obs) => {
        let ngayBatDau = new Date(km.ngayBatDau);
        let ngayKetThuc = new Date(km.ngayKetThuc);
        let ngay = new Date(item.ngayGioKhoiHanh);
        ngayBatDau.setHours(0);
        ngayBatDau.setMinutes(0);
        ngayBatDau.setSeconds(0);
        ngayKetThuc.setHours(23);
        ngayKetThuc.setMinutes(59);
        ngayKetThuc.setSeconds(59);
        if (!inRange(ngayBatDau, ngayKetThuc, ngay)) {
            obs.splice(id, 1);
            foundEr = true;
        }
    });
    return foundEr;
}

function filterMaKhuyenMai(Chuyens) {
    let n = Chuyens.length;
    for (let i = 0; i < n; i++) {
        let item = Chuyens[i];
        while (filterKM(item));

    }
}

function pagination(req, res, Chuyens) {
    var page = parseInt(req.query.page);
    var limit = 9;
    page = isNaN(page) ? 1 : page;
    let numPage = Math.ceil(Chuyens.length / limit);
    page = (page <= numPage && page >= 1) ? page : numPage;
    var pagination = {
        limit: limit,
        page: page,
        totalRows: Chuyens.length
    }
    var offset = (page - 1) * limit;

    var order = req.query.order;
    if (!order) {
        order = "departure_asc";
    }
    let tmp = order.split('_');
    sort(tmp[0], tmp[1] == 'asc', Chuyens);
    res.locals.Chuyens = Chuyens.slice(offset, offset + limit);;
    res.locals.pagination = pagination;
    res.locals.hasPagination = (pagination.totalRows / limit > 1);
}

function setDateTime(date, time, seconds) {
    let tmp = new Date(date);
    let t = time.split(':');

    tmp.setHours(0);
    tmp.setMinutes(0);
    tmp.setSeconds(0);

    t = parseInt(t[0]) * 3600 + parseInt(t[1]) * 60 + seconds;
    return new Date(tmp.getTime() + t * 1000);
}

function filerChuyen(departureRange, priceRange, bustype, chuyen) {
    let departureChuyen = chuyen.ngayGioKhoiHanh;
    if ((new Date()).getTime() > chuyen.ngayGioKhoiHanh) {
        return false;
    }
    if (departureRange[0] || departureRange[1]) {
        if (!departureRange[0]) departureRange[0] = '0:0';
        departureRange[0] = setDateTime(departureChuyen, departureRange[0], 0);
        if (!departureRange[1]) departureRange[1] = '23:59';
        departureRange[1] = setDateTime(departureChuyen, departureRange[1], 59);
        if (!inRange(departureRange[0], departureRange[1], departureChuyen)) {
            return false;
        }
    }

    if (priceRange[0] || priceRange[1]) {
        if (!priceRange[0]) priceRange[0] = 0;
        else priceRange[0] = parseInt(priceRange[0]);
        if (!priceRange[1]) priceRange[1] = Infinity;
        else priceRange[1] = parseInt(priceRange[1]);
        if (!(chuyen.gia >= priceRange[0] && chuyen.gia <= priceRange[1])) {
            return false;
        }
    }

    if (bustype) {
        if (bustype instanceof Array)
            bustype = bustype.map(function (x) {
                return x.toUpperCase()
            })
        else bustype = bustype.toUpperCase();
        if (bustype.indexOf(chuyen.Xe.LoaiXe.ten.toUpperCase()) < 0) {
            return false;
        }
    }

    return true;
}

function filterFunc(req, res, Chuyens) {
    let departureRange = [req.query.departure_min, req.query.departure_max];
    let priceRange = [req.query.price_min, req.query.price_max];
    let bustype = req.query.bustype;

    let foundEr = true;
    while (foundEr) {
        foundEr = false;
        Chuyens.forEach((item, index, object) => {
            departureRange = [req.query.departure_min, req.query.departure_max];
            if (!filerChuyen(departureRange, priceRange, bustype, item)) {
                object.splice(index, 1);
                foundEr = true;
            }
        });
    }
}

function filterVouchers(vouchers) {
    let foundEr = true;
    while (foundEr) {
        foundEr = false;
        vouchers.forEach((item, index, object) => {
            if (!(new Date()).getTime > item.ngayKetThuc.getTime()) {
                object.splice(index, 1);
                foundEr = true;
            }
        });
    }
}
hbs.registerHelper("prettifyDate", function (timestamp) {
    return timestamp.toDateString();
});

hbs.registerHelper("getTime", function (timestamp) {
    return timestamp.toTimeString().split(' ')[0];
});
// hbs.registerPartial("searchResultPartial", $("#searchResult-detail-template").html());



module.exports = router;