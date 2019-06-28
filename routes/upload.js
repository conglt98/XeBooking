var express = require('express');
var router = express.Router();

//Khai báo biến
let models = require('../models');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './public/img/user/',
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
    else cb('Xin vui lòng chỉ chọn ảnh đại diện!');
}

router.post('/', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                res.locals.isInfo=true;
                res.render('profile',{msgProfile : "Kích cỡ ảnh đại diện vượt quá 2MB!"});
            }
        } else {
            if (req.file == undefined) {
                res.locals.isInfo=true;
                res.render('profile',{msgProfile : "Không có file ảnh đại diện nào được chọn!"});
            } else {
                //Sau khi có ảnh RAW, ta tiến hành tạo ảnh kích thước nhỏ hơn vào buffer. 
                //Kích thước mới ở đây là width: 400px, height: 400px
                //Sau đó, ta ghi đè ảnh mới này lên ảnh RAW.
                sharp('./public/img/user/' + `${req.file.filename}`)
                    .resize(400, 400)
                    .toBuffer(function (err, buffer) {
                        fs.writeFileSync('./public/img/user/' + `${req.file.filename}`, buffer);
                    });
                sharp.cache(false);

                //Tiến hành lưu đường dẫn của ảnh xuống CSDL
                let filename = `/img/user/${req.file.filename}`;
                models.User
                    .update({
                        imagePath: filename
                    }, {
                        where: {
                            id: req.session.user.id,
                        }
                    })
                    .then(function () {
                        //Xóa ảnh avatar cũ của user (ảnh không xài nữa) => Tiết kiệm bộ nhớ
                        if (req.session.user.imagePath != '/img/user/user.jpg') {
                            if (req.session.user.imagePath) {
                                var oldfilename = path.basename(req.session.user.imagePath);
                                var oldpath = './public/img/user/' + oldfilename;
                                fs.stat(oldpath, function (err, stats) {
                                    if (!err) fs.unlinkSync(oldpath);
                                });
                            }
                        }

                        //Cập nhật ảnh mới của user. Sau đó redirect về trang Profile
                        
                        req.session.user.imagePath = filename;
                        
                        res.locals.isInfo=true;
                        res.render('profile',{msgProfileSuccess : "Cập nhật ảnh đại diện thành công!"});
                    });
            }
        }
    });
});

module.exports = router;