'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('KhuyenMais', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      maKhuyenMai: {
        type: Sequelize.STRING
      },
      ngayBatDau: {
        type: Sequelize.DATE
      },
      ngayKetThuc: {
        type: Sequelize.DATE
      },
      phanTram: {
        type: Sequelize.INTEGER
      },
      imagePath: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('KhuyenMais');
  }
};