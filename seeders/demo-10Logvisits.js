'use strict';


module.exports = {
    up: (queryInterface, Sequelize) => {
        var visits = [];
        var i = 1;

        for (i = 1; i <= 500; i++) {
            var visit = {
                visit: Sequelize.literal('NOW()'),
                createdAt: Sequelize.literal('NOW()'),
                updatedAt: Sequelize.literal('NOW()')
            }
            visits.push(visit);
        }

        return queryInterface.bulkInsert('Logvisits', visits, {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Logvisits', null, {});
    }
};