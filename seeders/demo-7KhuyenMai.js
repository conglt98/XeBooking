'use strict';

// khuyen mai

module.exports = {
  up: (queryInterface, Sequelize) => {
    var khuyenmais = [];
    var i = 1;

    for (i = 1; i < 5; i++) {
      var khuyenmai = {
        maKhuyenMai: `KM${i}`,
        ngayBatDau: "2019-06-15",
        ngayKetThuc: "2019-07-01",
        phanTram: 30,
        imagePath: `/img/A1/${i}.jpg`,
        TuyenId: i,
        deleted:0,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
      }
      khuyenmais.push(khuyenmai);
    }
    return queryInterface.bulkInsert('KhuyenMais', khuyenmais, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('KhuyenMais', null, {});
  }
};

