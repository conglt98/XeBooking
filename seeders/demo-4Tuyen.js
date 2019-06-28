'use strict';

// tuyen

module.exports = {
  up: (queryInterface, Sequelize) => {
    let tuyens = [];
    let tuyen = {
      soPhutDiChuyen:630,
      xuatphatId:1,
      ketthucId:2,
      createdAt: Sequelize.literal('NOW()'),
      updatedAt: Sequelize.literal('NOW()')
    }
    tuyens.push(tuyen);

    tuyen = {
      soPhutDiChuyen:630,
      xuatphatId:2,
      ketthucId:1,
      createdAt: Sequelize.literal('NOW()'),
      updatedAt: Sequelize.literal('NOW()')
    }
    tuyens.push(tuyen);

    tuyen = {
      soPhutDiChuyen:420,
      xuatphatId:3,
      ketthucId:4,
      createdAt: Sequelize.literal('NOW()'),
      updatedAt: Sequelize.literal('NOW()')
    }
    tuyens.push(tuyen);

    tuyen = {
      soPhutDiChuyen:420,
      xuatphatId:4,
      ketthucId:3,
      createdAt: Sequelize.literal('NOW()'),
      updatedAt: Sequelize.literal('NOW()')
    }
    tuyens.push(tuyen);
    return queryInterface.bulkInsert('Tuyens', tuyens, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Tuyens', null, {});
  }
};
