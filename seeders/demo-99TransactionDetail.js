'use strict';


module.exports = {
  up: (queryInterface, Sequelize) => {
    var users = [];
    var i = 1;

    for (i = 1; i <= 240; i++) {
      let ghetdat = '1A';
      if (i%2 == 0){
        ghetdat = '4';
      }
      var user = {
        ten:"Lê Thành Công",
        namSinh:1998,
        viTriGheDat:ghetdat,
        TransactionId:i,
        GioiTinhId:1,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
      }
      users.push(user);
      ghetdat = '3A';
      if (i%2 == 0){
        ghetdat = '5';
      }
      user = {
        ten:"Lê Thành Công1",
        namSinh:1998,
        viTriGheDat:ghetdat,
        TransactionId:i,
        GioiTinhId:1,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
      }
      users.push(user);
    }

    return queryInterface.bulkInsert('TransactionDetails', users, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('TransactionDetails', null, {});
  }
};
