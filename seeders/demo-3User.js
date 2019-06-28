'use strict';

// users

module.exports = {
  up: (queryInterface, Sequelize) => {
    var users = [];
    var user = {
      name: `Lê Thành Công`,
      email: 'lecongpr98@gmail.com',
      password: '$2a$10$y1JPPiC33cZklro1AsPJT.8kxjR6aGzdVnA.3q2maPz6Pnz4w.2ge',
      isAdmin: false,
      phone:'0123456789',
      imagePath: `/img/user/user-cong.jpg`,
      location:'Ho Chi Minh City, Viet Nam',
      
      createdAt: Sequelize.literal('NOW()'),
      updatedAt: Sequelize.literal('NOW()')
    }
    users.push(user);

    var user = {
      name: `Nguyễn Đỗ Cát Trân`,
      email: 'tranndc@gmail.com',
      password: '$2a$10$y1JPPiC33cZklro1AsPJT.8kxjR6aGzdVnA.3q2maPz6Pnz4w.2ge',
      isAdmin: true,
      phone:'0123456789',
      imagePath: `/img/user/user.jpg`,
      location:'Ho Chi Minh City, Viet Nam',
      createdAt: Sequelize.literal('NOW()'),
      updatedAt: Sequelize.literal('NOW()')
    }
    users.push(user);

    var user = {
      name: `Lê Thành Công`,
      email: 'lecongpr981@gmail.com',
      password: '$2a$10$y1JPPiC33cZklro1AsPJT.8kxjR6aGzdVnA.3q2maPz6Pnz4w.2ge',
      isAdmin: false,
      phone:'0123456789',
      imagePath: `/img/user/user-cong.jpg`,
      location:'Ho Chi Minh City, Viet Nam',
      createdAt: Sequelize.literal('NOW()'),
      updatedAt: Sequelize.literal('NOW()')
    }
    users.push(user);

    var user = {
      name: `Nguyễn Đỗ Cát Trân`,
      email: 'tranndc1@gmail.com',
      password: '$2a$10$y1JPPiC33cZklro1AsPJT.8kxjR6aGzdVnA.3q2maPz6Pnz4w.2ge',
      isAdmin: true,
      phone:'0123456789',
      imagePath: `/img/user/user.jpg`,
      location:'Ho Chi Minh City, Viet Nam',
      createdAt: Sequelize.literal('NOW()'),
      updatedAt: Sequelize.literal('NOW()')
    }
    users.push(user);

    var user = {
      name: `Lê Thành Công`,
      email: 'lecongpr982@gmail.com',
      password: '$2a$10$y1JPPiC33cZklro1AsPJT.8kxjR6aGzdVnA.3q2maPz6Pnz4w.2ge',
      isAdmin: false,
      phone:'0123456789',
      imagePath: `/img/user/user-cong.jpg`,
      location:'Ho Chi Minh City, Viet Nam',
      createdAt: Sequelize.literal('NOW()'),
      updatedAt: Sequelize.literal('NOW()')
    }
    users.push(user);

    var user = {
      name: `Nguyễn Đỗ Cát Trân`,
      email: 'tranndc2@gmail.com',
      password: '$2a$10$y1JPPiC33cZklro1AsPJT.8kxjR6aGzdVnA.3q2maPz6Pnz4w.2ge',
      isAdmin: true,
      phone:'0123456789',
      imagePath: `/img/user/user.jpg`,
      location:'Ho Chi Minh City, Viet Nam',
      createdAt: Sequelize.literal('NOW()'),
      updatedAt: Sequelize.literal('NOW()')
    }
    users.push(user);


    var user = {
      name: `Lê Thành Công`,
      email: 'lecongpr983@gmail.com',
      password: '$2a$10$y1JPPiC33cZklro1AsPJT.8kxjR6aGzdVnA.3q2maPz6Pnz4w.2ge',
      isAdmin: false,
      phone:'0123456789',
      imagePath: `/img/user/user-cong.jpg`,
      location:'Ho Chi Minh City, Viet Nam',
      createdAt: Sequelize.literal('NOW()'),
      updatedAt: Sequelize.literal('NOW()')
    }
    users.push(user);

    var user = {
      name: `Nguyễn Đỗ Cát Trân`,
      email: 'tranndc3@gmail.com',
      password: '$2a$10$y1JPPiC33cZklro1AsPJT.8kxjR6aGzdVnA.3q2maPz6Pnz4w.2ge',
      isAdmin: true,
      phone:'0123456789',
      imagePath: `/img/user/user.jpg`,
      location:'Ho Chi Minh City, Viet Nam',
      createdAt: Sequelize.literal('NOW()'),
      updatedAt: Sequelize.literal('NOW()')
    }
    users.push(user);


    var user = {
      name: `Lê Thành Công`,
      email: 'lecongpr984@gmail.com',
      password: '$2a$10$y1JPPiC33cZklro1AsPJT.8kxjR6aGzdVnA.3q2maPz6Pnz4w.2ge',
      isAdmin: false,
      phone:'0123456789',
      imagePath: `/img/user/user-cong.jpg`,
      location:'Ho Chi Minh City, Viet Nam',
      createdAt: Sequelize.literal('NOW()'),
      updatedAt: Sequelize.literal('NOW()')
    }
    users.push(user);

    var user = {
      name: `Nguyễn Đỗ Cát Trân`,
      email: 'tranndc4@gmail.com',
      password: '$2a$10$y1JPPiC33cZklro1AsPJT.8kxjR6aGzdVnA.3q2maPz6Pnz4w.2ge',
      isAdmin: true,
      phone:'0123456789',
      imagePath: `/img/user/user.jpg`,
      location:'Ho Chi Minh City, Viet Nam',
      createdAt: Sequelize.literal('NOW()'),
      updatedAt: Sequelize.literal('NOW()')
    }
    users.push(user);


    return queryInterface.bulkInsert('Users', users, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};