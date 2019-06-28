var controller = {};

var models = require('../models');
var tuyen = models.Tuyen;

controller.getAll = function (callback) {
    tuyen.findAll({
            include: [{
                model: models.DiaDiem,
                as: "xuatphat",
                attributes: ['ten'],
            }, {
                model: models.DiaDiem,
                as: "ketthuc",
                attributes: ['ten']
            }]
        })
        .then(function (tuyens) {
            callback(tuyens);
        });
};

module.exports = controller;