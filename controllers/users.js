var controller = {};

var models = require('../models');
var bcrypt = require('bcryptjs');
const Op = require('../models').Sequelize.Op;

let user = models.User;
controller.getAll = (callback) => {
    user
        .findAll()
        .then(result => {
            callback(result);
        });
}

controller.getAllWithDate = (datefrom, dateto, callback) => {
    user
        .findAll({
            where: {
                isAdmin: false,
                createdAt: {
                    [Op.between]: [datefrom, dateto],
                }
            }
        })
        .then(result => {
            callback(result);
        });
}


controller.createUser = function (user, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(user.password, salt, function (err, hash) {
            user.password = hash;
            user.imagePath = `/img/user/user.jpg`;
            models.User
                .create(user)
                .then(function () {
                    callback(err);
                });
        });
    });
};

controller.getUserByEmail = function (email, callback) {
    let Obj = {
        email: email,
        profileId: null
    }
    models.User
        .findOne({
            where: Obj
        })
        .then(function (user) {
            callback(user);
        })
        .catch(function (err) {
            if (err) throw err;
            callback(null);
        });
};

controller.comparePassword = function (password, hash, callback) {
    bcrypt.compare(password, hash, function (err, isMatch) {
        if (err) throw err;
        callback(isMatch);
    });
};

controller.getUserById = function (userid, callback) {
    models.User
        .findOne({
            where: {
                id: userid
            }
        })
        .then(function (user) {
            callback(user);
        });
}

controller.isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect(`/users/login?returnURL=${req.originalUrl}`);
    }
};

controller.isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.isAdmin) {
        next();
    } else {
        res.redirect(`/users/login?returnURL=${req.originalUrl}`);
        //res.status(403);
        //res.end();
    }
};

controller.findOrCreate = (profile, callback) => {
    models.User
        .findOne({
            where: {
                profileId: profile.id
            }
        })
        .then(function (user) {
            var newUser = {
                name: profile.displayName,
                profileId: profile.id,
                email: profile.emails[0].value,
                imagePath: profile.photos[0].value,
                isAdmin: 0
            }
            if (user)
                user.update({
                    name: profile.displayName || user.name,
                    profileId: profile.id || user.profileId,
                    imagePath: profile.photos[0].value || user.imagePath,
                    email: profile.emails[0].value || user.email
                }).then(function () {
                    callback(user);
                });
            else {
                models.User
                    .create(newUser)
                    .then(function () {
                        callback(newUser);
                    });
            }
        });
}

controller.modify = (userID, user, callback) => {
    models.User
        .findOne({
            where: {
                id: userID
            }
        })
        .then(function (result) {
            result.update({
                name: user.name || result.name,
                phone: user.phone || result.phone,
                email: user.email || result.email,
                location: user.location || result.location
            }).then(() => {
                callback(result);
            });
        })
}

module.exports = controller;