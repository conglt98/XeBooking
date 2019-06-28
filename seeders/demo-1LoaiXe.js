'use strict';

// bus type

module.exports = {
  up: (queryInterface, Sequelize) => {
    let cartypes = [];
    let cartype = {
      ten: "Sleeper",
      socho:46,
      createdAt: Sequelize.literal('NOW()'),
      updatedAt: Sequelize.literal('NOW()')
    }
    cartypes.push(cartype);

    cartype = {
      ten: "Seater",
      socho:28,
      createdAt: Sequelize.literal('NOW()'),
      updatedAt: Sequelize.literal('NOW()')
    }
    cartypes.push(cartype);
    return queryInterface.bulkInsert('LoaiXes', cartypes, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('LoaiXes', null, {});
  }
};
