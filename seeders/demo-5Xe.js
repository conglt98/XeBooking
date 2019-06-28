'use strict';
// Xe

module.exports = {
  up: (queryInterface, Sequelize) => {
    let buses = [];
    let i;
    let n=10;
    for (i = 1; i <= n; i++) {
      let palaceLicense = "59-A1 01.12"+i;
      let bus = {
        bienso:palaceLicense,
        LoaiXeId:1,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
      }
      buses.push(bus);
      palaceLicense = "59-B1 01.12"+i;
      bus = {
        bienso:palaceLicense,
        LoaiXeId:2,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
      }
      buses.push(bus);
    }

    return queryInterface.bulkInsert('Xes', buses, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Xes', null, {});
  }
};
