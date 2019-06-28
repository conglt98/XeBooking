var express = require('express');
var router = express.Router();

var crypto = require('crypto');
var nodeMailer = require('nodemailer');
var userController = require('../controllers/users');
var bcrypt = require('bcryptjs');
let models = require('../models');

router.get('/', (req, res) => {
    res.render("sendMail", {
        noHeader: "true",
        noFooter: "true"
    });
})

router.get('/sendmail', (req, res) => {
    req.session.emailForReset = req.query.email;

    userController.getUserByEmail(req.query.email, (result) => {
        if (!result) {
            res.render("paymentError",{info:"email is not registered"})
        } else {
            crypto.randomBytes(48, function (err, buffer) {
                if (err) throw err;
                var token = buffer.toString('hex');
                req.session.tokenForReset = token;
                var fullUrl = req.protocol + '://' + req.get('host') + "/forgotpass/reset" + "/" + req.session.emailForReset +
                    "/" + req.session.tokenForReset;


                let transporter = nodeMailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'lecongpr98@gmail.com',
                        pass: '11081998'
                    }
                });

                let mailOptions = {
                    from: 'lecongpr98@gmail.com', // sender address
                    to: req.query.email, // list of receivers
                    subject: "[XeBooking] Reset password", // Subject line
                    html: '<b>Reset your password</b><br><a href="' + fullUrl + '">Link reset</a>' // html body
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message %s -sent- %s', info.messageId, info.response);

                    res.render("successRespond", {
                        info: "Email was sent "
                    });
                });

            });
        }
    })

})

router.get('/reset/:email/:token', (req, res) => {
    if (req.params.email === req.session.emailForReset &&
        req.params.token === req.session.tokenForReset) {

        res.locals.emailForReset = req.params.email;
        res.locals.tokenForReset = req.params.token;
        res.render("resetPass", {
            noHeader: "true",
            noFooter: "true"
        });
    } else {
        res.render("paymentError");
    }
})

router.post('/reset/:email/:token/changepass', (req, res) => {
    var newpass = req.body.passwordForReset;


    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newpass, salt, function (err, hash) {
            newpass = hash;

            models.User
                .update({
                    password: newpass
                }, {
                    where: {
                        email: req.params.email,
                        profileId: null
                    }
                })
                .then(function () {
                    res.render("successRespond", {
                        info: "Password was changed "
                    });
                });
        });
    });



})

module.exports = router;