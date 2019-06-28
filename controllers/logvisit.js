let controller = {};

let Logvisit = require('../models').Logvisit;
const Op = require('../models').Sequelize.Op;

controller.add = (visit) => {
    return new Promise((resolve, reject) => {
        Logvisit
            .create(visit)
            .then(newLogvisit => resolve(newLogvisit));
    });
}

controller.getAll = (callback) => {
    Logvisit
        .findAll()
        .then(result => {
            callback(result);
        });
}

controller.getAllWithDate = (datefrom, dateto,callback) => {
    Logvisit
        .findAll({
            where: {
                createdAt: {
                    [Op.between]: [datefrom, dateto],
                }
            }
        })
        .then(result => {
            callback(result);
        });
}

module.exports = controller;