"use strict";
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Donations", {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true,
            },
            campaignId: {
                type: Sequelize.INTEGER,
            },
            userId: {
                type: Sequelize.STRING,
            },
            amount: {
                type: Sequelize.STRING,
            },
            donationDate: {
                type: Sequelize.DATE,
            },
            itemName: {
                type: Sequelize.STRING,
            },
            quantity: {
                type: Sequelize.STRING,
            },
            unit: {
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
        await queryInterface.dropTable("Donations");
    },
};
