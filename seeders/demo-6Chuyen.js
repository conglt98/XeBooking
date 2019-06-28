'use strict';

// chuyen

module.exports = {
  up: (queryInterface, Sequelize) => {
    let chuyens = [];
    let xe = 0;
    for (let i = 1; i <= 10; i++) {
      for (let j = 1; j <= 24; j++) {
        var date = new Date();
        date.setMinutes(0);
        date.setSeconds(0);
        date.setHours(j-1);
        date.setDate(date.getDate()+i-1);
        var chuyen = {
          ngayGioKhoiHanh: date,
          gia: Math.floor(Math.random() * 401) + 100,
          deleted:0,
          TuyenId: Math.floor(Math.random() * 4)+1,
          XeId: xe+1,
          createdAt: Sequelize.literal('NOW()'),
          updatedAt: Sequelize.literal('NOW()')
        }
        chuyens.push(chuyen);
        xe = (xe+1)%20;
      }
    }
    return queryInterface.bulkInsert('Chuyens', chuyens, {});

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Chuyens', null, {});
  }
};

