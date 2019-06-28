var express = require('express');
var router = express.Router();

let allvisit = require('../controllers/logvisit');
let allbooking = require('../controllers/transaction');

router.get('/chart_line', (req, res) => {
    // var obj = {
    //     "Revenue": [{
    //         "day": "May 1",
    //         "revenue": 3
    //     }, {
    //         "day": "May 2",
    //         "revenue": 5
    //     }, {
    //         "day": "May 3",
    //         "revenue": 4
    //     }, {
    //         "day": "May 4",
    //         "revenue": 5
    //     }, {
    //         "day": "May 5",
    //         "revenue": 7
    //     }, {
    //         "day": "May 7",
    //         "revenue": 3
    //     }, {
    //         "day": "May 8",
    //         "revenue": 6
    //     }, {
    //         "day": "Today",
    //         "revenue": 9
    //     }]
    // };

    var obj = {
        "Revenue": []
    };

    if (req.session.loadBetweenDate == false) {
        allbooking.getAllWithSortDate(results => {
            var n = Object.keys(results).length;
            for (let i = 0; i < n; i++) {
                var data = {};
                data["day"] = results[i].dataValues.createdAt.toDateString();
                data["revenue"] = 1;

                if (obj.Revenue.length == 0) {
                    obj.Revenue.push(data);
                } else {
                    var same = 0;
                    for (j = 0; j < obj.Revenue.length; j++) {
                        if (data["day"] == obj.Revenue[j].day) {
                            obj.Revenue[j].revenue = obj.Revenue[j].revenue + 1;
                            same = 1;
                            break;
                        }
                    }
                    if (same == 0)
                        obj.Revenue.push(data);
                }
            }
            res.send(obj);
        });
    } else {
        allbooking.getAllWithSortDateBetweenDate(req.session.datefrom, req.session.dateto, results => {
            var n = Object.keys(results).length;
            for (let i = 0; i < n; i++) {
                var data = {};
                data["day"] = results[i].dataValues.createdAt.toDateString();
                data["revenue"] = 1;

                if (obj.Revenue.length == 0) {
                    obj.Revenue.push(data);
                } else {
                    var same = 0;
                    for (j = 0; j < obj.Revenue.length; j++) {
                        if (data["day"] == obj.Revenue[j].day) {
                            obj.Revenue[j].revenue = obj.Revenue[j].revenue + 1;
                            same = 1;
                            break;
                        }
                    }
                    if (same == 0)
                        obj.Revenue.push(data);
                }
            }
            res.send(obj);
        });
    }

    //res.send();
});

router.get('/chart_col', (req, res) => {
    // res.send({
    //     "Revenue": [{
    //         "day": "May 1",
    //         "revenue": 3
    //     }, {
    //         "day": "May 2",
    //         "revenue": 5
    //     }, {
    //         "day": "May 3",
    //         "revenue": 4
    //     }, {
    //         "day": "May 4",
    //         "revenue": 5
    //     }, {
    //         "day": "May 5",
    //         "revenue": 7
    //     }, {
    //         "day": "May 7",
    //         "revenue": 3
    //     }, {
    //         "day": "May 8",
    //         "revenue": 6
    //     }, {
    //         "day": "Today",
    //         "revenue": 9
    //     }]
    // });

    var obj = {
        "Revenue": []
    };

    if (req.session.loadBetweenDate == false) {
        allbooking.getAllWithSortDateAndRevenue(results => {
            var n = Object.keys(results).length;
            for (let i = 0; i < n; i++) {
                var data = {};
                data["day"] = results[i].dataValues.createdAt.toDateString();
                
                var numOfTransactionDetails = results[i].TransactionDetails.length;
                var pc = 0;
                if (results[i].KhuyenMai) pc = results[i].KhuyenMai.phanTram;
                var price = results[i].Chuyen.gia;
                data["revenue"] = (Math.ceil((1 - pc / 100) * price)) * numOfTransactionDetails;
                
                if (obj.Revenue.length == 0) {
                    obj.Revenue.push(data);
                } else {
                    var same = 0;
                    for (j = 0; j < obj.Revenue.length; j++) {
                        if (data["day"] == obj.Revenue[j].day) {
                            obj.Revenue[j].revenue = obj.Revenue[j].revenue + data["revenue"];
                            same = 1;
                            break;
                        }
                    }
                    if (same == 0)
                        obj.Revenue.push(data);
                }
            }
            res.send(obj);
        });
    } else {
        allbooking.getAllWithSortDateAndRevenueBetweenDate(req.session.datefrom, req.session.dateto, results => {
            var n = Object.keys(results).length;
            for (let i = 0; i < n; i++) {
                var data = {};
                data["day"] = results[i].dataValues.createdAt.toDateString();
                
                var numOfTransactionDetails = results[i].TransactionDetails.length;
                var pc = 0;
                if (results[i].KhuyenMai) pc = results[i].KhuyenMai.phanTram;
                var price = results[i].Chuyen.gia;
                data["revenue"] = (Math.ceil((1 - pc / 100) * price)) * numOfTransactionDetails;
                

                if (obj.Revenue.length == 0) {
                    obj.Revenue.push(data);
                } else {
                    var same = 0;
                    for (j = 0; j < obj.Revenue.length; j++) {
                        if (data["day"] == obj.Revenue[j].day) {
                            obj.Revenue[j].revenue = obj.Revenue[j].revenue + data["revenue"];
                            same = 1;
                            break;
                        }
                    }
                    if (same == 0)
                        obj.Revenue.push(data);
                }
            }
            res.send(obj);
        });
    }
});


router.get('/chart_donut', (req, res) => {
    var obj = {
        "Task": [{
            "task": "Visit but not book bus",
            "percent": 30
        }, {
            "task": "Visit then book bus",
            "percent": 70
        }]
    };
    if (req.session.loadBetweenDate == false) {
        allbooking.getAll(results => {
            obj.Task[1].percent = Object.keys(results).length;
            allvisit.getAll(results => {
                obj.Task[0].percent = Object.keys(results).length - obj.Task[1].percent;
                res.send(obj);
            });
        });
    } else {
        allbooking.getAllBetweenDate(datefrom, dateto, results => {
            obj.Task[1].percent = Object.keys(results).length;
            allvisit.getAllWithDate(datefrom, dateto, results => {
                obj.Task[0].percent = Object.keys(results).length - obj.Task[1].percent;
                res.send(obj);
            });
        });
    }
});

router.get('/chart_bustype', (req, res) => {
    var obj = {
        "Bustype": [{
            "bustype": "Normal",
            "used": 0
        }, {
            "bustype": "Seater",
            "used": 30
        }, {
            "bustype": "Sleeper",
            "used": 40
        }]
    };
    if (req.session.loadBetweenDate == false) {
        allbooking.getAllBusTypeBooked(results => {
            var n = Object.keys(results).length;
            var loai1 = 0;
            var loai2 = 0;
            for (let i = 0; i < n; i++) {
                if (results[i].dataValues.Chuyen.dataValues.Xe.dataValues.LoaiXeId == 1) {
                    loai1 = loai1 + 1;
                }
                if (results[i].dataValues.Chuyen.dataValues.Xe.dataValues.LoaiXeId == 2) {
                    loai2 = loai2 + 1;
                }
            }
            obj.Bustype[2].used = loai1;
            obj.Bustype[1].used = loai2;

            res.send(obj);
        });
    } else {
        allbooking.getAllBusTypeBookedBetweenDate(req.session.datefrom, req.session.dateto, results => {
            var n = Object.keys(results).length;
            var loai1 = 0;
            var loai2 = 0;
            for (let i = 0; i < n; i++) {
                if (results[i].dataValues.Chuyen.dataValues.Xe.dataValues.LoaiXeId == 1) {
                    loai1 = loai1 + 1;
                }
                if (results[i].dataValues.Chuyen.dataValues.Xe.dataValues.LoaiXeId == 2) {
                    loai2 = loai2 + 1;
                }
            }
            obj.Bustype[2].used = loai1;
            obj.Bustype[1].used = loai2;

            res.send(obj);
        });
    }

});

router.get('/chart_busroute', (req, res) => {
    // var obj = {
    //     "Revenue": [{
    //         "route": "New york - Dallas",
    //         "book": 52
    //     }, {
    //         "route": "Ho Chi Minh - Dallas",
    //         "book": 24
    //     }, {
    //         "route": "Dallas - Ho Chi Minh",
    //         "book": 14
    //     }, {
    //         "route": "Other",
    //         "book": 10
    //     }]
    // };
    var obj = {
        "Revenue": []
    };

    console.log(req.session.loadBetweenDate + "-" + req.session.datefrom + "-" + req.session.dateto);
    if (req.session.loadBetweenDate == false) {
        allbooking.getAllBusRouteBooked(results => {
            var n = Object.keys(results).length;
            for (let i = 0; i < n; i++) {
                var data = {};
                data["route"] = results[i].dataValues.Chuyen.dataValues.Tuyen.dataValues.xuatphat.ten +
                    " - " + results[i].dataValues.Chuyen.dataValues.Tuyen.dataValues.ketthuc.ten;
                data["book"] = 1;

                if (obj.Revenue.length == 0) {
                    obj.Revenue.push(data);
                } else {
                    var same = 0;
                    for (j = 0; j < obj.Revenue.length; j++) {
                        if (data["route"] == obj.Revenue[j].route) {
                            obj.Revenue[j].book = obj.Revenue[j].book + 1;
                            same = 1;
                            break;
                        }
                    }
                    if (same == 0)
                        obj.Revenue.push(data);
                }
            }
            res.send(obj);
        });
    } else {
        allbooking.getAllBusRouteBookedBetweenDate(req.session.datefrom, req.session.dateto, results => {
            var n = Object.keys(results).length;
            for (let i = 0; i < n; i++) {
                var data = {};
                data["route"] = results[i].dataValues.Chuyen.dataValues.Tuyen.dataValues.xuatphat.ten +
                    " - " + results[i].dataValues.Chuyen.dataValues.Tuyen.dataValues.ketthuc.ten;
                data["book"] = 1;

                if (obj.Revenue.length == 0) {
                    obj.Revenue.push(data);
                } else {
                    var same = 0;
                    for (j = 0; j < obj.Revenue.length; j++) {
                        if (data["route"] == obj.Revenue[j].route) {
                            obj.Revenue[j].book = obj.Revenue[j].book + 1;
                            same = 1;
                            break;
                        }
                    }
                    if (same == 0)
                        obj.Revenue.push(data);
                }
            }
            res.send(obj);
        });
    }
});



module.exports = router;