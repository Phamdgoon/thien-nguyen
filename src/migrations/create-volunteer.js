"use strict";
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Volunteers", {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true,
            },
            userId: {
                type: Sequelize.STRING,
            },
            statusId: {
                type: Sequelize.INTEGER,
            },
            skills: {
                type: Sequelize.STRING,
            },
            experience: {
                type: Sequelize.STRING,
            },
            taskName: {
                type: Sequelize.STRING,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Volunteers");
    },
};
