var controller = {};

var models = require('../models');
var stations = models.DiaDiem;

controller.getAll = function(callback){
    stations.findAll()
    .then(function(stations){
        callback(stations);
    });
};

module.exports = controller;