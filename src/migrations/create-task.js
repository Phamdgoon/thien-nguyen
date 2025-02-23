"use strict";
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Tasks", {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true,
            },
            volunteerId: {
                type: Sequelize.INTEGER,
            },
            campaignId: {
                type: Sequelize.INTEGER,
            },
            taskTypeId: {
                type: Sequelize.INTEGER,
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
        await queryInterface.dropTable("Tasks");
    },
};
