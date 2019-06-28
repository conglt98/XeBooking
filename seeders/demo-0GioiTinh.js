'use strict';

//gender

module.exports = {
  up: (queryInterface, Sequelize) => {
    let genders = [];
    let gender = {
      ten: "Male",
      createdAt: Sequelize.literal('NOW()'),
      updatedAt: Sequelize.literal('NOW()')
    }
    genders.push(gender);

    gender = {
      ten: "Female",
      createdAt: Sequelize.literal('NOW()'),
      updatedAt: Sequelize.literal('NOW()')
    }
    genders.push(gender);
    gender = {
      ten: "Others",
      createdAt: Sequelize.literal('NOW()'),
      updatedAt: Sequelize.literal('NOW()')
    }
    genders.push(gender);
    return queryInterface.bulkInsert('GioiTinhs', genders, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('GioiTinhs', null, {});
  }
};
