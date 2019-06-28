var controller = {};

var models = require('../models');
var xe = models.Xe;

controller.getAll = function (callback) {
    xe.findAll({
            include: [{
                model: models.LoaiXe,
            }]
        })
        .then(function (xes) {
            callback(xes);
        });
};

module.exports = controller;