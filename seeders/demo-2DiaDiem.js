'use strict';

// station

module.exports = {
  up: (queryInterface, Sequelize) => {
    let stations = [];
    let station = {
      ten: "New York",
      diachi: "9736 Berkshire St. New York, NY 10009.",
      sdt: "212-509-6995",
      createdAt: Sequelize.literal('NOW()'),
      updatedAt: Sequelize.literal('NOW()')
    }
    stations.push(station);

    station = {
      ten: "Dallas",
      diachi: "5 Aspen St. San Antonio, TX 78230.",
      sdt: "212-509-6995",
      createdAt: Sequelize.literal('NOW()'),
      updatedAt: Sequelize.literal('NOW()')
    }
    stations.push(station);

    station = {
      ten: "Hồ Chí Minh",
      diachi: "255 Nguyễn Văn Cừ, quận 5, tp HCM",
      sdt: "028-6288-4499",
      createdAt: Sequelize.literal('NOW()'),
      updatedAt: Sequelize.literal('NOW()')
    }
    stations.push(station);

    station = {
      ten: "Đà Lạt",
      diachi: "06 Lữ Gia, Phường 9, Đà Lạt, Lâm Đông",
      sdt: "19006079",
      createdAt: Sequelize.literal('NOW()'),
      updatedAt: Sequelize.literal('NOW()')
    }
    stations.push(station);

    return queryInterface.bulkInsert('DiaDiems', stations, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('DiaDiems', null, {});
  }
};

